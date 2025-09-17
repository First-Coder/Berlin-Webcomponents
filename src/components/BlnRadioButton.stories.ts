import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './BlnRadioButton';
import type { BlnRadioButtonProps } from './BlnRadioButton';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const meta = {
    title: 'Base Components/RadioButton',
    tags: ['autodocs'],
    render: (args: Partial<BlnRadioButtonProps>) => html`
    <bln-radio-button
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      name=${ifDefined(args.name)}
      value=${ifDefined(args.value)}
      ?retro-design=${args.retroDesign}
      class="${args.class ?? ''}"
    >${ifDefined((args as any).label) ?? 'Option'}</bln-radio-button>
  `,
    argTypes: {
        checked: { control: 'boolean', description: 'Ausgewählter Zustand' },
        disabled: { control: 'boolean', description: 'Deaktiviert' },
        name: { control: 'text', description: 'Gruppenname (Radio-Exklusivität)' },
        value: { control: 'text', description: 'Wert, der bei Events (detail.value) geliefert wird' },
        retroDesign: { control: 'boolean', description: 'Retro-Design' },
        size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    },
    args: { checked: false },
} satisfies Meta<Partial<BlnRadioButtonProps>>;

export default meta;

type Story = StoryObj<Partial<BlnRadioButtonProps>>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Retro: Story = { args: { retroDesign: true, checked: true } };

export const GroupExample: Story = {
    render: () => html`
    <div class="flex gap-2">
      <bln-radio-button name="g" value="a">A</bln-radio-button>
      <bln-radio-button name="g" value="b">B</bln-radio-button>
      <bln-radio-button name="g" value="c" disabled>C</bln-radio-button>
    </div>
    <p class="text-xs text-gray-500">Klick auf eine Option setzt diese und hebt andere mit gleichem Namen auf.</p>
  `,
};
