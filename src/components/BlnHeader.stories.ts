import type { Meta, StoryObj } from '@storybook/web-components-vite';

import "./BlnHeader";
import type {BlnHeaderProps} from "./BlnHeader";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';

const meta = {
    title: 'Navigation/Header',
    tags: ['autodocs'],
    render: (args: BlnHeaderProps) => html`
        <bln-header></bln-header>
        <div style="height: 50vh;"></div>`,
    argTypes: {
        logoUrl: {description: 'Logo URL', type: {name: 'string'}},
    },
    args: {},
} satisfies Meta<BlnHeaderProps>;

export default meta;
type Story = StoryObj<BlnHeaderProps>;

export const Default: Story = {};
