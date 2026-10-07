// Booking form: conditional verification fields, validation, honest submission states.
const $ = (s, r) => r.querySelector(s);
const $$ = (s, r) => [...r.querySelectorAll(s)];

const VERIFY_LABELS = {
  'provider-references': 'Provider references', 'id-verification': 'ID verification', linkedin: 'LinkedIn',
  'voice-call': 'Voice call', text: 'Text', 'video-call': 'Video call',
};
const lvToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());

export function initBooking(root, cfg) {
  const wrap = $('[data-booking]', root);
  if (!wrap) return () => {};
  const form = $('[data-form]', wrap);
  const statusEl = $('[data-status]', wrap);
  const summary = $('[data-error-summary]', wrap);
  const submitBtn = $('[data-submit]', form);
  const btnText = $('.btn__text', submitBtn);
  const endpoint = (cfg.submission.endpoint || '').trim();
  const configured = Boolean(endpoint);
  const idleLabel = btnText.textContent;

  // Preferred dates cannot be in the past (Las Vegas date)
  $$('[data-min-today]', form).forEach((i) => i.setAttribute('min', lvToday()));

  /* ---------- conditional fields ---------- */
  const newNotice = $('[data-new-notice]', form);
  const outWrap = $('[data-conditional="out-call"]', form);
  const outInput = $('#outcallLocation', form);
  const vfPanels = $('#vf-panels', form);
  vfPanels.setAttribute('aria-live', 'polite');

  function setOut(on) {
    outWrap.hidden = !on;
    outInput.disabled = !on;
    if (on) outInput.setAttribute('data-required', ''); else { outInput.removeAttribute('data-required'); clearError(outInput); }
    const lab = $('label', outWrap);
    lab.innerHTML = on ? 'Out-call location <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span>' : 'Out-call location <span class="opt">(optional)</span>';
  }
  function setVerification(value) {
    $$('[data-vf]', form).forEach((fs) => {
      const on = fs.dataset.vf === value;
      fs.hidden = !on; fs.disabled = !on;
      if (!on) $$('input', fs).forEach(clearError);
    });
  }
  const onChange = (e) => {
    const t = e.target;
    if (t.name === 'clientType') newNotice.hidden = t.value !== 'new';
    if (t.name === 'callType') setOut(t.value === 'out-call');
    if (t.name === 'verification') setVerification(t.value);
  };
  form.addEventListener('change', onChange);
  setOut(false); setVerification('');

  /* ---------- validation ---------- */
  const labelText = (el) => {
    const lab = el.id ? form.querySelector(`label[for="${el.id}"]`) : null;
    if (!lab) return 'This field';
    const c = lab.cloneNode(true);
    $$('.req,.opt,.sr-only', c).forEach((n) => n.remove());
    return c.textContent.trim();
  };
  const errEl = (el) => document.getElementById(`${el.name || el.id}-error`);
  function setError(el, msg, groupEl) {
    const target = groupEl || el;
    target.setAttribute('aria-invalid', 'true');
    const e = errEl(groupEl ? groupEl.querySelector('input') : el) || document.getElementById(`${target.dataset.field}-error`);
    if (e) { e.textContent = msg; e.hidden = false; }
  }
  function clearError(el) {
    const group = el.closest('.field--group');
    const target = group || el;
    target.removeAttribute('aria-invalid');
    const e = group ? document.getElementById(`${group.dataset.field}-error`) : document.getElementById(`${el.id}-error`);
    if (e) { e.hidden = true; e.textContent = ''; }
  }
  const validators = {
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address, like name@example.com.'),
    tel: (v) => (v.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '').length >= 10 ? '' : 'Enter a phone number with area code.'),
    url: (v) => { try { const u = new URL(v); return /^https?:$/.test(u.protocol) ? '' : 'Start the link with http:// or https://.'; } catch { return 'Enter a full link, starting with https://.'; } },
    date: (v, el) => (v < lvToday() ? 'Choose today or a future date.' : ''),
  };

  function validate() {
    const errors = [];
    const radiosDone = new Set();
    $$('input,select,textarea', form).forEach((el) => {
      if (el.disabled || el.closest('[hidden]') || el.name === '_gotcha') return;
      if (el.type === 'radio') {
        if (radiosDone.has(el.name)) return; radiosDone.add(el.name);
        if (el.hasAttribute('data-required') && !form.querySelector(`input[name="${el.name}"]:checked`)) {
          const group = el.closest('.field--group');
          setError(el, 'Choose one option.', group);
          errors.push({ id: el.id || group.querySelector('input').id || el.name, msg: `${group.querySelector('legend').textContent.replace(/\*|\(required\)/g, '').trim()}: choose one option.`, focus: group.querySelector('input') });
        } else clearError(el);
        return;
      }
      const v = el.value.trim();
      let msg = '';
      if (el.hasAttribute('data-required') && !v) msg = el.tagName === 'SELECT' ? 'Choose an option.' : `${labelText(el)} is required.`;
      else if (v && validators[el.type]) msg = validators[el.type](v, el);
      if (msg) { setError(el, msg); errors.push({ id: el.id, msg: `${labelText(el)}: ${msg}`, focus: el }); } else clearError(el);
    });
    return errors;
  }
  form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') || e.target.closest('[aria-invalid]')) clearError(e.target); });

  function showSummary(errors) {
    const ul = $('ul', summary);
    ul.replaceChildren(...errors.map((er) => {
      const li = document.createElement('li'); const a = document.createElement('a');
      a.href = `#${er.focus.id}`; a.textContent = er.msg;
      a.addEventListener('click', (ev) => { ev.preventDefault(); er.focus.focus(); });
      li.appendChild(a); return li;
    }));
    summary.hidden = false; summary.focus();
  }

  /* ---------- payload ---------- */
  function collect() {
    const fd = new FormData(form); const data = {};
    for (const [k, v] of fd.entries()) { if (k === '_gotcha') continue; const s = String(v).trim(); if (s) data[k] = s; }
    data.verificationMethod = VERIFY_LABELS[data.verification] || data.verification;
    data.submittedFrom = location.href;
    return data;
  }
  const FIELD_NAMES = {
    legalName: 'Legal name', email: 'Email', phone: 'Phone', clientType: 'Client', date: 'Preferred date', time: 'Preferred time (Las Vegas time)',
    duration: 'Duration', callType: 'In-call or out-call', outcallLocation: 'Out-call location', verificationMethod: 'Verification',
    refName: 'Reference name', refLink: 'Reference link', refContact: 'Reference contact', linkedinUrl: 'LinkedIn',
    voiceDate: 'Preferred call date', voiceTime: 'Preferred call time (Las Vegas time)', textTime: 'Preferred time to be contacted',
    videoDate: 'Preferred video call date', videoTime: 'Preferred video call time (Las Vegas time)', message: 'Message',
  };
  function asText(data) {
    return 'Booking request (preferences only, not a confirmed booking)\n' +
      Object.entries(FIELD_NAMES).filter(([k]) => data[k]).map(([k, label]) => `${label}: ${data[k]}`).join('\n');
  }

  /* ---------- status panel ---------- */
  function showStatus(kind, title, paragraphs, extra) {
    statusEl.className = `status is-${kind}`;
    statusEl.replaceChildren();
    const h = document.createElement('p'); h.className = 'status__title'; h.textContent = title; statusEl.appendChild(h);
    paragraphs.forEach((t) => { const p = document.createElement('p'); p.textContent = t; statusEl.appendChild(p); });
    if (extra) statusEl.appendChild(extra);
    statusEl.hidden = false; statusEl.focus();
    statusEl.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function textFallback(data) {
    const box = document.createElement('div'); box.className = 'form__actions';
    const sms = document.createElement('a');
    sms.className = 'text-aria text-aria--pill';
    sms.href = `${cfg.contact.smsHref}?&body=${encodeURIComponent(asText(data))}`;
    sms.innerHTML = '<span class="text-aria__label"></span>';
    sms.firstChild.textContent = 'Text Aria my request';
    box.appendChild(sms);
    if (navigator.clipboard) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'Copy request text';
      b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(asText(data)); b.textContent = 'Copied'; } catch { b.textContent = 'Copy failed'; } });
      box.appendChild(b);
    }
    return box;
  }

  /* ---------- submit ---------- */
  async function onSubmit(e) {
    e.preventDefault();
    statusEl.hidden = true; summary.hidden = true;
    if (form.elements._gotcha && form.elements._gotcha.value) return;
    const errors = validate();
    if (errors.length) { showSummary(errors); return; }
    const data = collect();

    if (!configured) {
      showStatus('error', 'Not sent: online submission is not available yet', [
        'Your request was checked but nothing was sent anywhere. Aria has not received it.',
        `To request a booking now, text Aria at ${cfg.contact.phoneDisplay}. The button below opens a text message with your details filled in. You choose whether to send it.`,
        'Do not include ID documents in a text.',
      ], textFallback(data));
      return;
    }

    submitBtn.disabled = true; submitBtn.classList.add('is-loading'); submitBtn.setAttribute('aria-busy', 'true'); btnText.textContent = 'Sending…';
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(endpoint, {
        method: cfg.submission.method || 'POST', signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showStatus('ok', 'Request sent', [
        'Thank you. Aria has your request. This does not confirm a booking.',
        'She will follow up about verification, availability and the applicable deposit.',
      ]);
      form.reset(); setOut(false); setVerification(''); newNotice.hidden = true;
    } catch (err) {
      showStatus('error', 'Your request was not sent', [
        err.name === 'AbortError' ? 'The request timed out.' : 'Something went wrong while sending.',
        `Please try again, or text Aria at ${cfg.contact.phoneDisplay}.`,
      ], textFallback(data));
    } finally {
      clearTimeout(timer);
      submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); submitBtn.removeAttribute('aria-busy'); btnText.textContent = idleLabel;
    }
  }
  form.addEventListener('submit', onSubmit);
  return () => { form.removeEventListener('submit', onSubmit); form.removeEventListener('change', onChange); };
}
