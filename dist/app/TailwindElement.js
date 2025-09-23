var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement } from "lit";
import tailwindCss from '../styles/tailwind.min.css?raw';
import { property } from "lit/decorators.js";
import { booleanStringFalseConverter } from "../utils/converters";
/**
 * TailwindElement is an abstract class that extends the LitElement base class.
 * It integrates Tailwind CSS support into custom web components. This class
 * handles the application of Tailwind CSS styles within the shadow DOM and
 * offers basic functionality for debugging and dynamic styling purposes.
 *
 * The class ensures Tailwind CSS styles are properly applied, even within the
 * encapsulated shadow DOM of a web component.
 */
export default class TailwindElement extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * A boolean variable that indicates whether debugging mode is enabled.
         * When set to true, debugging features or additional log outputs may be activated.
         * When set to false, the debugging mode is disabled, and normal operation occurs.
         */
        this.debug = false;
        /**
         * A boolean variable that indicates whether the current mode or feature
         * operates in a retro or vintage style.
         *
         * When set to `true`, the system or feature is expected to behave in a manner
         * resembling older or classic functionality. When set to `false`, it operates
         * in standard or modern mode.
         */
        this.retroDesign = false;
    }
    /**
     * This method is called after the first update of the component's properties.
     * It ensures that TailwindCSS is applied correctly within the shadow DOM.
     *
     * @param {PropertyValues} _changedProperties - A map of properties that were changed
     * during the first update cycle.
     * @return {void} This method does not return a value.
     */
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.ensureTailwindInShadow();
    }
    /**
     * Processes a collection of class values, including strings, numbers, arrays, or objects,
     * and returns a concatenated string of valid class names.
     *
     * @param {...ClassValue[]} values - A list of class values that can include strings, numbers,
     * arrays, or objects. Arrays and objects are processed recursively.
     * Strings and numbers are trimmed before inclusion, and object keys are included if associated values evaluate to true.
     * @return {string} A single string containing all valid class names, separated by a space.
     */
    cn(...values) {
        const out = [];
        const push = (v) => {
            if (!v)
                return;
            if (typeof v === 'string' || typeof v === 'number') {
                const s = String(v).trim();
                if (s)
                    out.push(s);
                return;
            }
            if (Array.isArray(v)) {
                for (const item of v)
                    push(item);
                return;
            }
            if (typeof v === 'object') {
                for (const [key, val] of Object.entries(v)) {
                    if (val)
                        out.push(key.trim());
                }
            }
        };
        for (const v of values)
            push(v);
        return out.join(' ');
    }
    /**
     * Ensures that Tailwind CSS styles are applied within the shadow DOM of the current component.
     *
     * This method checks if the Tailwind CSS styles have been initialized on the constructor level.
     * If not, it assigns the Tailwind CSS stylesheet to the constructor. The method then creates
     * a `<style>` element containing the Tailwind CSS styles and prepends it to the shadow root of
     * the component.
     *
     * If an error occurs during the operation, it logs a message to the console.
     *
     * @return {void} This method does not return any value.
     */
    ensureTailwindInShadow() {
        try {
            const ctor = this.constructor;
            if (!ctor.tailwindCssText) {
                ctor.tailwindCssText = tailwindCss;
            }
            const styleEl = document.createElement('style');
            styleEl.textContent = ctor.tailwindCssText;
            this.shadowRoot?.prepend(styleEl);
        }
        catch (err) {
            console.error('Tailwind CSS konnte nicht geladen werden:', err);
        }
    }
}
__decorate([
    property({ type: Boolean })
], TailwindElement.prototype, "debug", void 0);
__decorate([
    property({ type: Boolean, converter: booleanStringFalseConverter, attribute: 'retro-design' })
], TailwindElement.prototype, "retroDesign", void 0);
