import { html } from "lit";
// Ensure components are registered when templates are used
import './BlnButton';
import './BlnSelect';
import './BlnAutocompleteSelect';
import './BlnCheckBox';
import './BlnTreeView';
import './ModernTree';
import './BlnToast';
import './BlnInput';
class FormBuilder {
    constructor() {
        this.fields = [];
        this.validateFunctions = new Map();
        this.asyncValidateFunctions = new Map();
        // default validators
        this.validateFunctions.set('email', (value) => {
            return !value.includes('@') ? 'Falsches Email Format' : '';
        });
        // Passwort: mindestens 5 Zeichen
        this.validateFunctions.set('password', (value) => {
            return value && value.length >= 5 ? '' : 'Passwort zu kurz (mindestens 5 Zeichen)';
        });
        // Number: zwischen 10 und 99 (inklusive)
        this.validateFunctions.set('number', (value) => {
            const n = Number(value);
            if (Number.isNaN(n))
                return 'Wert ist keine Zahl';
            if (n < 10)
                return 'Wert zu niedrig (mindestens 10)';
            if (n > 99)
                return 'Wert zu hoch (maximal 99)';
            return '';
        });
    }
    // Register/override a sync validator
    setCustomValidateFunction(type, func) {
        this.validateFunctions.set(type, func);
        return this;
    }
    // Register/override an async validator
    setCustomValidateFunctionAsync(type, func) {
        this.asyncValidateFunctions.set(type, func);
        return this;
    }
    // Synchronous validation API
    validate(type, value) {
        const func = this.validateFunctions.get(type);
        return func ? func(value) : '';
    }
    // Asynchronous validation API
    async validateAsync(type, value) {
        const asyncFunc = this.asyncValidateFunctions.get(type);
        if (asyncFunc) {
            try {
                return await asyncFunc(value);
            }
            catch (e) {
                return typeof e === 'string' ? e : 'Validierung fehlgeschlagen';
            }
        }
        return Promise.resolve(this.validate(type, value));
    }
    addBlnInput(props = {}) {
        const tpl = html `<bln-input
      .label=${props.label ?? ''}
      .name=${props.name ?? ''}
      .placeholder=${props.placeholder ?? ''}
      .hint=${props.hint ?? ''}
      .error=${props.error ?? ''}
      .value=${props.value ?? ''}
      .disabled=${props.disabled ?? false}
      .required=${props.required ?? false}
      .readonly=${props.readonly ?? false}
      .class=${props.class ?? ''}
      .type=${props.type ?? 'text'}
      .size=${props.size ?? 'medium'}
      .cornerHint=${props.cornerHint ?? ''}
      .isValid=${props.isValid ?? undefined}
      .retroDesign=${props.retroDesign ?? false}
      .minlength=${props.minlength ?? undefined}
      .maxlength=${props.maxlength ?? undefined}
      .pattern=${props.pattern ?? ''}
      .min=${props.min ?? ''}
      .max=${props.max ?? ''}
      .step=${props.step ?? undefined}
      .inputmode=${props.inputmode ?? undefined}
      .autocomplete=${props.autocomplete ?? ''}
      .ariaLabel=${props.ariaLabel ?? ''}
      .ariaLabelledby=${props.ariaLabelledby ?? ''}
      .ariaDescribedby=${props.ariaDescribedby ?? ''}
      .validator=${props.validator ?? undefined}
    ></bln-input>`;
        this.fields.push(tpl);
        return this;
    }
    addButton(text, onClick) {
        this.fields.push(html `<button type="button" @click=${onClick}>${text}</button>`);
        return this;
    }
    // Convenience: add a BlnTree
    addBlnTree(props = {}) {
        const tpl = html `<bln-tree
      .items=${props.items ?? []}
      .selectedIds=${props.selectedIds ?? []}
      .expandedIds=${props.expandedIds ?? []}
      .multiSelect=${props.multiSelect ?? false}
      aria-label=${props.ariaLabel ?? ''}
      aria-labelledby=${props.ariaLabelledby ?? ''}
      aria-describedby=${props.ariaDescribedby ?? ''}
      class=${props.class ?? ''}
    ></bln-tree>`;
        this.fields.push(tpl);
        return this;
    }
    // Convenience: add a BlnCheckbox
    addBlnCheckbox(props = {}) {
        const tpl = html `<bln-checkbox
      .label=${props.label ?? ''}
      .name=${props.name ?? ''}
      .value=${props.value ?? 'on'}
      .checked=${props.checked ?? false}
      .disabled=${props.disabled ?? false}
      .required=${props.required ?? false}
      .hint=${props.hint ?? ''}
      .cornerHint=${props.cornerHint ?? ''}
      .class=${props.class ?? ''}
    ></bln-checkbox>`;
        this.fields.push(tpl);
        return this;
    }
    // Convenience: add a ModernTree
    addModernTree(model, opts = {}) {
        const tpl = html `<modern-tree
      .dataModel=${model}
      .level=${opts.level ?? 0}
    ></modern-tree>`;
        this.fields.push(tpl);
        return this;
    }
    // Convenience: add a BlnToast
    addBlnToast(props = {}) {
        const tpl = html `<bln-toast
      .open=${props.open ?? false}
      .variant=${props.variant ?? 'info'}
      .title=${props.title ?? ''}
      .message=${props.message ?? ''}
      .autoHide=${props.autoHide ?? true}
      .autoHideDelay=${props.autoHideDelay ?? 4000}
      .closeButton=${props.closeButton ?? true}
      .ariaLive=${props.ariaLive ?? 'polite'}
      .ariaAtomicBool=${props.ariaAtomic ?? true}
      .class=${props.class ?? ''}
    ></bln-toast>`;
        this.fields.push(tpl);
        return this;
    }
    // Convenience: add a BlnSelect
    addBlnSelect(props = {}) {
        const tpl = html `<bln-select
      .label=${props.label ?? ''}
      .cornerHint=${props.cornerHint ?? ''}
      .hint=${props.hint ?? ''}
      .name=${props.name ?? ''}
      .placeholder=${props.placeholder ?? ''}
      .value=${props.value ?? ''}
      .disabled=${props.disabled ?? false}
      .required=${props.required ?? false}
      .multiple=${props.multiple ?? false}
      .size=${props.size ?? 'medium'}
      .class=${props.class ?? ''}
      .options=${props.options ?? []}
      .ariaLabel=${props.ariaLabel ?? ''}
      .ariaLabelledby=${props.ariaLabelledby ?? ''}
      .ariaDescribedby=${props.ariaDescribedby ?? ''}
    ></bln-select>`;
        this.fields.push(tpl);
        return this;
    }
    // Convenience: add a BlnAutocompleteSelect
    addBlnAutocompleteSelect(props = {}) {
        const tpl = html `<bln-autocomplete-select
      .label=${props.label ?? ''}
      .cornerHint=${props.cornerHint ?? ''}
      .hint=${props.hint ?? ''}
      .name=${props.name ?? ''}
      .placeholder=${props.placeholder ?? ''}
      .searchPlaceholder=${props.searchPlaceholder ?? 'Suchen...'}
      .value=${props.value ?? ''}
      .disabled=${props.disabled ?? false}
      .required=${props.required ?? false}
      .multiple=${props.multiple ?? false}
      .size=${props.size ?? 'medium'}
      .class=${props.class ?? ''}
      .isValid=${props.isValid ?? undefined}
      .retroDesign=${props.retroDesign ?? false}
      .minSearchChars=${props.minSearchChars ?? 1}
      .noResultsText=${props.noResultsText ?? 'Keine Ergebnisse gefunden'}
      .loadingText=${props.loadingText ?? 'Laden...'}
      .options=${props.options ?? []}
      .ariaLabel=${props.ariaLabel ?? ''}
      .ariaLabelledby=${props.ariaLabelledby ?? ''}
      .ariaDescribedby=${props.ariaDescribedby ?? ''}
    ></bln-autocomplete-select>`;
        this.fields.push(tpl);
        return this;
    }
    // Convenience: add a BlnButton
    addBlnButton(label, props = {}, onClick) {
        const tpl = html `<bln-button
      .variant=${props.variant ?? 'solid'}
      .size=${props.size ?? 'medium'}
      .withStripes=${props.withStripes ?? false}
      .disabled=${props.disabled ?? false}
      .class=${props.class ?? ''}
      .onClick=${onClick}
    >${label}</bln-button>`;
        this.fields.push(tpl);
        return this;
    }
    getFields() {
        return this.fields;
    }
}
export default FormBuilder;
export { FormBuilder };
