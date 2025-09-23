var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property, state } from "lit/decorators.js";
import { html } from "lit";
import TailwindElement from "../app/TailwindElement";
import { booleanStringFalseConverter } from "../utils/converters";
import "./LucideIcon";
let BlnSelect = class BlnSelect extends TailwindElement {
    constructor() {
        super(...arguments);
        // Visual Meta
        this.label = "";
        this.cornerHint = "";
        this.hint = "";
        // Form/Behavior
        this.name = "";
        this.placeholder = "";
        this.value = "";
        this.disabled = false;
        this.required = false;
        this.multiple = false;
        // Sizing/Styles
        this.size = "medium";
        this.class = "";
        this.isValid = undefined;
        // A11y
        this.ariaLabel = "";
        this.ariaLabelledby = "";
        this.ariaDescribedby = "";
        // Options (programmatisch gesetzt); alternativ kann Slot <option> genutzt werden
        this.options = [];
        // interner IDs
        this._selectId = `bln-select-${Math.random().toString(36).slice(2)}`;
        this._hintId = `bln-select-hint-${Math.random().toString(36).slice(2)}`;
        this._isValidSet = false;
        this.onChange = (e) => {
            const sel = e.currentTarget;
            if (this.multiple) {
                const vals = Array.from(sel.selectedOptions).map(o => o.value);
                this.value = vals;
            }
            else {
                this.value = sel.value;
            }
            // Events nach außen weiterreichen
            this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
            this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        };
    }
    isSelectionValid() {
        // Show validity state only if user explicitly set isValid (tracked flag)
        // and there is a value selected (neutral when empty)
        const hasValue = Array.isArray(this.value)
            ? this.value.length > 0
            : (this.value ?? '') !== '';
        return (this._isValidSet && hasValue) ? this.isValid : undefined;
    }
    renderSelectOptions() {
        const hasProvidedOptions = Array.isArray(this.options) && this.options.length > 0;
        if (hasProvidedOptions) {
            return html `
        ${this.placeholder
                ? html `<option value="" ?selected=${!this.multiple && (this.value === "" || this.value == null)} disabled hidden>${this.placeholder}</option>`
                : null}
        ${this.options.map(o => html `
          <option value=${o.value} ?disabled=${!!o.disabled}
                  ?selected=${this.multiple
                ? Array.isArray(this.value) && this.value.includes(o.value)
                : this.value === o.value}
          >${o.label}</option>
        `)}
      `;
        }
        // Slot als Fallback: Nutzer kann <option> direkt slottet bereitstellen
        return html `
      ${this.placeholder
            ? html `<option value="" ?selected=${!this.multiple && (this.value === "" || this.value == null)} disabled hidden>${this.placeholder}</option>`
            : null}
      <slot></slot>
    `;
    }
    willUpdate(changed) {
        if (changed.has('isValid'))
            this._isValidSet = true;
    }
    render() {
        // A11y: aria-describedby automatisch, wenn hint vorhanden
        const describedBy = [
            this.ariaDescribedby || "",
            this.hint ? this._hintId : ""
        ].filter(Boolean).join(" ") || undefined;
        const invalid = this.isSelectionValid();
        return html `
      <div class="max-w-sm">
        ${this.label
            ? html `
              <div class="flex flex-wrap justify-between items-center gap-2">
                <label for="${this._selectId}" class="${this.cn(this.retroDesign
                ? ['font-bold text-black']
                : ['text-sm font-medium text-gray-700'], ['block mb-2'])}">
                  ${this.label}
                </label>
                <span class="block mb-2 text-sm text-gray-500 dark:text-neutral-500">${this.cornerHint}</span>
              </div>`
            : ""}
        <div class="relative">
          <select
            id="${this._selectId}"
            name="${this.name}"
            class="${this.cn(
        // Sizes
        this.size === 'small' ? ['py-1.5 sm:py-2 px-3'] : '', this.size === 'medium' ? ['py-2.5 sm:py-3 px-4'] : '', this.size === 'large' ? ['p-3.5 sm:p-5'] : '', 
        // Retro vs Modern
        this.retroDesign
            ? ['rounded-none focus:border-retro-blue focus:shadow-retro-input-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white']
            : ['rounded-md focus:border-blue-600 focus-visible:outline-none'], 
        // Base
        ['block w-full border-2 sm:text-sm appearance-none bg-white'], 
        // Neutral when no value: black border; otherwise gray
        (Array.isArray(this.value) ? this.value.length > 0 : (this.value ?? '') !== '') ? ['border-gray-200'] : ['border-black'], ['disabled:opacity-50 disabled:pointer-events-none'], invalid === true ? ['border-teal-500 focus:border-teal-400'] : '', invalid === false ? ['border-red-500 focus:border-red-300'] : '', this.class)}"
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?multiple=${this.multiple}
            aria-invalid=${invalid === undefined ? 'false' : String(!invalid)}
            aria-describedby=${describedBy || nothing}
            aria-label=${this.ariaLabel || nothing}
            aria-labelledby=${this.ariaLabelledby || (this.label ? undefined : nothing)}
            @change=${this.onChange}>
            ${this.renderSelectOptions()}
          </select>

          <!-- Icons wie bei BlnInput rechtsbündig -->
          <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
            ${invalid === true
            ? html `<lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
            : nothing}
            ${invalid === false
            ? html `<lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
            : nothing}
          </div>

          <!-- kleines Chevron (nur Deko, nicht interaktiv), bei multiple kein Chevron -->
          ${!this.multiple ? html `
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
              <svg class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clip-rule="evenodd"></path>
              </svg>
            </div>
          ` : null}
        </div>

        ${this.hint
            ? html `<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>`
            : ""}
      </div>
    `;
    }
};
__decorate([
    property()
], BlnSelect.prototype, "label", void 0);
__decorate([
    property({ attribute: "corner-hint" })
], BlnSelect.prototype, "cornerHint", void 0);
__decorate([
    property()
], BlnSelect.prototype, "hint", void 0);
__decorate([
    property()
], BlnSelect.prototype, "name", void 0);
__decorate([
    property()
], BlnSelect.prototype, "placeholder", void 0);
__decorate([
    property({ attribute: "value" })
], BlnSelect.prototype, "value", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnSelect.prototype, "disabled", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnSelect.prototype, "required", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnSelect.prototype, "multiple", void 0);
__decorate([
    property()
], BlnSelect.prototype, "size", void 0);
__decorate([
    property()
], BlnSelect.prototype, "class", void 0);
__decorate([
    property({ attribute: "is-valid", reflect: true, converter: booleanStringFalseConverter })
], BlnSelect.prototype, "isValid", void 0);
__decorate([
    property({ attribute: "aria-label" })
], BlnSelect.prototype, "ariaLabel", void 0);
__decorate([
    property({ attribute: "aria-labelledby" })
], BlnSelect.prototype, "ariaLabelledby", void 0);
__decorate([
    property({ attribute: "aria-describedby" })
], BlnSelect.prototype, "ariaDescribedby", void 0);
__decorate([
    property({ attribute: false })
], BlnSelect.prototype, "options", void 0);
__decorate([
    state()
], BlnSelect.prototype, "_selectId", void 0);
__decorate([
    state()
], BlnSelect.prototype, "_hintId", void 0);
__decorate([
    state()
], BlnSelect.prototype, "_isValidSet", void 0);
BlnSelect = __decorate([
    customElement("bln-select")
], BlnSelect);
export { BlnSelect };
const nothing = undefined;
