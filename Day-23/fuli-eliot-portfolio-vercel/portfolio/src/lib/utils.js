export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// Only http(s) links are ever rendered as hrefs. Anything else becomes ''.
export const safeUrl = (value) => {
  try {
    const u = new URL(String(value ?? '').trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
  } catch {
    return '';
  }
};

export const splitTags = (v) =>
  (Array.isArray(v) ? v : String(v ?? '').split(',')).map((s) => String(s).trim()).filter(Boolean);

export const parseDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const fmtDate = (iso) => {
  const d = parseDate(iso);
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
};

const startOfToday = (now) => new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const internshipStatus = (start, end, now = new Date()) => {
  const s = parseDate(start), e = parseDate(end);
  if (!s || !e) return '';
  const today = startOfToday(now);
  if (today < s) return 'Starts soon';
  if (today > e) return 'Completed';
  return 'In progress';
};

export const internshipProgress = (start, end, now = new Date()) => {
  const s = parseDate(start), e = parseDate(end);
  if (!s || !e || e <= s) return 0;
  return Math.min(1, Math.max(0, (startOfToday(now) - s) / (e - s)));
};

export const durationLabel = (start, end) => {
  const s = parseDate(start), e = parseDate(end);
  if (!s || !e || e < s) return '';
  const days = Math.round((e - s) / 86400000) + 1;
  const weeks = Math.round(days / 7);
  return weeks >= 2 ? `${weeks} weeks` : `${days} days`;
};

export const initials = (name) =>
  String(name).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export const acronym = (text) => (String(text).match(/\(([^)]+)\)/) || [])[1] || text;

// "https://github.com/user/repo/tree/main/Day_9/tic-website" -> "Day_9/tic-website"
export const repoPath = (p) => {
  if (p.repoUrl) {
    const m = p.repoUrl.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+\/(?:tree|blob)\/[^/]+\/(.+?)\/?$/i);
    if (m) return decodeURIComponent(m[1]);
    try { return new URL(p.repoUrl).pathname.replace(/^\//, '') || p.title; } catch { /* fall through */ }
  }
  if (p.liveUrl) { try { return new URL(p.liveUrl).hostname; } catch { /* fall through */ } }
  return p.title;
};

export function download(filename, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
