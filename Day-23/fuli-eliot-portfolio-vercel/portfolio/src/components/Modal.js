// One shared <dialog> used for every form and every delete confirmation.
import { html, raw } from '../lib/html.js';
import { safeUrl } from '../lib/utils.js';

let dlg = null;
let cfg = null;
let lastFocus = null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Field = (f, value, error) => {
  const id = `f-${f.name}`;
  const attrs = raw(
    `id="${id}" name="${f.name}"` +
    (f.required ? ' required' : '') +
    (f.maxLength ? ` maxlength="${f.maxLength}"` : '') +
    (error ? ` aria-invalid="true" aria-describedby="e-${f.name}"` : '')
  );
  let control;
  if (f.type === 'textarea') {
    control = html`<textarea ${attrs} rows="${f.rows || 4}" placeholder="${f.placeholder || ''}">${value}</textarea>`;
  } else {
    control = html`<input ${attrs} type="${f.type || 'text'}" value="${value}" placeholder="${f.placeholder || ''}" autocomplete="off" ${f.datalist ? raw(`list="dl-${f.name}"`) : ''}>`;
  }
  return html`
    <div class="field">
      <label for="${id}">${f.label}${f.required ? html` <span class="req" aria-hidden="true">*</span>` : ''}</label>
      ${control}
      ${f.datalist ? html`<datalist id="dl-${f.name}">${f.datalist.map((o) => html`<option value="${o}"></option>`)}</datalist>` : ''}
      ${f.help ? html`<p class="help">${f.help}</p>` : ''}
      ${error ? html`<p class="error" id="e-${f.name}" role="alert">${error}</p>` : ''}
    </div>`;
};

const FormView = (c, values, errors) => html`
  <form novalidate>
    <header class="modal-head">
      <h2 id="modal-title">${c.title}</h2>
      <button type="button" class="icon-btn" data-modal-close aria-label="Close">&times;</button>
    </header>
    <div class="modal-body">
      ${c.intro ? html`<p class="modal-intro">${c.intro}</p>` : ''}
      ${c.fields.map((f) => Field(f, values[f.name] ?? '', errors[f.name]))}
    </div>
    <footer class="modal-foot">
      <button type="button" class="btn btn-ghost" data-modal-close>Cancel</button>
      <button type="submit" class="btn btn-primary">${c.submitLabel || 'Save'}</button>
    </footer>
  </form>`;

function draw(values, errors) {
  dlg.innerHTML = String(FormView(cfg, values, errors));
}

function validate(fields, custom, values) {
  const errors = {};
  for (const f of fields) {
    const v = values[f.name] || '';
    if (f.required && !v) errors[f.name] = 'This field is required.';
    else if (v && f.type === 'url' && !safeUrl(v)) errors[f.name] = 'Enter a full link, for example https://example.com.';
    else if (v && f.type === 'email' && !EMAIL.test(v)) errors[f.name] = 'Enter a valid email address.';
  }
  return { ...(custom?.(values) || {}), ...errors };
}

function onSubmit(e) {
  if (cfg?.kind !== 'form') return;
  e.preventDefault();
  const values = {};
  for (const f of cfg.fields) {
    let v = String(new FormData(e.target).get(f.name) ?? '').trim();
    // Be forgiving: "github.com/me/repo" becomes "https://github.com/me/repo".
    if (f.type === 'url' && v && !/^[a-z][a-z0-9+.-]*:\/\//i.test(v) && v.includes('.')) v = `https://${v}`;
    values[f.name] = v;
  }
  const errors = validate(cfg.fields, cfg.validate, values);
  if (Object.keys(errors).length) {
    draw(values, errors);
    dlg.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  const submit = cfg.onSubmit;
  dlg.close();
  submit(values);
}

function onClick(e) {
  if (e.target === dlg || e.target.closest('[data-modal-close]')) dlg.close();
  else if (e.target.closest('[data-modal-confirm]')) {
    const confirm = cfg?.onConfirm;
    dlg.close();
    confirm?.();
  }
}

export function mountModal(el) {
  dlg = el;
  dlg.addEventListener('click', onClick);
  dlg.addEventListener('submit', onSubmit);
  dlg.addEventListener('close', () => { lastFocus?.focus?.({ preventScroll: true }); });
}

export function openForm(config) {
  cfg = { kind: 'form', ...config };
  lastFocus = document.activeElement;
  draw(config.values || {}, {});
  dlg.showModal();
  dlg.querySelector('input, textarea')?.focus();
}

export function openConfirm({ title, message, confirmLabel = 'Delete', onConfirm }) {
  cfg = { kind: 'confirm', onConfirm };
  lastFocus = document.activeElement;
  dlg.innerHTML = String(html`
    <div class="modal-confirm">
      <h2 id="modal-title">${title}</h2>
      <p>${message}</p>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" data-modal-close>Cancel</button>
        <button type="button" class="btn btn-danger" data-modal-confirm>${confirmLabel}</button>
      </div>
    </div>`);
  dlg.showModal();
  dlg.querySelector('[data-modal-close]').focus();
}
