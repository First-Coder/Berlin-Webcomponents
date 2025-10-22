import {customElement, property, state} from "lit/decorators.js";
import {html} from "lit";
import TailwindElement from "../app/TailwindElement";
import {booleanStringFalseConverter} from "../utils/converters";
import "./LucideIcon";

export interface BlnModalButton {
    id: string;
    label: string;
    variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
    disabled?: boolean;
    primary?: boolean; // Mark as primary button for styling and Enter key handling
}

export interface BlnModalProps {
    title: string;
    text: string;
    inputLabel: string;
    inputPlaceholder: string;
    inputValue: string;
    inputType: string;
    showInput: boolean;
    buttons: BlnModalButton[];
    open: boolean;
    size: "small" | "medium" | "large" | "fullscreen";
    closeOnBackdrop: boolean;
    closeOnEscape: boolean;
    class: string;
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
    /** Optional externe Validierungsfunktion für Input. Nur als Property (nicht als Attribut) setzbar. */
    validator?: (value: string, el: BlnModalDialog) => boolean | { valid: boolean; message?: string };
}

@customElement('bln-modal-dialog')
export class BlnModalDialog extends TailwindElement {
    // Content
    @property() title: BlnModalProps['title'] = "";
    @property() text: BlnModalProps['text'] = "";
    @property({attribute: 'input-label'}) inputLabel: BlnModalProps['inputLabel'] = "";
    @property({attribute: 'input-placeholder'}) inputPlaceholder: BlnModalProps['inputPlaceholder'] = "";
    @property({attribute: 'input-value'}) inputValue: BlnModalProps['inputValue'] = "";
    @property({attribute: 'input-type'}) inputType: BlnModalProps['inputType'] = "text";
    @property({attribute: 'show-input', converter: booleanStringFalseConverter}) showInput: BlnModalProps['showInput'] = false;
    @property({attribute: false}) buttons: BlnModalProps['buttons'] = [];

    // Behavior
    @property({reflect: true, converter: booleanStringFalseConverter}) open: BlnModalProps['open'] = false;
    @property() size: BlnModalProps['size'] = "medium";
    @property({attribute: 'close-on-backdrop', converter: booleanStringFalseConverter}) closeOnBackdrop: BlnModalProps['closeOnBackdrop'] = true;
    @property({attribute: 'close-on-escape', converter: booleanStringFalseConverter}) closeOnEscape: BlnModalProps['closeOnEscape'] = true;
    @property() class: BlnModalProps['class'] = "";

    // A11y
    @property({attribute: 'aria-label'}) ariaLabel: BlnModalProps['ariaLabel'] = "";
    @property({attribute: 'aria-labelledby'}) ariaLabelledby: BlnModalProps['ariaLabelledby'] = "";
    @property({attribute: 'aria-describedby'}) ariaDescribedby: BlnModalProps['ariaDescribedby'] = "";

    /** Externe Validierungsfunktion: nur als Property setzbar (attribute: false). */
    @property({attribute: false}) validator?: BlnModalProps['validator'];

    // Internal state
    @state() private _dialogId = `bln-modal-${Math.random().toString(36).slice(2)}`;
    @state() private _titleId = `bln-modal-title-${Math.random().toString(36).slice(2)}`;
    @state() private _textId = `bln-modal-text-${Math.random().toString(36).slice(2)}`;
    @state() private _inputId = `bln-modal-input-${Math.random().toString(36).slice(2)}`;
    @state() private _previousFocus: Element | null = null;
    @state() private _inputError = "";
    @state() private _inputValid: boolean | undefined = undefined;

    protected willUpdate(changed: Map<string, any>) {
        if (changed.has('open')) {
            if (this.open) {
                this.handleOpen();
            } else {
                this.handleClose();
            }
        }
        if (changed.has('inputValue')) {
            this.runInputValidation();
        }
    }

    private handleOpen() {
        // Store previously focused element
        this._previousFocus = document.activeElement;
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        
        // Focus management will be handled in updated()
        this.dispatchEvent(new CustomEvent('open', {
            detail: { inputValue: this.inputValue },
            bubbles: true,
            composed: true
        }));
    }

    private handleClose() {
        // Restore background scrolling
        document.body.style.overflow = '';
        
        // Restore focus to previous element
        if (this._previousFocus && this._previousFocus instanceof HTMLElement) {
            this._previousFocus.focus();
        }
        
        this.dispatchEvent(new CustomEvent('close', {
            detail: { inputValue: this.inputValue },
            bubbles: true,
            composed: true
        }));
    }

    protected updated(changed: Map<string, any>) {
        super.updated(changed);
        
        if (changed.has('open') && this.open) {
            // Focus first focusable element after modal opens
            this.updateComplete.then(() => {
                this.focusFirstElement();
            });
        }
    }

    private focusFirstElement() {
        if (!this.open) return;
        
        const focusableElements = this.shadowRoot?.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
        }
    }

    private handleBackdropClick = (e: MouseEvent) => {
        if (!this.closeOnBackdrop) return;
        
        // Only close if clicking the backdrop itself, not child elements
        if (e.target === e.currentTarget) {
            this.closeModal();
        }
    };

    private handleKeyDown = (e: KeyboardEvent) => {
        if (!this.open) return;

        switch (e.key) {
            case 'Escape':
                if (this.closeOnEscape) {
                    e.preventDefault();
                    this.closeModal();
                }
                break;
            case 'Tab':
                this.handleTabNavigation(e);
                break;
            case 'Enter':
                this.handleEnterKey(e);
                break;
        }
    };

    private handleTabNavigation(e: KeyboardEvent) {
        const focusableElements = Array.from(
            this.shadowRoot?.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ) || []
        ) as HTMLElement[];

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab (backwards)
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab (forwards)
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    private handleEnterKey(e: KeyboardEvent) {
        // If Enter is pressed and we're not in an input field, trigger primary button
        if (e.target instanceof HTMLInputElement) return;
        
        const primaryButton = this.buttons.find(btn => btn.primary);
        if (primaryButton) {
            e.preventDefault();
            this.handleButtonClick(primaryButton);
        }
    }

    private handleInputChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        this.inputValue = input.value;
        this.runInputValidation();
        
        this.dispatchEvent(new CustomEvent('input-change', {
            detail: { value: this.inputValue, valid: this._inputValid },
            bubbles: true,
            composed: true
        }));
    };

    private runInputValidation() {
        if (!this.validator || !this.showInput) {
            this._inputError = "";
            this._inputValid = undefined;
            return;
        }

        const value = this.inputValue || '';
        try {
            const res = this.validator(value, this as any);
            const result = typeof res === 'boolean' ? { valid: res } : res ?? { valid: true };
            this._inputValid = result.valid;
            this._inputError = (!result.valid && result.message) ? result.message : '';
        } catch (e) {
            this._inputValid = false;
            this._inputError = 'Ungültiger Wert';
        }
    }

    private handleButtonClick = (button: BlnModalButton) => {
        if (button.disabled) return;

        // Validate input before allowing certain actions
        if (this.showInput && button.primary && this.validator) {
            this.runInputValidation();
            if (this._inputValid === false) {
                return; // Don't proceed if validation fails
            }
        }

        this.dispatchEvent(new CustomEvent('button-click', {
            detail: { 
                buttonId: button.id, 
                button: button, 
                inputValue: this.inputValue,
                inputValid: this._inputValid
            },
            bubbles: true,
            composed: true
        }));
    };

    public closeModal() {
        this.open = false;
    }

    public openModal() {
        this.open = true;
    }

    private getModalSizeClasses() {
        const baseClasses = ['bg-white rounded-lg shadow-xl transform transition-all'];
        
        switch (this.size) {
            case 'small':
                return [...baseClasses, 'max-w-sm w-full mx-4'];
            case 'medium':
                return [...baseClasses, 'max-w-md w-full mx-4'];
            case 'large':
                return [...baseClasses, 'max-w-2xl w-full mx-4'];
            case 'fullscreen':
                return [...baseClasses, 'w-full h-full mx-4 my-4 max-w-none rounded-none'];
            default:
                return [...baseClasses, 'max-w-md w-full mx-4'];
        }
    }

    private getButtonVariantClasses(variant: string = 'outline', primary: boolean = false) {
        if (primary && variant === 'outline') {
            variant = 'solid'; // Primary buttons should be solid by default
        }
        
        const baseClasses = ['px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2'];
        
        switch (variant) {
            case 'solid':
                return [...baseClasses, 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'];
            case 'outline':
                return [...baseClasses, 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'];
            case 'ghost':
                return [...baseClasses, 'text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'];
            case 'soft':
                return [...baseClasses, 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'];
            case 'link':
                return [...baseClasses, 'text-blue-600 underline hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'];
            default:
                return [...baseClasses, 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'];
        }
    }

    protected render() {
        if (!this.open) return html``;

        const ariaLabelledby = this.ariaLabelledby || (this.title ? this._titleId : undefined);
        const ariaDescribedby = this.ariaDescribedby || (this.text ? this._textId : undefined);
        
        return html`
            <!-- Modal Backdrop -->
            <div 
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                @click="${this.handleBackdropClick}"
                @keydown="${this.handleKeyDown}"
            >
                <!-- Modal Dialog -->
                <div
                    id="${this._dialogId}"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="${ariaLabelledby || nothing}"
                    aria-describedby="${ariaDescribedby || nothing}"
                    aria-label="${this.ariaLabel || nothing}"
                    class="${this.cn(...this.getModalSizeClasses(), this.class)}"
                    @click="${(e: Event) => e.stopPropagation()}"
                >
                    <!-- Header -->
                    ${this.title ? html`
                        <div class="px-6 py-4 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h2 id="${this._titleId}" class="text-lg font-semibold text-gray-900">
                                    ${this.title}
                                </h2>
                                ${this.closeOnEscape ? html`
                                    <button
                                        type="button"
                                        @click="${this.closeModal}"
                                        class="text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded"
                                        aria-label="Dialog schließen"
                                    >
                                        <lucide-icon name="X" cls="w-5 h-5"></lucide-icon>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Body -->
                    <div class="px-6 py-4">
                        ${this.text ? html`
                            <p id="${this._textId}" class="text-gray-700 mb-4">
                                ${this.text}
                            </p>
                        ` : ''}

                        ${this.showInput ? html`
                            <div class="mb-4">
                                ${this.inputLabel ? html`
                                    <label for="${this._inputId}" class="block text-sm font-medium text-gray-700 mb-2">
                                        ${this.inputLabel}
                                    </label>
                                ` : ''}
                                <input
                                    id="${this._inputId}"
                                    type="${this.inputType}"
                                    class="${this.cn(
                                        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
                                        'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600',
                                        'disabled:opacity-50 disabled:cursor-not-allowed',
                                        this._inputValid === false ? 'border-red-500 focus:ring-red-600 focus:border-red-600' : '',
                                        this._inputValid === true ? 'border-teal-500 focus:ring-teal-600 focus:border-teal-600' : ''
                                    )}"
                                    placeholder="${this.inputPlaceholder}"
                                    .value="${this.inputValue}"
                                    @input="${this.handleInputChange}"
                                    @change="${this.handleInputChange}"
                                    aria-invalid="${this._inputValid === false ? 'true' : 'false'}"
                                    aria-describedby="${this._inputError ? `${this._inputId}-error` : nothing}"
                                />
                                ${this._inputError ? html`
                                    <p id="${this._inputId}-error" class="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                                        ${this._inputError}
                                    </p>
                                ` : ''}
                            </div>
                        ` : ''}

                        <!-- Slot for custom content -->
                        <slot></slot>
                    </div>

                    <!-- Footer with buttons -->
                    ${this.buttons.length > 0 ? html`
                        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                            ${this.buttons.map(button => html`
                                <button
                                    type="button"
                                    ?disabled="${button.disabled}"
                                    class="${this.cn(...this.getButtonVariantClasses(button.variant, button.primary))}"
                                    @click="${() => this.handleButtonClick(button)}"
                                >
                                    ${button.label}
                                </button>
                            `)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        // Add global event listeners when component is connected
        document.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up global event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Restore body overflow if modal was open
        if (this.open) {
            document.body.style.overflow = '';
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'bln-modal-dialog': BlnModalDialog;
    }
}

const nothing = undefined;