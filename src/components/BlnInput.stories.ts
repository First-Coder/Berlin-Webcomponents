import type {Meta, StoryObj} from '@storybook/web-components-vite';

import "./BlnInput";
import type {BlnInputProps} from "./BlnInput";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Base Components/Input',
    tags: ['autodocs'],
    render: (args: BlnInputProps) => html`
        <bln-input
                label=${ifDefined(args.label)}
                placeholder=${ifDefined(args.placeholder)}
                hint=${ifDefined(args.hint)}
                disabled=${ifDefined(args.disabled)}
                value=${ifDefined(args.value)}
                class="${args.class}"
                type=${ifDefined(args.type)}
                size=${ifDefined(args.size)}
                corner-hint=${ifDefined(args.cornerHint)}
                is-valid=${ifDefined(args.isValid)}
        />`,
    argTypes: {
        placeholder: {description: 'Placeholder of the input', type: {name: 'string'}},
        label: {description: 'Label of the input', type: {name: 'string'}},
        hint: {description: 'Hint of the input', type: {name: 'string'}},
        cornerHint: {description: 'Corner hint of the input', type: {name: 'string'}},
        disabled: {description: 'Disabled state of the input', type: {name: 'boolean'}},
        value: {description: 'Value of the input', type: {name: 'string'}},
        class: {description: 'Additional CSS classes to apply to the input', type: {name: 'string'}},
        type: {description: 'Type of the input', type: {name: 'string'}},
        size: {
            description: 'Size of the input',
            type: {name: 'string'},
            control: {type: 'select'},
            options: ['small', 'medium', 'large'],
        },
        isValid: {description: 'Whether the input is valid', type: {name: 'boolean'}},
    },
    args: {
        label: 'E-Mail',
        placeholder: 'you@site.com',
        hint: 'Enter your email address',
        type: 'email',
    },
} satisfies Meta<BlnInputProps>;

export default meta;
type Story = StoryObj<BlnInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultInput: Story = {};

export const PilledInput: Story = {
    args: {
        class: '!rounded-full',
    },
};

export const SmallInput: Story = {
    args: {
        size: 'small',
    },
};

export const LargeInput: Story = {
    args: {
        size: 'large',
    },
};

export const OptionalInput: Story = {
    args: {
        cornerHint: 'Optional',
    },
};

export const ValidInput: Story = {
    args: {
        isValid: true,
    },
};

export const InvalidInput: Story = {
    args: {
        isValid: false,
    },
};