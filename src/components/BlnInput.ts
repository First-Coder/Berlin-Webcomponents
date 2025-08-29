import {customElement, property} from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import {html} from "lit";
import {booleanStringFalseConverter} from "../utils/converters";


import './LucideIcon';

export interface BlnInputProps {
    label: string;
    placeholder: string;
    hint: string;
    value: string;
    disabled: boolean;
    class: string;
    type: string;
    size: 'small' | 'medium' | 'large';
    cornerHint: string;
    isValid: boolean;
    retroDesign: boolean;
}

@customElement('bln-input')
export class BlnInput extends TailwindElement {
    /**
     * Represents the placeholder text to be displayed in an input field
     * when it is empty and unfocused.
     *
     * This property is commonly used to provide a short hint or
     * description about the expected input format or purpose of the field.
     *
     * @type {string}
     */
    @property() placeholder: BlnInputProps['placeholder'] = "";

    /**
     * Indicates whether the input component should be disabled.
     * A disabled input is non-interactive and has a visual indication of its disabled state.
     *
     * @type {boolean}
     * @default false
     */
    @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnInputProps['disabled'] = false;

    /**
     * Represents a hint or descriptive text for the input field.
     * This property is typically used to provide additional context or guidance
     * to the users about the purpose or expected content of the input field.
     * It is displayed alongside the input field and does not affect its functionality.
     */
    @property() hint: BlnInputProps['hint'] = "";

    /**
     * Represents the label for a `BlnInputProps` component.
     * This label is utilized to display descriptive text for the input field.
     * It provides contextual information for the user about what the input is for.
     * The value should be a string.
     */
    @property() label: BlnInputProps['label'] = "";

    /**
     * Represents the value of the input field in the BlnInputProps.
     * Can be used to retrieve or set the text content of the input.
     * By default, it is initialized as an empty string.
     *
     * It is expected to be a string value which may represent user input
     * or a pre-defined default input value.
     */
    @property() value: BlnInputProps['value'] = "";

    /**
     * Represents the CSS class to be applied to a BlnInput component.
     *
     * This property allows customization of the CSS styling by providing
     * one or more class names as a string. It can be used to apply
     * additional styling or override default styles.
     *
     * The default value is an empty string, indicating no class has been assigned.
     */
    @property() class: BlnInputProps['class'] = "";


    /**
     * Defines the type of the input element within the BlnInputProps.
     * This specifies the behavior and the type of data the input field accepts.
     * Common values include "text", "password", "email", etc.
     */
    @property() type: BlnInputProps['type'] = "text";

    /**
     * The size property that defines the size of the input component.
     * It is of type 'BlnInputProps["size"]' and determines the visual
     * scale of the input. The default value is "medium".
     */
    @property() size: BlnInputProps['size'] = "medium";

    /**
     * Specifies a hint or additional information to display in the corner of the component.
     * This property is typically used to provide supplementary context or helper information
     * for the component's main functionality.
     *
     * @type {BlnInputProps['cornerHint']}
     */
    @property({attribute: 'corner-hint'}) cornerHint: BlnInputProps['cornerHint'] = "";

    @property({
        attribute: 'is-valid',
        reflect: true,
        converter: booleanStringFalseConverter
    }) isValid: BlnInputProps['isValid'] = false;

    protected render(): unknown {
        return html`
            <div class="max-w-sm">
                ${this.label
                        ? html`
                            <div class="flex flex-wrap justify-between items-center gap-2">
                                <label class="${this.cn(
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
                    <input type="${this.type}"
                           value="${this.value}"
                           ?disabled="${this.disabled}"
                           class="${this.cn(
                                   // Sizes
                                   this.size === 'small' ? ['py-1.5 sm:py-2 px-3'] : '',
                                   this.size === 'medium' ? ['py-2.5 sm:py-3 px-4'] : '',
                                   this.size === 'large' ? ['p-3.5 sm:p-5'] : '',
                                   // Retro
                                   this.retroDesign
                                           ? ['rounded-none focus:border-retro-blue focus:shadow-retro-input-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white']
                                           : ['rounded-md focus:border-blue-600 focus-visible:outline-none'],
                                   // Other...
                                   ['block w-full border-2 border-gray-200 sm:text-sm'],
                                   ['disabled:opacity-50 disabled:pointer-events-none'],
                                   this.isValid && this.hasAttribute('is-valid')
                                           ? ['border-teal-500 focus:border-teal-400']
                                           : '',
                                   !this.isValid && this.hasAttribute('is-valid')
                                           ? ['border-red-500 focus:border-red-300']
                                           : '',
                                   this.class,
                           )}"
                           placeholder="${this.placeholder}"/>
                    <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
                        ${this.isValid && this.hasAttribute('is-valid')
                                ? html`
                                    <lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
                                : ''
                        }
                        ${!this.isValid && this.hasAttribute('is-valid') ?
                                html`
                                    <lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
                                : ''
                        }
                    </div>
                </div>
                ${this.hint ? html`<p class="mt-2 text-sm text-gray-500">${this.hint}</p>` : ""}
            </div>`;
    }
}