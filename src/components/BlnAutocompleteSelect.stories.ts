import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnAutocompleteSelect';
import type { BlnAutocompleteSelectProps } from './BlnAutocompleteSelect';
import type { BlnSelectOption } from './BlnSelect';

// Sample data for stories
const germanCities: BlnSelectOption[] = [
    { label: 'Berlin', value: 'berlin' },
    { label: 'München', value: 'munich' },
    { label: 'Hamburg', value: 'hamburg' },
    { label: 'Köln', value: 'cologne' },
    { label: 'Frankfurt am Main', value: 'frankfurt' },
    { label: 'Stuttgart', value: 'stuttgart' },
    { label: 'Düsseldorf', value: 'dusseldorf' },
    { label: 'Dortmund', value: 'dortmund' },
    { label: 'Essen', value: 'essen' },
    { label: 'Leipzig', value: 'leipzig' },
    { label: 'Bremen', value: 'bremen' },
    { label: 'Dresden', value: 'dresden' },
    { label: 'Hannover', value: 'hannover' },
    { label: 'Nürnberg', value: 'nuremberg' },
    { label: 'Duisburg', value: 'duisburg' },
    { label: 'Bochum (deaktiviert)', value: 'bochum', disabled: true }
];

const programmingLanguages: BlnSelectOption[] = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C#', value: 'csharp' },
    { label: 'C++', value: 'cpp' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
    { label: 'PHP', value: 'php' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'Swift', value: 'swift' },
    { label: 'Kotlin', value: 'kotlin' }
];

const meta = {
    title: 'Base Components/Autocomplete Select',
    tags: ['autodocs'],
    render: (args: Partial<BlnAutocompleteSelectProps>) => html`
    <bln-autocomplete-select
      label=${ifDefined(args.label)}
      hint=${ifDefined(args.hint)}
      corner-hint=${ifDefined(args.cornerHint)}
      name=${ifDefined(args.name)}
      placeholder=${ifDefined(args.placeholder)}
      search-placeholder=${ifDefined(args.searchPlaceholder)}
      size=${ifDefined(args.size)}
      class="${args.class ?? ''}"
      is-valid=${ifDefined(args.isValid)}
      disabled=${ifDefined(args.disabled)}
      required=${ifDefined(args.required)}
      multiple=${ifDefined(args.multiple)}
      min-search-chars=${ifDefined(args.minSearchChars)}
      no-results-text=${ifDefined(args.noResultsText)}
      loading-text=${ifDefined(args.loadingText)}
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      retro-design=${ifDefined(args.retroDesign)}
      .value=${args.value as any}
      .options=${args.options ?? []}
    >
    </bln-autocomplete-select>
  `,
    argTypes: {
        label: { description: 'Beschriftung des Autocomplete-Selects', type: { name: 'string' } },
        hint: { description: 'Hilfetext unter dem Feld', type: { name: 'string' } },
        cornerHint: { description: 'Hinweis rechts neben dem Label', type: { name: 'string' } },
        name: { description: 'Name des Feldes (Formular)', type: { name: 'string' } },
        placeholder: { description: 'Platzhalter für das Eingabefeld (wird nicht verwendet)', type: { name: 'string' } },
        searchPlaceholder: { description: 'Platzhalter für das Suchfeld', type: { name: 'string' } },
        value: { 
            description: 'Ausgewählter Wert (string) oder Werte (string[]) bei multiple', 
            control: 'object' 
        },
        disabled: { description: 'Deaktiviert das Feld', type: { name: 'boolean' } },
        required: { description: 'Pflichtfeld', type: { name: 'boolean' } },
        multiple: { description: 'Mehrfachauswahl aktivieren', type: { name: 'boolean' } },
        size: {
            description: 'Größe des Eingabefelds',
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
        class: { description: 'Zusätzliche CSS-Klassen', type: { name: 'string' } },
        isValid: { 
            description: 'Gültigkeitszustand für Styles (setzt aria-invalid entsprechend)', 
            type: { name: 'boolean' } 
        },
        retroDesign: { description: 'Retro-Design aktivieren', type: { name: 'boolean' } },
        minSearchChars: {
            description: 'Mindestanzahl Zeichen für Filterung',
            control: { type: 'number', min: 0, max: 5 }
        },
        noResultsText: {
            description: 'Text wenn keine Ergebnisse gefunden werden',
            type: { name: 'string' }
        },
        loadingText: {
            description: 'Text während Ladevorgang (nicht implementiert)',
            type: { name: 'string' }
        },
        options: {
            description: 'Optionen als Array: {label, value, disabled?}',
            control: 'object',
        },
        ariaLabel: { 
            name: 'aria-label', 
            description: 'A11y: Eigene aria-label', 
            type: { name: 'string' } 
        },
        ariaLabelledby: { 
            name: 'aria-labelledby', 
            description: 'A11y: Verweist auf ID eines Labels', 
            type: { name: 'string' } 
        },
        ariaDescribedby: { 
            name: 'aria-describedby', 
            description: 'A11y: Verweist auf ID mit Beschreibung/Hint', 
            type: { name: 'string' } 
        },
    },
    args: {
        label: 'Stadt auswählen',
        searchPlaceholder: 'Stadt suchen...',
        size: 'medium',
        minSearchChars: 1,
        noResultsText: 'Keine Ergebnisse gefunden',
        options: germanCities,
    },
    parameters: {
        docs: {
            description: {
                component: `
# BlnAutocompleteSelect — Suchbares Select-Element

Ein zugängliches Autocomplete-Select-Element basierend auf BlnSelect mit erweiterten Suchfunktionen.

## Hauptfeatures

- **Suchfunktion**: Filtert Optionen basierend auf Eingabe
- **Konfigurierbare Mindestzeichen**: Bestimmt ab wann gefiltert wird
- **Barrierefrei**: Vollständige ARIA-Unterstützung mit Combobox-Pattern
- **Single & Multiple**: Unterstützt Einzel- und Mehrfachauswahl
- **Keyboard Navigation**: Vollständige Tastatursteuerung
- **Externe Items**: Optionen werden von außen übergeben
- **Retro Design**: Optional verfügbar

## Accessibility Features

- **ARIA Combobox Pattern**: Implementiert WAI-ARIA Combobox-Spezifikation
- **Keyboard Support**: Pfeiltasten, Enter, Escape
- **Screen Reader Support**: Korrekte Ansagen und Navigation
- **Focus Management**: Professionelle Fokus-Verwaltung

## Verwendung

\`\`\`typescript
// Grundlegende Verwendung
const cities = [
  { label: 'Berlin', value: 'berlin' },
  { label: 'München', value: 'munich' }
];

// Single Selection
<bln-autocomplete-select
  label="Stadt"
  .options={cities}
  min-search-chars="2"
></bln-autocomplete-select>

// Multiple Selection
<bln-autocomplete-select
  label="Städte"
  .options={cities}
  multiple
></bln-autocomplete-select>
\`\`\`

## Events

- **search**: Wird bei jeder Eingabe ausgelöst
- **change**: Standard-Änderungsevent
- **input**: Standard-Input-Event
                `
            }
        }
    }
} satisfies Meta<Partial<BlnAutocompleteSelectProps>>;

export default meta;
type Story = StoryObj<Partial<BlnAutocompleteSelectProps>>;

export const Default: Story = {
    args: {
        value: '',
    },
    parameters: {
        docs: {
            description: {
                story: 'Standard-Autocomplete mit Städten. Tippe mindestens ein Zeichen um zu filtern.'
            }
        }
    }
};

export const WithPreselected: Story = {
    args: {
        value: 'berlin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Autocomplete mit vorausgewählter Option. Der Wert wird im Suchfeld angezeigt.'
            }
        }
    }
};

export const MinSearchChars: Story = {
    args: {
        label: 'Stadt (min. 3 Zeichen)',
        hint: 'Gib mindestens 3 Zeichen ein um zu suchen',
        minSearchChars: 3,
    },
    parameters: {
        docs: {
            description: {
                story: 'Autocomplete das erst ab 3 Zeichen filtert. Nützlich bei großen Datenmengen.'
            }
        }
    }
};

export const MultipleSelection: Story = {
    args: {
        label: 'Mehrere Städte',
        hint: 'Wähle mehrere Städte aus',
        multiple: true,
        value: ['berlin', 'munich'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Mehrfachauswahl mit Tags. Ausgewählte Optionen werden als entfernbare Tags angezeigt.'
            }
        }
    }
};

export const ProgrammingLanguages: Story = {
    args: {
        label: 'Programmiersprachen',
        searchPlaceholder: 'Sprache suchen...',
        hint: 'Wähle deine bevorzugten Programmiersprachen',
        multiple: true,
        options: programmingLanguages,
        value: ['javascript', 'typescript'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Beispiel mit Programmiersprachen zur Demonstration verschiedener Datentypen.'
            }
        }
    }
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'berlin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Deaktiviertes Autocomplete-Select. Das Eingabefeld ist nicht interaktiv.'
            }
        }
    }
};

export const Required: Story = {
    args: {
        required: true,
        hint: 'Dieses Feld ist erforderlich',
    },
    parameters: {
        docs: {
            description: {
                story: 'Pflichtfeld-Autocomplete mit required-Attribut für Formularvalidierung.'
            }
        }
    }
};

export const ValidationStates: Story = {
    name: 'Validation (Valid/Invalid)',
    render: () => html`
        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-medium mb-4">Gültig (Valid)</h3>
                <bln-autocomplete-select
                    label="Gültige Auswahl"
                    hint="Diese Auswahl ist korrekt"
                    is-valid="true"
                    .value=${'berlin'}
                    .options=${germanCities}>
                </bln-autocomplete-select>
            </div>
            
            <div>
                <h3 class="text-lg font-medium mb-4">Ungültig (Invalid)</h3>
                <bln-autocomplete-select
                    label="Ungültige Auswahl"
                    hint="Hier ist ein Fehler aufgetreten"
                    is-valid="false"
                    .value=${'invalid'}
                    .options=${germanCities}>
                </bln-autocomplete-select>
            </div>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Validierungszustände mit entsprechenden visuellen Indikatoren und Icons.'
            }
        }
    }
};

export const Sizes: Story = {
    name: 'Different Sizes',
    render: () => html`
        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-medium mb-4">Klein (Small)</h3>
                <bln-autocomplete-select
                    label="Kleine Größe"
                    size="small"
                    .options=${germanCities.slice(0, 5)}>
                </bln-autocomplete-select>
            </div>
            
            <div>
                <h3 class="text-lg font-medium mb-4">Medium (Standard)</h3>
                <bln-autocomplete-select
                    label="Mittlere Größe"
                    size="medium"
                    .options=${germanCities.slice(0, 5)}>
                </bln-autocomplete-select>
            </div>
            
            <div>
                <h3 class="text-lg font-medium mb-4">Groß (Large)</h3>
                <bln-autocomplete-select
                    label="Große Größe"
                    size="large"
                    .options=${germanCities.slice(0, 5)}>
                </bln-autocomplete-select>
            </div>
        </div>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Verschiedene Größen des Autocomplete-Selects für unterschiedliche Design-Anforderungen.'
            }
        }
    }
};

export const RetroDesign: Story = {
    args: {
        label: 'Retro Autocomplete',
        hint: 'Mit klassischem Retro-Styling',
        retroDesign: true,
        cornerHint: 'Retro',
    },
    parameters: {
        docs: {
            description: {
                story: 'Autocomplete mit Retro-Design für klassische Anwendungen oder nostalgische Interfaces.'
            }
        }
    }
};

export const NoResultsCustomText: Story = {
    args: {
        label: 'Autocomplete mit Custom No-Results',
        noResultsText: '🔍 Leider nichts gefunden...',
        options: germanCities.slice(0, 3), // Weniger Optionen für Demo
    },
    parameters: {
        docs: {
            description: {
                story: 'Benutzerdefinierter Text wenn keine Suchergebnisse gefunden werden. Suche nach "xyz" um zu testen.'
            }
        }
    }
};

export const AccessibilityDemo: Story = {
    name: 'Accessibility Features',
    args: {
        label: 'Barrierefreies Autocomplete',
        hint: 'Nutze Pfeiltasten, Enter und Escape zur Navigation',
        ariaLabel: 'Stadt für Reiseplanung auswählen',
        cornerHint: 'Pflichtfeld',
        required: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
**Accessibility Features im Detail:**

- **Keyboard Navigation**: 
  - ↓/↑ Pfeiltasten: Navigation durch Optionen
  - Enter: Auswahl bestätigen  
  - Escape: Dropdown schließen
  
- **Screen Reader Support**:
  - ARIA Combobox Pattern
  - aria-expanded für Dropdown-Status
  - aria-selected für ausgewählte Optionen
  - aria-activedescendant für aktuelle Fokus-Option
  
- **Focus Management**:
  - Sichtbare Fokus-Indikatoren
  - Logische Tab-Reihenfolge
  - Fokus bleibt im Eingabefeld bei Navigation

**Teste die Barrierefreiheit:**
1. Nutze nur die Tastatur zur Navigation
2. Aktiviere einen Screen Reader
3. Überprüfe die Tab-Reihenfolge
                `
            }
        }
    }
};

export const FormIntegration: Story = {
    name: 'Form Integration Example',
    render: () => html`
        <form @submit=${(e: Event) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data: Record<string, any> = {};
            for (const [key, value] of formData as any) {
                data[key] = value;
            }
            console.log('Form submitted:', data);
            alert('Check console for form data');
        }}>
            <div class="space-y-4">
                <bln-autocomplete-select
                    label="Hauptwohnsitz"
                    name="primary_city"
                    required
                    hint="Wähle deine Hauptstadt"
                    .options=${germanCities}>
                </bln-autocomplete-select>
                
                <bln-autocomplete-select
                    label="Weitere Städte"
                    name="other_cities"
                    multiple
                    hint="Optional: Weitere Städte die du kennst"
                    .options=${germanCities}>
                </bln-autocomplete-select>
                
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
                    Absenden
                </button>
            </div>
        </form>
    `,
    parameters: {
        docs: {
            description: {
                story: 'Integration in HTML-Formulare mit name-Attributen und Formular-Validierung.'
            }
        }
    }
};