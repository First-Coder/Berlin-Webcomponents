import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnSelect';
import type { BlnSelectProps } from './BlnSelect';

const meta = {
    title: 'Base Components/Select',
    tags: ['autodocs'],
    render: (args: Partial<BlnSelectProps>) => html`
    <bln-select
      label=${ifDefined(args.label)}
      hint=${ifDefined(args.hint)}
      corner-hint=${ifDefined(args.cornerHint)}
      name=${ifDefined(args.name)}
      placeholder=${ifDefined(args.placeholder)}
      size=${ifDefined(args.size)}
      class="${args.class ?? ''}"
      is-valid=${ifDefined(args.isValid)}
      disabled=${ifDefined(args.disabled)}
      required=${ifDefined(args.required)}
      multiple=${ifDefined(args.multiple)}
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      retro-design=${ifDefined(args.retroDesign)}
      .value=${args.value as any}
      .options=${args.options ?? []}
    >
    </bln-select>
  `,
    argTypes: {
        label: { description: 'Beschriftung des Selects', type: { name: 'string' } },
        hint: { description: 'Hilfetext unter dem Feld', type: { name: 'string' } },
        cornerHint: { description: 'Hinweis rechts neben dem Label', type: { name: 'string' } },
        name: { description: 'Name des Feldes (Formular)', type: { name: 'string' } },
        placeholder: { description: 'Platzhalter (nur sinnvoll bei Single-Select)', type: { name: 'string' } },
        value: { description: 'Ausgewählter Wert (string) oder Werte (string[]) bei multiple', control: 'object' },
        disabled: { description: 'Deaktiviert das Feld', type: { name: 'boolean' } },
        required: { description: 'Pflichtfeld', type: { name: 'boolean' } },
        multiple: { description: 'Mehrfachauswahl aktivieren', type: { name: 'boolean' } },
        size: {
            description: 'Größe',
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
        class: { description: 'Zusätzliche CSS-Klassen', type: { name: 'string' } },
        isValid: { description: 'Gültigkeitszustand für Styles (setzt aria-invalid entsprechend)', type: { name: 'boolean' } },
        retroDesign: { description: 'Retro-Design aktivieren', type: { name: 'boolean' } },
        options: {
            description: 'Optionen als Array: {label, value, disabled?}',
            control: 'object',
        },
        ariaLabel: { name: 'aria-label', description: 'A11y: Eigene aria-label', type: { name: 'string' } },
        ariaLabelledby: { name: 'aria-labelledby', description: 'A11y: Verweist auf ID eines Labels', type: { name: 'string' } },
        ariaDescribedby: { name: 'aria-describedby', description: 'A11y: Verweist auf ID mit Beschreibung/Hint', type: { name: 'string' } },
    },
    args: {
        label: 'Kategorie',
        placeholder: 'Bitte wählen',
        size: 'medium',
        options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
            { label: 'Option C (disabled)', value: 'c', disabled: true },
        ],
    },
} satisfies Meta<Partial<BlnSelectProps>>;

export default meta;
type Story = StoryObj<Partial<BlnSelectProps>>;

export const Default: Story = {
    args: {
        value: '',
    },
};

export const WithPreselected: Story = {
    args: {
        value: 'b',
    },
};

export const Multiple: Story = {
    args: {
        multiple: true,
        value: ['a', 'c'],
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Required: Story = {
    args: {
        required: true}}