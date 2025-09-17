import {customElement, property, state} from 'lit/decorators.js';
import {html, nothing} from 'lit';
import TailwindElement from '../app/TailwindElement';
import {booleanStringFalseConverter} from '../utils/converters';

export interface BlnRadioButtonProps {
    // Visual
    label: string;
    hint: string;
    cornerHint: string;

    // Form/behavior
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
    required: boolean;

    // Styling
    size: 'small' | 'medium' | 'large';
    class: string;
    retroDesign: boolean;

    // A11y
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
}

@customElement('bln-radio-button')
export class BlnRadioButton extends TailwindElement {
    // Visual
    @property() label: BlnRadioButtonProps['label'] = '';
    @property() hint: BlnRadioButtonProps['hint'] = '';
    @property({attribute: 'corner-hint'}) cornerHint: BlnRadioButtonProps['cornerHint'] = '';

    // Form/behavior
    @property() name: BlnRadioButtonProps['name'] = '';
    @property() value: BlnRadioButtonProps['value'] = 'on';
    @property({reflect: true, converter: booleanStringFalseConverter}) checked: BlnRadioButtonProps['checked'] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnRadioButtonProps['disabled'] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) required: BlnRadioButtonProps['required'] = false;

    // Styling
    @property() size: BlnRadioButtonProps['size'] = 'medium';
    @property() class: BlnRadioButtonProps['class'] = '';
    @property({attribute: 'retro-design', converter: booleanStringFalseConverter})
    retroDesign: BlnRadioButtonProps['retroDesign'] = false;

    // A11y
    @property({attribute: 'aria-label'}) ariaLabel: BlnRadioButtonProps['ariaLabel'] = '';
    @property({attribute: 'aria-labelledby'}) ariaLabelledby: BlnRadioButtonProps['ariaLabelledby'] = '';
    @property({attribute: 'aria-describedby'}) ariaDescribedby: BlnRadioButtonProps['ariaDescribedby'] = '';

    @state() private _id = `bln-radio-${Math.random().toString(36).slice(2)}`;
    @state() private _hintId = `bln-radio-hint-${Math.random().toString(36).slice(2)}`;

    connectedCallback(): void {
        super.connectedCallback?.();
        // Falls initial checked=true gesetzt ist, sorge für Exklusivität in der Gruppe
        if (this.checked) this.uncheckSiblings();
        // Sync bei Attributänderungen außerhalb
        this.addEventListener('click', this.onHostClick);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback?.();
        this.removeEventListener('click', this.onHostClick);
    }

    private onHostClick = (e: Event) => {
        // Delegiere Klick auf die native Kontrolle, wenn außerhalb geklickt wurde
        if (this.disabled) return;
        const path = (e as any).composedPath?.() ?? [];
        const clickedInput = path.some((n: any) => n instanceof HTMLInputElement);
        if (!clickedInput) {
            const input = this.renderRoot?.querySelector('input[type="radio"]') as HTMLInputElement | null;
            input?.click();
        }
    };

    private onChange = (e: Event) => {
        const input = e.currentTarget as HTMLInputElement;
        const newChecked = input.checked;

        if (newChecked) {
            // Exklusivität sicherstellen
            this.uncheckSiblings();
            this.checked = true;
        } else {
            // Radios können eigentlich nicht unchecked werden, wenn gewählt;
            // belasse checked wie geliefert (Browser-Logik).
            this.checked = false;
        }
        this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value, checked: this.checked }, bubbles: true, composed: true }));
    };

    private uncheckSiblings() {
        if (!this.name) return;
        const root: Document | ShadowRoot = this.getRootNode() as any;
        const nodes = (root as Document).querySelectorAll?.('bln-radio-button') as NodeListOf<BlnRadioButton> | undefined;
        nodes?.forEach((node) => {
            if (node === this) return;
            if (node.name === this.name) node.checked = false;
        });
    }

    protected render() {
        const describedBy = [
            this.ariaDescribedby || '',
            this.hint ? this._hintId : ''
        ].filter(Boolean).join(' ') || undefined;

        const sizeClasses = this.size === 'small' ? 'w-4 h-4' : this.size === 'large' ? 'w-6 h-6' : 'w-5 h-5';
        const ring = this.retroDesign
            ? 'rounded-none focus:ring-0 focus:border-2 focus:border-retro-blue focus:shadow-retro-input-shadow'
            : 'rounded-full focus:ring-2 focus:ring-blue-600 focus:ring-offset-0';

        return html`
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
            ? html`<span id="${this._hintId}" class="block text-xs text-gray-500">${this.hint}</span>`
            : nothing}
        </span>
      </label>
    `;
    }
}
