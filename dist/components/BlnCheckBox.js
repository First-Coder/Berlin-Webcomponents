var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property, state } from 'lit/decorators.js';
import { html } from 'lit';
import TailwindElement from '../app/TailwindElement';
import { booleanStringFalseConverter } from '../utils/converters';
let BlnCheckBox = class BlnCheckBox extends TailwindElement {
    constructor() {
        super(...arguments);
        // Visual
        this.label = '';
        this.hint = '';
        this.cornerHint = '';
        // Form/behavior
        this.name = '';
        this.value = 'on';
        this.checked = false;
        this.disabled = false;
        this.required = false;
        // Styling
        this.size = 'medium';
        this.class = '';
        // A11y
        this.ariaLabel = '';
        this.ariaLabelledby = '';
        this.ariaDescribedby = '';
        this._id = `bln-checkbox-${Math.random().toString(36).slice(2)}`;
        this._hintId = `bln-checkbox-hint-${Math.random().toString(36).slice(2)}`;
        this.onChange = (e) => {
            const input = e.currentTarget;
            this.checked = input.checked;
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        };
    }
    render() {
        const describedBy = [this.ariaDescribedby || '', this.hint ? this._hintId : ''].filter(Boolean).join(' ') || undefined;
        return html `
      <div class="max-w-sm">
        ${this.label || this.cornerHint
            ? html `<div class="flex flex-wrap justify-between items-center gap-2">
              ${this.label
                ? html `<div class="${this.cn(this.retroDesign ? ['font-bold text-black'] : ['text-sm font-medium text-gray-700'], ['block mb-2'])}">${this.label}</div>`
                : ''}
              ${this.cornerHint ? html `<span class="block mb-2 text-sm text-gray-500">${this.cornerHint}</span>` : ''}
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
        this.size === 'small' ? ['h-4 w-4'] : '', this.size === 'medium' ? ['h-5 w-5'] : '', this.size === 'large' ? ['h-6 w-6'] : '', this.retroDesign
            ? ['appearance-none border-2 border-black bg-white checked:bg-black focus:border-retro-blue focus:shadow-retro-input-shadow']
            : ['rounded-sm border-2 border-gray-300 text-blue-600 focus:ring-blue-600'], ['disabled:opacity-50 disabled:pointer-events-none'], this.class)}"
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
        ${this.hint ? html `<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>` : ''}
      </div>
    `;
    }
};
__decorate([
    property()
], BlnCheckBox.prototype, "label", void 0);
__decorate([
    property()
], BlnCheckBox.prototype, "hint", void 0);
__decorate([
    property({ attribute: 'corner-hint' })
], BlnCheckBox.prototype, "cornerHint", void 0);
__decorate([
    property()
], BlnCheckBox.prototype, "name", void 0);
__decorate([
    property()
], BlnCheckBox.prototype, "value", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnCheckBox.prototype, "checked", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnCheckBox.prototype, "disabled", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnCheckBox.prototype, "required", void 0);
__decorate([
    property()
], BlnCheckBox.prototype, "size", void 0);
__decorate([
    property()
], BlnCheckBox.prototype, "class", void 0);
__decorate([
    property({ attribute: 'aria-label' })
], BlnCheckBox.prototype, "ariaLabel", void 0);
__decorate([
    property({ attribute: 'aria-labelledby' })
], BlnCheckBox.prototype, "ariaLabelledby", void 0);
__decorate([
    property({ attribute: 'aria-describedby' })
], BlnCheckBox.prototype, "ariaDescribedby", void 0);
__decorate([
    state()
], BlnCheckBox.prototype, "_id", void 0);
__decorate([
    state()
], BlnCheckBox.prototype, "_hintId", void 0);
BlnCheckBox = __decorate([
    customElement('bln-checkbox')
], BlnCheckBox);
export { BlnCheckBox };
const nothing = undefined;
