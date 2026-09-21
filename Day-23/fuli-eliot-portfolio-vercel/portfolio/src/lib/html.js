// A tiny "JSX-like" helper.
// html`...` escapes every interpolated value. Nested html`...` results and
// arrays of them are inserted as-is, so components compose like in React.
class SafeHtml {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (v) => String(v).replace(/[&<>"']/g, (c) => ESC[c]);

const part = (v) => {
  if (v instanceof SafeHtml) return v.value;
  if (Array.isArray(v)) return v.map(part).join('');
  if (v === null || v === undefined || v === false || v === true) return '';
  return escape(v);
};

export const html = (strings, ...values) =>
  new SafeHtml(strings.reduce((out, s, i) => out + s + (i < values.length ? part(values[i]) : ''), ''));

// Mark a trusted string (never user data) as safe HTML, e.g. a static attribute.
export const raw = (s) => new SafeHtml(String(s));

export const mount = (el, tpl) => { el.innerHTML = String(tpl); };
