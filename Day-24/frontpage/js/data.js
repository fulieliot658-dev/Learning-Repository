/* ============================================================
   Frontpage — data layer
   Feeds mirror data/sample-feeds.json. Items are representative
   demo content (a published static page can't fetch RSS itself).
   ============================================================ */
const FEEDS = [
 {id:"csstricks",t:"CSS-Tricks",s:"CSS-Tricks",cat:"frontend",c:"#e8543f",l:"C",url:"https://css-tricks.com/feed/",site:"https://css-tricks.com/",fmt:"RSS 2.0",desc:"Tips, tricks, and techniques on using Cascading Style Sheets.",full:true,health:"ok",fetched:22},
 {id:"smashing",t:"Smashing Magazine",s:"Smashing Mag",cat:"frontend",c:"#d33a2c",l:"S",url:"https://www.smashingmagazine.com/feed/",site:"https://www.smashingmagazine.com/",fmt:"RSS 2.0",desc:"For web designers and developers.",full:true,health:"ok",fetched:14},
 {id:"comeau",t:"Josh W. Comeau",s:"Josh Comeau",cat:"frontend",c:"#6d5bd0",l:"J",url:"https://www.joshwcomeau.com/rss.xml",site:"https://www.joshwcomeau.com/",fmt:"RSS 2.0",desc:"Friendly tutorials for developers.",full:true,health:"ok",fetched:31},
 {id:"kcd",t:"Kent C. Dodds",s:"Kent C. Dodds",cat:"frontend",c:"#1e88a8",l:"K",url:"https://kentcdodds.com/blog/rss.xml",site:"https://kentcdodds.com/",fmt:"RSS 2.0",desc:"Quality software, one post at a time.",full:false,health:"ok",fetched:44},
 {id:"webdev",t:"web.dev",s:"web.dev",cat:"frontend",c:"#4285f4",l:"w",url:"https://web.dev/feed.xml",site:"https://web.dev/",fmt:"Atom 1.0",desc:"Building a better web, together.",full:true,health:"ok",fetched:9},
 {id:"mdn",t:"MDN Blog",s:"MDN Blog",cat:"frontend",c:"#111827",l:"M",url:"https://developer.mozilla.org/en-US/blog/rss.xml",site:"https://developer.mozilla.org/en-US/blog/",fmt:"RSS 2.0",desc:"The MDN Web Docs blog.",full:false,health:"ok",fetched:52},
 {id:"sidebar",t:"Sidebar.io",s:"Sidebar.io",cat:"design",c:"#3b7dd8",l:"S",url:"https://sidebar.io/feed.xml",site:"https://sidebar.io/",fmt:"Atom 1.0",desc:"The five best design links, every day.",full:false,health:"ok",fetched:5},
 {id:"nng",t:"Nielsen Norman Group",s:"NN Group",cat:"design",c:"#0b7a3e",l:"N",url:"https://www.nngroup.com/feed/rss/",site:"https://www.nngroup.com/",fmt:"RSS 2.0",desc:"Evidence-based user experience research.",full:true,health:"ok",fetched:26},
 {id:"figma",t:"Figma Blog",s:"Figma Blog",cat:"design",c:"#7b4bd8",l:"F",url:"https://www.figma.com/blog/feed/",site:"https://www.figma.com/blog/",fmt:"RSS 2.0",desc:"How products get designed, at Figma and beyond.",full:true,health:"ok",fetched:18},
 {id:"ala",t:"A List Apart",s:"A List Apart",cat:"design",c:"#b8443a",l:"A",url:"https://alistapart.com/main/feed/",site:"https://alistapart.com/",fmt:"RSS 2.0",desc:"For people who make websites.",full:true,health:"stale",fetched:1130},
 {id:"uxc",t:"UX Collective",s:"UX Collective",cat:"design",c:"#1a1d21",l:"U",url:"https://uxdesign.cc/feed",site:"https://uxdesign.cc/",fmt:"RSS 2.0",desc:"Curated stories on user experience and product design.",full:false,health:"ok",fetched:12},
 {id:"cloudflare",t:"Cloudflare Blog",s:"Cloudflare Blog",cat:"backend",c:"#f38020",l:"C",url:"https://blog.cloudflare.com/rss/",site:"https://blog.cloudflare.com/",fmt:"RSS 2.0",desc:"The Cloudflare Blog.",full:true,health:"ok",fetched:7},
 {id:"vercel",t:"Vercel Blog",s:"Vercel Blog",cat:"backend",c:"#1a1d21",l:"V",url:"https://vercel.com/atom",site:"https://vercel.com/blog",fmt:"Atom 1.0",desc:"Updates from Vercel.",full:true,health:"ok",fetched:16},
 {id:"github",t:"The GitHub Blog",s:"GitHub Blog",cat:"backend",c:"#24292f",l:"G",url:"https://github.blog/feed/",site:"https://github.blog/",fmt:"RSS 2.0",desc:"Updates, ideas and inspiration from GitHub.",full:false,health:"ok",fetched:29},
 {id:"netlify",t:"Netlify Blog",s:"Netlify Blog",cat:"backend",c:"#00ad9f",l:"N",url:"https://www.netlify.com/blog/index.xml",site:"https://www.netlify.com/blog/",fmt:"RSS 2.0",desc:"News and posts from Netlify.",full:false,health:"error",fetched:39,err:"504 Gateway Timeout — the feed server didn't respond within 10s. Retrying in 32 min."},
 {id:"pragmatic",t:"The Pragmatic Engineer",s:"Pragmatic Engineer",cat:"general",c:"#c2410c",l:"P",url:"https://blog.pragmaticengineer.com/rss/",site:"https://blog.pragmaticengineer.com/",fmt:"RSS 2.0",desc:"Observations across the software engineering industry.",full:false,paywall:true,health:"ok",fetched:11},
 {id:"hn",t:"Hacker News Best",s:"Hacker News",cat:"general",c:"#ff6600",l:"Y",url:"https://hnrss.org/best",site:"https://news.ycombinator.com/",fmt:"RSS 2.0",desc:"Best stories on Hacker News.",full:false,health:"ok",fetched:2},
 {id:"simonw",t:"Simon Willison's Weblog",s:"Simon Willison",cat:"ai",c:"#0b7285",l:"S",url:"https://simonwillison.net/atom/everything/",site:"https://simonwillison.net/",fmt:"Atom 1.0",desc:"AI, Python and web development.",full:true,health:"ok",fetched:3},
 {id:"hf",t:"Hugging Face Blog",s:"Hugging Face",cat:"ai",c:"#ffb703",l:"H",url:"https://huggingface.co/blog/feed.xml",site:"https://huggingface.co/blog",fmt:"Atom 1.0",desc:"The latest from Hugging Face.",full:true,health:"ok",fetched:21}
];

const CATS = [
 {id:"frontend",name:"Frontend",c:"#2563eb"},
 {id:"design",name:"Design",c:"#d946ef"},
 {id:"backend",name:"Backend & DevOps",c:"#f59e0b"},
 {id:"general",name:"General Tech",c:"#6366f1"},
 {id:"ai",name:"AI & ML",c:"#10b981"}
];

const P = (...a)=>a.map(x=>"<p>"+x+"</p>").join("");
const RAW = [
 ["comeau",2,"The surprising truth about CSS container queries","Container queries have been available for a while now, but most developers are still using them like media queries with a different syntax. There's a much more powerful mental model that unlocks truly reusable components.",
  P("For years, responsive design meant one thing: ask the viewport how wide it is, then rearrange everything at once. It worked, but it produced components that only knew how to behave in the layout they were first written for.",
    "Container queries flip the question. Instead of asking the page how big it is, a component asks its own parent. That sounds like a small change. In practice it means a card can be dropped into a sidebar, a three-column grid, or a full-width hero and get it right without a single new breakpoint.")+
  "<h2>The mental model shift</h2>"+
  P("The trick is to stop thinking in page breakpoints and start thinking in component breakpoints. A card doesn't care that the viewport is 768px wide. It cares that it has 320px to work with.")+
  "<pre><code>.card-wrap {\n  container-type: inline-size;\n  container-name: card;\n}\n\n@container card (min-width: 24rem) {\n  .card { grid-template-columns: 8rem 1fr; }\n}</code></pre>"+
  P("Two lines of setup, and the component is now portable. Every layout it lands in gets the right treatment for free.")+
  "<h2>Where it gets interesting</h2>"+
  P("Container query units are the part people miss. <code>cqi</code> is one percent of the container's inline size, which means type can scale against the component rather than the window. Pair it with <code>clamp()</code> and a card title fluidly resizes inside a sidebar without ever consulting the viewport.",
    "The migration path is gentle: keep your media queries for page-level layout, and use container queries for anything you intend to reuse. The two coexist perfectly well.")],
 ["figma",6,"Introducing Variables 2.0: design tokens meet real logic","Variables in Figma now support conditional logic, mathematical expressions and cross-file references. This unlocks design system workflows that were previously only possible in code.",
  P("Design tokens have always been a translation problem. Designers maintain one source of truth, engineers maintain another, and the two drift apart between releases.",
    "Variables 2.0 closes the gap by letting a token be computed rather than merely stored. A spacing value can be derived from a base unit. A colour can respond to a mode. A component can express the rule instead of the result.")+
  "<h2>Expressions</h2>"+
  P("You can now write <code>{space.base} * 4</code> instead of hard-coding 16. When the base changes, everything downstream follows — the same behaviour a build step gives you in code, but visible while you design.")+
  "<h2>Cross-file references</h2>"+
  P("A library file can publish primitives that product files consume without copying. Update once, and every consuming file sees the change on its next sync.",
    "We're shipping this to all plans over the coming weeks. The REST API exposes computed values, so token pipelines keep working unchanged.")],
 ["cloudflare",3,"How we cut p99 latency 60% with edge-first caching","Our engineering team spent the last quarter rethinking how we cache at the edge. The result: dramatically lower tail latency for our most demanding customers, and lessons applicable to any distributed system.",
  P("Tail latency is where distributed systems tell the truth. The median hides your problems; p99 reveals them. When we started this work, our p99 for cache-miss paths sat at 340ms. It now sits at 134ms.")+
  "<h2>The diagnosis</h2>"+
  P("Most of the cost was not in fetching data. It was in deciding what to fetch. Every request walked a chain of conditional checks — purge state, tiered cache membership, origin health — and each check was a potential network hop.",
    "Collapsing those into a single locally-resolvable decision removed three of the four hops for a typical miss.")+
  "<h2>What we changed</h2>"+
  "<ul><li>Cache metadata is now replicated to every colo rather than fetched from a regional tier.</li><li>Purge propagation moved to a gossip protocol with bounded staleness instead of a synchronous fan-out.</li><li>Origin health is sampled continuously rather than probed on demand.</li></ul>"+
  P("The staleness trade-off is real: a purge can now take up to 1.2 seconds to reach every location, against 300ms before. For the overwhelming majority of workloads that is an excellent trade for a 60% reduction in tail latency.")+
  "<h2>What transfers</h2>"+
  P("The general lesson isn't about caching. It's that coordination on the hot path is usually the thing costing you your tail. Move the coordination off the request, accept bounded inconsistency, and measure what you actually lose.")],
 ["simonw",4,"Building effective RAG systems: what actually works in production","After months of experimenting with retrieval-augmented generation in real applications, here's what I've learned about chunking strategies, embedding models, and the surprising importance of metadata filtering.",
  P("Retrieval-augmented generation demos beautifully and productionises badly. The gap is almost never the model. It's the retrieval.")+
  "<h2>Chunking matters more than embeddings</h2>"+
  P("I've swapped embedding models three times and measured single-digit improvements. I changed my chunking strategy once and measured a 40% improvement in answer quality.",
    "Fixed-size chunks split arguments in half. Semantic chunking on heading boundaries, with a small overlap and the parent heading prepended to every chunk, fixed most of my retrieval failures at a stroke.")+
  "<h2>Metadata filtering is underrated</h2>"+
  P("Vector similarity is a blunt instrument. If a user asks about last quarter, no amount of embedding quality will reliably exclude documents from three years ago. A date filter will, instantly and for free.",
    "My current default: filter hard on metadata first, then rank by vector similarity within the filtered set. Retrieval quality goes up and the index gets cheaper to search.")+
  "<h2>Evaluate before you optimise</h2>"+
  P("Build a set of thirty real questions with known-good source documents before you touch anything else. Without it you are tuning by vibes, and vibes are how RAG systems end up confidently wrong.")],
 ["smashing",2,"A practical guide to designing for colorblind users","Color blindness affects roughly 8% of men and 0.5% of women worldwide. Yet most interfaces rely heavily on color to convey meaning, status, and hierarchy. Here's how to design interfaces that work for everyone without sacrificing visual richness.",
  P("The standard advice — don't rely on colour alone — is correct and almost useless on its own. It tells you what to avoid without telling you what to do instead.")+
  "<h2>Give every colour a second channel</h2>"+
  P("A status indicator that is green when healthy and red when broken carries one bit of information in one channel. Add a shape — a filled circle versus a triangle — and it carries the same bit in two. Nothing is lost for people who see the colour; everything is gained for people who don't.")+
  "<h2>Test with the right simulations</h2>"+
  P("Deuteranomaly is the most common form and the one most likely to break a red/green pairing. Chrome DevTools can simulate it in the Rendering panel in about four seconds, which is fast enough that there is no excuse for skipping it.")+
  "<h2>Charts are the hard case</h2>"+
  "<ul><li>Label series directly rather than through a legend where you can.</li><li>Vary lightness, not just hue — a colourblind reader can still read a value scale.</li><li>Use pattern fills for categorical data in print or high-density charts.</li></ul>"+
  P("None of this makes an interface uglier. Most of it makes it clearer for everyone.")],
 ["webdev",8,"View transitions are now stable across all major browsers","The View Transitions API has reached stable support everywhere. Cross-document transitions make multi-page apps feel as smooth as single-page ones, with no framework required.",
  P("For a decade the main argument for single-page architecture was the transition. You could not navigate between two documents without a flash, so you stopped navigating between documents.")+
  "<h2>Two lines to start</h2>"+
  "<pre><code>@view-transition {\n  navigation: auto;\n}</code></pre>"+
  P("That's the whole opt-in for same-origin navigations. The browser captures the old page, captures the new one, and cross-fades between them.")+
  "<h2>Naming elements</h2>"+
  P("The interesting part is <code>view-transition-name</code>. Give the same name to an element on both pages and the browser morphs one into the other — a thumbnail in a list growing into a hero image on the detail page, with no JavaScript involved.",
    "Respect <code>prefers-reduced-motion</code>: wrap your custom animations in the media query and let the default cross-fade handle everyone else.")],
 ["vercel",9,"Rethinking the build step for the streaming era","Builds were designed for a world where you shipped a bundle and walked away. Streaming rendering changes what a build should even produce.",
  P("A build used to have one job: turn source into static output. Streaming and partial prerendering mean the output is no longer a single artifact but a graph of things that resolve at different times.")+
  "<h2>What changes</h2>"+
  P("The unit of caching stops being the page and becomes the segment. A page can be 90% static and 10% dynamic, and the static 90% can go on a CDN while the rest streams in on request.",
    "That makes build time less interesting and cache invalidation much more interesting. Teams that move to this model usually find their build gets faster and their mental model gets harder.")+
  "<h2>Practical advice</h2>"+
  "<ul><li>Push dynamic reads as deep into the tree as you can.</li><li>Give every dynamic boundary a loading state you'd be happy to ship.</li><li>Measure streaming with TTFB and LCP together — one without the other misleads.</li></ul>"],
 ["nng",7,"The hidden cost of infinite scroll in research tools","Infinite scroll tests well for browsing and badly for finding. Our latest study explains why, and what to use instead when users have a goal.",
  P("We ran a study with 24 participants across three research-heavy tools. The pattern was consistent: infinite scroll improved time-on-page and damaged task completion.")+
  "<h2>Why it fails for goal-directed work</h2>"+
  P("Scrolling destroys position. Users who found a relevant result, opened it, and came back could not reliably return to where they were. Eleven of 24 participants restarted their search rather than attempt to scroll back.",
    "Pagination gives a coordinate. Page 4 is a place you can return to. An arbitrary scroll offset is not.")+
  "<h2>The middle ground</h2>"+
  P("Load-more buttons keep the continuous feel while creating stable chunks, and they leave the footer reachable — which matters more than designers usually expect.")],
 ["csstricks",13,"Anchor positioning replaced 400 lines of my tooltip code","CSS anchor positioning is the feature I've wanted for fifteen years. Here's what it removes from your codebase.",
  P("Every tooltip library does the same four things: measure the trigger, measure the viewport, pick a side, and reposition on scroll. All four are now native.")+
  "<pre><code>.trigger { anchor-name: --tip; }\n.tooltip {\n  position: absolute;\n  position-anchor: --tip;\n  top: anchor(bottom);\n  justify-self: anchor-center;\n  position-try-fallbacks: flip-block;\n}</code></pre>"+
  P("<code>position-try-fallbacks</code> is the piece that does the real work: when the tooltip would overflow, the browser tries the alternative placements you've listed and picks the first that fits. No resize observer, no scroll listener, no layout thrash.")+
  "<h2>What still needs JavaScript</h2>"+
  P("Focus management and dismissal. The positioning problem is solved; the interaction problem is not. Pair anchor positioning with the popover attribute and you're down to a handful of lines.")],
 ["hf",21,"Small models are eating the fine-tuning market","Three-billion-parameter models fine-tuned on narrow tasks are now beating general models ten times their size, at a fraction of the serving cost.",
  P("The default architecture decision for the last two years has been: call the biggest available model and prompt it carefully. For a growing set of tasks that is now the expensive wrong answer.")+
  "<h2>The numbers</h2>"+
  P("On classification, extraction and routing tasks, a well-fine-tuned 3B model consistently lands within two points of a frontier model while costing roughly 4% as much to serve and responding in a quarter of the time.",
    "The catch is that you need labelled data — but you can generate most of it with the large model you're trying to replace.")+
  "<h2>The distillation loop</h2>"+
  "<ul><li>Run the frontier model on 5,000 real inputs and keep the outputs.</li><li>Review a sample by hand; fix what's wrong.</li><li>Fine-tune the small model on the result.</li><li>Hold back 500 examples to measure honestly.</li></ul>"+
  P("Teams that run this loop usually find the hard part isn't training. It's deciding what counts as a correct answer.")],
 ["ala",1100,"Designing for the long now","Most of what we build will be maintained by someone we'll never meet. Designing for that person is a discipline of its own.",
  P("A site launched today has a median life of about four years and a maintainer turnover of roughly eighteen months. Whatever you are building, you will hand it to a stranger.")+
  "<h2>Write down the why</h2>"+
  P("Code records what a system does. Almost nothing records why it does it that way, which is why maintainers rewrite working code — not out of arrogance, but because the constraint that made it necessary was never written down.")+
  "<h2>Favour boring</h2>"+
  P("A boring solution is one a future maintainer can understand without archaeology. That is worth a surprising amount of performance and a great deal of cleverness.")],
 ["github",29,"Dependency review now flags transitive licence changes","A new check surfaces licence changes anywhere in your dependency tree, not just in direct dependencies."],
 ["mdn",34,"Baseline 2026: what's newly available","A round-up of the features that crossed into Baseline this year and are now safe to use without a fallback."],
 ["kcd",41,"Stop testing implementation details, again","The advice hasn't changed, but the tooling has. Here's how the current generation of testing libraries makes the right thing easier."],
 ["hn",1,"Show HN: I built a terminal-based spreadsheet in 900 lines of C","Vim keybindings, formula evaluation, CSV import/export. Started as a weekend project to avoid opening a browser for small calculations."],
 ["hn",5,"The untold story of the world's first hard drive","In 1956 IBM shipped a five-megabyte disk that weighed a ton and had to be moved by forklift. The engineering compromises behind it are still with us."],
 ["hn",10,"Why is the Windows clock so inaccurate?","A deep dive into timer resolution, interrupt coalescing, and why your system clock can drift by seconds under load."],
 ["hn",16,"A love letter to the 90s web","Building a personal site with no build step, no framework, and no analytics. It loads in 40ms and nobody can track you."],
 ["hn",23,"Postgres is enough for most of what you're doing","Queues, full-text search, key-value, cron, pub/sub. An argument for deleting four services from your architecture."],
 ["pragmatic",11,"Inside the engineering org that ships on Fridays","How a 400-person platform team rebuilt its deploy pipeline until Friday releases stopped being frightening. Includes their incident data before and after."],
 ["pragmatic",30,"What senior engineers actually do all day","We tracked calendars and commits across 60 senior engineers at eight companies. The results surprised everyone, including the engineers."],
 ["sidebar",5,"Five design links — Monday","Today: a typography audit tool, a study on dark-mode legibility, an archive of Swiss railway signage, an essay on the death of the mood board, and a new variable serif."],
 ["sidebar",29,"Five design links — Sunday","Today: motion principles for data viz, a case study on redesigning a hospital intake form, and a very long essay about grids."],
 ["uxc",15,"The onboarding flow that doubled activation by doing less","We removed four screens from our onboarding and activation went up 112%. Here's the research that told us which four."],
 ["uxc",27,"Your design system is a product, not a project","Treating the system as something that ships once is the most common reason it dies in year two."],
 ["netlify",39,"Edge functions get streaming responses","Stream partial responses from edge functions without buffering the whole body."],
 ["figma",33,"What we learned from 10,000 hours of design critique","Patterns from watching design teams give and receive feedback — and the three sentences that make critique useful."],
 ["comeau",36,"An interactive guide to CSS grid alignment","Nine properties, one mental model. With a playground you can poke at until it clicks."],
 ["csstricks",40,"Scroll-driven animations without JavaScript","Timeline-scoped animations are stable now. Here's a parallax hero in eleven lines of CSS."],
 ["webdev",44,"Core Web Vitals: INP one year on","Interaction to Next Paint has been the responsiveness metric for a year. What the field data says about how sites adapted."],
 ["smashing",48,"Designing empty states people actually read","An empty screen is the most-read screen in your product and usually the least designed."],
 ["simonw",26,"Running a 30B model on a laptop, properly this time","Quantisation has gotten good enough that this is now genuinely useful rather than a party trick. Notes on what works."],
 ["simonw",50,"My notes on the new structured output APIs","Constrained decoding is quietly the most useful thing to happen to LLM tooling this year."],
 ["cloudflare",35,"A post-mortem on last week's DNS incident","What happened, why it took 34 minutes to detect, and the three changes we're making."],
 ["vercel",47,"Partial prerendering leaves beta","Static shell, dynamic holes, one request. Now on by default for new projects."],
 ["nng",45,"Card sorting is still the cheapest research you can run","Forty-five minutes, eight participants, and you'll find out your navigation is wrong before you build it."],
 ["github",53,"Actions cache gets 3x faster restores","A new content-addressed storage layer cuts cold restore times significantly on large caches."],
 ["mdn",58,"Documenting the web when the web won't hold still","How the MDN team decides what's stable enough to document."],
 ["kcd",62,"The case against premature abstraction","Duplication is cheaper than the wrong abstraction. A worked example with real code."],
 ["hf",56,"Datasets now support streaming joins","Join two datasets without materialising either one."],
 ["hn",61,"Ask HN: What's your most-used shell function?","Hundreds of one-liners people actually use every day."],
 ["uxc",66,"Stop calling it friction","Not all friction is bad. Some of it is the product."],
 ["sidebar",53,"Five design links — Friday","Today: an oral history of the Macintosh interface, and a tool that turns screenshots into style guides."],
 ["ala",1220,"The web we were promised, revisited","Twenty years of predictions, scored honestly."]
];

const ITEMS = RAW.map((r,i)=>{
  const f = FEEDS.find(x=>x.id===r[0]);
  return {
    id:"it"+i, feed:r[0], cat:f.cat, hours:r[1], title:r[2], excerpt:r[3],
    body:r[4]||null,
    url:f.site, words: r[4] ? 620 + (i%5)*180 : 0,
    author: f.t
  };
}).sort((a,b)=>a.hours-b.hours);

const PACKS = [
  {id:"fe",name:"Frontend essentials",desc:"The blogs that shaped how the web is built. Tutorials, platform news and standards.",feeds:["csstricks","smashing","comeau","webdev","mdn"]},
  {id:"dsgn",name:"Design & research",desc:"Craft, critique and evidence — from daily link digests to longform UX research.",feeds:["sidebar","nng","figma","ala","uxc"]},
  {id:"ship",name:"Infrastructure & shipping",desc:"Platform engineering, deploys and the systems underneath your app.",feeds:["cloudflare","vercel","github","netlify"]},
  {id:"ai",name:"Keeping up with AI",desc:"Practitioner notes rather than press releases.",feeds:["simonw","hf"]},
  {id:"brief",name:"The daily briefing",desc:"Two high-volume sources for a quick scan over coffee.",feeds:["hn","pragmatic"]}
];
