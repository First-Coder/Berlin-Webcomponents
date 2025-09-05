
import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues} from "lit";
import tailwindCss from '../styles/tailwind.min.css?raw';
import TailwindElement from "../app/TailwindElement";

import './LucideIcon';

export interface BlnButtonProps {
    variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link' | 'arrow' | 'arrow-red';
    withArrow: boolean,
    withStripes: boolean,
    size?: 'small' | 'medium' | 'large';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    class?: string;
    retroDesign: boolean;
}

@customElement('bln-button')
export class BlnButton extends TailwindElement {
    /**
     * Represents an HTML button element type.
     *
     * The "button" type is used to define a clickable button element in HTML.
     * Buttons of this type are often used for user interaction purposes,
     * such as submitting forms, triggering events, or performing actions via scripts.
     *
     * Characteristics:
     * - Does not have a default behavior, allowing custom actions to be defined.
     * - Commonly associated with event handlers, such as "click" events.
     */
    @property({type: String}) type = "button";


    /**
     * Represents a variable that can store a value of different classes.
     */
    @property({type: String}) class = "";

    /**
     * Represents the variant type for a specific component or functionality.
     * Allows customization or differentiation between styles or behaviors.
     *
     * Possible value: "primary"
     */
    @property({type: String}) variant = "solid";


    /**
     * Represents the size of an item or element.
     * This variable holds a string value indicating the size classification.
     * Commonly used to define or adjust dimensions, layouts, or options.
     * Possible values might include "small", "medium", "large", etc.
     */
    @property({type: String}) size = "medium";


    /**
     * Indicates whether the arrow feature should be enabled or disabled.
     * This variable is a boolean flag that determines the activation state of the arrow feature.
     * When set to `true`, the arrow functionality will be enabled.
     * When set to `false`, the arrow functionality will remain disabled.
     */
    @property({type: Boolean, attribute: "with-arrow"}) withArrow = false;


    /**
     * A boolean variable that determines whether a particular feature or functionality is disabled.
     * If set to `true`, the feature is inactive or unavailable.
     * Defaults to `false`, indicating that the feature is enabled and operational.
     */
    @property({type: Boolean, reflect: true}) disabled = false;

    /**
     * This variable indicates whether a striped effect is applied or not.
     * It is a boolean value that defaults to false, implying that the striped effect
     * is disabled unless explicitly set to true.
     */
    @property({type: Boolean, attribute: "with-stripes"}) withStripes = false;


    /**
     * Represents an optional callback function to handle click events.
     *
     * This function is invoked when a click event occurs. The function
     * receives a single parameter, a `MouseEvent` object, which provides
     * information about the event, such as the target element and event
     * properties.
     *
     * The function should be implemented to define custom behavior for
     * the click action.
     *
     * @param {MouseEvent} e - The mouse event triggered by the click action.
     */
    @property({attribute: false}) onClick?: (e: MouseEvent) => void;

    /**
     * Renders a button with customizable styles and behaviors based on properties such as size, variant, arrow inclusion, and disabled state.
     * The method dynamically constructs the button's classes, applies relevant styles, and optionally renders a right arrow icon based on button configuration.
     */
    renderButton() {
        return html`
            <button class="${this.cn(
                    'transition duration-700 disabled:pointer-events-none',
                    [
                        this.retroDesign
                                ? 'inline-flex border-2 font-semibold border-black bg-white  hover:bg-gray-200'
                                : 'inline-flex items-center gap-x-2 text-sm font-medium rounded border focus:outline-hidden',
                        this.disabled
                                ? 'disabled:cursor-not-allowed disabled:opacity-50'
                                : '',
                        (this.variant === 'solid' || this.variant === null) && !this.retroDesign
                                ? 'bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 border-transparent'
                                : '',
                        this.variant === 'outline' && !this.retroDesign
                                ? 'border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:border-blue-600 focus:text-blue-600'
                                : '',
                        this.variant === 'ghost' && !this.retroDesign
                                ? 'border-transparent text-blue-500 hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800'
                                : '',
                        this.variant === 'soft' && !this.retroDesign
                                ? 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:bg-blue-200'
                                : '',
                        this.variant === 'link'
                                ? this.retroDesign
                                        ? 'border-2 !border-[#e40422] bg-white font-bold hover:!bg-transparent hover:underline'
                                        : 'border-transparent text-blue-500 hover:text-blue-700 focus:text-blue-700'
                                : '',
                        (this.variant === 'arrow' || this.variant === 'arrow-red') && !this.retroDesign
                                ? 'border-transparent hover:text-gray-400 transition duration-700'
                                : ''
                    ]
            )}"
                    ?disabled=${this.disabled}
                    @click=${(e: MouseEvent) => this.onClick?.(e)}>
                <span class="${this.cn([
                    this.size === 'large'
                            ? 'p-4 sm:p-5'
                            : this.size === 'small'
                                    ? 'py-2 px-3'
                                    : 'py-3 px-4',
                    this.variant === 'arrow' || this.variant === 'arrow-red'
                            ? this.retroDesign
                                    ? 'border-r-2 border-black'
                                    : 'pr-1'
                            : '',
                    this.retroDesign
                            ? ''
                            : 'border-transparent',
                ])}"><slot></slot></span>
                ${this.variant === 'arrow' || this.variant === 'arrow-red'
                        ? html`
                            <div class="${this.cn([
                                'w-full flex items-center justify-center',
                                this.variant === 'arrow'
                                        ? this.retroDesign
                                                ? 'bg-black px-3'
                                                : 'bg-gray-600 rounded-full p-2'
                                        : this.retroDesign
                                                ? 'bg-police-red px-3'
                                                : 'bg-police-red rounded-full p-2',
                            ])}">
                                <lucide-icon name="ArrowRight"
                                             cls="${this.cn([
                                                 'text-white',
                                                 this.retroDesign
                                                         ? 'w-6 h-6'
                                                         : 'w-4 h-4',
                                             ])}">
                                </lucide-icon>
                            </div>`
                        : ""}
            </button>`;
    }

    protected render() {
        return this.withStripes
            ? html`
                    <section class="py-2 pr-2 flex justify-end"
                             style="background-image: linear-gradient(135deg, #000000 4.55%, transparent 4.55%, transparent 50%, #000000 50%, #000000 54.55%, transparent 54.55%, transparent 100%);background-size: 11px 11px;">
                        ${this.renderButton()}
                    </section>`
            : this.renderButton()
    }
}