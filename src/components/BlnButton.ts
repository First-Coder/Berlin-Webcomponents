import {customElement, property} from "lit/decorators.js";
import {html, LitElement} from "lit";

export interface BlnButtonProps {
    variant?: 'primary' | 'link';
    withArrow: boolean,
    withStripes: boolean,
    size?: 'small' | 'medium' | 'large';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

@customElement('bln-button')
export class BlnButton extends LitElement {
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
    @property({type: String}) variant = "primary";


    /**
     * Represents the size of an object or entity.
     *
     * This variable is typically used to define or adjust configurations,
     * properties, or appearances where size is a consideration.
     *
     * Possible values may include descriptive size terms such as
     * "small", "medium", "large", or custom definitions based on context.
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
     *
     * @type {boolean}
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
     *
     * @return {string} A string representing the HTML template for the button, including its styles and dynamic content.
     */
    renderButton(): string {
        // Button types
        const isLink = this.variant === 'link';

        // Classes
        const base = isLink
            ? "border-2 border-[#e40422] bg-white font-bold"
            : "border-2 border-black bg-white";
        const size = this.size === 'small' ? 'text-sm' : this.size === 'large' ? 'text-lg' : '';
        const padding = isLink
            ? this.size === 'small'
                ? 'py-2 px-3'
                : 'py-3 px-4'
            : this.withArrow
                ? ''
                : this.size === 'small'
                    ? 'py-1 px-3'
                    : 'py-2 px-5';
        const hover = !this.isDisabled && !isLink ? 'hover:bg-gray-200' : isLink ? 'hover:underline' : '';
        const disabled = this.disabled ? 'opacity-50 cursor-not-allowed' : '';
        const spanClasses = this.withArrow
            ? this.size === 'small'
                ? 'py-1 px-3 border-r-2 border-black'
                : 'py-2 px-5 border-r-2 border-black'
            : '';
        const buttonClasses = [
            'transition duration-700 flex items-stretch',
            base,
            disabled,
            size,
            padding,
            hover,
            this.class, // zusätzliche Host-übergebene Klassen
        ].filter(Boolean).join(' ');

        // Render
        return html`
            <!-- Tailwind aus Storybook Static Dir -->
            <link rel="stylesheet" href="/tailwind.css"/>

            <button class="${buttonClasses}"
                    ?disabled=${this.disabled}
                    @click=${(e: MouseEvent) => this.onClick?.(e)}>
                <span class="${spanClasses}"><slot></slot></span>
                ${this.withArrow
                        ? html`
                            <div class="px-3 flex items-center" style="background: #e40422;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" fill="white">
                                    <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
                                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                </svg>
                            </div>`
                        : ""}
            </button>`;
    }

    protected render(): string {
        return this.withStripes
            ? html`
                    <section class="py-2 pr-2 flex justify-end"
                             style="background-image: linear-gradient(135deg, #000000 4.55%, transparent 4.55%, transparent 50%, #000000 50%, #000000 54.55%, transparent 54.55%, transparent 100%);background-size: 11px 11px;">
                        ${this.renderButton()}
                    </section>`
            : this.renderButton()
    }
}