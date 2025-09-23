import './BlnRadioButton';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
const meta = {
    title: 'Base Components/RadioButton',
    tags: ['autodocs'],
    render: (args) => html `
    <bln-radio-button
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      name=${ifDefined(args.name)}
      value=${ifDefined(args.value)}
      ?retro-design=${args.retroDesign}
      class="${args.class ?? ''}"
    >${ifDefined(args.label) ?? 'Option'}</bln-radio-button>
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
};
export default meta;
export const Default = {};
export const Checked = { args: { checked: true } };
export const Disabled = { args: { disabled: true } };
export const Retro = { args: { retroDesign: true, checked: true } };
export const GroupExample = {
    render: () => html `
    <div class="flex gap-2">
      <bln-radio-button name="g" value="a">A</bln-radio-button>
      <bln-radio-button name="g" value="b">B</bln-radio-button>
      <bln-radio-button name="g" value="c" disabled>C</bln-radio-button>
    </div>
    <p class="text-xs text-gray-500">Klick auf eine Option setzt diese und hebt andere mit gleichem Namen auf.</p>
  `,
};
