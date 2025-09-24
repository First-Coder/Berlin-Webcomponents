import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnTextarea';
import type { BlnTextareaProps } from './BlnTextarea';

const meta = {
  title: 'Base Components/Textarea',
  tags: ['autodocs'],
  render: (args: Partial<BlnTextareaProps>) => html`
    <bln-textarea
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
      readonly=${ifDefined(args.readonly)}
      minlength=${ifDefined(args.minlength as any)}
      maxlength=${ifDefined(args.maxlength as any)}
      rows=${ifDefined(args.rows as any)}
      cols=${ifDefined(args.cols as any)}
      wrap=${ifDefined(args.wrap)}
      resize=${ifDefined(args.resize)}
      autocomplete=${ifDefined(args.autocomplete)}
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      retro-design=${ifDefined(args.retroDesign)}
      error=${ifDefined(args.error)}
      .value=${args.value as any}
    ></bln-textarea>
  `,
  argTypes: {
    label: { description: 'Beschriftung des Textfeldes', type: { name: 'string' } },
    hint: { description: 'Hilfetext unter dem Feld', type: { name: 'string' } },
    cornerHint: { description: 'Hinweis rechts neben dem Label', type: { name: 'string' } },
    name: { description: 'Name des Feldes (Formular)', type: { name: 'string' } },
    placeholder: { description: 'Platzhalter', type: { name: 'string' } },
    value: { description: 'Wert', control: 'text' },
    disabled: { description: 'Deaktiviert das Feld', type: { name: 'boolean' } },
    required: { description: 'Pflichtfeld', type: { name: 'boolean' } },
    readonly: { description: 'Nur lesbar', type: { name: 'boolean' } },
    minlength: { description: 'Minimale Länge', control: 'number' },
    maxlength: { description: 'Maximale Länge', control: 'number' },
    rows: { description: 'Anzahl der Zeilen', control: 'number' },
    cols: { description: 'Anzahl der Spalten', control: 'number' },
    wrap: { description: 'Textumbruch', control: { type: 'select' }, options: ['soft','hard','off'] },
    resize: { description: 'Größenänderung', control: { type: 'select' }, options: ['none','both','horizontal','vertical'] },
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
    label: 'Beschreibung',
    placeholder: 'Geben Sie hier Ihre Beschreibung ein...',
    size: 'medium',
    rows: 4,
    resize: 'vertical',
  },
} satisfies Meta<Partial<BlnTextareaProps>>;

export default meta;

type Story = StoryObj<Partial<BlnTextareaProps>>;

export const Default: Story = {
  args: {
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Das ist ein mehrzeiliger Text\nmit verschiedenen Zeilen\nund Inhalten.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Dieser Text ist nicht editierbar\nwegen des disabled-Attributs.',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'Dieser Text ist nur lesbar\nund kann nicht verändert werden.',
  },
};

export const Required: Story = {
  args: {
    required: true,
    hint: 'Dieses Feld ist erforderlich',
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap: 16px; flex-direction: column; width: 400px;">
      <bln-textarea label="Klein" size="small" placeholder="Small Textarea" rows="3"></bln-textarea>
      <bln-textarea label="Mittel" size="medium" placeholder="Medium Textarea" rows="4"></bln-textarea>
      <bln-textarea label="Groß" size="large" placeholder="Large Textarea" rows="5"></bln-textarea>
    </div>
  `,
};

export const DifferentRows: Story = {
  render: () => html`
    <div style="display:flex; gap: 16px; flex-direction: column; width: 400px;">
      <bln-textarea label="2 Zeilen" rows="2" placeholder="Kurzer Text"></bln-textarea>
      <bln-textarea label="4 Zeilen (Standard)" rows="4" placeholder="Normaler Text"></bln-textarea>
      <bln-textarea label="8 Zeilen" rows="8" placeholder="Langer Text"></bln-textarea>
    </div>
  `,
};

export const ResizeOptions: Story = {
  render: () => html`
    <div style="display:flex; gap: 16px; flex-direction: column; width: 400px;">
      <bln-textarea label="Nicht skalierbar" resize="none" placeholder="resize: none"></bln-textarea>
      <bln-textarea label="Vertikal skalierbar" resize="vertical" placeholder="resize: vertical (Standard)"></bln-textarea>
      <bln-textarea label="Horizontal skalierbar" resize="horizontal" placeholder="resize: horizontal"></bln-textarea>
      <bln-textarea label="Beide Richtungen" resize="both" placeholder="resize: both"></bln-textarea>
    </div>
  `,
};

export const ValidAndInvalid: Story = {
  render: () => html`
    <div style="display:flex; gap: 24px; flex-direction: column; width: 400px;">
      <bln-textarea 
        label="Gültig" 
        .value=${'Das ist ein gültiger Text\nmit mehreren Zeilen.'} 
        is-valid=${true} 
        hint="Alles gut"
        rows="3">
      </bln-textarea>
      <bln-textarea 
        label="Ungültig" 
        .value=${''} 
        is-valid=${false} 
        error="Dieses Feld ist erforderlich"
        rows="3">
      </bln-textarea>
    </div>
  `,
};

export const WithMaxLength: Story = {
  args: {
    label: 'Kommentar',
    maxlength: 200,
    hint: 'Maximal 200 Zeichen',
    placeholder: 'Ihr Kommentar hier...',
    rows: 5,
  },
};

export const RetroDesign: Story = {
  args: {
    label: 'Nachricht',
    retroDesign: true,
    value: 'Retro-Design aktiviert\nmit eckigen Ecken und\nbesonderen Fokus-Styles.',
    rows: 4,
  },
};

export const WrapOptions: Story = {
  render: () => html`
    <div style="display:flex; gap: 16px; flex-direction: column; width: 400px;">
      <bln-textarea 
        label="Soft Wrap (Standard)" 
        wrap="soft" 
        cols="30"
        .value=${'Dies ist ein sehr langer Text der automatisch umgebrochen wird wenn die Zeilenlänge erreicht ist aber beim Absenden nicht umgebrochen übertragen wird.'}
        rows="4">
      </bln-textarea>
      <bln-textarea 
        label="Hard Wrap" 
        wrap="hard" 
        cols="30"
        .value=${'Dies ist ein sehr langer Text der automatisch umgebrochen wird und beim Absenden mit den Zeilenumbrüchen übertragen wird.'}
        rows="4">
      </bln-textarea>
      <bln-textarea 
        label="Kein Wrap" 
        wrap="off" 
        .value=${'Dies ist ein sehr langer Text der nicht automatisch umgebrochen wird und horizontal scrollbar ist.'}
        rows="4">
      </bln-textarea>
    </div>
  `,
};