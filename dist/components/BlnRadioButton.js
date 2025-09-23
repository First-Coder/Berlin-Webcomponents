var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property, state } from 'lit/decorators.js';
import { html, nothing } from 'lit';
import TailwindElement from '../app/TailwindElement';
import { booleanStringFalseConverter } from '../utils/converters';
let BlnRadioButton = class BlnRadioButton extends TailwindElement {
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
        this.retroDesign = false;
        // A11y
        this.ariaLabel = '';
        this.ariaLabelledby = '';
        this.ariaDescribedby = '';
        this._id = `bln-radio-${Math.random().toString(36).slice(2)}`;
        this._hintId = `bln-radio-hint-${Math.random().toString(36).slice(2)}`;
        this.onHostClick = (e) => {
            // Delegiere Klick auf die native Kontrolle, wenn außerhalb geklickt wurde
            if (this.disabled)
                return;
            const path = e.composedPath?.() ?? [];
            const clickedInput = path.some((n) => n instanceof HTMLInputElement);
            if (!clickedInput) {
                const input = this.renderRoot?.querySelector('input[type="radio"]');
                input?.click();
            }
        };
        this.onChange = (e) => {
            const input = e.currentTarget;
            const newChecked = input.checked;
            if (newChecked) {
                // Exklusivität sicherstellen
                this.uncheckSiblings();
                this.checked = true;
            }
            else {
                // Radios können eigentlich nicht unchecked werden, wenn gewählt;
                // belasse checked wie geliefert (Browser-Logik).
                this.checked = false;
            }
            this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value, checked: this.checked }, bubbles: true, composed: true }));
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        // Falls initial checked=true gesetzt ist, sorge für Exklusivität in der Gruppe
        if (this.checked)
            this.uncheckSiblings();
        // Sync bei Attributänderungen außerhalb
        this.addEventListener('click', this.onHostClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener('click', this.onHostClick);
    }
    uncheckSiblings() {
        if (!this.name)
            return;
        const root = this.getRootNode();
        const nodes = root.querySelectorAll?.('bln-radio-button');
        nodes?.forEach((node) => {
            if (node === this)
                return;
            if (node.name === this.name)
                node.checked = false;
        });
    }
    render() {
        const describedBy = [
            this.ariaDescribedby || '',
            this.hint ? this._hintId : ''
        ].filter(Boolean).join(' ') || undefined;
        const sizeClasses = this.size === 'small' ? 'w-4 h-4' : this.size === 'large' ? 'w-6 h-6' : 'w-5 h-5';
        const ring = this.retroDesign
            ? 'rounded-none focus:ring-0 focus:border-2 focus:border-retro-blue focus:shadow-retro-input-shadow'
            : 'rounded-full focus:ring-2 focus:ring-blue-600 focus:ring-offset-0';
        return html `
      <label class="inline-flex items-center gap-2 ${this.class}">
        <input
          id="${this._id}"
          type="radio"
          name="${this.name}"
          class="border-2 ${sizeClasses} ${ring} disabled:opacity-50 disabled:pointer-events-none"
          .value=${this.value}
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-label=${this.ariaLabel || nothing}
          aria-labelledby=${this.ariaLabelledby || nothing}
          aria-describedby=${describedBy || nothing}
          @change=${this.onChange}
        />
        <span>
          <slot>${this.label || ''}</slot>
          ${this.hint
            ? html `<span id="${this._hintId}" class="block text-xs text-gray-500">${this.hint}</span>`
            : nothing}
        </span>
      </label>
    `;
    }
};
__decorate([
    property()
], BlnRadioButton.prototype, "label", void 0);
__decorate([
    property()
], BlnRadioButton.prototype, "hint", void 0);
__decorate([
    property({ attribute: 'corner-hint' })
], BlnRadioButton.prototype, "cornerHint", void 0);
__decorate([
    property()
], BlnRadioButton.prototype, "name", void 0);
__decorate([
    property()
], BlnRadioButton.prototype, "value", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnRadioButton.prototype, "checked", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnRadioButton.prototype, "disabled", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnRadioButton.prototype, "required", void 0);
__decorate([
    property()
], BlnRadioButton.prototype, "size", void 0);
__decorate([
    property()
], BlnRadioButton.prototype, "class", void 0);
__decorate([
    property({ attribute: 'retro-design', converter: booleanStringFalseConverter })
], BlnRadioButton.prototype, "retroDesign", void 0);
__decorate([
    property({ attribute: 'aria-label' })
], BlnRadioButton.prototype, "ariaLabel", void 0);
__decorate([
    property({ attribute: 'aria-labelledby' })
], BlnRadioButton.prototype, "ariaLabelledby", void 0);
__decorate([
    property({ attribute: 'aria-describedby' })
], BlnRadioButton.prototype, "ariaDescribedby", void 0);
__decorate([
    state()
], BlnRadioButton.prototype, "_id", void 0);
__decorate([
    state()
], BlnRadioButton.prototype, "_hintId", void 0);
BlnRadioButton = __decorate([
    customElement('bln-radio-button')
], BlnRadioButton);
export { BlnRadioButton };
