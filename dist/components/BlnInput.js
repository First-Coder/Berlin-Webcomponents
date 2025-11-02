
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property, state } from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import { html } from "lit";
import { booleanStringFalseConverter } from "../utils/converters";
import './LucideIcon';
let BlnInput = class BlnInput extends TailwindElement {
    constructor() {
        super(...arguments);
        // Visual/Meta
        this.label = "";
        this.cornerHint = "";
        this.hint = "";
        this.error = "";
        // Form/Behavior
        this.name = "";
        this.type = "text";
        this.value = "";
        this.placeholder = "";
        this.disabled = false;
        this.required = false;
        this.readonly = false;
        this.minlength = undefined;
        this.maxlength = undefined;
        this.pattern = "";
        this.min = "";
        this.max = "";
        this.step = undefined;
        this.inputmode = undefined;
        this.autocomplete = "";
        // Sizing/Styles
        this.size = "medium";
        this.class = "";
        this.isValid = undefined;
        // A11y
        this.ariaLabel = "";
        this.ariaLabelledby = "";
        this.ariaDescribedby = "";
        // internal ids
        this._inputId = `bln-input-${Math.random().toString(36).slice(2)}`;
        this._hintId = `bln-input-hint-${Math.random().toString(36).slice(2)}`;
        this._errorId = `bln-input-error-${Math.random().toString(36).slice(2)}`;
        this._isValidSet = false;
        this.onInput = (e) => {
            const input = e.currentTarget;
            this.value = input.value;
            // Run external validation if provided
            this.runValidation();
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        };
        this.onChange = (_e) => {
            this.runValidation();
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        };
    }
    willUpdate(changed) {
        if (changed.has('isValid'))
            this._isValidSet = true;
        if (changed.has('value')) {
            // When value changes programmatically, also re-run validation if provided
            this.runValidation();
        }
    }
    render() {
        const describedBy = [
            this.ariaDescribedby || '',
            this.hint ? this._hintId : '',
            this.error ? this._errorId : ''
        ].filter(Boolean).join(' ') || undefined;
        // Determine validity state only after consumer has explicitly set isValid
        // Additionally, when there is no value yet, keep a neutral state (no green/red)
        const hasValue = (this.value ?? '') !== '';
        const invalid = this._isValidSet && hasValue ? !this.isValid : undefined;
        return html `
      <div class="max-w-sm">
        ${this.label || this.cornerHint ? html `
          <div class="flex flex-wrap justify-between items-center gap-2">
            ${this.label ? html `<label for="${this._inputId}" class="${this.cn(this.retroDesign ? ['font-bold text-black'] : ['text-sm font-medium text-gray-700'], ['block mb-2'])}">${this.label}</label>` : ''}
            ${this.cornerHint ? html `<span class="block mb-2 text-sm text-gray-500 dark:text-neutral-500">${this.cornerHint}</span>` : ''}
          </div>` : ''}

        <div class="relative">
          <input
            id="${this._inputId}"
            type="${this.type}"
            name="${this.name}"
            class="${this.cn(
        // Sizes
        this.size === 'small' ? ['py-1.5 sm:py-2 px-3'] : '', this.size === 'medium' ? ['py-2.5 sm:py-3 px-4'] : '', this.size === 'large' ? ['p-3.5 sm:p-5'] : '', 
        // Retro
        this.retroDesign
            ? ['rounded-none focus:border-retro-blue focus:shadow-retro-input-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white']
            : ['rounded-md focus:border-blue-600 focus-visible:outline-none'], 
        // Other...
        ['block w-full border-2 sm:text-sm'], hasValue ? ['border-gray-200'] : ['border-black'], ['disabled:opacity-50 disabled:pointer-events-none'], invalid === false ? ['border-teal-500 focus:border-teal-400'] : '', invalid === true ? ['border-red-500 focus:border-red-300'] : '', this.class)}"
            .value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            minlength=${this.minlength ?? nothing}
            maxlength=${this.maxlength ?? nothing}
            pattern=${this.pattern || nothing}
            min=${this.min || nothing}
            max=${this.max || nothing}
            step=${this.step ?? nothing}
            inputmode=${this.inputmode ?? nothing}
            autocomplete=${this.autocomplete || nothing}
            aria-invalid=${invalid === undefined ? 'false' : String(invalid)}
            aria-describedby=${describedBy || nothing}
            aria-label=${this.ariaLabel || nothing}
            aria-labelledby=${this.ariaLabelledby || (this.label ? undefined : nothing)}
            placeholder="${this.placeholder}"
            @input=${this.onInput}
            @change=${this.onChange}
            @focus=${(e) => this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }))}
            @blur=${(e) => this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }))}
            @keydown=${(e) => this.dispatchEvent(new CustomEvent('keydown', { detail: { key: e.key }, bubbles: true, composed: true }))}
            @keyup=${(e) => this.dispatchEvent(new CustomEvent('keyup', { detail: { key: e.key }, bubbles: true, composed: true }))}
          />
          <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
            ${invalid === false
            ? html `<lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
            : nothing}
            ${invalid === true
            ? html `<lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
            : nothing}
          </div>
        </div>

        ${this.hint ? html `<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>` : ''}
        ${this.error ? html `<span id="${this._errorId}" class="mt-1 text-sm text-red-600" role="alert" aria-live="polite">${this.error}</span>` : ''}
      </div>`;
    }
    runValidation() {
        if (!this.validator)
            return;
        const v = (this.value ?? '');
        // Neutral state for empty unless validator explicitly handles it
        if (v === '') {
            // Clear validity and error for neutral display
            this.isValid = undefined;
            this.error = '';
            return;
        }
        try {
            const res = this.validator(v, this);
            const result = typeof res === 'boolean' ? { valid: res } : res ?? { valid: true };
            this.isValid = result.valid;
            // If invalid and message provided, set error; otherwise clear error to avoid stale messages
            this.error = (!result.valid && result.message) ? result.message : (!result.valid ? (this.error || '') : '');
            // Ensure we show validity icons once validator ran
            this._isValidSet = true;
            this.dispatchEvent(new CustomEvent('validitychange', { detail: { isValid: this.isValid, message: this.error }, bubbles: true, composed: true }));
        }
        catch (e) {
            // On validator error, do not break UI; mark invalid with generic message
            this.isValid = false;
            this.error = this.error || 'Ungültiger Wert';
            this._isValidSet = true;
        }
    }
};
__decorate([
    property()
], BlnInput.prototype, "label", void 0);
__decorate([
    property({ attribute: 'corner-hint' })
], BlnInput.prototype, "cornerHint", void 0);
__decorate([
    property()
], BlnInput.prototype, "hint", void 0);
__decorate([
    property()
], BlnInput.prototype, "error", void 0);
__decorate([
    property()
], BlnInput.prototype, "name", void 0);
__decorate([
    property()
], BlnInput.prototype, "type", void 0);
__decorate([
    property()
], BlnInput.prototype, "value", void 0);
__decorate([
    property()
], BlnInput.prototype, "placeholder", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnInput.prototype, "disabled", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnInput.prototype, "required", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnInput.prototype, "readonly", void 0);
__decorate([
    property({ attribute: 'minlength' })
], BlnInput.prototype, "minlength", void 0);
__decorate([
    property({ attribute: 'maxlength' })
], BlnInput.prototype, "maxlength", void 0);
__decorate([
    property()
], BlnInput.prototype, "pattern", void 0);
__decorate([
    property()
], BlnInput.prototype, "min", void 0);
__decorate([
    property()
], BlnInput.prototype, "max", void 0);
__decorate([
    property()
], BlnInput.prototype, "step", void 0);
__decorate([
    property()
], BlnInput.prototype, "inputmode", void 0);
__decorate([
    property()
], BlnInput.prototype, "autocomplete", void 0);
__decorate([
    property({ attribute: false })
], BlnInput.prototype, "validator", void 0);
__decorate([
    property()
], BlnInput.prototype, "size", void 0);
__decorate([
    property()
], BlnInput.prototype, "class", void 0);
__decorate([
    property({ attribute: 'is-valid', reflect: true, converter: booleanStringFalseConverter })
], BlnInput.prototype, "isValid", void 0);
__decorate([
    property({ attribute: 'aria-label' })
], BlnInput.prototype, "ariaLabel", void 0);
__decorate([
    property({ attribute: 'aria-labelledby' })
], BlnInput.prototype, "ariaLabelledby", void 0);
__decorate([
    property({ attribute: 'aria-describedby' })
], BlnInput.prototype, "ariaDescribedby", void 0);
__decorate([
    state()
], BlnInput.prototype, "_inputId", void 0);
__decorate([
    state()
], BlnInput.prototype, "_hintId", void 0);
__decorate([
    state()
], BlnInput.prototype, "_errorId", void 0);
__decorate([
    state()
], BlnInput.prototype, "_isValidSet", void 0);
BlnInput = __decorate([
    customElement('bln-input')
], BlnInput);
export { BlnInput };
const nothing = undefined;
