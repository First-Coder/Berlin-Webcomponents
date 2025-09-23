import {customElement, property, state} from "lit/decorators.js";
import {html, nothing, TemplateResult} from "lit";
import TailwindElement from "../app/TailwindElement";
import {booleanStringFalseConverter} from "../utils/converters";
import "./LucideIcon";
import type {BlnSelectOption} from "./BlnSelect";

export interface BlnAutocompleteSelectProps {
    label: string;
    hint: string;
    cornerHint: string;
    name: string;
    placeholder: string;
    searchPlaceholder: string;
    value: string | string[];
    disabled: boolean;
    required: boolean;
    multiple: boolean;
    size: "small" | "medium" | "large";
    class: string;
    isValid: boolean | undefined;
    retroDesign: boolean;
    options: BlnSelectOption[];
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
    minSearchChars: number;
    noResultsText: string;
    loadingText: string;
}

@customElement("bln-autocomplete-select")
export class BlnAutocompleteSelect extends TailwindElement {
    // Visual Meta
    @property() label: BlnAutocompleteSelectProps["label"] = "";
    @property({attribute: "corner-hint"}) cornerHint: BlnAutocompleteSelectProps["cornerHint"] = "";
    @property() hint: BlnAutocompleteSelectProps["hint"] = "";

    // Form/Behavior
    @property() name: BlnAutocompleteSelectProps["name"] = "";
    @property() placeholder: BlnAutocompleteSelectProps["placeholder"] = "";
    @property({attribute: "search-placeholder"}) searchPlaceholder: BlnAutocompleteSelectProps["searchPlaceholder"] = "Suchen...";
    @property({attribute: "value"}) value: BlnAutocompleteSelectProps["value"] = "";
    @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnAutocompleteSelectProps["disabled"] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) required: BlnAutocompleteSelectProps["required"] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) multiple: BlnAutocompleteSelectProps["multiple"] = false;

    // Sizing/Styles
    @property() size: BlnAutocompleteSelectProps["size"] = "medium";
    @property() class: BlnAutocompleteSelectProps["class"] = "";
    @property({attribute: "is-valid", reflect: true, converter: booleanStringFalseConverter}) isValid: BlnAutocompleteSelectProps["isValid"] = undefined;
    @property({attribute: "retro-design", reflect: true, converter: booleanStringFalseConverter}) retroDesign: BlnAutocompleteSelectProps["retroDesign"] = false;

    // A11y
    @property({attribute: "aria-label"}) ariaLabel: BlnAutocompleteSelectProps["ariaLabel"] = "";
    @property({attribute: "aria-labelledby"}) ariaLabelledby: BlnAutocompleteSelectProps["ariaLabelledby"] = "";
    @property({attribute: "aria-describedby"}) ariaDescribedby: BlnAutocompleteSelectProps["ariaDescribedby"] = "";

    // Autocomplete specific
    @property({attribute: "min-search-chars", type: Number}) minSearchChars: BlnAutocompleteSelectProps["minSearchChars"] = 1;
    @property({attribute: "no-results-text"}) noResultsText: BlnAutocompleteSelectProps["noResultsText"] = "Keine Ergebnisse gefunden";
    @property({attribute: "loading-text"}) loadingText: BlnAutocompleteSelectProps["loadingText"] = "Laden...";

    // Options (programmatisch gesetzt)
    @property({attribute: false}) options: BlnAutocompleteSelectProps["options"] = [];

    // Internal state
    @state() private _searchTerm = "";
    @state() private _isOpen = false;
    @state() private _filteredOptions: BlnSelectOption[] = [];
    @state() private _focusedIndex = -1;
    @state() private _isValidSet = false;

    // Internal IDs
    @state() private _comboboxId = `bln-autocomplete-${Math.random().toString(36).slice(2)}`;
    @state() private _listboxId = `bln-autocomplete-listbox-${Math.random().toString(36).slice(2)}`;
    @state() private _hintId = `bln-autocomplete-hint-${Math.random().toString(36).slice(2)}`;

    protected willUpdate(changed: Map<string, any>) {
        if (changed.has('isValid')) this._isValidSet = true;
        if (changed.has('options') || changed.has('_searchTerm')) {
            this.updateFilteredOptions();
        }
    }

    private updateFilteredOptions() {
        if (!this._searchTerm || this._searchTerm.length < this.minSearchChars) {
            this._filteredOptions = [...this.options];
        } else {
            const searchLower = this._searchTerm.toLowerCase();
            this._filteredOptions = this.options.filter(option => 
                option.label.toLowerCase().includes(searchLower) ||
                option.value.toLowerCase().includes(searchLower)
            );
        }
    }

    private onSearchInput = (e: Event) => {
        const input = e.currentTarget as HTMLInputElement;
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

    private onSearchKeydown = (e: KeyboardEvent) => {
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

    private focusNextOption() {
        if (this._filteredOptions.length === 0) return;
        this._focusedIndex = (this._focusedIndex + 1) % this._filteredOptions.length;
    }

    private focusPreviousOption() {
        if (this._filteredOptions.length === 0) return;
        this._focusedIndex = this._focusedIndex <= 0 
            ? this._filteredOptions.length - 1 
            : this._focusedIndex - 1;
    }

    private selectOption(option: BlnSelectOption) {
        if (option.disabled) return;

        if (this.multiple) {
            const currentValues = Array.isArray(this.value) ? this.value : [];
            if (currentValues.includes(option.value)) {
                this.value = currentValues.filter(v => v !== option.value);
            } else {
                this.value = [...currentValues, option.value];
            }
        } else {
            this.value = option.value;
            this._searchTerm = option.label;
            this.closeDropdown();
        }

        this.dispatchEvent(new Event("change", {bubbles: true, composed: true}));
        this.dispatchEvent(new Event("input", {bubbles: true, composed: true}));
    }

    private closeDropdown() {
        this._isOpen = false;
        this._focusedIndex = -1;
    }

    private onInputBlur = (e: FocusEvent) => {
        // Close dropdown after a short delay to allow option clicks
        setTimeout(() => {
            if (!this.shadowRoot?.activeElement) {
                this.closeDropdown();
            }
        }, 150);
    };

    private getDisplayValue(): string {
        if (this.multiple) {
            const values = Array.isArray(this.value) ? this.value : [];
            if (values.length === 0) return "";
            if (values.length === 1) {
                const option = this.options.find(o => o.value === values[0]);
                return option?.label || values[0];
            }
            return `${values.length} Elemente ausgewählt`;
        } else {
            if (!this.value) return "";
            const stringValue = Array.isArray(this.value) ? this.value[0] : this.value;
            const option = this.options.find(o => o.value === stringValue);
            return option?.label || stringValue;
        }
    }

    private isSelectionValid(): boolean | undefined {
        const hasValue = Array.isArray(this.value)
            ? this.value.length > 0
            : (this.value ?? '') !== '';
        return (this._isValidSet && hasValue) ? this.isValid : undefined;
    }

    private getSelectedOptions(): BlnSelectOption[] {
        if (!this.multiple || !Array.isArray(this.value)) return [];
        return this.options.filter(option => this.value.includes(option.value));
    }

    private removeSelectedOption(optionValue: string, e: Event) {
        e.stopPropagation();
        if (Array.isArray(this.value)) {
            this.value = this.value.filter(v => v !== optionValue);
            this.dispatchEvent(new Event("change", {bubbles: true, composed: true}));
        }
    }

    protected render(): TemplateResult {
        const describedBy = [
            this.ariaDescribedby || "",
            this.hint ? this._hintId : ""
        ].filter(Boolean).join(" ") || undefined;

        const invalid = this.isSelectionValid();
        const displayValue = this.getDisplayValue();
        const showResults = this._isOpen && this._searchTerm.length >= this.minSearchChars;

        return html`
            <div class="max-w-sm relative">
                ${this.label
                    ? html`
                        <div class="flex flex-wrap justify-between items-center gap-2">
                            <label for="${this._comboboxId}" class="${this.cn(
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

                <!-- Selected items (multiple mode) -->
                ${this.multiple && Array.isArray(this.value) && this.value.length > 0 ? html`
                    <div class="mb-2 flex flex-wrap gap-1">
                        ${this.getSelectedOptions().map(option => html`
                            <span class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                                ${option.label}
                                <button
                                    type="button"
                                    @click=${(e: Event) => this.removeSelectedOption(option.value, e)}
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
                            this.size === 'small' ? ['py-1.5 sm:py-2 px-3'] : '',
                            this.size === 'medium' ? ['py-2.5 sm:py-3 px-4'] : '',
                            this.size === 'large' ? ['p-3.5 sm:p-5'] : '',
                            // Retro vs Modern
                            this.retroDesign
                                ? ['rounded-none focus:border-retro-blue focus:shadow-retro-input-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white']
                                : ['rounded-md focus:border-blue-600 focus-visible:outline-none'],
                            // Base
                            ['block w-full border-2 sm:text-sm bg-white'],
                            // Border colors
                            (Array.isArray(this.value) ? this.value.length > 0 : (this.value ?? '') !== '' ) ? ['border-gray-200'] : ['border-black'],
                            ['disabled:opacity-50 disabled:pointer-events-none'],
                            invalid === true ? ['border-teal-500 focus:border-teal-400'] : '',
                            invalid === false ? ['border-red-500 focus:border-red-300'] : '',
                            this.class
                        )}"
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
                            ? html`<lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
                            : nothing}
                        ${invalid === false
                            ? html`<lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
                            : nothing}
                        <div class="ml-2">
                            <lucide-icon name="Search" cls="w-4 h-4 text-gray-400"></lucide-icon>
                        </div>
                    </div>

                    <!-- Dropdown -->
                    ${showResults ? html`
                        <div class="${this.cn(
                            ['absolute z-50 w-full mt-1 bg-white border border-gray-300 max-h-60 overflow-auto'],
                            this.retroDesign 
                                ? ['border-2 border-black shadow-retro'] 
                                : ['rounded-md shadow-lg']
                        )}">
                            <ul 
                                id=${this._listboxId}
                                role="listbox"
                                aria-multiselectable=${this.multiple ? 'true' : 'false'}
                                class="py-1">
                                ${this._filteredOptions.length === 0 ? html`
                                    <li class="px-3 py-2 text-gray-500 text-sm">${this.noResultsText}</li>
                                ` : this._filteredOptions.map((option, index) => html`
                                    <li
                                        id="option-${index}"
                                        role="option"
                                        aria-selected=${this.multiple 
                                            ? Array.isArray(this.value) && this.value.includes(option.value) ? 'true' : 'false'
                                            : this.value === option.value ? 'true' : 'false'}
                                        ?aria-disabled=${option.disabled}
                                        class="${this.cn(
                                            ['px-3 py-2 cursor-pointer text-sm'],
                                            this._focusedIndex === index ? ['bg-blue-100'] : ['hover:bg-gray-100'],
                                            option.disabled ? ['text-gray-400 cursor-not-allowed'] : ['text-gray-900'],
                                            // Selected state
                                            (this.multiple 
                                                ? Array.isArray(this.value) && this.value.includes(option.value)
                                                : this.value === option.value) ? ['bg-blue-50 text-blue-900'] : []
                                        )}"
                                        @click=${() => this.selectOption(option)}
                                        @mouseenter=${() => this._focusedIndex = index}>
                                        <div class="flex items-center justify-between">
                                            <span>${option.label}</span>
                                            ${(this.multiple 
                                                ? Array.isArray(this.value) && this.value.includes(option.value)
                                                : this.value === option.value) ? html`
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
                    ? html`<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>`
                    : ""}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'bln-autocomplete-select': BlnAutocompleteSelect;
    }
}