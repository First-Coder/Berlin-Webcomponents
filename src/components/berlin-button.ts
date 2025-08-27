import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";

/**
 * Generate the button based on berlin.de
 */
@customElement('berlin-button')
export  class Button extends LitElement {
    static styles = css`
        :host {
            font-family: arial, sans-serif, verdana, helvetica;

            button:disabled {
                cursor: not-allowed;

                > * {
                    opacity: 0.5;
                }
            }
        }
    `;

    @property()
    type:string = "button";
    @property()
    class:string = "";
    @property()
    stlye:string = "";
    @property()
    isDisabled:boolean = false;
    @property()
    variant:string = "";
    @property()
    withStripes:boolean = false;
    @property()
    withArrow:boolean = false;

    /*
    static properties = {
        // Define the button type
        type: {attribute: "type", type: String},
        // Define the button custom classes
        class: {attribute: "class", type: String},
        // Define the button custom styles
        style: {attribute: "style", type: String},
        // Define if the button is disabled
        isDisabled: {attribute: "disabled", type: Boolean},
        // Define the button variants like "link"....
        variant: {attribute: "variant", type: String},
        // Define if the button has stripes in the background
        withStripes: {attribute: "with-stripes", type: Boolean},
        // Define if the button has an arrow on the right side
        withArrow: {attribute: "with-arrow", type: Boolean},
    }

     */

    constructor() {
        super();
        this.type = "button";
        this.class = "";
        this.style = "";
        this.isDisabled = false;
        this.variant = "";
        this.withStripes = false;
        this.withArrow = false;
    }

    firstUpdated(t:any) {
        super.firstUpdated(t);

        const button = this.shadowRoot?.querySelector('button');
        const span = button?.querySelector('span');

        switch (this.variant) {
            case "link": {
                button?.classList.add("py-3", "px-4", "border", "border-black", "text-white", "bg-black");
                break;
            }
            default: {
                button?.classList.add("py-2", "px-5", "border-2", "border-black", "bg-white", "transition");
                if (!this.isDisabled) {
                    button?.classList.add("hover:bg-gray-200")
                }
            }
        }

        // Arrow
        if (this.withArrow) {
            button?.classList.remove("py-2", "px-5");
            span?.classList.add("py-2", "px-5", "border-r-2", "border-black");
        }
    }

    render() {
        return this.withStripes
            ? html`
                    <section class="block py-2 pr-2 flex justify-end"
                             style="background-image: linear-gradient(135deg, #000000 4.55%, transparent 4.55%, transparent 50%, #000000 50%, #000000 54.55%, transparent 54.55%, transparent 100%);background-size: 11px 11px;">
                        ${this.renderButton()}
                    </section>`
            : this.renderButton()
    }

    /**
     * Render the button element
     */
    renderButton() {
        return html`
            <!-- Tailwind-->
            <link rel="stylesheet" href="http://assetservice-dev/lib/tailwind/tailwind-2.0.2.css"/>
            <script src="http://assetservice-dev/lib/tailwind/tailwind-3.4.5.js"></script>

            <button type="${this.type}"
                    class="flex items-stretch ${this.class}"
                    style="${this.style}"
                    ?disabled="${this.isDisabled}"
                    @click="${this.dispatchEvent(new Event("click"))}">
                <span>
                    <slot></slot>
                </span>
                ${this.withArrow
            ? html`
                            <div class="px-3 flex items-center" style="background: #e40422;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" fill="white">
                                    <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
                                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                </svg>
                            </div>`
            : ""}
            </button>
        `;
    }
}

customElements.define('berlin-button', Button);