var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property, state } from "lit/decorators.js";
import { html, nothing } from "lit";
import TailwindElement from "../app/TailwindElement";
import { booleanStringFalseConverter } from "../utils/converters";
import "./LucideIcon";
let BlnAutocompleteSelect = class BlnAutocompleteSelect extends TailwindElement {
    constructor() {
        super(...arguments);
        // Visual Meta
        this.label = "";
        this.cornerHint = "";
        this.hint = "";
        // Form/Behavior
        this.name = "";
        this.placeholder = "";
        this.searchPlaceholder = "Suchen...";
        this.value = "";
        this.disabled = false;
        this.required = false;
        this.multiple = false;
        // Sizing/Styles
        this.size = "medium";
        this.class = "";
        this.isValid = undefined;
        this.retroDesign = false;
        // A11y
        this.ariaLabel = "";
        this.ariaLabelledby = "";
        this.ariaDescribedby = "";
        // Autocomplete specific
        this.minSearchChars = 1;
        this.noResultsText = "Keine Ergebnisse gefunden";
        this.loadingText = "Laden...";
        // Options (programmatisch gesetzt)
        this.options = [];
        // Internal state
        this._searchTerm = "";
        this._isOpen = false;
        this._filteredOptions = [];
        this._focusedIndex = -1;
        this._isValidSet = false;
        // Internal IDs
        this._comboboxId = `bln-autocomplete-${Math.random().toString(36).slice(2)}`;
        this._listboxId = `bln-autocomplete-listbox-${Math.random().toString(36).slice(2)}`;
        this._hintId = `bln-autocomplete-hint-${Math.random().toString(36).slice(2)}`;
        this.onSearchInput = (e) => {
            const input = e.currentTarget;
            this._searchTerm = input.value;
            this._focusedIndex = -1;
            if (!this._isOpen && this._searchTerm.length >= this.minSearchChars) {
                this._isOpen = true;
            }
            this.dispatchEvent(new CustomEvent("search", {
                detail: { searchTerm: this._searchTerm },
                bubbles: true,
                composed: true
            }));
        };
        this.onSearchKeydown = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!this._isOpen && this._searchTerm.length >= this.minSearchChars) {
                        this._isOpen = true;
                    }
                    this.focusNextOption();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.focusPreviousOption();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this._focusedIndex >= 0 && this._filteredOptions[this._focusedIndex]) {
                        this.selectOption(this._filteredOptions[this._focusedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeDropdown();
                    break;
            }
        };
        this.onInputBlur = (e) => {
            // Close dropdown after a short delay to allow option clicks
            setTimeout(() => {
                if (!this.shadowRoot?.activeElement) {
                    this.closeDropdown();
                }
            }, 150);
        };
    }
    willUpdate(changed) {
        if (changed.has('isValid'))
            this._isValidSet = true;
        if (changed.has('options') || changed.has('_searchTerm')) {
            this.updateFilteredOptions();
        }
    }
    updateFilteredOptions() {
        if (!this._searchTerm || this._searchTerm.length < this.minSearchChars) {
            this._filteredOptions = [...this.options];
        }
        else {
            const searchLower = this._searchTerm.toLowerCase();
            this._filteredOptions = this.options.filter(option => option.label.toLowerCase().includes(searchLower) ||
                option.value.toLowerCase().includes(searchLower));
        }
    }
    focusNextOption() {
        if (this._filteredOptions.length === 0)
            return;
        this._focusedIndex = (this._focusedIndex + 1) % this._filteredOptions.length;
    }
    focusPreviousOption() {
        if (this._filteredOptions.length === 0)
            return;
        this._focusedIndex = this._focusedIndex <= 0
            ? this._filteredOptions.length - 1
            : this._focusedIndex - 1;
    }
    selectOption(option) {
        if (option.disabled)
            return;
        if (this.multiple) {
            const currentValues = Array.isArray(this.value) ? this.value : [];
            if (currentValues.includes(option.value)) {
                this.value = currentValues.filter(v => v !== option.value);
            }
            else {
                this.value = [...currentValues, option.value];
            }
        }
        else {
            this.value = option.value;
            this._searchTerm = option.label;
            this.closeDropdown();
        }
        this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
        this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }
    closeDropdown() {
        this._isOpen = false;
        this._focusedIndex = -1;
    }
    getDisplayValue() {
        if (this.multiple) {
            const values = Array.isArray(this.value) ? this.value : [];
            if (values.length === 0)
                return "";
            if (values.length === 1) {
                const option = this.options.find(o => o.value === values[0]);
                return option?.label || values[0];
            }
            return `${values.length} Elemente ausgewählt`;
        }
        else {
            if (!this.value)
                return "";
            const stringValue = Array.isArray(this.value) ? this.value[0] : this.value;
            const option = this.options.find(o => o.value === stringValue);
            return option?.label || stringValue;
        }
    }
    isSelectionValid() {
        const hasValue = Array.isArray(this.value)
            ? this.value.length > 0
            : (this.value ?? '') !== '';
        return (this._isValidSet && hasValue) ? this.isValid : undefined;
    }
    getSelectedOptions() {
        if (!this.multiple || !Array.isArray(this.value))
            return [];
        return this.options.filter(option => this.value.includes(option.value));
    }
    removeSelectedOption(optionValue, e) {
        e.stopPropagation();
        if (Array.isArray(this.value)) {
            this.value = this.value.filter(v => v !== optionValue);
            this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
        }
    }
    render() {
        const describedBy = [
            this.ariaDescribedby || "",
            this.hint ? this._hintId : ""
        ].filter(Boolean).join(" ") || undefined;
        const invalid = this.isSelectionValid();
        const displayValue = this.getDisplayValue();
        const showResults = this._isOpen && this._searchTerm.length >= this.minSearchChars;
        return html `
            <div class="max-w-sm relative">
                ${this.label
            ? html `
                        <div class="flex flex-wrap justify-between items-center gap-2">
                            <label for="${this._comboboxId}" class="${this.cn(this.retroDesign
                ? ['font-bold text-black']
                : ['text-sm font-medium text-gray-700'], ['block mb-2'])}">
                                ${this.label}
                            </label>
                            <span class="block mb-2 text-sm text-gray-500 dark:text-neutral-500">${this.cornerHint}</span>
                        </div>`
            : ""}

                <!-- Selected items (multiple mode) -->
                ${this.multiple && Array.isArray(this.value) && this.value.length > 0 ? html `
                    <div class="mb-2 flex flex-wrap gap-1">
                        ${this.getSelectedOptions().map(option => html `
                            <span class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                                ${option.label}
                                <button
                                    type="button"
                                    @click=${(e) => this.removeSelectedOption(option.value, e)}
                                    class="ml-1 text-blue-600 hover:text-blue-800"
                                    aria-label="Remove ${option.label}">
                                    <lucide-icon name="X" cls="w-3 h-3"></lucide-icon>
                                </button>
                            </span>
                        `)}
                    </div>
                ` : nothing}

                <div class="relative">
                    <!-- Search input -->
                    <input
                        type="text"
                        id="${this._comboboxId}"
                        name="${this.name}"
                        class="${this.cn(
        // Sizes
        this.size === 'small' ? ['py-1.5 sm:py-2 px-3'] : '', this.size === 'medium' ? ['py-2.5 sm:py-3 px-4'] : '', this.size === 'large' ? ['p-3.5 sm:p-5'] : '', 
        // Retro vs Modern
        this.retroDesign
            ? ['rounded-none focus:border-retro-blue focus:shadow-retro-input-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white']
            : ['rounded-md focus:border-blue-600 focus-visible:outline-none'], 
        // Base
        ['block w-full border-2 sm:text-sm bg-white'], 
        // Border colors
        (Array.isArray(this.value) ? this.value.length > 0 : (this.value ?? '') !== '') ? ['border-gray-200'] : ['border-black'], ['disabled:opacity-50 disabled:pointer-events-none'], invalid === true ? ['border-teal-500 focus:border-teal-400'] : '', invalid === false ? ['border-red-500 focus:border-red-300'] : '', this.class)}"
                        .value=${this.multiple ? this._searchTerm : (this._searchTerm || displayValue)}
                        placeholder=${this.searchPlaceholder}
                        ?disabled=${this.disabled}
                        ?required=${this.required}
                        autocomplete="off"
                        role="combobox"
                        aria-expanded=${this._isOpen ? 'true' : 'false'}
                        aria-controls=${this._listboxId}
                        aria-activedescendant=${this._focusedIndex >= 0 ? `option-${this._focusedIndex}` : ''}
                        aria-invalid=${invalid === undefined ? 'false' : String(!invalid)}
                        aria-describedby=${describedBy || nothing}
                        aria-label=${this.ariaLabel || nothing}
                        aria-labelledby=${this.ariaLabelledby || (this.label ? undefined : nothing)}
                        @input=${this.onSearchInput}
                        @keydown=${this.onSearchKeydown}
                        @blur=${this.onInputBlur}
                        @focus=${() => {
            if (this._searchTerm.length >= this.minSearchChars) {
                this._isOpen = true;
            }
        }}
                    >

                    <!-- Icons -->
                    <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
                        ${invalid === true
            ? html `<lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
            : nothing}
                        ${invalid === false
            ? html `<lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
            : nothing}
                        <div class="ml-2">
                            <lucide-icon name="Search" cls="w-4 h-4 text-gray-400"></lucide-icon>
                        </div>
                    </div>

                    <!-- Dropdown -->
                    ${showResults ? html `
                        <div class="${this.cn(['absolute z-50 w-full mt-1 bg-white border border-gray-300 max-h-60 overflow-auto'], this.retroDesign
            ? ['border-2 border-black shadow-retro']
            : ['rounded-md shadow-lg'])}">
                            <ul 
                                id=${this._listboxId}
                                role="listbox"
                                aria-multiselectable=${this.multiple ? 'true' : 'false'}
                                class="py-1">
                                ${this._filteredOptions.length === 0 ? html `
                                    <li class="px-3 py-2 text-gray-500 text-sm">${this.noResultsText}</li>
                                ` : this._filteredOptions.map((option, index) => html `
                                    <li
                                        id="option-${index}"
                                        role="option"
                                        aria-selected=${this.multiple
            ? Array.isArray(this.value) && this.value.includes(option.value) ? 'true' : 'false'
            : this.value === option.value ? 'true' : 'false'}
                                        ?aria-disabled=${option.disabled}
                                        class="${this.cn(['px-3 py-2 cursor-pointer text-sm'], this._focusedIndex === index ? ['bg-blue-100'] : ['hover:bg-gray-100'], option.disabled ? ['text-gray-400 cursor-not-allowed'] : ['text-gray-900'], 
        // Selected state
        (this.multiple
            ? Array.isArray(this.value) && this.value.includes(option.value)
            : this.value === option.value) ? ['bg-blue-50 text-blue-900'] : [])}"
                                        @click=${() => this.selectOption(option)}
                                        @mouseenter=${() => this._focusedIndex = index}>
                                        <div class="flex items-center justify-between">
                                            <span>${option.label}</span>
                                            ${(this.multiple
            ? Array.isArray(this.value) && this.value.includes(option.value)
            : this.value === option.value) ? html `
                                                <lucide-icon name="Check" cls="w-4 h-4 text-blue-600"></lucide-icon>
                                            ` : nothing}
                                        </div>
                                    </li>
                                `)}
                            </ul>
                        </div>
                    ` : nothing}
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
], BlnAutocompleteSelect.prototype, "label", void 0);
__decorate([
    property({ attribute: "corner-hint" })
], BlnAutocompleteSelect.prototype, "cornerHint", void 0);
__decorate([
    property()
], BlnAutocompleteSelect.prototype, "hint", void 0);
__decorate([
    property()
], BlnAutocompleteSelect.prototype, "name", void 0);
__decorate([
    property()
], BlnAutocompleteSelect.prototype, "placeholder", void 0);
__decorate([
    property({ attribute: "search-placeholder" })
], BlnAutocompleteSelect.prototype, "searchPlaceholder", void 0);
__decorate([
    property({ attribute: "value" })
], BlnAutocompleteSelect.prototype, "value", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnAutocompleteSelect.prototype, "disabled", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnAutocompleteSelect.prototype, "required", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnAutocompleteSelect.prototype, "multiple", void 0);
__decorate([
    property()
], BlnAutocompleteSelect.prototype, "size", void 0);
__decorate([
    property()
], BlnAutocompleteSelect.prototype, "class", void 0);
__decorate([
    property({ attribute: "is-valid", reflect: true, converter: booleanStringFalseConverter })
], BlnAutocompleteSelect.prototype, "isValid", void 0);
__decorate([
    property({ attribute: "retro-design", reflect: true, converter: booleanStringFalseConverter })
], BlnAutocompleteSelect.prototype, "retroDesign", void 0);
__decorate([
    property({ attribute: "aria-label" })
], BlnAutocompleteSelect.prototype, "ariaLabel", void 0);
__decorate([
    property({ attribute: "aria-labelledby" })
], BlnAutocompleteSelect.prototype, "ariaLabelledby", void 0);
__decorate([
    property({ attribute: "aria-describedby" })
], BlnAutocompleteSelect.prototype, "ariaDescribedby", void 0);
__decorate([
    property({ attribute: "min-search-chars", type: Number })
], BlnAutocompleteSelect.prototype, "minSearchChars", void 0);
__decorate([
    property({ attribute: "no-results-text" })
], BlnAutocompleteSelect.prototype, "noResultsText", void 0);
__decorate([
    property({ attribute: "loading-text" })
], BlnAutocompleteSelect.prototype, "loadingText", void 0);
__decorate([
    property({ attribute: false })
], BlnAutocompleteSelect.prototype, "options", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_searchTerm", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_isOpen", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_filteredOptions", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_focusedIndex", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_isValidSet", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_comboboxId", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_listboxId", void 0);
__decorate([
    state()
], BlnAutocompleteSelect.prototype, "_hintId", void 0);
BlnAutocompleteSelect = __decorate([
    customElement("bln-autocomplete-select")
], BlnAutocompleteSelect);
export { BlnAutocompleteSelect };
