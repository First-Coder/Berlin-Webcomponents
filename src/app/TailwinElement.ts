import {LitElement, PropertyValues} from "lit";
import tailwindCss from '../styles/tailwind.min.css?raw';
import {property} from "lit/decorators.js";

/**
 * Represents a value that can be used to dynamically construct class names in various web development contexts.
 *
 * This type includes multiple possibilities, allowing for flexibility in constructing class strings:
 * - A `string` representing a class name.
 * - A `number` which can represent numeric class-related values.
 * - `null` and `undefined` are allowed to simplify class handling without causing errors.
 * - `false` can be used to conditionally exclude values when constructing class names.
 * - An array of `ClassValue` items, enabling recursive and nested class structures.
 * - An object where the keys are class names and the values determine whether to include the class name based on truthy or falsy evaluation.
 */
type ClassValue =
    | string
    | number
    | null
    | false
    | undefined
    | ClassValue[]
    | { [klass: string]: any };


/**
 * TailwindElement is an abstract class that extends the LitElement base class.
 * It integrates Tailwind CSS support into custom web components. This class
 * handles the application of Tailwind CSS styles within the shadow DOM and
 * offers basic functionality for debugging and dynamic styling purposes.
 *
 * The class ensures Tailwind CSS styles are properly applied, even within the
 * encapsulated shadow DOM of a web component.
 */
export default abstract class TailwindElement extends LitElement {
    /**
     * A boolean variable that indicates whether debugging mode is enabled.
     * When set to true, debugging features or additional log outputs may be activated.
     * When set to false, the debugging mode is disabled, and normal operation occurs.
     */
    @property({type: Boolean}) debug = false;

    /**
     * Represents an optional string containing Tailwind CSS class definitions.
     * This variable may be used to dynamically assign CSS classes for styling purposes
     * in a format compliant with the Tailwind CSS framework.
     *
     * @type {?string}
     */
    private static tailwindCssText?: string;

    /**
     * This method is called after the first update of the component's properties.
     * It ensures that TailwindCSS is applied correctly within the shadow DOM.
     *
     * @param {PropertyValues} _changedProperties - A map of properties that were changed
     * during the first update cycle.
     * @return {void} This method does not return a value.
     */
    protected firstUpdated(_changedProperties: PropertyValues): void {
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
    protected cn(...values: ClassValue[]): string {
        const out: string[] = [];

        const push = (v: ClassValue): void => {
            if (!v) return;

            if (typeof v === 'string' || typeof v === 'number') {
                const s = String(v).trim();
                if (s) out.push(s);
                return;
            }

            if (Array.isArray(v)) {
                for (const item of v) push(item);
                return;
            }

            if (typeof v === 'object') {
                for (const [key, val] of Object.entries(v)) {
                    if (val) out.push(key.trim());
                }
            }
        };

        for (const v of values) push(v);

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
    private ensureTailwindInShadow(): void {
        try {
            const ctor = this.constructor as typeof TailwindElement;
            if (!ctor.tailwindCssText) {
                ctor.tailwindCssText = tailwindCss;
            }
            const styleEl = document.createElement('style');
            styleEl.textContent = ctor.tailwindCssText!;
            this.shadowRoot?.prepend(styleEl);
        } catch (err) {
            console.error('Tailwind CSS konnte nicht geladen werden:', err);
        }
    }
}