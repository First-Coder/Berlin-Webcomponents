import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import FormBuilder from './FormBuilder';

// We showcase the FormBuilder by rendering the lit TemplateResults it produces
// inside a container. This is not a custom element, but a helper that returns
// templates for our components. Therefore, the story just calls the API and
// inlines the results into the page.

type Args = {
  email?: string;
  password?: string;
  number?: string;
  withBlnSelect?: boolean;
  withBlnCheckbox?: boolean;
  withBlnToast?: boolean;
  retroDesign?: boolean;
};

const meta = {
  title: 'Utilities/FormBuilder',
  tags: ['autodocs'],
  render: (args: Args) => {
    const fb = new FormBuilder();

    fb
      .addBlnInput({ label: 'E-Mail', name: 'email', type: 'email', value: args.email ?? '' })
      .addBlnInput({ label: 'Passwort', name: 'password', type: 'password', value: args.password ?? '' })
      .addBlnInput({ label: 'Zahl (10-99)', name: 'number', type: 'number', value: args.number ?? '' });

    if (args.withBlnSelect) {
      fb.addBlnSelect({
        label: 'Kategorie',
        placeholder: 'Bitte wählen',
        options: [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
          { label: 'Option C (disabled)', value: 'c', disabled: true },
        ],
      });
    }

    if (args.withBlnCheckbox) {
      fb.addBlnCheckbox({ label: 'AGB akzeptieren', name: 'agb' });
    }

    if (args.withBlnToast) {
      fb.addBlnToast({ open: true, variant: 'info', title: 'Hinweis', message: 'Beispiel Toast', retroDesign: args.retroDesign ?? false });
    }

    // Render all produced fields in a vertical stack
    return html`<div style="display: grid; gap: 12px; max-width: 480px;">${fb.getFields()}</div>`;
  },
  argTypes: {
    email: { description: 'Vorbelegter E-Mail-Wert', control: 'text' },
    password: { description: 'Vorbelegtes Passwort (nur Demo)', control: 'text' },
    number: { description: 'Vorbelegte Zahl (10-99)', control: 'text' },
    withBlnSelect: { description: 'BlnSelect hinzufügen', control: 'boolean' },
    withBlnCheckbox: { description: 'BlnCheckbox hinzufügen', control: 'boolean' },
    withBlnToast: { description: 'BlnToast hinzufügen', control: 'boolean' },
    retroDesign: { description: 'Retro-Design für Toast', control: 'boolean' },
  },
  args: {
    email: 'max@example.com',
    password: '',
    number: '42',
    withBlnSelect: true,
    withBlnCheckbox: true,
    withBlnToast: false,
    retroDesign: false,
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithToast: Story = {
  args: {
    withBlnToast: true,
  },
};
