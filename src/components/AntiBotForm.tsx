import { createElement, useEffect, useMemo, useRef } from 'react';

export type LeadData = {
  name: string;
  email: string;
  message: string;
};

type AntiBotFormProps = {
  ready: boolean;
  onSubmit: (data: LeadData) => void;
};

const elementName = 'anti-bot-form';

const defineAntiBotElement = () => {
  if (customElements.get(elementName)) {
    return;
  }

  class AntiBotFormElement extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) {
        return;
      }

      // Technique: closed Shadow DOM encapsulation hides inputs from document.querySelector.
      const shadow = this.attachShadow({ mode: 'closed' });
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
        }
        .wrapper {
          display: grid;
          gap: 1.25rem;
        }
        .hint {
          font-size: 0.9rem;
          color: #4b5563;
        }
        form {
          display: grid;
          gap: 1rem;
          font-family: inherit;
        }
        label {
          display: grid;
          gap: 0.35rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
        }
        input,
        textarea {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.75rem 0.9rem;
          font-size: 1rem;
          font-family: inherit;
          background: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        input:focus,
        textarea:focus {
          outline: none;
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }
        textarea {
          min-height: 140px;
          resize: vertical;
        }
        .row {
          display: grid;
          gap: 0.75rem;
        }
        .actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        button {
          border: none;
          border-radius: 999px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: #ffffff;
          background: #0f766e;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(15, 118, 110, 0.2);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .footnote {
          font-size: 0.8rem;
          color: #6b7280;
        }
        .hp {
          position: absolute;
          left: -9999px;
          height: 0;
          overflow: hidden;
        }
      `;

      const wrapper = document.createElement('div');
      wrapper.className = 'wrapper';

      const hint = document.createElement('div');
      hint.className = 'hint';
      hint.textContent = 'This form lives in a closed Shadow DOM and uses randomized field markers.';

      const form = document.createElement('form');
      form.setAttribute('autocomplete', 'on');
      form.noValidate = true;

      // Technique: randomized data-* attributes instead of predictable name="email".
      const randomToken = () => Math.random().toString(36).slice(2, 10);
      const fieldTokens = {
        name: randomToken(),
        email: randomToken(),
        message: randomToken(),
        honeypot: randomToken(),
      };

      const makeLabel = (text: string, input: HTMLElement) => {
        const label = document.createElement('label');
        label.append(text, input);
        return label;
      };

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'Ada Lovelace';
      nameInput.autocomplete = 'name';
      nameInput.required = true;
      nameInput.setAttribute(`data-${fieldTokens.name}`, '1');

      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.placeholder = 'ada@analytics.io';
      emailInput.autocomplete = 'email';
      emailInput.required = true;
      emailInput.setAttribute(`data-${fieldTokens.email}`, '1');

      const messageInput = document.createElement('textarea');
      messageInput.placeholder = 'Tell us what you want to automate (or defeat).';
      messageInput.required = true;
      messageInput.setAttribute(`data-${fieldTokens.message}`, '1');

      // Technique: honeypot decoy field that should remain empty for humans.
      const honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.tabIndex = -1;
      honeypot.autocomplete = 'off';
      honeypot.setAttribute('aria-hidden', 'true');
      honeypot.setAttribute(`data-${fieldTokens.honeypot}`, '1');
      const honeypotLabel = document.createElement('label');
      honeypotLabel.className = 'hp';
      honeypotLabel.textContent = 'Company website';
      honeypotLabel.appendChild(honeypot);

      const row = document.createElement('div');
      row.className = 'row';
      row.append(
        makeLabel('Name', nameInput),
        makeLabel('Work Email', emailInput),
        makeLabel('Message', messageInput),
      );

      const actions = document.createElement('div');
      actions.className = 'actions';

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = 'Request Demo';

      const footnote = document.createElement('div');
      footnote.className = 'footnote';
      footnote.textContent = 'We will not store your data. This is a demo-only submission.';

      actions.append(footnote, submitButton);

      form.append(honeypotLabel, row, actions);

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (honeypot.value.trim().length > 0) {
          submitButton.textContent = 'Submission blocked';
          submitButton.disabled = true;
          return;
        }

        const detail = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
        };

        if (!detail.name || !detail.email || !detail.message) {
          submitButton.textContent = 'Complete all fields';
          setTimeout(() => {
            submitButton.textContent = 'Request Demo';
          }, 1500);
          return;
        }

        this.dispatchEvent(
          new CustomEvent('anti-bot-submit', {
            detail,
            bubbles: true,
            composed: true,
          }),
        );

        form.reset();
      });

      wrapper.append(hint, form);
      shadow.append(style, wrapper);
    }
  }

  customElements.define(elementName, AntiBotFormElement);
};

export const AntiBotForm = ({ ready, onSubmit }: AntiBotFormProps) => {
  const formRef = useRef<HTMLElement | null>(null);
  const readyMarker = useMemo(() => (ready ? 'ready' : 'locked'), [ready]);

  useEffect(() => {
    defineAntiBotElement();
  }, []);

  useEffect(() => {
    const element = formRef.current;
    if (!element) {
      return;
    }

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<LeadData>;
      onSubmit(customEvent.detail);
    };

    element.addEventListener('anti-bot-submit', handler as EventListener);
    return () => element.removeEventListener('anti-bot-submit', handler as EventListener);
  }, [onSubmit, ready]);

  if (!ready) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-300 bg-white/70 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Unlocking secure form...</p>
        <p className="mt-2">
          Move your mouse, scroll, and type once. The form appears after a few seconds of
          human-like activity.
        </p>
      </div>
    );
  }

  return createElement('anti-bot-form' as any, { ref: formRef, 'data-ready': readyMarker } as any);
};

