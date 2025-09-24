import {customElement, property, state} from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import {html} from "lit";
import {booleanStringFalseConverter} from "../utils/converters";

import './LucideIcon';

export interface BlnTextareaProps {
    label: string;
    name: string;
    placeholder: string;
    hint: string;
    error: string;
    value: string;
    disabled: boolean;
    required: boolean;
    readonly: boolean;
    class: string;
    size: 'small' | 'medium' | 'large';
    cornerHint: string;
    isValid: boolean | undefined;
    retroDesign: boolean;
    minlength: number;
    maxlength: number;
    rows: number;
    cols: number;
    wrap: 'soft' | 'hard' | 'off';
    resize: 'none' | 'both' | 'horizontal' | 'vertical';
    autocomplete: string;
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
    /** Optional externe Validierungsfunktion. Nur als Property (nicht als Attribut) setzbar. */
    validator?: (value: string, el: BlnTextarea) => boolean | { valid: boolean; message?: string };
}

@customElement('bln-textarea')
export class BlnTextarea extends TailwindElement {
    // Visual/Meta
    @property() label: BlnTextareaProps['label'] = "";
    @property({attribute: 'corner-hint'}) cornerHint: BlnTextareaProps['cornerHint'] = "";
    @property() hint: BlnTextareaProps['hint'] = "";
    @property() error: BlnTextareaProps['error'] = "";

    // Form/Behavior
    @property() name: BlnTextareaProps['name'] = "";
    @property() value: BlnTextareaProps['value'] = "";
    @property() placeholder: BlnTextareaProps['placeholder'] = "";
    @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnTextareaProps['disabled'] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) required: BlnTextareaProps['required'] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) readonly: BlnTextareaProps['readonly'] = false;
    @property({attribute: 'minlength'}) minlength: BlnTextareaProps['minlength'] = undefined as any;
    @property({attribute: 'maxlength'}) maxlength: BlnTextareaProps['maxlength'] = undefined as any;
    @property() rows: BlnTextareaProps['rows'] = 4;
    @property() cols: BlnTextareaProps['cols'] = undefined as any;
    @property() wrap: BlnTextareaProps['wrap'] = 'soft';
    @property() resize: BlnTextareaProps['resize'] = 'vertical';
    @property() autocomplete: BlnTextareaProps['autocomplete'] = "";
    /** Externe Validierungsfunktion: nur als Property setzbar (attribute: false). */
    @property({attribute: false}) validator?: BlnTextareaProps['validator'];

    // Sizing/Styles
    @property() size: BlnTextareaProps['size'] = "medium";
    @property() class: BlnTextareaProps['class'] = "";
    @property({attribute: 'is-valid', reflect: true, converter: booleanStringFalseConverter}) isValid: BlnTextareaProps['isValid'] = undefined;
    @property({attribute: 'retro-design', reflect: true, converter: booleanStringFalseConverter}) retroDesign: BlnTextareaProps['retroDesign'] = false;

    // A11y
    @property({attribute: 'aria-label'}) ariaLabel: BlnTextareaProps['ariaLabel'] = "";
    @property({attribute: 'aria-labelledby'}) ariaLabelledby: BlnTextareaProps['ariaLabelledby'] = "";
    @property({attribute: 'aria-describedby'}) ariaDescribedby: BlnTextareaProps['ariaDescribedby'] = "";

    // internal ids
    @state() private _textareaId = `bln-textarea-${Math.random().toString(36).slice(2)}`;
    @state() private _hintId = `bln-textarea-hint-${Math.random().toString(36).slice(2)}`;
    @state() private _errorId = `bln-textarea-error-${Math.random().toString(36).slice(2)}`;
    @state() private _isValidSet = false;

    private onInput = (e: Event) => {
        const textarea = e.currentTarget as HTMLTextAreaElement;
        this.value = textarea.value;
        // Run external validation if provided
        this.runValidation();
        this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    };

    private onChange = (_e: Event) => {
        this.runValidation();
        this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    };

    protected willUpdate(changed: Map<string, any>) {
        if (changed.has('isValid')) this._isValidSet = true;
        if (changed.has('value')) {
            // When value changes programmatically, also re-run validation if provided
            this.runValidation();
        }
    }

    protected render() {
        const describedBy = [
            this.ariaDescribedby || '',
            this.hint ? this._hintId : '',
            this.error ? this._errorId : ''
        ].filter(Boolean).join(' ') || undefined;

        // Determine validity state only after consumer has explicitly set isValid
        // Additionally, when there is no value yet, keep a neutral state (no green/red)
        const hasValue = (this.value ?? '') !== '';
        const invalid = this._isValidSet && hasValue ? !this.isValid : undefined;

        const resizeClass = {
            'none': 'resize-none',
            'both': 'resize',
            'horizontal': 'resize-x',
            'vertical': 'resize-y'
        }[this.resize] || 'resize-y';

        return html`
      <div class="max-w-sm">
        ${this.label || this.cornerHint ? html`
          <div class="flex flex-wrap justify-between items-center gap-2">
            ${this.label ? html`<label for="${this._textareaId}" class="${this.cn(
                this.retroDesign ? ['font-bold text-black'] : ['text-sm font-medium text-gray-700'],
                ['block mb-2']
            )}">${this.label}</label>` : ''}
            ${this.cornerHint ? html`<span class="block mb-2 text-sm text-gray-500 dark:text-neutral-500">${this.cornerHint}</span>` : ''}
          </div>` : ''}

        <div class="relative">
          <textarea
            id="${this._textareaId}"
            name="${this.name}"
            class="${this.cn(
                // Sizes
                this.size === 'small' ? ['py-1.5 sm:py-2 px-3 text-xs'] : '',
                this.size === 'medium' ? ['py-2.5 sm:py-3 px-4 text-sm'] : '',
                this.size === 'large' ? ['p-3.5 sm:p-5 text-base'] : '',
                // Retro
                this.retroDesign
                    ? ['rounded-none focus:border-retro-blue focus:shadow-retro-input-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white']
                    : ['rounded-md focus:border-blue-600 focus-visible:outline-none'],
                // Other...
                ['block w-full border-2'],
                hasValue ? ['border-gray-200'] : ['border-black'],
                ['disabled:opacity-50 disabled:pointer-events-none'],
                invalid === false ? ['border-teal-500 focus:border-teal-400'] : '',
                invalid === true ? ['border-red-500 focus:border-red-300'] : '',
                [resizeClass],
                this.class,
            )}"
            .value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            rows=${this.rows}
            cols=${this.cols ?? nothing}
            wrap=${this.wrap}
            minlength=${this.minlength ?? nothing}
            maxlength=${this.maxlength ?? nothing}
            autocomplete=${this.autocomplete || nothing}
            aria-invalid=${invalid === undefined ? 'false' : String(invalid)}
            aria-describedby=${describedBy || nothing}
            aria-label=${this.ariaLabel || nothing}
            aria-labelledby=${this.ariaLabelledby || (this.label ? undefined : nothing)}
            placeholder="${this.placeholder}"
            @input=${this.onInput}
            @change=${this.onChange}
            @focus=${(e: Event) => this.dispatchEvent(new Event('focus', {bubbles: true, composed: true}))}
            @blur=${(e: Event) => this.dispatchEvent(new Event('blur', {bubbles: true, composed: true}))}
            @keydown=${(e: KeyboardEvent) => this.dispatchEvent(new CustomEvent('keydown', {detail: {key: e.key}, bubbles: true, composed: true}))}
            @keyup=${(e: KeyboardEvent) => this.dispatchEvent(new CustomEvent('keyup', {detail: {key: e.key}, bubbles: true, composed: true}))}
          ></textarea>
          <div class="absolute top-3 end-0 flex items-start pointer-events-none pe-3">
            ${invalid === false
                ? html`<lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
                : nothing}
            ${invalid === true
                ? html`<lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
                : nothing}
          </div>
        </div>

        ${this.hint ? html`<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>` : ''}
        ${this.error ? html`<span id="${this._errorId}" class="mt-1 text-sm text-red-600" role="alert" aria-live="polite">${this.error}</span>` : ''}
      </div>`;
    }

    private runValidation() {
        if (!this.validator) return;
        const v = (this.value ?? '');
        // Neutral state for empty unless validator explicitly handles it
        if (v === '') {
            // Clear validity and error for neutral display
            this.isValid = undefined as any;
            this.error = '' as any;
            return;
        }
        try {
            const res = this.validator(v, this as any);
            const result = typeof res === 'boolean' ? { valid: res } : res ?? { valid: true };
            this.isValid = result.valid as any;
            // If invalid and message provided, set error; otherwise clear error to avoid stale messages
            this.error = (!result.valid && result.message) ? result.message : (!result.valid ? (this.error || '') : '');
            // Ensure we show validity icons once validator ran
            this._isValidSet = true;
            this.dispatchEvent(new CustomEvent('validitychange', { detail: { isValid: this.isValid, message: this.error }, bubbles: true, composed: true }));
        } catch (e) {
            // On validator error, do not break UI; mark invalid with generic message
            this.isValid = false as any;
            this.error = this.error || 'Ungültiger Wert';
            this._isValidSet = true;
        }
    }
}

const nothing = undefined;