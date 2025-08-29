import {customElement, property} from "lit/decorators.js";
import {html} from "lit";
import {icons} from "lucide";
import {unsafeSVG} from "lit-html/directives/unsafe-svg.js";
import TailwindElement from "../app/TailwindElement";

/**
 * Represents an array of immutable tuples where each tuple consists of a string and an immutable record.
 * Each tuple contains a string identifier and an associated record containing key-value pairs.
 *
 * The structure of the array and its elements are immutable, ensuring that once created,
 * the data cannot be modified.
 */
type IconNode = ReadonlyArray<Readonly<[string, Record<string, string>]>>

/**
 * Converts an object of attributes into a single string representation where each key-value pair
 * is formatted as `key="value"`. Attributes with undefined values are omitted from the result.
 *
 * @param {Record<string, string | number | undefined>} attrs - An object containing key-value pairs representing attributes.
 * @return {string} A string representation of the provided attributes, formatted as key-value pairs.
 */
function attrsToString(attrs: Record<string, string | number | undefined>): string {
    return Object.entries(attrs)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}="${String(v)}"`)
        .join(' ');
}

/**
 * Converts a specified icon name to an SVG string with customizable attributes.
 *
 * @param {string} name - The name of the icon to be converted to SVG.
 * @param {Object} [opts] - Optional parameters to customize the SVG output.
 * @param {number|string} [opts.width] - The width of the SVG. Defaults to 24.
 * @param {number|string} [opts.height] - The height of the SVG. Defaults to 24.
 * @param {string} [opts.color] - The color to apply to the icon's stroke. Defaults to "currentColor".
 * @param {number|string} [opts.strokeWidth] - The width of the icon's stroke. Defaults to 2.
 * @param {string} [opts.class] - CSS class to apply to the SVG.
 * @param {'true'|'false'} [opts.aria-hidden] - Accessibility attribute to indicate visibility. Defaults to "true".
 * @param {string} [opts.role] - ARIA role for the SVG element. Defaults to "img".
 * @param {string} [opts.title] - A title for the SVG element for accessibility purposes.
 * @return {string} - The generated SVG string based on the specified icon and options.
 */
function iconToSvg(name: string, opts?: {
    width?: number | string;
    height?: number | string;
    color?: string;
    strokeWidth?: number | string;
    class?: string;
    'aria-hidden'?: 'true' | 'false';
    role?: string;
    title?: string;
}): string {
    const node = (icons as Record<string, IconNode>)[name];
    if (!node) return '';

    const svgAttrs = {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: opts?.color ?? 'currentColor',
        'stroke-width': opts?.strokeWidth ?? 2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        width: opts?.width ?? 24,
        height: opts?.height ?? 24,
        class: opts?.class,
        'aria-hidden': opts?.['aria-hidden'] ?? 'true',
        role: opts?.role ?? 'img',
    };

    const title = opts?.title ? `<title>${opts.title}</title>` : '';
    const children = node
        .map(([tag, attrs]) => `<${tag} ${attrsToString(attrs)}></${tag}>`)
        .join('');

    return `<svg ${attrsToString(svgAttrs)}>${title}${children}</svg>`;
}

/**
 * Interface representing the properties for LucideIcons component.
 *
 * @property {string} name - The name of the icon to be rendered.
 * @property {number} size - The size of the icon in pixels.
 * @property {string} color - The color to apply to the icon.
 * @property {number} strokeWidth - The stroke width of the icon lines.
 * @property {string} cls - Additional CSS class names to style the icon.
 */
export interface LucideIconsProps {
    name: string;
    size: number;
    color: string;
    strokeWidth: number;
    cls: string;
}

/**
 * A custom web component representing an icon using the Lucide library.
 * This component allows customization of the displayed icon's size,
 * color, stroke width, and additional CSS classes.
 *
 * Attributes:
 * - name: Specifies the name of the Lucide icon to display. Defaults to 'search'.
 * - size: Determines the size of the icon in pixels. Defaults to 16.
 * - color: Defines the color of the icon. Defaults to 'currentColor'.
 * - stroke-width: Sets the stroke width of the icon. Defaults to 2.
 * - cls: Adds additional CSS class(es) to the icon.
 *
 * This component uses the `iconToSvg` function to generate SVG markup for the specified
 * icon based on the provided attributes. The rendered SVG is injected into the DOM.
 *
 * Extends:
 * - LitElement, a base class for creating web components using Lit.
 */
@customElement('lucide-icon')
export class LucideIcon extends TailwindElement {
    /**
     * Represents the term or query used to search for specific data or information.
     * This variable can hold a string value indicating the keywords or phrase to perform a search operation.
     */
    @property() name: LucideIconsProps['name'] = 'Search';

    /**
     * Represents the size or dimensions of an object or element.
     *
     * @type {number}
     * @default 18
     */
    @property() size: LucideIconsProps['size'] = 18;

    /**
     * Represents a CSS-compatible color value used for styling elements.
     *
     * The `color` variable by default is set to `'currentColor'`, which indicates
     * that the element should inherit the text color of its parent element. This can
     * be overridden by assigning any valid CSS color value, such as hexadecimal, RGB,
     * HSL, or named colors.
     *
     * Example of valid values:
     * - `'red'`
     * - `'#ff0000'`
     * - `'rgb(255, 0, 0)'`
     * - `'hsl(0, 100%, 50%)/**
     Represents * the
     color * value Default to: be `' usedcurrent forColor styling elements`
     */
    @property() color: LucideIconsProps['color'] = 'currentColor';

    /**
     * Represents the width of a stroke or line used in rendering or drawing operations.
     * This value typically defines the thickness of borders, outlines, or paths in a visual context.
     *
     * The default value is 2.
     */
    @property({attribute: 'stroke-width'}) strokeWidth: LucideIconsProps['strokeWidth'] = 2;

    /**
     * Represents a class identifier or designation used in a programming context.
     * The variable `cls` is an empty string by default and can be used to store
     * or manipulate class names, identifiers, or other string-based data attributes.
     * Ensure that the value assigned to `cls` follows the expected format for its intended purpose.
     */
    @property() cls: LucideIconsProps['cls'] = '';


    protected render() {
        const svg = iconToSvg(this.name, {
            width: this.size,
            height: this.size,
            color: this.color,
            strokeWidth: this.strokeWidth,
            class: this.cls,
            'aria-hidden': 'true',
        });

        if (!svg) {
            console.warn(`[lucide-icon] Unbekanntes Icon: "${this.name}". Prüfe Schreibweise.`, {});
            return html``;
        }

        return html`${unsafeSVG(svg)}`;
    }
}
