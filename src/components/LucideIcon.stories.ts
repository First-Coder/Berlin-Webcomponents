import type {Meta, StoryObj} from '@storybook/web-components-vite';

import "./LucideIcon";
import type {LucideIconsProps} from "./LucideIcon";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Base/Icon',
    tags: ['autodocs'],
    render: (args: LucideIconsProps) => html`
        <lucide-icon
                name=${ifDefined(args.name)}
                size=${ifDefined(args.size)}
                color=${ifDefined(args.color)}
                stroke-width=${ifDefined((args.strokeWidth))}
        />`,
    argTypes: {
        name: {description: 'Name of the icon', type: {name: 'string'}},
        size: {description: 'Size of the icon', type: {name: 'number'}},
        color: {description: 'Color of the icon', type: {name: 'string'}},
        strokeWidth: {description: 'Stroke width of the icon', type: {name: 'number'}},
    },
    args: {
        name: 'Search',
        size: 18,
        color: 'currentColor',
        strokeWidth: 2,
    },
} satisfies Meta<LucideIconsProps>;

export default meta;
type Story = StoryObj<LucideIconsProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultIcon: Story = {};