import type {Meta, StoryObj} from '@storybook/web-components-vite';

import {fn} from 'storybook/test';

import "../components/BlnButton";
import type {BlnButtonProps} from "../components/BlnButton";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Components/BlnButton',
    tags: ['autodocs'],
    render: (args: BlnButtonProps) => html`
        <bln-button
                size=${args.size ?? 'medium'}
                variant=${args.variant ?? 'primary'}
                class-names=${ifDefined(args.class)}
                ?with-arrow=${ifDefined(args.withArrow)}
                ?disabled=${args.disabled === true}
                ?with-stripes=${ifDefined(args.withStripes)}
                ${args.withArrow ? 'with-arrow' : ''}
                .onClick=${args.onClick}
        >${ifDefined(args.label)}
        </bln-button>`,
    argTypes: {
        disabled: {control: 'boolean', description: 'Disabled state of the button', type: {name: 'boolean'}},
        class: {control: 'none', description: 'Additional CSS classes to apply to the button', type: {name: 'string'}},
        withArrow: {control: 'boolean', description: 'Whether to show an arrow icon', type: {name: 'boolean'}},
        withStripes: {control: 'boolean', description: 'Whether to show stripes', type: {name: 'boolean'}},
        variant: {
            description: 'Variant of the button',
            type: {name: 'string'},
            control: {type: 'select'},
            options: ['primary', 'link'],
        },
        size: {
            description: 'Size of the button',
            type: {name: 'string'},
            control: {type: 'select'},
            options: ['small', 'medium', 'large'],
        },
    },
    args: {label: 'BlnButton', onClick: fn()},
} satisfies Meta<BlnButtonProps>;

export default meta;
type Story = StoryObj<BlnButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        primary: 'primary',
        label: 'BlnButton',
    },
};

export const PrimaryArrow: Story = {
    args: {
        primary: 'primary',
        withArrow: true,
        label: 'BlnButton',
    },
};

export const PrimaryStripes: Story = {
    args: {
        primary: 'primary',
        withStripes: true,
        label: 'BlnButton',
    },
};

export const Link: Story = {
    args: {
        label: 'BlnButton',
        variant: 'link',
    },
};

export const Disabled: Story = {
    args: {
        label: 'BlnButton',
        disabled: true,
    },
};