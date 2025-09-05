import {customElement, property, state} from "lit/decorators.js";
import {html, PropertyValues} from "lit";
import TailwindElement from "../app/TailwindElement";

import './LucideIcon';
import {booleanStringFalseConverter} from "../utils/converters";

export interface BlnButtonProps {
    type: string;
    variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link' | 'arrow' | 'arrow-red';
    withArrow: boolean,
    withStripes: boolean,
    size?: 'small' | 'medium' | 'large';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    class?: string;
    retroDesign: boolean;
    loading: boolean;
    // Virtual properties
    leading: boolean;
    trailing: boolean;
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
    @property() type: BlnButtonProps['type'] = "button";


    /**
     * Represents a variable that can store a value of different classes.
     */
    @property() class: BlnButtonProps['class'] = "";

    /**
     * Represents the variant type for a specific component or functionality.
     * Allows customization or differentiation between styles or behaviors.
     *
     * Possible value: "primary"
     */
    @property() variant: BlnButtonProps['variant'] = "solid";


    /**
     * Represents the size of an item or element.
     * This variable holds a string value indicating the size classification.
     * Commonly used to define or adjust dimensions, layouts, or options.
     * Possible values might include "small", "medium", "large", etc.
     */
    @property() size: BlnButtonProps['size'] = "medium";


    /**
     * Indicates whether the arrow feature should be enabled or disabled.
     * This variable is a boolean flag that determines the activation state of the arrow feature.
     * When set to `true`, the arrow functionality will be enabled.
     * When set to `false`, the arrow functionality will remain disabled.
     */
    @property({attribute: "with-arrow"}) withArrow: BlnButtonProps['withArrow'] = false;


    /**
     * A boolean variable that determines whether a particular feature or functionality is disabled.
     * If set to `true`, the feature is inactive or unavailable.
     * Defaults to `false`, indicating that the feature is enabled and operational.
     */
    @property({reflect: true}) disabled: BlnButtonProps['disabled'] = false;

    /**
     * This variable indicates whether a striped effect is applied or not.
     * It is a boolean value that defaults to false, implying that the striped effect
     * is disabled unless explicitly set to true.
     */
    @property({attribute: "with-stripes"}) withStripes: BlnButtonProps['withStripes'] = false;


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
     * Represents the loading state for the button.
     * This property determines if the button should display a loading indicator.
     * When set to `true`, the button is in a loading state.
     * Defaults to `false`.
     */
    @property({reflect: true, converter: booleanStringFalseConverter}) loading: BlnButtonProps['loading'] = false;

    /**
     * A boolean variable that indicates whether a subject or entity has a leading characteristic.
     * This variable typically signifies the presence (`true`) or absence (`false`) of
     * a leading or preliminary state, condition, or attribute.
     */
    @state() private hasLeading: boolean = false;

    /**
     * A boolean variable indicating whether a specific trailing behavior is present.
     * This typically determines if there is any trailing element or character in a particular context.
     *
     * @type {boolean}
     */
    @state() private hasTrailing: boolean = false;

    /**
     * Handles changes in the assigned nodes of a slot element and updates the `hasLeading` property
     * based on the presence of non-empty nodes.
     *
     * @param {Event} e - The event triggered when the slot's assigned nodes change.
     * @return {void} This method does not return a value.
     */
    private onLeadingChange(e: Event): void {
        const slot = e.target as HTMLSlotElement;
        const assigned = slot.assignedNodes({flatten: true}).filter(n => {
            // leere Textknoten ignorieren
            return !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim());
        });
        this.hasLeading = assigned.length > 0;
    }

    /**
     * Handles the 'slotchange' event for the trailing slot and updates the state
     * based on the presence of assigned nodes in the slot.
     *
     * @param {Event} e - The slotchange event triggered by the trailing slot.
     * @return {void} This method does not return a value.
     */
    private onTrailingChange(e: Event): void {
        const slot = e.target as HTMLSlotElement;
        const assigned = slot.assignedNodes({flatten: true}).filter(n => {
            // leere Textknoten ignorieren
            return !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim());
        });
        this.hasTrailing = assigned.length > 0;
    }

    /**
     * Returns an array of CSS class names for horizontal padding based on the size property
     * and whether the padding is for the left or right side.
     *
     * @param {boolean} left - Determines whether the padding is for the left (true) or right (false) side.
     * @return {string[]} An array of class names representing horizontal padding for the specified side and size.
     */
    private getSizeHorizontalPadding(left: boolean): string[] {
        switch (this.size) {
            case 'small':
                return left ? ['pl-3'] : ['pr-3'];
            case 'medium':
                return left ? ['pl-4'] : ['pr-4'];
            case 'large':
                return left ? ['pl-4', 'sm:pl-5'] : ['pr-4', 'sm:pr-5'];
            default:
                return left ? ['pl-4'] : ['pr-4'];
        }
    }

    /**
     * Updates the component based on changes to its properties and adjusts the padding of certain elements within the shadow DOM.
     *
     * @param {PropertyValues<this>} changedProperties - An object containing the properties that changed and their previous values.
     * @return {void} This method does not return a value.
     */
    protected updated(changedProperties: PropertyValues<this>) {
        const shadowRoot = this.shadowRoot;
        if (!shadowRoot) return;

        // Remove old padding classes
        shadowRoot.querySelector('span#loading')?.classList.remove('ml-2');
        shadowRoot.querySelector('slot[name="leading"]')?.classList.remove(...this.getSizeHorizontalPadding(true));
        shadowRoot.querySelector('slot[name="trailing"]')?.classList.remove(...this.getSizeHorizontalPadding(false));
        shadowRoot.querySelector('span#content')?.classList.remove(...this.getSizeHorizontalPadding(true));
        shadowRoot.querySelector('span#content')?.classList.remove(...this.getSizeHorizontalPadding(false));

        // Set left padding
        let leftHtmlElement: Element | null;
        if (this.hasLeading) {
            leftHtmlElement = this.shadowRoot.querySelector('slot[name="leading"]');
        } else if (this.loading && !this.retroDesign) {
            leftHtmlElement = this.shadowRoot.querySelector('span#loading');
        } else {
            leftHtmlElement = this.shadowRoot.querySelector('span#content');
        }
        if (!leftHtmlElement) {
            console.warn('No left padding element found');
        } else if (this.loading && !this.retroDesign) {
            leftHtmlElement.classList.add('ml-2');
        } else {
            leftHtmlElement.classList.add(...this.getSizeHorizontalPadding(true));
        }

        // Set right padding
        let rightHtmlElement: Element | null;
        if (this.hasTrailing) {
            rightHtmlElement = this.shadowRoot.querySelector('slot[name="trailing"]');
        } else {
            rightHtmlElement = this.shadowRoot.querySelector('span#content');
        }
        if (!rightHtmlElement) {
            console.warn('No right padding element found');
        } else {
            rightHtmlElement.classList.add(...this.getSizeHorizontalPadding(false));
        }
    }

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
                ${this.loading && !this.retroDesign
                        ? html`
                            <span id="loading" class="animate-spin" role="status" aria-label="loading">
                                <lucide-icon name="LoaderCircle" cls="w-5 h-5"></lucide-icon>
                            </span>
                        `
                        : html`
                            <slot name="leading" @slotchange=${this.onLeadingChange}></slot>`
                }
                <span id="content" class="${this.cn([
                    this.size === 'large'
                            ? 'py-4 sm:py-5'
                            : this.size === 'small'
                                    ? 'py-2'
                                    : 'py-3',
                    this.variant === 'arrow' || this.variant === 'arrow-red'
                            ? this.retroDesign
                                    ? 'border-r-2 border-black'
                                    : 'pr-1'
                            : '',
                    this.retroDesign
                            ? ''
                            : 'border-transparent',
                ])}">
                    <slot></slot>
                </span>
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
                        : html`
                            <slot name="trailing" @slotchange=${this.onTrailingChange}></slot>`}
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