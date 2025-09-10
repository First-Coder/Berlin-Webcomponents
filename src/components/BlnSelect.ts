import {customElement, property, state} from "lit/decorators.js";
import {html} from "lit";
import TailwindElement from "../app/TailwindElement";
import {booleanStringFalseConverter} from "../utils/converters";
import "./LucideIcon";

export interface BlnSelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface BlnSelectProps {
    label: string;
    hint: string;
    cornerHint: string;
    name: string;
    placeholder: string;
    value: string | string[];
    disabled: boolean;
    required: boolean;
    multiple: boolean;
    size: "small" | "medium" | "large";
    class: string;
    isValid: boolean;
    retroDesign: boolean;
    options: BlnSelectOption[];
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
}

@customElement("bln-select")
export class BlnSelect extends TailwindElement {
    // Visual Meta
    @property() label: BlnSelectProps["label"] = "";
    @property({attribute: "corner-hint"}) cornerHint: BlnSelectProps["cornerHint"] = "";
    @property() hint: BlnSelectProps["hint"] = "";

    // Form/Behavior
    @property() name: BlnSelectProps["name"] = "";
    @property() placeholder: BlnSelectProps["placeholder"] = "";
    @property({attribute: "value"}) value: BlnSelectProps["value"] = "";
    @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnSelectProps["disabled"] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) required: BlnSelectProps["required"] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) multiple: BlnSelectProps["multiple"] = false;

    // Sizing/Styles
    @property() size: BlnSelectProps["size"] = "medium";
    @property() class: BlnSelectProps["class"] = "";
    @property({attribute: "is-valid", reflect: true, converter: booleanStringFalseConverter}) isValid: BlnSelectProps["isValid"] = false;

    // A11y
    @property({attribute: "aria-label"}) ariaLabel: BlnSelectProps["ariaLabel"] = "";
    @property({attribute: "aria-labelledby"}) ariaLabelledby: BlnSelectProps["ariaLabelledby"] = "";
    @property({attribute: "aria-describedby"}) ariaDescribedby: BlnSelectProps["ariaDescribedby"] = "";

    // Options (programmatisch gesetzt); alternativ kann Slot <option> genutzt werden
    @property({attribute: false}) options: BlnSelectProps["options"] = [];

    // interner IDs
    @state() private _selectId = `bln-select-${Math.random().toString(36).slice(2)}`;
    @state() private _hintId = `bln-select-hint-${Math.random().toString(36).slice(2)}`;
    @state() private _isValidSet = false;

    private onChange = (e: Event) => {
        const sel = e.currentTarget as HTMLSelectElement;
        if (this.multiple) {
            const vals = Array.from(sel.selectedOptions).map(o => o.value);
            this.value = vals;
        } else {
            this.value = sel.value;
        }
        // Events nach außen weiterreichen
        this.dispatchEvent(new Event("change", {bubbles: true, composed: true}));
        this.dispatchEvent(new Event("input", {bubbles: true, composed: true}));
    };

    private isSelectionValid(): boolean | undefined {
        // Show validity state only if user explicitly set isValid (tracked flag)
        return this._isValidSet ? this.isValid : undefined;
    }


    protected renderSelectOptions() {
        const hasProvidedOptions = Array.isArray(this.options) && this.options.length > 0;
        if (hasProvidedOptions) {
            return html`
        ${this.placeholder
                ? html`<option value="" ?selected=${!this.multiple && (this.value === "" || this.value == null)} disabled hidden>${this.placeholder}</option>`
                : null}
        ${this.options.map(o => html`
          <option value=${o.value} ?disabled=${!!o.disabled}
                  ?selected=${this.multiple
                ? Array.isArray(this.value) && this.value.includes(o.value)
                : this.value === o.value}
          >${o.label}</option>
        `)}
      `;
        }
        // Slot als Fallback: Nutzer kann <option> direkt slottet bereitstellen
        return html`
      ${this.placeholder
            ? html`<option value="" ?selected=${!this.multiple && (this.value === "" || this.value == null)} disabled hidden>${this.placeholder}</option>`
            : null}
      <slot></slot>
    `;
    }



    protected willUpdate(changed: Map<string, any>) {
        if (changed.has('isValid')) this._isValidSet = true;
    }

    protected render() {
        // A11y: aria-describedby automatisch, wenn hint vorhanden
        const describedBy = [
            this.ariaDescribedby || "",
            this.hint ? this._hintId : ""
        ].filter(Boolean).join(" ") || undefined;

        const invalid = this.isSelectionValid();

        return html`
      <div class="max-w-sm">
        ${this.label
            ? html`
              <div class="flex flex-wrap justify-between items-center gap-2">
                <label for="${this._selectId}" class="${this.cn(
                this.retroDesign
                    ? ['font-bold text-black']
                    : ['text-sm font-medium text-gray-700'],
                ['block mb-2']
            )}">
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
            this.size === 'small' ? ['py-1.5 sm:py-2 px-3'] : '',
            this.size === 'medium' ? ['py-2.5 sm:py-3 px-4'] : '',
            this.size === 'large' ? ['p-3.5 sm:p-5'] : '',
            // Retro vs Modern
            this.retroDesign
                ? ['rounded-none focus:border-retro-blue focus:shadow-retro-input-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white']
                : ['rounded-md focus:border-blue-600 focus-visible:outline-none'],
            // Base
            ['block w-full border-2 border-gray-200 sm:text-sm appearance-none bg-white'],
            ['disabled:opacity-50 disabled:pointer-events-none'],
            invalid === true ? ['border-teal-500 focus:border-teal-400'] : '',
            invalid === false ? ['border-red-500 focus:border-red-300'] : '',
            this.class
        )}"
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
            ? html`<lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
            : nothing}
            ${invalid === false
            ? html`<lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
            : nothing}
          </div>

          <!-- kleines Chevron (nur Deko, nicht interaktiv), bei multiple kein Chevron -->
          ${!this.multiple ? html`
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
              <svg class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clip-rule="evenodd"></path>
              </svg>
            </div>
          ` : null}
        </div>

        ${this.hint
            ? html`<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>`
            : ""}
      </div>
    `;
    }
}

const nothing = undefined;