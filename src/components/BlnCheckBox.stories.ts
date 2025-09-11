import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnCheckBox';
import type { BlnCheckBoxProps } from './BlnCheckBox';

const meta = {
  title: 'Base Components/Checkbox',
  tags: ['autodocs'],
  render: (args: Partial<BlnCheckBoxProps>) => html`
    <bln-checkbox
      label=${ifDefined(args.label)}
      hint=${ifDefined(args.hint)}
      corner-hint=${ifDefined(args.cornerHint)}
      name=${ifDefined(args.name)}
      size=${ifDefined(args.size)}
      class="${args.class ?? ''}"
      disabled=${ifDefined(args.disabled)}
      required=${ifDefined(args.required)}
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      retro-design=${ifDefined(args.retroDesign)}
      .value=${args.value as any}
      .checked=${args.checked as any}
    >
      ${args.label ?? 'Ich stimme den Bedingungen zu'}
    </bln-checkbox>
  `,
  argTypes: {
    label: { description: 'Optionales sichtbares Label oberhalb der Checkbox', type: { name: 'string' } },
    hint: { description: 'Hilfetext unter dem Feld', type: { name: 'string' } },
    cornerHint: { description: 'Hinweis rechts neben dem Label', type: { name: 'string' } },
    name: { description: 'Name des Feldes (Formular)', type: { name: 'string' } },
    value: { description: 'Formularwert bei checked', type: { name: 'string' } },
    checked: { description: 'Ausgewählter Zustand', type: { name: 'boolean' } },
    disabled: { description: 'Deaktiviert das Feld', type: { name: 'boolean' } },
    required: { description: 'Pflichtfeld', type: { name: 'boolean' } },
    size: {
      description: 'Größe',
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    class: { description: 'Zusätzliche CSS-Klassen', type: { name: 'string' } },
    retroDesign: { description: 'Retro-Design aktivieren', type: { name: 'boolean' } },
    ariaLabel: { name: 'aria-label', description: 'A11y: Eigene aria-label (falls kein sichtbares Label/Slot)', type: { name: 'string' } },
    ariaLabelledby: { name: 'aria-labelledby', description: 'A11y: Verweist auf ID eines Labels', type: { name: 'string' } },
    ariaDescribedby: { name: 'aria-describedby', description: 'A11y: Verweist auf ID mit Beschreibung/Hint', type: { name: 'string' } },
  },
  args: {
    label: 'Einverständnis',
    checked: false,
    size: 'medium',
    value: 'yes',
  },
} satisfies Meta<Partial<BlnCheckBoxProps>>;

export default meta;

type Story = StoryObj<Partial<BlnCheckBoxProps>>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Required: Story = {
  args: { required: true },
};

export const Sizes: Story = {
  render: (args) => html`
    <div class="flex flex-col gap-4">
      ${(['small','medium','large'] as const).map(size => html`
        <bln-checkbox
          label="${args.label} (${size})"
          size=${size}
          .checked=${args.checked as any}
          .value=${args.value as any}
        >${args.label} (${size})</bln-checkbox>
      `)}
    </div>
  `,
};

export const RetroDesign: Story = {
  args: { retroDesign: true },
};
