import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnInput';
import type { BlnInputProps } from './BlnInput';

const meta = {
  title: 'Base Components/Input',
  tags: ['autodocs'],
  render: (args: Partial<BlnInputProps>) => html`
    <bln-input
      label=${ifDefined(args.label)}
      hint=${ifDefined(args.hint)}
      corner-hint=${ifDefined(args.cornerHint)}
      name=${ifDefined(args.name)}
      placeholder=${ifDefined(args.placeholder)}
      type=${ifDefined(args.type)}
      size=${ifDefined(args.size)}
      class="${args.class ?? ''}"
      is-valid=${ifDefined(args.isValid)}
      disabled=${ifDefined(args.disabled)}
      required=${ifDefined(args.required)}
      readonly=${ifDefined(args.readonly)}
      minlength=${ifDefined(args.minlength as any)}
      maxlength=${ifDefined(args.maxlength as any)}
      pattern=${ifDefined(args.pattern)}
      min=${ifDefined(args.min)}
      max=${ifDefined(args.max)}
      step=${ifDefined(args.step as any)}
      inputmode=${ifDefined(args.inputmode as any)}
      autocomplete=${ifDefined(args.autocomplete)}
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      retro-design=${ifDefined(args.retroDesign)}
      error=${ifDefined(args.error)}
      .value=${args.value as any}
    ></bln-input>
  `,
  argTypes: {
    label: { description: 'Beschriftung des Eingabefelds', type: { name: 'string' } },
    hint: { description: 'Hilfetext unter dem Feld', type: { name: 'string' } },
    cornerHint: { description: 'Hinweis rechts neben dem Label', type: { name: 'string' } },
    name: { description: 'Name des Feldes (Formular)', type: { name: 'string' } },
    placeholder: { description: 'Platzhalter', type: { name: 'string' } },
    type: { description: 'HTML Input-Typ', control: { type: 'select' }, options: ['text','email','url','number','password','search','tel','date','time','datetime-local'] },
    value: { description: 'Wert', control: 'text' },
    disabled: { description: 'Deaktiviert das Feld', type: { name: 'boolean' } },
    required: { description: 'Pflichtfeld', type: { name: 'boolean' } },
    readonly: { description: 'Nur lesbar', type: { name: 'boolean' } },
    minlength: { description: 'Minimale Länge', control: 'number' },
    maxlength: { description: 'Maximale Länge', control: 'number' },
    pattern: { description: 'Regex Pattern', control: 'text' },
    min: { description: 'Min (z.B. Zahl/Datum)', control: 'text' },
    max: { description: 'Max (z.B. Zahl/Datum)', control: 'text' },
    step: { description: 'Schrittweite', control: 'number' },
    inputmode: { description: 'Virtuelle Tastatur', control: { type: 'select' }, options: ['none','text','decimal','numeric','tel','search','email','url'] },
    autocomplete: { description: 'Autocomplete Attribut', control: 'text' },
    size: { description: 'Größe', control: { type: 'select' }, options: ['small','medium','large'] },
    class: { description: 'Zusätzliche CSS-Klassen', control: 'text' },
    isValid: { description: 'Gültigkeit (setzt Styles/Icons). Wenn nicht gesetzt, wird keine Gültigkeit erzwungen.', type: { name: 'boolean' } },
    retroDesign: { description: 'Retro-Design aktivieren', type: { name: 'boolean' } },
    error: { description: 'Fehlermeldung (unter dem Feld, a11y: role="alert")', control: 'text' },
    ariaLabel: { name: 'aria-label', description: 'A11y: eigenes aria-label', control: 'text' },
    ariaLabelledby: { name: 'aria-labelledby', description: 'A11y: verweist auf ID eines Labels', control: 'text' },
    ariaDescribedby: { name: 'aria-describedby', description: 'A11y: verweist auf ID mit Beschreibung/Hint', control: 'text' },
  },
  args: {
    label: 'Vorname',
    placeholder: 'Max',
    size: 'medium',
  },
} satisfies Meta<Partial<BlnInputProps>>;

export default meta;

type Story = StoryObj<Partial<BlnInputProps>>;

export const Default: Story = {
  args: {
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Berliner',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'nicht editierbar',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'nur lesbar',
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Sizes: Story = {
  args: {
    size: 'small',
  },
  render: (args) => html`
    <div style="display:flex; gap: 16px; flex-direction: column; width: 320px;">
      <bln-input label="Klein" size="small" placeholder="Small"></bln-input>
      <bln-input label="Mittel" size="medium" placeholder="Medium"></bln-input>
      <bln-input label="Groß" size="large" placeholder="Large"></bln-input>
    </div>
  `,
};

export const ValidAndInvalid: Story = {
  render: () => html`
    <div style="display:flex; gap: 24px; flex-direction: column; width: 320px;">
      <bln-input label="Gültig" .value=${'abc'} is-valid=${true} hint="Alles gut"></bln-input>
      <bln-input label="Ungültig" .value=${''} is-valid=${false} error="Pflichtfeld"></bln-input>
    </div>
  `,
};
