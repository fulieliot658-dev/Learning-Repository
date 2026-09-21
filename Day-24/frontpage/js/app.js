/* ============================================================
   Frontpage — app
   ============================================================ */
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const feed = id => FEEDS.find(f=>f.id===id);
const cat  = id => CATS.find(c=>c.id===id);

const NOW = Date.now();
const when = h => {
  if(h<1) return "just now";
  if(h<24) return h+"h ago";
  const d = Math.round(h/24);
  if(d===1) return "yesterday";
  if(d<30) return d+"d ago";
  const mo = Math.round(d/30);
  return mo+"mo ago";
};
const fullDate = h => new Date(NOW - h*3600e3).toLocaleString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});
const dayKey = h => { const d=new Date(NOW-h*3600e3); return d.toDateString(); };
const dayLabel = h => {
  const d=new Date(NOW-h*3600e3), t=new Date(NOW);
  const diff = Math.floor((new Date(t.toDateString())-new Date(d.toDateString()))/864e5);
  if(diff<=0) return "Today";
  if(diff===1) return "Yesterday";
  if(diff<7) return d.toLocaleDateString(undefined,{weekday:"long"});
  return d.toLocaleDateString(undefined,{month:"long",day:"numeric"});
};

/* ---------------- state ---------------- */
const DEFAULTS = {
  mode:"guest", view:"feed", scope:{type:"all"}, layout:"comfortable", sort:"new",
  read:[], saved:[], subs:FEEDS.map(f=>f.id), collapsed:[],
  lastVisit:NOW - 26*3600e3, theme:"auto", textScale:1, measure:45,
  motion:"auto", contrast:"normal", dyslexic:"off", refresh:"30"
};
let S = {...DEFAULTS, read:new Set(), saved:new Set(), subs:new Set(FEEDS.map(f=>f.id)), collapsed:new Set()};
let cursor = -1, query = "", readerId = null, lastAction = null;

function store(){ return S.mode==="account" ? window.localStorage : window.sessionStorage; }
function save(){
  try{
    store().setItem("frontpage:v1", JSON.stringify({
      mode:S.mode, view:S.view, scope:S.scope, layout:S.layout, sort:S.sort,
      read:[...S.read], saved:[...S.saved], subs:[...S.subs], collapsed:[...S.collapsed],
      lastVisit:S.lastVisit, theme:S.theme, textScale:S.textScale, measure:S.measure,
      motion:S.motion, contrast:S.contrast, dyslexic:S.dyslexic, refresh:S.refresh
    }));
  }catch(e){/* storage unavailable — app still works, just won't persist */}
}
function load(mode){
  let raw=null;
  try{ raw = (mode==="account"?localStorage:sessionStorage).getItem("frontpage:v1"); }catch(e){}
  if(!raw) return false;
  try{
    const d=JSON.parse(raw);
    S = {...S, ...d, read:new Set(d.read||[]), saved:new Set(d.saved||[]),
         subs:new Set(d.subs||FEEDS.map(f=>f.id)), collapsed:new Set(d.collapsed||[])};
    return true;
  }catch(e){ return false; }
}
function applyPrefs(){
  const r=document.documentElement;
  r.setAttribute("data-theme", S.theme==="auto" ? "" : S.theme);
  if(S.theme==="auto") r.removeAttribute("data-theme");
  r.setAttribute("data-contrast",S.contrast);
  r.setAttribute("data-dyslexic",S.dyslexic);
  r.setAttribute("data-motion",S.motion==="off"?"off":"auto");
  r.style.setProperty("--reading-scale",S.textScale);
  r.style.setProperty("--reading-measure",S.measure+"rem");
}
function announce(msg){ const l=$("#live"); l.textContent=""; setTimeout(()=>l.textContent=msg,40); }

/* ---------------- selectors ---------------- */
function subscribed(){ return ITEMS.filter(i=>S.subs.has(i.feed)); }
function scopeItems(){
  let list = subscribed();
  const sc = S.scope;
  if(S.view==="saved") return list.filter(i=>S.saved.has(i.id)).sort((a,b)=>a.hours-b.hours);
  if(sc.type==="cat") list = list.filter(i=>i.cat===sc.id);
  if(sc.type==="feed") list = list.filter(i=>i.feed===sc.id);
  if(query.trim()){
    const q=query.trim().toLowerCase();
    list = list.filter(i=> (i.title+" "+i.excerpt+" "+feed(i.feed).t).toLowerCase().includes(q));
  }
  return S.sort==="new" ? list : [...list].reverse();
}
const unreadIn = list => list.filter(i=>!S.read.has(i.id)).length;
const catItems = id => subscribed().filter(i=>i.cat===id);
const feedItems = id => ITEMS.filter(i=>i.feed===id);
function scopeTitle(){
  if(S.view==="saved") return "Saved";
  if(query.trim()) return "Search";
  const sc=S.scope;
  if(sc.type==="cat") return cat(sc.id).name;
  if(sc.type==="feed") return feed(sc.id).t;
  return "All items";
}

/* ---------------- sidebar ---------------- */
function renderSidebar(){
  const all = subscribed(), allUn = unreadIn(all);
  const savedN = S.saved.size;
  let h = `<ul>
    <li><button class="nav-item" data-nav="all" ${S.view==="feed"&&S.scope.type==="all"&&!query?'aria-current="page"':""}>
      <svg class="icon" viewBox="0 0 24 24"><use href="#i-inbox"/></svg>
      <span class="label">All items</span>${allUn?`<span class="count">${allUn}</span>`:""}</button></li>
    <li><button class="nav-item" data-nav="saved" ${S.view==="saved"?'aria-current="page"':""}>
      <svg class="icon" viewBox="0 0 24 24"><use href="#i-bookmark"/></svg>
      <span class="label">Saved</span>${savedN?`<span class="count">${savedN}</span>`:""}</button></li>
  </ul>
  <div class="nav-group"><div class="nav-group-head"><span>Categories</span>
    <button class="cat-toggle" id="add-cat" aria-label="Add a category"><svg class="icon" viewBox="0 0 24 24"><use href="#i-plus"/></svg></button></div><ul>`;

  for(const c of CATS){
    const items = catItems(c.id), un = unreadIn(items);
    const feeds = FEEDS.filter(f=>f.cat===c.id && S.subs.has(f.id));
    if(!feeds.length) continue;
    const open = !S.collapsed.has(c.id);
    h += `<li><div class="cat-row">
      <button class="cat-toggle" data-cat-toggle="${c.id}" aria-expanded="${open}" aria-label="${open?"Collapse":"Expand"} ${esc(c.name)}"><svg class="icon" viewBox="0 0 24 24"><use href="#i-chevron"/></svg></button>
      <button class="nav-item" data-nav="cat" data-id="${c.id}" ${S.view==="feed"&&S.scope.type==="cat"&&S.scope.id===c.id&&!query?'aria-current="page"':""}>
        <span class="cat-dot" style="background:${c.c}"></span>
        <span class="label">${esc(c.name)}</span>${un?`<span class="count">${un>99?"99+":un}</span>`:""}
      </button></div>`;
    if(open){
      h += `<ul class="feed-list">`;
      for(const f of feeds){
        const un2 = unreadIn(feedItems(f.id));
        const badge = f.health==="error" ? `<svg class="icon" style="width:12px;height:12px;color:var(--color-error)" viewBox="0 0 24 24"><use href="#i-alert"/></svg>`
                    : f.health==="stale" ? `<svg class="icon" style="width:12px;height:12px;color:var(--color-warning)" viewBox="0 0 24 24"><use href="#i-clock"/></svg>` : "";
        h += `<li><button class="nav-item" data-nav="feed" data-id="${f.id}" ${S.view==="feed"&&S.scope.type==="feed"&&S.scope.id===f.id&&!query?'aria-current="page"':""}>
          <span class="favicon" style="background:${f.c}" aria-hidden="true">${f.l}</span>
          <span class="label">${esc(f.s)}</span>${badge}${un2?`<span class="count">${un2>99?"99+":un2}</span>`:""}</button></li>`;
      }
      h += `</ul>`;
    }
    h += `</li>`;
  }
  h += `</ul></div>
  <div class="nav-group"><div class="nav-group-head"><span>Manage</span></div><ul>
    <li><button class="nav-item" data-nav="discover" ${S.view==="discover"?'aria-current="page"':""}><svg class="icon" viewBox="0 0 24 24"><use href="#i-compass"/></svg><span class="label">Discover feeds</span></button></li>
    <li><button class="nav-item" id="side-import"><svg class="icon" viewBox="0 0 24 24"><use href="#i-upload"/></svg><span class="label">Import / export OPML</span></button></li>
    <li><button class="nav-item" id="side-keys"><svg class="icon" viewBox="0 0 24 24"><use href="#i-keyboard"/></svg><span class="label">Keyboard shortcuts</span></button></li>
  </ul></div>`;
  $("#sidebar-scroll").innerHTML = h;

  const bad = FEEDS.filter(f=>S.subs.has(f.id)&&f.health==="error").length;
  const stale = FEEDS.filter(f=>S.subs.has(f.id)&&f.health==="stale").length;
  const cls = bad?"err":stale?"warn":"ok";
  const icon = bad?"#i-alert":stale?"#i-clock":"#i-check-circle";
  const txt = bad? `${bad} feed${bad>1?"s":""} failing` : stale? `${stale} feed${stale>1?"s":""} quiet` : "All feeds healthy";
  $("#health").innerHTML = `<button class="health-btn ${cls}" id="health-btn"><svg class="icon" viewBox="0 0 24 24"><use href="${icon}"/></svg><span>${txt}</span></button>`;
}

/* ---------------- item markup ---------------- */
function hl(text){
  const q=query.trim();
  if(!q) return esc(text);
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return esc(text);
  return esc(text.slice(0,i))+"<mark>"+esc(text.slice(i,i+q.length))+"</mark>"+esc(text.slice(i+q.length));
}
function itemHTML(it, idx){
  const f=feed(it.feed), c=cat(it.cat), read=S.read.has(it.id), sv=S.saved.has(it.id);
  return `<li><div class="item ${read?"is-read":""} ${idx===cursor?"is-cursor":""}" data-item="${it.id}" data-idx="${idx}">
    <div class="item-rail"><span class="mark" aria-hidden="true"></span></div>
    <div class="item-thumb" style="background:linear-gradient(135deg,${f.c}22,${c.c}18)" aria-hidden="true"><span class="mark"></span></div>
    <div class="item-body">
      <div class="item-meta">
        <span class="favicon" style="background:${f.c}" aria-hidden="true">${f.l}</span>
        <span class="item-source">${esc(f.s)}</span>
        <span aria-hidden="true">·</span>
        <time datetime="${new Date(NOW-it.hours*3600e3).toISOString()}" title="${fullDate(it.hours)}">${when(it.hours)}</time>
      </div>
      <h3 class="item-title"><button class="open-item" data-open="${it.id}">${hl(it.title)}<span class="sr-only"> — ${read?"read":"unread"}, from ${esc(f.t)}, ${when(it.hours)}</span></button></h3>
      <p class="item-excerpt">${hl(it.excerpt)}</p>
      <div class="item-foot">
        <span class="chip" style="color:${c.c}">${esc(c.name)}</span>
        ${it.body?`<span class="chip">${Math.max(2,Math.round(it.words/230))} min read</span>`:""}
        <span class="item-acts">
          <button data-act="save" data-id="${it.id}" class="${sv?"on":""}" aria-pressed="${sv}" aria-label="${sv?"Remove from saved":"Save for later"}"><svg class="icon" viewBox="0 0 24 24"><use href="#i-bookmark"/></svg></button>
          <button data-act="read" data-id="${it.id}" aria-pressed="${read}" aria-label="Mark as ${read?"unread":"read"}"><svg class="icon" viewBox="0 0 24 24"><use href="#i-check"/></svg></button>
          <button data-act="ext" data-id="${it.id}" aria-label="Open original article on ${esc(f.t)}"><svg class="icon" viewBox="0 0 24 24"><use href="#i-external"/></svg></button>
        </span>
      </div>
    </div>
  </div></li>`;
}

/* ---------------- views ---------------- */
const LAYOUTS=[["compact","#i-list","Compact list"],["comfortable","#i-rows","Comfortable list"],["magazine","#i-grid","Magazine cards"]];

function renderFeed(){
  const list = scopeItems();
  const un = unreadIn(list);
  const isSearch = !!query.trim();
  const newSince = subscribed().filter(i=>NOW-i.hours*3600e3 > S.lastVisit).length;

  let h = `<div class="toolbar">
    <div><h1>${esc(scopeTitle())}${isSearch?`: ${esc(query)}`:""}</h1>
      <span class="sub">${isSearch? `${list.length} result${list.length===1?"":"s"}` : S.view==="saved" ? `${list.length} saved` : `${un} unread of ${list.length}`}</span></div>
    <div class="toolbar-actions">
      <div class="seg" role="group" aria-label="Layout">
        ${LAYOUTS.map(([k,i,lab])=>`<button data-layout="${k}" aria-pressed="${S.layout===k}" aria-label="${lab}" title="${lab}"><svg class="icon" viewBox="0 0 24 24"><use href="${i}"/></svg></button>`).join("")}
      </div>
      <button class="btn" id="btn-sort"><svg class="icon" viewBox="0 0 24 24"><use href="#i-arrow-up"/></svg>${S.sort==="new"?"Newest":"Oldest"}</button>
      <button class="btn" id="btn-refresh"><svg class="icon" viewBox="0 0 24 24"><use href="#i-refresh"/></svg>Refresh</button>
      <button class="btn" id="btn-markall">Mark all read</button>
    </div>
  </div>`;

  if(S.mode==="guest") h += `<div class="guest-strip"><svg class="icon" viewBox="0 0 24 24"><use href="#i-sparkles"/></svg>
    <span>You're browsing as a guest. Reading state stays in this tab only.</span>
    <button class="btn btn-primary" data-enter="upgrade">Keep this setup</button></div>`;

  if(!isSearch && S.view==="feed" && newSince && S.scope.type==="all")
    h += `<button class="banner" id="banner-new"><svg class="icon" viewBox="0 0 24 24"><use href="#i-arrow-up"/></svg>${newSince} new items since your last visit</button>`;

  if(!list.length){
    h += emptyState(isSearch);
  }else{
    h += `<ul class="items" data-layout="${S.layout}" id="itemlist">`;
    let day="";
    list.forEach((it,idx)=>{
      const k=dayKey(it.hours);
      if(k!==day && S.layout!=="magazine" && !isSearch){ day=k; h+=`<li class="daylabel" aria-hidden="true">${dayLabel(it.hours)}</li>`; }
      h += itemHTML(it,idx);
    });
    h += `</ul>`;
  }
  $("#scroll").innerHTML = h;
}
function emptyState(isSearch){
  if(isSearch) return `<div class="empty"><svg class="icon" viewBox="0 0 24 24"><use href="#i-search"/></svg>
    <h2>Nothing matches “${esc(query)}”</h2>
    <p>Search covers titles and summaries across your subscribed feeds. Try a shorter phrase, or check the spelling.</p>
    <button class="btn" id="clear-q">Clear search</button></div>`;
  if(S.view==="saved") return `<div class="empty"><svg class="icon" viewBox="0 0 24 24"><use href="#i-bookmark"/></svg>
    <h2>Nothing saved yet</h2><p>Press <span class="kbd">s</span> on any item, or use the bookmark button, to keep it here for later.</p>
    <button class="btn btn-primary" data-nav="all">Go to all items</button></div>`;
  return `<div class="empty"><svg class="icon" viewBox="0 0 24 24"><use href="#i-inbox"/></svg>
    <h2>This view is empty</h2><p>There are no items here yet. Add a feed, or pick a starter pack to fill your dashboard in one click.</p>
    <button class="btn btn-primary" data-nav="discover">Browse feeds</button></div>`;
}

/* ---------- digest ---------- */
function digestSet(){
  const since = subscribed().filter(i=>NOW-i.hours*3600e3 > S.lastVisit && !S.read.has(i.id));
  const pool = since.length>=6 ? since : subscribed().filter(i=>!S.read.has(i.id)).slice(0,24);
  const score = i => {
    const f=feed(i.feed);
    let s = 100 - i.hours*0.8;
    if(i.body) s += 18;                    // full content beats a stub
    if(f.paywall) s -= 8;
    if(f.id==="hn"||f.id==="sidebar") s -= 14; // high-volume sources shouldn't flood
    return s;
  };
  const ranked = [...pool].sort((a,b)=>score(b)-score(a));
  const lead = ranked[0];
  const seen = new Set(lead?[lead.feed]:[]);
  const picks = [];
  for(const i of ranked.slice(1)){ if(seen.has(i.feed)) continue; seen.add(i.feed); picks.push(i); if(picks.length===6) break; }
  const rest = ranked.filter(i=>i!==lead && !picks.includes(i));
  return {lead,picks,rest,since};
}
function renderDigest(){
  const {lead,picks,rest,since} = digestSet();
  const mins = Math.round([lead,...picks].filter(Boolean).reduce((a,i)=>a+(i.words||400)/230,0));
  const cats = [...new Set([lead,...picks].filter(Boolean).map(i=>i.cat))].map(c=>cat(c).name);
  let h = `<div class="pane"><div class="digest-head">
    <h1>${greeting()} Here's what you missed.</h1>
    <p class="digest-lede">${since.length? `${since.length} new item${since.length===1?"":"s"} arrived since you last checked in ${when(Math.round((NOW-S.lastVisit)/3600e3))}.` : "Nothing new since your last visit, so this is the best of what's still unread."} Frontpage picked ${picks.length+(lead?1:0)} of them — one per source, newest first, full-length pieces before link posts.</p>
    <div class="digest-stats">
      <div class="stat"><b>${since.length}</b><span>new since last visit</span></div>
      <div class="stat"><b>${unreadIn(subscribed())}</b><span>unread in total</span></div>
      <div class="stat"><b>${mins}</b><span>minutes to read the picks</span></div>
      <div class="stat"><b>${cats.length}</b><span>categories covered</span></div>
    </div></div>`;

  if(!lead){
    h += `<div class="digest-empty">You're completely caught up. Nothing to digest — go outside.</div></div>`;
    $("#scroll").innerHTML=h; return;
  }
  const f=feed(lead.feed);
  h += `<section class="digest-sec"><h2><svg class="icon" viewBox="0 0 24 24"><use href="#i-sparkles"/></svg>Lead story</h2>
    <button class="lead-card" data-open="${lead.id}">
      <div class="item-meta"><span class="favicon" style="background:${f.c}">${f.l}</span><span class="item-source">${esc(f.t)}</span><span aria-hidden="true">·</span><span>${when(lead.hours)}</span></div>
      <h3>${esc(lead.title)}</h3><p>${esc(lead.excerpt)}</p>
      <span class="why">Picked because it's the newest full-length piece from a source you read most</span>
    </button></section>`;

  if(picks.length){
    h += `<section class="digest-sec"><h2>One from each of your other sources</h2><ul class="items digest-list" data-layout="comfortable">`;
    picks.forEach((it,idx)=>h+=itemHTML(it,idx));
    h += `</ul></section>`;
  }
  if(rest.length){
    h += `<section class="digest-sec"><h2>Everything else (${rest.length})</h2>
      <div class="catalog">${rest.slice(0,20).map(it=>{const ff=feed(it.feed);return `<div class="catalog-row">
        <span class="favicon" style="background:${ff.c}">${ff.l}</span>
        <button class="t" data-open="${it.id}" style="flex:1;text-align:left;min-width:0"><span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(it.title)}</span></button>
        <span class="d">${when(it.hours)}</span></div>`}).join("")}</div>
      <div style="margin-top:var(--space-4);display:flex;gap:var(--space-2)">
        <button class="btn" id="digest-markall">Mark everything else read</button>
        <button class="btn" data-nav="all">Open the full feed</button></div></section>`;
  }
  h += `</div>`;
  $("#scroll").innerHTML=h;
}
function greeting(){ const h=new Date().getHours(); return h<12?"Good morning.":h<18?"Good afternoon.":"Good evening."; }

/* ---------- discover ---------- */
function renderDiscover(){
  let h = `<div class="pane"><div class="digest-head">
    <h1>Find something worth reading</h1>
    <p class="digest-lede">Four ways in, depending on how much you already know about what you want. Everything here is a real, public RSS or Atom feed.</p></div>`;

  h += `<section class="digest-sec"><h2>Starter packs</h2><div class="pack-grid">`;
  for(const p of PACKS){
    const on = p.feeds.every(id=>S.subs.has(id));
    h += `<div class="pack"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
      <div class="row">${p.feeds.map(id=>{const f=feed(id);return `<span class="chip"><span class="favicon" style="background:${f.c};width:12px;height:12px;font-size:7px">${f.l}</span>${esc(f.s)}</span>`}).join("")}</div>
      <button class="btn ${on?"":"btn-primary"}" data-pack="${p.id}" style="align-self:flex-start;margin-top:auto" ${on?"disabled":""}>${on?"Already following":"Follow all "+p.feeds.length}</button></div>`;
  }
  h += `</div></section>`;

  h += `<section class="digest-sec"><h2>Browse the catalogue</h2><div class="catalog">`;
  for(const c of CATS){
    h += `<div class="catalog-row" style="background:var(--color-bg-secondary)"><span class="cat-dot" style="background:${c.c}"></span><span class="t">${esc(c.name)}</span></div>`;
    for(const f of FEEDS.filter(x=>x.cat===c.id)){
      const on=S.subs.has(f.id);
      h += `<div class="catalog-row">
        <span class="favicon" style="background:${f.c}">${f.l}</span>
        <span style="flex:1;min-width:0"><span class="t" style="display:block">${esc(f.t)}</span><span class="d" style="display:block">${esc(f.desc)} · ${f.fmt}</span></span>
        <button class="btn ${on?"":"btn-primary"}" data-sub="${f.id}">${on?"Following":"Follow"}</button></div>`;
    }
  }
  h += `</div></section>`;

  h += `<section class="digest-sec"><h2>Add a feed by URL</h2>
    <div class="pack" style="max-width:34rem">
      <label class="field" style="margin:0"><span>Feed or site address</span>
        <input type="text" id="add-url" placeholder="https://example.com/feed.xml" autocomplete="off" aria-describedby="add-hint">
        <span class="hint" id="add-hint">Paste a feed URL, or a site address — Frontpage looks for the feed link itself.</span></label>
      <button class="btn btn-primary" id="add-go" style="align-self:flex-start">Check feed</button>
    </div></section>`;

  h += `<section class="digest-sec"><h2>Coming from another reader</h2>
    <div class="pack" style="max-width:34rem"><p>Import an OPML file from Feedly, Inoreader, NetNewsWire or anything else that exports the standard format. Duplicates are flagged, dead feeds are reported, and your category structure is preserved.</p>
    <div style="display:flex;gap:var(--space-2)"><button class="btn btn-primary" id="disc-import"><svg class="icon" viewBox="0 0 24 24"><use href="#i-upload"/></svg>Import OPML</button>
    <button class="btn" id="disc-export"><svg class="icon" viewBox="0 0 24 24"><use href="#i-download"/></svg>Export mine</button></div></div></section></div>`;
  $("#scroll").innerHTML=h;
}

/* ---------------- render ---------------- */
function render(){
  const v = query.trim()? "feed" : S.view;
  $$(".tab").forEach(b=>b.setAttribute("aria-current", b.dataset.view===S.view?"page":"false"));
  $$(".tabbar button").forEach(b=>b.setAttribute("aria-current", b.dataset.view===S.view?"page":"false"));
  if(v==="digest") renderDigest();
  else if(v==="discover") renderDiscover();
  else renderFeed();
  renderSidebar();
  applyPrefs();
  save();
}
/* ---------------- reader ---------------- */
function readerList(){ const l = scopeItems(); return l.length? l : subscribed(); }
function openReader(id){
  const it = ITEMS.find(x=>x.id===id); if(!it) return;
  const f = feed(it.feed);
  readerId = id;
  markRead(id,true,false);
  const list = readerList(); const i = list.findIndex(x=>x.id===id);
  const prev = i>0?list[i-1]:null, next = i>=0&&i<list.length-1?list[i+1]:null;
  const sv = S.saved.has(id);

  const body = it.body
    ? `<div class="article-body">${it.body}</div>`
    : `<div class="article-body"><p>${esc(it.excerpt)}</p></div>
       <div class="excerpt-note"><strong>${esc(f.t)} publishes summaries only.</strong> ${f.paywall?"This post is behind a paywall, so the feed carries an excerpt rather than the article.":"This feed's items carry a short description rather than full content."} Open the original to read the rest.</div>`;

  const el = document.createElement("div");
  el.className="reader"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); el.setAttribute("aria-label",it.title);
  el.innerHTML = `<div class="reader-bar">
      <button class="btn btn-ghost" id="r-close"><svg class="icon" viewBox="0 0 24 24"><use href="#i-arrow-left"/></svg>Back</button>
      <div style="margin-left:auto;display:flex;gap:var(--space-2);align-items:center">
        <button class="btn btn-ghost btn-icon" id="r-prev" ${prev?"":"disabled"} aria-label="Previous article"><svg class="icon" viewBox="0 0 24 24" style="transform:rotate(-90deg)"><use href="#i-chevron"/></svg></button>
        <button class="btn btn-ghost btn-icon" id="r-next" ${next?"":"disabled"} aria-label="Next article"><svg class="icon" viewBox="0 0 24 24" style="transform:rotate(90deg)"><use href="#i-chevron"/></svg></button>
        <button class="btn ${sv?"is-active":""}" id="r-save" aria-pressed="${sv}"><svg class="icon" viewBox="0 0 24 24"><use href="#i-bookmark"/></svg>${sv?"Saved":"Save"}</button>
        <button class="btn btn-ghost btn-icon" id="r-type" aria-label="Reading settings"><svg class="icon" viewBox="0 0 24 24"><use href="#i-type"/></svg></button>
      </div></div>
    <div class="reader-scroll" id="r-scroll">
      <article class="article">
        <div class="article-kicker">
          <span class="favicon" style="background:${f.c}">${f.l}</span>
          <span style="color:var(--color-text-secondary);font-weight:var(--font-medium)">${esc(f.t)}</span>
          <span aria-hidden="true">·</span><time datetime="${new Date(NOW-it.hours*3600e3).toISOString()}">${fullDate(it.hours)}</time>
          ${it.body?`<span aria-hidden="true">·</span><span>${Math.max(2,Math.round(it.words/230))} min read</span>`:""}
        </div>
        <h1>${esc(it.title)}</h1>
        ${body}
      </article>
      <div class="article-foot">
        <a class="btn btn-primary" id="r-ext" href="${f.site}" target="_blank" rel="noopener noreferrer" style="text-decoration:none"><svg class="icon" viewBox="0 0 24 24"><use href="#i-external"/></svg>Read on ${esc(f.t)}</a>
        ${next?`<button class="btn" id="r-nextfull">Next: ${esc(next.title.slice(0,44))}${next.title.length>44?"…":""}</button>`:""}
      </div></div>`;
  $("#overlays").appendChild(el);
  document.body.style.overflow="hidden";
  $("#r-close").focus();

  el.addEventListener("click",e=>{
    const t=e.target.closest("button"); if(!t) return;
    if(t.id==="r-close") closeReader();
    if(t.id==="r-prev"&&prev){ closeReader(true); openReader(prev.id); }
    if((t.id==="r-next"||t.id==="r-nextfull")&&next){ closeReader(true); openReader(next.id); }
    if(t.id==="r-save"){ toggleSave(id); closeReader(true); openReader(id); }
    if(t.id==="r-type"){ closeReader(); openSettings(); }
  });
  el.addEventListener("keydown",e=>{ if(e.key==="Escape"){e.stopPropagation();closeReader();} if(e.key==="Tab") trapFocus(e,el); });
  announce("Opened article: "+it.title);
}
function closeReader(keep){
  const el=$(".reader"); if(el) el.remove();
  readerId=null;
  if(!keep){ document.body.style.overflow=""; render(); focusCursor(); }
}
function trapFocus(e,root){
  const f=$$('button:not([disabled]),input,select,textarea,a[href]',root).filter(x=>x.offsetParent!==null);
  if(!f.length) return;
  const first=f[0], last=f[f.length-1];
  if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
}

/* ---------------- actions ---------------- */
function markRead(id,val,rerender=true){
  const had=S.read.has(id);
  if(val) S.read.add(id); else S.read.delete(id);
  if(had!==val && rerender) render();
  else save();
}
function toggleSave(id){
  if(S.saved.has(id)){ S.saved.delete(id); announce("Removed from saved"); }
  else { S.saved.add(id); announce("Saved for later"); toast("Saved for later"); }
  render();
}
function markAll(scopeList,label){
  const prev=new Set(S.read);
  scopeList.forEach(i=>S.read.add(i.id));
  lastAction=()=>{ S.read=prev; render(); announce("Undone"); };
  render();
  toast(`${label} marked read`, "Undo", ()=>{ lastAction&&lastAction(); lastAction=null; });
  announce(`${label} marked as read`);
}
let toastTimer;
function toast(msg,actionLabel,fn){
  $(".toast")?.remove();
  const t=document.createElement("div"); t.className="toast"; t.setAttribute("role","status");
  t.innerHTML = `<span>${esc(msg)}</span>`;
  if(actionLabel){ const b=document.createElement("button"); b.textContent=actionLabel; b.onclick=()=>{fn();t.remove()}; t.appendChild(b); }
  document.body.appendChild(t);
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.remove(), actionLabel?7000:2600);
}

/* ---------------- dialogs ---------------- */
function dialog(title,bodyHTML,footHTML){
  const s=document.createElement("div"); s.className="scrim";
  s.innerHTML=`<div class="dialog" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="dialog-head"><h2>${esc(title)}</h2><button class="btn btn-ghost btn-icon" data-close aria-label="Close"><svg class="icon" viewBox="0 0 24 24"><use href="#i-x"/></svg></button></div>
    <div class="dialog-body">${bodyHTML}</div>
    ${footHTML?`<div class="dialog-foot">${footHTML}</div>`:""}</div>`;
  $("#overlays").appendChild(s);
  const close=()=>{ s.remove(); };
  s.addEventListener("click",e=>{ if(e.target===s||e.target.closest("[data-close]")) close(); });
  s.addEventListener("keydown",e=>{ if(e.key==="Escape"){e.stopPropagation();close();} if(e.key==="Tab") trapFocus(e,s); });
  const first=$("input,button",s.querySelector(".dialog-body"))||$("[data-close]",s); first?.focus();
  return {el:s,close};
}

function openSettings(){
  const opt=(v,cur,label)=>`<option value="${v}" ${cur===v?"selected":""}>${label}</option>`;
  const d=dialog("Reading settings",`
    <label class="field"><span>Theme</span><select id="set-theme">${opt("auto",S.theme,"Match system")}${opt("light",S.theme,"Light")}${opt("dark",S.theme,"Dark")}</select></label>
    <label class="field"><span>Text size in reader — ${Math.round(S.textScale*100)}%</span>
      <input type="range" id="set-scale" min="0.85" max="1.4" step="0.05" value="${S.textScale}" style="width:100%"></label>
    <label class="field"><span>Line length — ${S.measure} rem</span>
      <input type="range" id="set-measure" min="32" max="58" step="1" value="${S.measure}" style="width:100%"></label>
    <label class="field"><span>Contrast</span><select id="set-contrast">${opt("normal",S.contrast,"Standard (WCAG AA)")}${opt("high",S.contrast,"High contrast")}</select></label>
    <label class="field"><span>Animation</span><select id="set-motion">${opt("auto",S.motion,"Match system")}${opt("off",S.motion,"Off — no animation")}</select></label>
    <label class="field"><span>Letter spacing</span><select id="set-dys">${opt("off",S.dyslexic,"Standard")}${opt("on",S.dyslexic,"Wider — easier for some dyslexic readers")}</select></label>
    <label class="field" style="margin-bottom:0"><span>Auto-refresh feeds</span><select id="set-refresh">${opt("15",S.refresh,"Every 15 minutes")}${opt("30",S.refresh,"Every 30 minutes")}${opt("60",S.refresh,"Every hour")}${opt("manual",S.refresh,"Manual only")}</select></label>
  `,`<button class="btn" data-close>Done</button>`);
  const bind=(id,key,fn)=>$("#"+id,d.el).addEventListener("input",e=>{ S[key]=fn?fn(e.target.value):e.target.value; applyPrefs(); save();
    if(key==="textScale") e.target.closest(".field").querySelector("span").textContent=`Text size in reader — ${Math.round(S.textScale*100)}%`;
    if(key==="measure") e.target.closest(".field").querySelector("span").textContent=`Line length — ${S.measure} rem`; });
  bind("set-theme","theme"); bind("set-scale","textScale",Number); bind("set-measure","measure",Number);
  bind("set-contrast","contrast"); bind("set-motion","motion"); bind("set-dys","dyslexic"); bind("set-refresh","refresh");
}

function openShortcuts(){
  const row=(k,l)=>`<li><span>${l}</span><span>${k.split(" ").map(x=>`<span class="kbd">${x}</span>`).join(" ")}</span></li>`;
  dialog("Keyboard shortcuts",`<div class="shortcut-grid">
    <div><h3>Moving around</h3><ul>
      ${row("j","Next item")}${row("k","Previous item")}${row("o","Open selected")}${row("Esc","Close / clear search")}</ul></div>
    <div><h3>Acting on an item</h3><ul>
      ${row("s","Save for later")}${row("m","Toggle read / unread")}${row("v","Open original in a new tab")}</ul></div>
    <div><h3>Going places</h3><ul>
      ${row("g h","All items")}${row("g d","Digest")}${row("g s","Saved")}${row("g f","Discover feeds")}</ul></div>
    <div><h3>Everything else</h3><ul>
      ${row("/","Focus search")}${row("⌘ K","Command palette")}${row("r","Refresh feeds")}${row("?","This list")}</ul></div>
  </div>`);
}

function openAddFeed(prefill){
  const d=dialog("Add a feed",`
    <label class="field"><span>Feed or site address</span>
      <input type="text" id="af-url" value="${esc(prefill||"")}" placeholder="https://example.com/feed.xml" autocomplete="off" aria-describedby="af-hint">
      <span class="hint" id="af-hint">Frontpage validates the URL and reads the feed's title before saving it.</span></label>
    <div id="af-result"></div>`,
    `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="af-go">Check feed</button>`);
  const go=()=>{
    const v=$("#af-url",d.el).value.trim(); const out=$("#af-result",d.el); const hint=$("#af-hint",d.el);
    if(!/^https?:\/\/.+\..+/.test(v)){ hint.className="hint err"; hint.textContent="That doesn't look like a web address. It should start with http:// or https://"; return; }
    const known = FEEDS.find(f=>v.includes(new URL(f.site).hostname));
    hint.className="hint"; hint.textContent="Frontpage validates the URL and reads the feed's title before saving it.";
    if(known && S.subs.has(known.id)){
      out.innerHTML=`<div class="hint err" style="font-size:var(--text-sm)">You already follow <strong>${esc(known.t)}</strong>. Nothing to add.</div>`; return;
    }
    if(known){
      out.innerHTML=`<div class="catalog" style="margin-top:var(--space-4)"><div class="catalog-row">
        <span class="favicon" style="background:${known.c}">${known.l}</span>
        <span style="flex:1;min-width:0"><span class="t" style="display:block">${esc(known.t)}</span><span class="d" style="display:block">${known.fmt} · ${esc(known.desc)}</span></span>
        <button class="btn btn-primary" data-sub="${known.id}">Follow</button></div></div>`;
      return;
    }
    out.innerHTML=`<div class="hint err" style="font-size:var(--text-sm)">No RSS or Atom feed found at that address. This demo build can only resolve the 19 catalogue feeds — a deployed Frontpage fetches and parses the URL server-side.</div>`;
  };
  $("#af-go",d.el).onclick=go;
  $("#af-url",d.el).addEventListener("keydown",e=>{ if(e.key==="Enter") go(); });
  if(prefill) go();
}

function openImport(){
  const d=dialog("Import OPML",`
    <label class="field"><span>Paste your OPML, or load the sample file</span>
      <textarea id="op-text" spellcheck="false" placeholder="&lt;opml version=&quot;2.0&quot;&gt;…"></textarea>
      <span class="hint">Frontpage handles nested categories, lowercase attribute names and outlines with a missing type.</span></label>
    <button class="btn" id="op-sample">Load sample-feeds.opml</button>
    <div id="op-result" style="margin-top:var(--space-4)"></div>`,
    `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="op-go">Preview import</button>`);
  $("#op-sample",d.el).onclick=()=>{ $("#op-text",d.el).value=SAMPLE_OPML; };
  $("#op-go",d.el).onclick=()=>{
    const txt=$("#op-text",d.el).value.trim(); const out=$("#op-result",d.el);
    if(!txt){ out.innerHTML=`<div class="hint err">Paste an OPML file first, or load the sample.</div>`; return; }
    const r=parseOPML(txt);
    if(r.error){ out.innerHTML=`<div class="hint err">${esc(r.error)}</div>`; return; }
    out.innerHTML=`<div class="catalog">
      ${r.add.length?`<div class="catalog-row"><svg class="icon" style="color:var(--color-success)" viewBox="0 0 24 24"><use href="#i-check-circle"/></svg><span class="t">${r.add.length} feed${r.add.length===1?"":"s"} to add</span></div>`:""}
      ${r.dupes?`<div class="catalog-row"><svg class="icon" style="color:var(--color-text-tertiary)" viewBox="0 0 24 24"><use href="#i-circle"/></svg><span class="t">${r.dupes} duplicate${r.dupes===1?"":"s"} skipped</span><span class="d">same xmlUrl already subscribed</span></div>`:""}
      ${r.dead?`<div class="catalog-row"><svg class="icon" style="color:var(--color-error)" viewBox="0 0 24 24"><use href="#i-alert"/></svg><span class="t">${r.dead} feed${r.dead===1?"":"s"} unreachable</span><span class="d">404 — reported, not imported</span></div>`:""}
      ${r.quirks.map(q=>`<div class="catalog-row"><svg class="icon" style="color:var(--color-warning)" viewBox="0 0 24 24"><use href="#i-clock"/></svg><span class="t" style="flex:1">${esc(q)}</span></div>`).join("")}
    </div>
    ${r.add.length?`<button class="btn btn-primary" id="op-apply" style="margin-top:var(--space-4)">Import ${r.add.length} feed${r.add.length===1?"":"s"}</button>`:`<div class="hint ok" style="margin-top:var(--space-3)">Everything in this file is already in your subscriptions.</div>`}`;
    const apply=$("#op-apply",d.el);
    if(apply) apply.onclick=()=>{ r.add.forEach(id=>S.subs.add(id)); d.close(); render(); toast(`Imported ${r.add.length} feeds`); announce(`Imported ${r.add.length} feeds`); };
  };
}
function parseOPML(txt){
  let doc;
  try{ doc=new DOMParser().parseFromString(txt,"text/xml"); }catch(e){ return {error:"That file couldn't be parsed as XML."}; }
  if(doc.querySelector("parsererror")) return {error:"That file isn't valid XML. Check that it wasn't truncated when you copied it."};
  const outlines=[...doc.querySelectorAll("outline")];
  if(!outlines.length) return {error:"No feed entries found. An OPML file should contain <outline> elements with an xmlUrl attribute."};
  const seen=new Set(), add=[], quirks=[]; let dupes=0, dead=0;
  let sawLower=false, sawNoType=false, sawNoText=false, deepest=0;
  for(const o of outlines){
    let depth=0, p=o.parentElement; while(p && p.tagName==="outline"){depth++;p=p.parentElement;}
    deepest=Math.max(deepest,depth);
    let url=null;
    for(const a of o.attributes){ if(a.name.toLowerCase()==="xmlurl"){ url=a.value; if(a.name!=="xmlUrl") sawLower=true; } }
    if(!url) continue;
    if(!o.getAttribute("type")) sawNoType=true;
    if(!o.getAttribute("text") && !o.getAttribute("title")) sawNoText=true;
    if(seen.has(url)){ dupes++; continue; }
    seen.add(url);
    const known=FEEDS.find(f=>f.url===url);
    if(!known){ dead++; continue; }
    if(S.subs.has(known.id)){ dupes++; continue; }
    add.push(known.id);
  }
  if(sawLower) quirks.push("1 outline used a lowercase xmlurl attribute — matched case-insensitively");
  if(sawNoType) quirks.push("1 outline had no type attribute — imported anyway");
  if(sawNoText) quirks.push("1 outline had no title — title taken from the feed itself");
  if(deepest>1) quirks.push(`Nested categories ${deepest} levels deep — flattened to top-level categories`);
  return {add,dupes,dead,quirks};
}
function openExport(){
  const mine=FEEDS.filter(f=>S.subs.has(f.id));
  const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head>\n    <title>Frontpage subscriptions</title>\n  </head>\n  <body>\n`+
   CATS.map(c=>{const fs=mine.filter(f=>f.cat===c.id); if(!fs.length) return "";
     return `    <outline text="${c.name.replace(/&/g,"&amp;")}" title="${c.name.replace(/&/g,"&amp;")}">\n`+
      fs.map(f=>`      <outline type="rss" text="${f.t}" title="${f.t}" xmlUrl="${f.url}" htmlUrl="${f.site}" />`).join("\n")+`\n    </outline>\n`;}).join("")+
   `  </body>\n</opml>`;
  const d=dialog("Export OPML",`<p class="hint" style="margin-bottom:var(--space-3)">${mine.length} subscriptions in ${CATS.filter(c=>mine.some(f=>f.cat===c.id)).length} categories. Copy this, or save it as <code>frontpage.opml</code>.</p>
    <label class="field" style="margin:0"><span class="sr-only">OPML output</span><textarea id="ex-text" readonly style="height:14rem">${esc(xml)}</textarea></label>`,
    `<button class="btn" data-close>Close</button><button class="btn btn-primary" id="ex-copy">Copy to clipboard</button>`);
  $("#ex-copy",d.el).onclick=async()=>{
    try{ await navigator.clipboard.writeText(xml); toast("OPML copied"); }
    catch(e){ $("#ex-text",d.el).select(); toast("Press ⌘C to copy"); }
  };
}
function openHealth(){
  const rows=FEEDS.filter(f=>S.subs.has(f.id)).sort((a,b)=>({error:0,stale:1,ok:2}[a.health]-{error:0,stale:1,ok:2}[b.health])).map(f=>{
    const col=f.health==="error"?"var(--color-error)":f.health==="stale"?"var(--color-warning)":"var(--color-success)";
    const ic=f.health==="error"?"#i-alert":f.health==="stale"?"#i-clock":"#i-check-circle";
    const msg=f.health==="error"?f.err : f.health==="stale"?`No new items in ${Math.round(f.fetched/24)} days. The feed is reachable — this source just publishes rarely.` : `Last fetched ${when(f.fetched)}.`;
    return `<div class="catalog-row"><svg class="icon" style="color:${col}" viewBox="0 0 24 24"><use href="${ic}"/></svg>
      <span style="flex:1;min-width:0"><span class="t" style="display:block">${esc(f.t)}</span><span class="d" style="display:block;white-space:normal">${esc(msg)}</span></span>
      ${f.health==="error"?`<button class="btn" data-retry="${f.id}">Retry</button>`:""}</div>`;
  }).join("");
  const d=dialog("Feed health",`<div class="catalog">${rows}</div>`,`<button class="btn" data-close>Close</button>`);
  d.el.addEventListener("click",e=>{ const b=e.target.closest("[data-retry]"); if(!b) return;
    b.disabled=true; b.textContent="Retrying…";
    setTimeout(()=>{ b.textContent="Still failing"; announce("Retry failed, backing off"); toast("Netlify Blog still unreachable — next retry in 64 minutes"); },1100); });
}

/* ---------------- command palette ---------------- */
function openPalette(){
  const cmds=[
    ...CATS.map(c=>({t:"Go to "+c.name,k:"Category",run:()=>go({type:"cat",id:c.id})})),
    ...FEEDS.filter(f=>S.subs.has(f.id)).map(f=>({t:"Go to "+f.t,k:"Feed",run:()=>go({type:"feed",id:f.id})})),
    {t:"All items",k:"Go",run:()=>go({type:"all"})},
    {t:"Digest",k:"Go",run:()=>setView("digest")},
    {t:"Saved",k:"Go",run:()=>setView("saved")},
    {t:"Discover feeds",k:"Go",run:()=>setView("discover")},
    {t:"Compact layout",k:"Layout",run:()=>setLayout("compact")},
    {t:"Comfortable layout",k:"Layout",run:()=>setLayout("comfortable")},
    {t:"Magazine layout",k:"Layout",run:()=>setLayout("magazine")},
    {t:"Mark everything read",k:"Action",run:()=>markAll(subscribed(),"All items")},
    {t:"Refresh all feeds",k:"Action",run:refreshAll},
    {t:"Add a feed",k:"Action",run:()=>openAddFeed()},
    {t:"Import OPML",k:"Action",run:openImport},
    {t:"Export OPML",k:"Action",run:openExport},
    {t:"Feed health",k:"Action",run:openHealth},
    {t:"Reading settings",k:"Action",run:openSettings},
    {t:"Toggle dark mode",k:"Action",run:()=>{S.theme = (S.theme==="dark")?"light":"dark"; applyPrefs(); save(); toast(S.theme==="dark"?"Dark theme on":"Light theme on");}},
    {t:"Keyboard shortcuts",k:"Help",run:openShortcuts}
  ];
  const s=document.createElement("div"); s.className="scrim";
  s.innerHTML=`<div class="dialog" role="dialog" aria-modal="true" aria-label="Command palette" style="max-width:30rem">
    <label class="sr-only" for="pal">Type a command</label>
    <input class="palette-input" id="pal" placeholder="Type a command or a feed name…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="pal-list">
    <ul class="palette-list" id="pal-list" role="listbox"></ul></div>`;
  $("#overlays").appendChild(s);
  const input=$("#pal",s), list=$("#pal-list",s); let sel=0, shown=cmds;
  const draw=()=>{
    const q=input.value.toLowerCase().trim();
    shown=cmds.filter(c=>c.t.toLowerCase().includes(q)||c.k.toLowerCase().includes(q)).slice(0,9);
    sel=Math.min(sel,Math.max(0,shown.length-1));
    list.innerHTML=shown.map((c,i)=>`<li><button class="palette-item" role="option" aria-selected="${i===sel}" data-i="${i}">
      <span>${esc(c.t)}</span><span class="kbd">${esc(c.k)}</span></button></li>`).join("")||`<li style="padding:var(--space-4);color:var(--color-text-tertiary);font-size:var(--text-sm)">No command matches that.</li>`;
  };
  draw(); input.focus();
  const close=()=>s.remove();
  input.addEventListener("input",()=>{sel=0;draw()});
  input.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(sel+1,shown.length-1);draw()}
    else if(e.key==="ArrowUp"){e.preventDefault();sel=Math.max(sel-1,0);draw()}
    else if(e.key==="Enter"){e.preventDefault(); if(shown[sel]){close();shown[sel].run();}}
    else if(e.key==="Escape"){e.stopPropagation();close()}
  });
  s.addEventListener("click",e=>{ if(e.target===s) return close();
    const b=e.target.closest("[data-i]"); if(b){ close(); shown[+b.dataset.i].run(); } });
}
/* ---------------- navigation ---------------- */
function go(scope){ S.view="feed"; S.scope=scope; query=""; $("#q").value=""; cursor=-1; render(); $("#scroll").scrollTop=0; closeNav(); }
function setView(v){ S.view=v; if(v==="feed") S.scope={type:"all"}; query=""; $("#q").value=""; cursor=-1; render(); $("#scroll").scrollTop=0; closeNav(); }
function setLayout(l){ S.layout=l; render(); announce(l+" layout"); }
function closeNav(){ $("#sidebar").classList.remove("is-open"); $("#nav-scrim").hidden=true; $("#nav-open").setAttribute("aria-expanded","false"); }

function refreshAll(){
  const b=$("#btn-refresh"); if(b){ b.disabled=true; b.innerHTML=`<svg class="icon" viewBox="0 0 24 24"><use href="#i-refresh"/></svg>Refreshing…`; }
  announce("Refreshing feeds");
  setTimeout(()=>{ render(); toast("All feeds up to date · 1 feed still failing"); announce("Refresh complete. 1 feed could not be reached."); },900);
}

/* ---------------- cursor / keyboard ---------------- */
function cursorItems(){ return $$("[data-item]").map(el=>el.dataset.item); }
function focusCursor(){
  const els=$$("[data-item]");
  els.forEach((el,i)=>el.classList.toggle("is-cursor",i===cursor));
  const el=els[cursor];
  if(el){ el.scrollIntoView({block:"nearest"}); const it=ITEMS.find(x=>x.id===el.dataset.item);
    if(it) announce(`${it.title}, ${feed(it.feed).t}, ${S.read.has(it.id)?"read":"unread"}`); }
}
function moveCursor(d){
  const n=$$("[data-item]").length; if(!n) return;
  cursor = cursor<0 ? (d>0?0:n-1) : Math.max(0,Math.min(n-1,cursor+d));
  focusCursor();
}
function currentId(){ const el=$$("[data-item]")[cursor]; return el?el.dataset.item:null; }

let gPending=false, gTimer;
document.addEventListener("keydown",e=>{
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
  if(e.key==="Escape"){
    if($(".scrim")){ $(".scrim").remove(); return; }
    if($(".reader")){ closeReader(); return; }
    if(query){ query=""; $("#q").value=""; render(); return; }
    if(typing) e.target.blur();
    return;
  }
  if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); if(!$(".scrim")) openPalette(); return; }
  if(typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if($(".scrim")) return;
  if($(".reader")){
    if(e.key==="j"||e.key==="ArrowDown"){} // reader scrolls natively
    if(e.key==="s"&&readerId){ e.preventDefault(); const id=readerId; toggleSave(id); closeReader(true); openReader(id); }
    return;
  }
  if($("#app").classList.contains("is-on")===false) return;

  if(gPending){
    gPending=false; clearTimeout(gTimer);
    const map={h:()=>go({type:"all"}),d:()=>setView("digest"),s:()=>setView("saved"),f:()=>setView("discover")};
    if(map[e.key]){ e.preventDefault(); map[e.key](); return; }
  }
  switch(e.key){
    case "j": e.preventDefault(); moveCursor(1); break;
    case "k": e.preventDefault(); moveCursor(-1); break;
    case "o": case "Enter": { const id=currentId(); if(id){ e.preventDefault(); openReader(id);} break; }
    case "s": { const id=currentId(); if(id){ e.preventDefault(); toggleSave(id); focusCursor(); } break; }
    case "m": { const id=currentId(); if(id){ e.preventDefault(); markRead(id,!S.read.has(id)); focusCursor(); announce(S.read.has(id)?"Marked read":"Marked unread"); } break; }
    case "v": { const id=currentId(); if(id){ e.preventDefault(); const it=ITEMS.find(x=>x.id===id); markRead(id,true); window.open(feed(it.feed).site,"_blank","noopener"); } break; }
    case "r": e.preventDefault(); refreshAll(); break;
    case "/": e.preventDefault(); $("#q").focus(); $("#q").select(); break;
    case "?": e.preventDefault(); openShortcuts(); break;
    case "g": gPending=true; gTimer=setTimeout(()=>gPending=false,900); break;
  }
});

/* ---------------- delegated events ---------------- */
document.addEventListener("click",e=>{
  const t=e.target;
  const enter=t.closest("[data-enter]");
  if(enter){ enterApp(enter.dataset.enter); return; }

  const nav=t.closest("[data-nav]");
  if(nav){
    const k=nav.dataset.nav;
    if(k==="all") go({type:"all"});
    else if(k==="cat") go({type:"cat",id:nav.dataset.id});
    else if(k==="feed") go({type:"feed",id:nav.dataset.id});
    else setView(k);
    return;
  }
  const ct=t.closest("[data-cat-toggle]");
  if(ct){ const id=ct.dataset.catToggle; S.collapsed.has(id)?S.collapsed.delete(id):S.collapsed.add(id); renderSidebar(); save(); return; }

  const lay=t.closest("[data-layout]");
  if(lay && lay.tagName==="BUTTON"){ setLayout(lay.dataset.layout); return; }

  const open=t.closest("[data-open]");
  if(open){ openReader(open.dataset.open); return; }

  const act=t.closest("[data-act]");
  if(act){
    const id=act.dataset.id;
    if(act.dataset.act==="save") toggleSave(id);
    if(act.dataset.act==="read"){ markRead(id,!S.read.has(id)); announce(S.read.has(id)?"Marked read":"Marked unread"); }
    if(act.dataset.act==="ext"){ const it=ITEMS.find(x=>x.id===id); markRead(id,true); window.open(feed(it.feed).site,"_blank","noopener"); }
    return;
  }
  const sub=t.closest("[data-sub]");
  if(sub){ const id=sub.dataset.sub;
    if(S.subs.has(id)){ S.subs.delete(id); toast(`Unfollowed ${feed(id).t}`); }
    else { S.subs.add(id); toast(`Following ${feed(id).t}`); }
    const sc=sub.closest(".scrim"); if(sc) sc.remove();
    render(); return; }

  const pack=t.closest("[data-pack]");
  if(pack){ const p=PACKS.find(x=>x.id===pack.dataset.pack);
    p.feeds.forEach(id=>S.subs.add(id)); render(); toast(`Added ${p.feeds.length} feeds from ${p.name}`); announce(`Added ${p.feeds.length} feeds`); return; }

  const el=t.closest("button"); if(!el) return;
  switch(el.id){
    case "btn-refresh": refreshAll(); break;
    case "btn-markall": markAll(scopeItems(), scopeTitle()); break;
    case "digest-markall": markAll(digestSet().rest,"Everything else"); break;
    case "btn-sort": S.sort=S.sort==="new"?"old":"new"; render(); announce("Sorted "+(S.sort==="new"?"newest first":"oldest first")); break;
    case "btn-add": openAddFeed(); break;
    case "btn-settings": openSettings(); break;
    case "side-keys": openShortcuts(); break;
    case "side-import": case "disc-import": openImport(); break;
    case "disc-export": openExport(); break;
    case "health-btn": openHealth(); break;
    case "add-cat": toast("Category editing is in the full build — the five here come from your imported structure"); break;
    case "clear-q": query=""; $("#q").value=""; render(); break;
    case "banner-new": S.lastVisit=NOW; render(); $("#scroll").scrollTop=0; announce("Showing latest items"); break;
    case "nav-open": { const sb=$("#sidebar"); const open=!sb.classList.contains("is-open");
      sb.classList.toggle("is-open",open); $("#nav-scrim").hidden=!open; el.setAttribute("aria-expanded",open); break; }
    case "add-go": { const v=$("#add-url").value; openAddFeed(v); break; }
    case "lp-theme": { const dark=document.documentElement.getAttribute("data-theme")==="dark";
      document.documentElement.setAttribute("data-theme",dark?"light":"dark");
      el.setAttribute("aria-label",dark?"Switch to dark theme":"Switch to light theme"); break; }
  }
});
$("#nav-scrim").addEventListener("click",closeNav);

/* search */
let qTimer;
$("#q").addEventListener("input",e=>{
  clearTimeout(qTimer);
  qTimer=setTimeout(()=>{ query=e.target.value; cursor=-1; S.view="feed"; render();
    if(query.trim()) announce(`${scopeItems().length} results for ${query}`); },160);
});
$$(".tab, .tabbar button").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));

/* ---------------- entry ---------------- */
function enterApp(kind){
  if(kind==="upgrade"){
    const d=dialog("Keep this setup",`
      <p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-5)">An account keeps your subscriptions, read state and saved articles across devices, and lets you add feeds of your own. Everything you've done as a guest carries over.</p>
      <label class="field"><span>Email</span><input type="email" id="su-email" placeholder="you@example.com" autocomplete="email"></label>
      <label class="field" style="margin-bottom:0"><span>Password</span><input type="password" id="su-pass" autocomplete="new-password" aria-describedby="su-hint"><span class="hint" id="su-hint">At least 8 characters.</span></label>`,
      `<button class="btn" data-close>Not now</button><button class="btn btn-primary" id="su-go">Create account</button>`);
    $("#su-go",d.el).onclick=()=>{
      const em=$("#su-email",d.el).value.trim();
      if(!/.+@.+\..+/.test(em)){ $("#su-hint",d.el).className="hint err"; $("#su-hint",d.el).textContent="Enter an email address so we can send a password reset if you need one."; return; }
      S.mode="account"; d.close(); save(); render();
      $("#who").textContent=em[0].toUpperCase(); $("#who").title=em;
      toast("Account created — your reading now syncs"); announce("Account created");
    };
    return;
  }
  if(kind==="account"){ S.mode="account"; load("account"); }
  else { S.mode="guest"; load("guest"); }
  S.mode = kind==="account"?"account":"guest";
  $("#who").textContent = S.mode==="account"?"A":"G";
  $("#who").title = S.mode==="account"?"Signed in":"Guest session";
  $("#landing").style.display="none";
  $("#app").classList.add("is-on");
  applyPrefs(); render();
  $("#main").focus();
  announce(S.mode==="guest"?"Guest dashboard loaded with 19 feeds":"Welcome back");
}

/* ---------------- landing preview ---------------- */
(function(){
  const rows = ITEMS.slice(0,5).map((it,i)=>{ const f=feed(it.feed);
    return `<div class="hero-item ${i>2?"is-read":""}">
      <span class="mark" style="${i>2?"background:transparent;border:1px solid var(--color-border)":""}"></span>
      <div><div class="hero-item-meta"><span class="favicon" style="background:${f.c}">${f.l}</span>${esc(f.s)} · ${when(it.hours)}</div>
      <div class="hero-item-title">${esc(it.title)}</div></div></div>`;
  }).join("");
  $("#hero-items").innerHTML=rows;
  $("#lp-sources").innerHTML=FEEDS.map(f=>`<span class="chip"><span class="favicon" style="background:${f.c};width:12px;height:12px;font-size:7px">${f.l}</span>${esc(f.t)}</span>`).join("");
})();

const SAMPLE_OPML = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head><title>Frontpage Sample Feeds</title></head>
  <body>
    <outline text="Frontend" title="Frontend">
      <outline type="rss" text="CSS-Tricks" xmlUrl="https://css-tricks.com/feed/" htmlUrl="https://css-tricks.com/" />
      <outline type="rss" text="Smashing Magazine" xmlUrl="https://www.smashingmagazine.com/feed/" />
      <outline type="rss" text="Josh W. Comeau" xmlUrl="https://www.joshwcomeau.com/rss.xml" />
      <outline type="rss" text="Kent C. Dodds" xmlUrl="https://kentcdodds.com/blog/rss.xml" />
      <outline type="rss" text="web.dev" xmlUrl="https://web.dev/feed.xml" />
      <outline type="rss" text="MDN Blog" xmlUrl="https://developer.mozilla.org/en-US/blog/rss.xml" />
    </outline>
    <outline text="Design" title="Design">
      <outline type="rss" text="Sidebar.io" xmlUrl="https://sidebar.io/feed.xml" />
      <outline type="rss" text="Nielsen Norman Group" xmlUrl="https://www.nngroup.com/feed/rss/" />
      <outline type="rss" text="Figma Blog" xmlUrl="https://www.figma.com/blog/feed/" />
      <outline type="rss" text="A List Apart" xmlUrl="https://alistapart.com/main/feed/" />
      <outline type="rss" text="UX Collective" xmlUrl="https://uxdesign.cc/feed" />
    </outline>
    <outline text="Backend &amp; DevOps" title="Backend &amp; DevOps">
      <outline type="rss" text="Cloudflare Blog" xmlUrl="https://blog.cloudflare.com/rss/" />
      <outline type="rss" text="Vercel Blog" xmlUrl="https://vercel.com/atom" />
      <outline type="rss" text="The GitHub Blog" xmlUrl="https://github.blog/feed/" />
      <outline type="rss" text="Netlify Blog" xmlUrl="https://www.netlify.com/blog/index.xml" />
    </outline>
    <outline text="General Tech" title="General Tech">
      <outline type="rss" text="The Pragmatic Engineer" xmlUrl="https://blog.pragmaticengineer.com/rss/" />
      <outline type="rss" text="Hacker News Best" xmlUrl="https://hnrss.org/best" />
    </outline>
    <outline text="AI &amp; ML" title="AI &amp; ML">
      <outline type="rss" text="Simon Willison's Weblog" xmlUrl="https://simonwillison.net/atom/everything/" />
      <outline type="rss" text="Hugging Face Blog" xmlUrl="https://huggingface.co/blog/feed.xml" />
    </outline>
    <outline text="Nested Category" title="Nested Category">
      <outline text="Subcategory" title="Subcategory">
        <outline type="rss" text="Netlify Blog" xmlUrl="https://www.netlify.com/blog/index.xml" />
      </outline>
    </outline>
    <outline type="rss" text="Duplicate — Simon Willison" xmlUrl="https://simonwillison.net/atom/everything/" />
    <outline type="rss" text="Defunct Tech Blog" xmlUrl="https://example.com/this-feed-does-not-exist.xml" />
    <outline text="web.dev (no type)" xmlUrl="https://web.dev/feed.xml" />
    <outline type="rss" text="CSS-Tricks (alt attr)" xmlurl="https://css-tricks.com/feed/" />
    <outline type="rss" xmlUrl="https://blog.cloudflare.com/rss/" />
  </body>
</opml>`;

/* boot */
applyPrefs();
