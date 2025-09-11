import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './BlnSelect';
const modules = import.meta.glob([
    './components/**/*.ts',
    '!./**/*.stories.*',
    '!./**/*.spec.*',
    '!./**/*.test.*',
    '!./**/*.d.ts',
    '!./index.ts',
    '!./components/BlnTree.ts',
], {
    eager: true,
});
// Optional: Für Debugzwecke auflisten
console.debug('Geladene Module:', Object.keys(modules));
export * from './components/BlnSelect';
export * from './components/BlnCheckBox';
export * from './components/BlnTreeView';
export * from './components/BlnToast';
const meta = {
    title: 'Base Components/Select',
    tags: ['autodocs'],
    parameters: {
        actions: { handles: ['change', 'input'] },
        docs: {
            description: {
                component: `
Ein zugängliches Select-Element auf Basis von Lit + Tailwind.

A11y-Hinweise:
- Label ist mit dem Select via for/id verknüpft.
- hint wird automatisch via aria-describedby referenziert.
- is-valid steuert visuelle Zustände und setzt aria-invalid entsprechend.
- Native <select> sichert Tastaturbedienung und Screenreader-Support.
        `.trim(),
            },
        },
    },
    render: (args) => html `
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
      .value=${args.value}
      .options=${args.options ?? []}
      @change=${(e) => console.log('change', e)}
      @input=${(e) => console.log('input', e)}
    ></bln-select>
  `,
    argTypes: {
        label: { description: 'Beschriftung des Selects', type: { name: 'string' } },
        hint: { description: 'Hilfetext unter dem Feld', type: { name: 'string' } },
        cornerHint: { description: 'Hinweis rechts neben dem Label', type: { name: 'string' } },
        name: { description: 'Name des Feldes (Formular)', type: { name: 'string' } },
        placeholder: { description: 'Platzhalter (nur sinnvoll bei Single-Select)', type: { name: 'string' } },
        value: { description: 'Ausgewählter Wert (string) bzw. Werte (string[]) bei multiple', control: 'object' },
        disabled: { description: 'Deaktiviert das Feld', type: { name: 'boolean' } },
        required: { description: 'Pflichtfeld', type: { name: 'boolean' } },
        multiple: { description: 'Mehrfachauswahl aktivieren', type: { name: 'boolean' } },
        size: {
            description: 'Größe',
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
        class: { description: 'Zusätzliche CSS-Klassen', type: { name: 'string' } },
        isValid: { description: 'Gültigkeitszustand (steuert Styles und aria-invalid)', type: { name: 'boolean' } },
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
};
export default meta;
export const Default = {
    args: {
        value: '',
    },
    parameters: {
        docs: {
            description: {
                story: 'Standardvariante, Single-Select mit Platzhalter.',
            },
        },
    },
};
export const WithPreselected = {
    args: {
        value: 'b',
    },
    parameters: {
        docs: {
            description: {
                story: 'Eine Option wird initial vorausgewählt.',
            },
        },
    },
};
export const Multiple = {
    args: {
        multiple: true,
        value: ['a', 'c'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Mehrfachauswahl mit string[] als Value.',
            },
        },
    },
};
export const Disabled = {
    args: {
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Deaktivierter Zustand mit reduzierter Interaktion.',
            },
        },
    },
};
export const Required = {
    args: {
        required: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Pflichtfeld; native Validierung durch Browser.',
            },
        },
    },
};
export const Sizes = {
    render: (args) => html `
    <div class="flex flex-col gap-6">
      ${['small', 'medium', 'large'].map((s) => html `
          <div>
            <bln-select
              label="Size: ${s}"
              size=${s}
              placeholder=${ifDefined(args.placeholder)}
              .options=${args.options}
              .value=${args.value}
            ></bln-select>
          </div>
        `)}
    </div>
  `,
    args: {
        value: '',
    },
    parameters: {
        docs: {
            description: {
                story: 'Die drei verfügbaren Größen.',
            },
        },
    },
};
export const RetroDesign = {
    args: {
        retroDesign: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Retro-Design-Variante mit kantigem Fokus-/Borderverhalten.',
            },
        },
    },
};
export const ValidationStates = {
    render: (args) => html `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <bln-select
        label="Valid"
        is-valid=${true}
        .options=${args.options}
        .value=${'a'}
      ></bln-select>
      <bln-select
        label="Invalid"
        is-valid=${false}
        .options=${args.options}
        .value=${'b'}
      ></bln-select>
    </div>
  `,
    parameters: {
        docs: {
            description: {
                story: 'Zeigt Success-/Error-Indikatoren und entsprechende Borderfarben.',
            },
        },
    },
};
export const SlottedOptions = {
    render: (args) => html `
    <bln-select
      label=${ifDefined(args.label)}
      placeholder=${ifDefined(args.placeholder)}
      .value=${args.value}
      size=${ifDefined(args.size)}
      class="${args.class ?? ''}"
    >
      <option value="" disabled hidden>Bitte wählen</option>
      <option value="a">Geschlottete Option A</option>
      <option value="b">Geschlottete Option B</option>
      <option value="c" disabled>Geschlottete Option C (disabled)</option>
    </bln-select>
  `,
    args: {
        value: '',
        options: undefined, // Slot statt .options
    },
    parameters: {
        docs: {
            description: {
                story: 'Beispiel für Nutzung mit eigenen <option>-Kindern via Slot.',
            },
        },
    },
};
