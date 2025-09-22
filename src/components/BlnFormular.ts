import {customElement, property, queryAssignedElements} from 'lit/decorators.js';
import {html, nothing} from 'lit';
import TailwindElement from '../app/TailwindElement';

import './BlnInput';
import './BlnButton';

/**
 * BlnFormular: Accessible, composable form wrapper.
 * - Accepts external children (e.g., <bln-input>, other fields) via default slot.
 * - Provides an actions area at the bottom via <slot name="actions"> for external buttons (Speichern, Löschen, Leeren).
 * - On submit, collects values from slotted inputs and dispatches a "bln-submit" CustomEvent with detail { data }.
 * - Exposes clear() to reset contained known inputs and dispatches "bln-clear"; delete() dispatches "bln-delete".
 */
@customElement('bln-formular')
export class BlnFormular extends TailwindElement {
  /** Form caption for a11y; referenced by aria-labelledby on the <form>. */
  @property({type: String, attribute: 'aria-label'}) ariaLabel: string = '';
  @property({type: String, attribute: 'aria-labelledby'}) ariaLabelledby: string = '';
  @property({type: String}) legend: string = '';

  /** When true, pressing Enter in text inputs will trigger submit. */
  @property({type: Boolean, reflect: true}) submitOnEnter: boolean = true;

  /** Optional: prevent default submit event bubbling to page. */
  @property({type: Boolean}) preventNativeSubmit: boolean = true;

  /** Enable retro design styling. */
  @property({type: Boolean, reflect: true, attribute: 'retro-design'}) retroDesign: boolean = false;

  // Grab slotted elements we can read values from
  @queryAssignedElements({flatten: true}) private _slotted!: Element[];
  @queryAssignedElements({slot: 'actions', flatten: true}) private _actions!: Element[];

  private handleKeydown = (e: KeyboardEvent) => {
    if (!this.submitOnEnter) return;
    if (e.key === 'Enter') {
      // Avoid accidental submit on buttons/textareas as needed
      const target = e.target as HTMLElement | null;
      const tag = (target?.tagName || '').toLowerCase();
      const type = (target as any)?.type;
      if (tag === 'textarea') return; // let textarea use Enter
      if (tag === 'button' || (tag === 'input' && (type === 'button' || type === 'submit'))) return;
      e.preventDefault();
      this.submit();
    }
  };

  private collectData(): Record<string, any> {
    const data: Record<string, any> = {};
    // Gather from known custom elements and native inputs
    const fields: Element[] = [...(this._slotted || [])];
    for (const el of fields) {
      // bln-input exposes name/value properties
      if ((el as any).tagName?.toLowerCase() === 'bln-input') {
        const name = (el as any).name ?? '';
        if (name) data[name] = (el as any).value ?? '';
        continue;
      }
      // Native inputs inside default slot
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
        const name = (el as any).name ?? '';
        if (name) {
          if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
            // For checkboxes: return boolean checked state
            // For radios: return value only if checked, otherwise skip
            if (el.type === 'checkbox') {
              data[name] = el.checked;
            } else if (el.type === 'radio' && el.checked) {
              data[name] = el.value ?? '';
            }
          } else {
            data[name] = (el as any).value ?? '';
          }
        }
        continue;
      }
      // If the slotted node contains form controls nested, query them
      if (el instanceof HTMLElement) {
        const inputs = el.querySelectorAll('input[name], select[name], textarea[name], bln-input');
        inputs.forEach((inp: Element) => {
          if (inp.tagName.toLowerCase() === 'bln-input') {
            const name = (inp as any).name ?? '';
            if (name) data[name] = (inp as any).value ?? '';
          } else if (inp instanceof HTMLInputElement || inp instanceof HTMLSelectElement || inp instanceof HTMLTextAreaElement) {
            const name = (inp as any).name ?? '';
            if (name) {
              if (inp instanceof HTMLInputElement && (inp.type === 'checkbox' || inp.type === 'radio')) {
                // For checkboxes: return boolean checked state
                // For radios: return value only if checked, otherwise skip
                if (inp.type === 'checkbox') {
                  data[name] = inp.checked;
                } else if (inp.type === 'radio' && inp.checked) {
                  data[name] = inp.value ?? '';
                }
              } else {
                data[name] = (inp as any).value ?? '';
              }
            }
          }
        });
      }
    }
    return data;
  }

  /** Public API: submit the form, dispatching bln-submit. */
  submit() {
    const data = this.collectData();
    const evt = new CustomEvent('bln-submit', { detail: { data }, bubbles: true, composed: true });
    this.dispatchEvent(evt);
  }

  /** Public API: clear known fields and dispatch bln-clear. */
  clear() {
    const fields: Element[] = [...(this._slotted || [])];
    const all: Element[] = [];
    for (const el of fields) {
      if (el instanceof HTMLElement) all.push(el, ...Array.from(el.querySelectorAll('*')));
      else all.push(el);
    }
    all.forEach((el) => {
      if ((el as any).tagName?.toLowerCase?.() === 'bln-input') {
        (el as any).value = '';
        // If BlnInput runs validation on value changes, it will update itself
      } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
          el.checked = false;
        } else {
          el.value = '';
        }
      } else if (el instanceof HTMLSelectElement) {
        el.selectedIndex = -1;
      }
    });
    this.dispatchEvent(new CustomEvent('bln-clear', {bubbles: true, composed: true}));
  }

  /** Public API: signal delete intent. */
  delete() {
    this.dispatchEvent(new CustomEvent('bln-delete', {bubbles: true, composed: true}));
  }

  protected render() {
    // a11y: associate optional legend via aria-labelledby if present
    const labelledby = this.ariaLabelledby || (this.legend ? 'bln-form-legend' : undefined);
    return html`
      <form role="form" aria-label=${this.ariaLabel || nothing} aria-labelledby=${labelledby || nothing}
            @submit=${(e: Event) => { if (this.preventNativeSubmit) e.preventDefault(); this.submit(); }}
            @keydown=${this.handleKeydown}
            class="${this.cn(
              ['flex flex-col gap-4'],
              this.retroDesign 
                ? ['border-2 border-black p-6 bg-white'] 
                : []
            )}">
        ${this.legend ? html`<h2 id="bln-form-legend" class="${this.cn(
          this.retroDesign 
            ? ['font-bold text-black text-xl mb-4 uppercase'] 
            : ['text-lg font-semibold']
        )}">${this.legend}</h2>` : nothing}
        <div class="contents">
          <slot></slot>
        </div>
        <div class="${this.cn(
          ['mt-4 pt-4 flex flex-wrap gap-2 justify-end'],
          this.retroDesign 
            ? ['border-t-2 border-black'] 
            : ['border-t']
        )}">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bln-formular': BlnFormular;
  }
}
