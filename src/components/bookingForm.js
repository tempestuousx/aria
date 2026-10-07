import { rates, verificationMethods, submission, contact, site, placeholders } from '../config.js';
import { content } from '../content.js';
import { esc } from '../lib.js';
import { textAria } from './contact.js';

const b = content.booking;

function field({ id, label, type = 'text', required = false, hint = '', attrs = '', autocomplete = '' }) {
  const hintId = hint ? `${id}-hint` : '';
  return `<div class="field" data-field="${id}">
    <label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span>' : ' <span class="opt">(optional)</span>'}</label>
    ${hint ? `<p class="field__hint" id="${hintId}">${hint}</p>` : ''}
    <input id="${id}" name="${id}" type="${type}" ${required ? 'data-required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
      aria-describedby="${[hintId, id + '-error'].filter(Boolean).join(' ')}" ${attrs}>
    <p class="field__error" id="${id}-error" hidden></p>
  </div>`;
}

function radioGroup({ name, legend, options, required = true }) {
  return `<fieldset class="field field--group" data-field="${name}" aria-describedby="${name}-error">
    <legend>${esc(legend)} ${required ? '<span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span>' : ''}</legend>
    <div class="choices">${options.map((o) => `<label class="choice"><input type="radio" name="${name}" value="${o.value}" ${required ? 'data-required' : ''}><span>${esc(o.label)}</span></label>`).join('')}</div>
    <p class="field__error" id="${name}-error" hidden></p>
  </fieldset>`;
}

const durationOptions = rates.rows
  .map((r, i) => `<option value="duration-${i + 1}: ${esc(r.duration)}">Duration ${i + 1}: ${esc(r.duration)}${rates.finalized ? '' : ' (placeholder)'}</option>`)
  .join('');

const verificationOptions = verificationMethods.map((v) => `<option value="${v.value}">${esc(v.label)}</option>`).join('');

export function bookingForm() {
  const configured = Boolean(submission.endpoint);
  return `<div class="booking" data-booking data-configured="${configured}">
    ${configured ? '' : `<div class="notice notice--warn" role="note">
      <p class="notice__title">${esc(b.unconfiguredTitle)}</p>
      <p>${esc(b.unconfiguredBody)}</p>
      <p>${textAria({ variant: 'block', showNumber: true })}</p>
    </div>`}

    <div class="notice notice--ink" role="note">
      <p><strong>${esc(b.requestNotice)}</strong></p>
      <p>${esc(b.schedulingNote)}</p>
    </div>

    <div class="status" data-status role="status" aria-live="polite" tabindex="-1" hidden></div>
    <div class="error-summary" data-error-summary role="alert" tabindex="-1" hidden>
      <p class="error-summary__title">Please fix these before sending:</p>
      <ul></ul>
    </div>

    <form class="form" novalidate autocomplete="on" data-form>
      <p class="form__req"><span class="req" aria-hidden="true">*</span> Required</p>

      <fieldset class="form__block">
        <legend>About you</legend>
        ${field({ id: 'legalName', label: 'Legal name', required: true, autocomplete: 'name' })}
        ${field({ id: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}
        ${field({ id: 'phone', label: 'Phone number', type: 'tel', required: true, autocomplete: 'tel', hint: 'Include area code.' })}
        ${radioGroup({ name: 'clientType', legend: 'New or returning client', options: [{ value: 'new', label: 'New client' }, { value: 'returning', label: 'Returning client' }] })}
        <div class="notice notice--pink" data-new-notice hidden role="note">
          <p><strong>${esc(rates.depositNotice)}</strong></p>
        </div>
      </fieldset>

      <fieldset class="form__block">
        <legend>Your booking</legend>
        ${field({ id: 'date', label: 'Preferred booking date', type: 'date', required: true, attrs: 'data-min-today' })}
        ${field({ id: 'time', label: 'Preferred booking time (Las Vegas time)', type: 'time', required: true })}
        <div class="field" data-field="duration">
          <label for="duration">Booking duration <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
          <p class="field__hint" id="duration-hint">${rates.finalized ? 'See the Rates page.' : 'Durations are placeholders until rates are finalized.'}</p>
          <select id="duration" name="duration" data-required aria-describedby="duration-hint duration-error">
            <option value="">Choose a duration</option>${durationOptions}
          </select>
          <p class="field__error" id="duration-error" hidden></p>
        </div>
        ${radioGroup({ name: 'callType', legend: 'In-call or out-call', options: [{ value: 'in-call', label: 'In-call' }, { value: 'out-call', label: 'Out-call' }] })}
        <div data-conditional="out-call" hidden>
          ${field({ id: 'outcallLocation', label: 'Out-call location', hint: 'Hotel name or address.' })}
        </div>
      </fieldset>

      <fieldset class="form__block">
        <legend>Verification</legend>
        <div class="field" data-field="verification">
          <label for="verification">Preferred verification method <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
          <p class="field__hint" id="verification-hint">${esc(content.etiquette.depositIntro)}</p>
          <select id="verification" name="verification" data-required aria-controls="vf-panels" aria-describedby="verification-hint verification-error">
            <option value="">Choose a method</option>${verificationOptions}
          </select>
          <p class="field__error" id="verification-error" hidden></p>
        </div>

        <div id="vf-panels">
          <fieldset class="vf" data-vf="provider-references" hidden disabled>
            <legend>Provider references</legend>
            ${field({ id: 'refName', label: 'Reference name', required: true })}
            ${field({ id: 'refLink', label: 'Profile or website link', type: 'url', required: true, attrs: 'placeholder="https://"' })}
            ${field({ id: 'refContact', label: 'Professional contact information', required: true, hint: 'A professional email or phone number for the reference.' })}
          </fieldset>
          <fieldset class="vf" data-vf="id-verification" hidden disabled>
            <legend>ID verification</legend>
            <p class="notice notice--ink">${esc(b.idVerificationNote)}</p>
          </fieldset>
          <fieldset class="vf" data-vf="linkedin" hidden disabled>
            <legend>LinkedIn</legend>
            ${field({ id: 'linkedinUrl', label: 'LinkedIn profile URL', type: 'url', required: true, attrs: 'placeholder="https://www.linkedin.com/in/..."' })}
          </fieldset>
          <fieldset class="vf" data-vf="voice-call" hidden disabled>
            <legend>Voice call</legend>
            <p class="field__hint">A preference only. Aria will confirm a time with you.</p>
            ${field({ id: 'voiceDate', label: 'Preferred call date', type: 'date', required: true, attrs: 'data-min-today' })}
            ${field({ id: 'voiceTime', label: 'Preferred call time (Las Vegas time)', type: 'time', required: true })}
          </fieldset>
          <fieldset class="vf" data-vf="text" hidden disabled>
            <legend>Text</legend>
            ${field({ id: 'textTime', label: 'Preferred time to be contacted', required: true, hint: 'For example: weekday evenings, Las Vegas time.' })}
          </fieldset>
          <fieldset class="vf" data-vf="video-call" hidden disabled>
            <legend>Video call</legend>
            <div class="notice notice--pink" role="note"><p><strong>${esc(b.videoNotice)}</strong></p>
              <p>Payment is not collected on this form. Aria will explain how to proceed.</p></div>
            <p class="field__hint">A preference only. Aria will confirm a time with you.</p>
            ${field({ id: 'videoDate', label: 'Preferred call date', type: 'date', required: true, attrs: 'data-min-today' })}
            ${field({ id: 'videoTime', label: 'Preferred call time (Las Vegas time)', type: 'time', required: true })}
          </fieldset>
        </div>
      </fieldset>

      <fieldset class="form__block">
        <legend>Anything else?</legend>
        <div class="field" data-field="message">
          <label for="message">Message <span class="opt">(optional)</span></label>
          <textarea id="message" name="message" rows="4" aria-describedby="message-error"></textarea>
          <p class="field__error" id="message-error" hidden></p>
        </div>
      </fieldset>

      <!-- Spam trap: real visitors never see or fill this. -->
      <div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>

      <p class="form__final">${esc(b.requestNotice)}</p>
      <div class="form__actions">
        <button class="btn btn--primary" type="submit" data-submit><span class="btn__text">${configured ? 'Send my request' : 'Check my request'}</span><span class="btn__spin" aria-hidden="true"></span></button>
        ${textAria({ variant: 'pill', text: 'Or text Aria', showNumber: true })}
      </div>
    </form>
  </div>`;
}
