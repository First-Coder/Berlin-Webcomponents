import {customElement, property, state} from 'lit/decorators.js';
import {html} from 'lit';
import TailwindElement from '../app/TailwindElement';
import {booleanStringFalseConverter} from '../utils/converters';

export interface BlnCheckBoxProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  required: boolean;
  hint: string;
  cornerHint: string;
  class: string;
  size: 'small' | 'medium' | 'large';
  retroDesign: boolean;
  ariaLabel: string;
  ariaLabelledby: string;
  ariaDescribedby: string;
}

@customElement('bln-checkbox')
export class BlnCheckBox extends TailwindElement {
  // Visual
  @property() label: BlnCheckBoxProps['label'] = '';
  @property() hint: BlnCheckBoxProps['hint'] = '';
  @property({attribute: 'corner-hint'}) cornerHint: BlnCheckBoxProps['cornerHint'] = '';

  // Form/behavior
  @property() name: BlnCheckBoxProps['name'] = '';
  @property() value: BlnCheckBoxProps['value'] = 'on';
  @property({reflect: true, converter: booleanStringFalseConverter}) checked: BlnCheckBoxProps['checked'] = false;
  @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnCheckBoxProps['disabled'] = false;
  @property({reflect: true, converter: booleanStringFalseConverter}) required: BlnCheckBoxProps['required'] = false;

  // Styling
  @property() size: BlnCheckBoxProps['size'] = 'medium';
  @property() class: BlnCheckBoxProps['class'] = '';

  // A11y
  @property({attribute: 'aria-label'}) ariaLabel: BlnCheckBoxProps['ariaLabel'] = '';
  @property({attribute: 'aria-labelledby'}) ariaLabelledby: BlnCheckBoxProps['ariaLabelledby'] = '';
  @property({attribute: 'aria-describedby'}) ariaDescribedby: BlnCheckBoxProps['ariaDescribedby'] = '';

  @state() private _id = `bln-checkbox-${Math.random().toString(36).slice(2)}`;
  @state() private _hintId = `bln-checkbox-hint-${Math.random().toString(36).slice(2)}`;

  private onChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    this.checked = input.checked;
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
  };

  protected render() {
    const describedBy = [this.ariaDescribedby || '', this.hint ? this._hintId : ''].filter(Boolean).join(' ') || undefined;

    return html`
      <div class="max-w-sm">
        ${this.label || this.cornerHint
          ? html`<div class="flex flex-wrap justify-between items-center gap-2">
              ${this.label
                ? html`<div class="${this.cn(
                    this.retroDesign ? ['font-bold text-black'] : ['text-sm font-medium text-gray-700'],
                    ['block mb-2']
                  )}">${this.label}</div>`
                : ''}
              ${this.cornerHint ? html`<span class="block mb-2 text-sm text-gray-500">${this.cornerHint}</span>` : ''}
            </div>`
          : ''}
        <div class="relative">
          <label class="inline-flex items-center gap-3 select-none">
            <input
              id="${this._id}"
              type="checkbox"
              name="${this.name}"
              class="${this.cn(
                // size maps to box size and spacing
                this.size === 'small' ? ['h-4 w-4'] : '',
                this.size === 'medium' ? ['h-5 w-5'] : '',
                this.size === 'large' ? ['h-6 w-6'] : '',
                this.retroDesign
                  ? ['appearance-none border-2 border-black bg-white checked:bg-black focus:border-retro-blue focus:shadow-retro-input-shadow']
                  : ['rounded-sm border-2 border-gray-300 text-blue-600 focus:ring-blue-600'],
                ['disabled:opacity-50 disabled:pointer-events-none'],
                this.class
              )}"
              .value=${this.value}
              ?checked=${this.checked}
              ?disabled=${this.disabled}
              ?required=${this.required}
              aria-label=${this.ariaLabel || nothing}
              aria-labelledby=${this.ariaLabelledby || nothing}
              aria-describedby=${describedBy || nothing}
              @change=${this.onChange}
            />
            <span class="text-sm text-gray-700"><slot></slot></span>
          </label>
        </div>
        ${this.hint ? html`<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>` : ''}
      </div>
    `;
  }
}

const nothing = undefined;
