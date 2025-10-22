import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnCalendar';
import type { BlnCalendarProps } from './BlnCalendar';

const meta = {
  title: 'Base Components/Calendar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Ein vollständig zugänglicher Kalender für die Auswahl von Datumsbereichen.

**Funktionen:**
- Auswahl von zwei Datumswerten (Start- und Enddatum)
- Anpassbare Datumsformate (dd.MM.yyyy, yyyy-MM-dd, dd/MM/yyyy, MM/dd/yyyy)
- Heute-Button für schnelle Auswahl des aktuellen Datums
- Löschen-Button zum Zurücksetzen der Auswahl
- Min/Max-Datum Einschränkungen
- Vollständige Tastaturnavigation

**Accessibility Features:**
- ARIA-Grid für den Kalender
- Roving Tabindex für Fokusmanagement
- Tastaturnavigation: Pfeiltasten, Home/End, Enter/Space
- Screen Reader Unterstützung
- Korrekte Beschriftung aller interaktiven Elemente

**Tastaturnavigation:**
- **Pfeiltasten**: Navigation zwischen Tagen
- **Home/End**: Zum ersten/letzten Tag des Monats
- **Enter/Space**: Datum auswählen
        `.trim(),
      },
    },
  },
  render: (args: Partial<BlnCalendarProps>) => html`
    <bln-calendar
      label=${ifDefined(args.label)}
      hint=${ifDefined(args.hint)}
      corner-hint=${ifDefined(args.cornerHint)}
      name=${ifDefined(args.name)}
      start-date=${ifDefined(args.startDate)}
      end-date=${ifDefined(args.endDate)}
      date-format=${ifDefined(args.dateFormat)}
      size=${ifDefined(args.size)}
      class="${args.class ?? ''}"
      is-valid=${ifDefined(args.isValid)}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?readonly=${args.readonly}
      min-date=${ifDefined(args.minDate)}
      max-date=${ifDefined(args.maxDate)}
      ?show-today-button=${args.showTodayButton}
      ?show-clear-button=${args.showClearButton}
      locale=${ifDefined(args.locale)}
      ?retro-design=${args.retroDesign}
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      error=${ifDefined(args.error)}
      @date-change=${(e: CustomEvent) => console.log('Date changed:', e.detail)}
      @today-click=${(e: CustomEvent) => console.log('Today clicked:', e.detail)}
      @clear-click=${(e: CustomEvent) => console.log('Clear clicked:', e.detail)}
    ></bln-calendar>
  `,
  argTypes: {
    label: { description: 'Beschriftung des Kalenders', control: 'text' },
    hint: { description: 'Hilfetext unter dem Kalender', control: 'text' },
    cornerHint: { description: 'Hinweis rechts neben dem Label', control: 'text' },
    name: { description: 'Name des Feldes (Formular)', control: 'text' },
    startDate: { description: 'Startdatum im gewählten Format', control: 'text' },
    endDate: { description: 'Enddatum im gewählten Format', control: 'text' },
    dateFormat: { 
      description: 'Format für Datumsanzeige und -eingabe', 
      control: { type: 'select' }, 
      options: ['dd.MM.yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy'] 
    },
    disabled: { description: 'Kalender deaktivieren', control: 'boolean' },
    required: { description: 'Pflichtfeld', control: 'boolean' },
    readonly: { description: 'Nur lesbar', control: 'boolean' },
    minDate: { description: 'Frühestes auswählbares Datum', control: 'text' },
    maxDate: { description: 'Spätestes auswählbares Datum', control: 'text' },
    showTodayButton: { description: 'Heute-Button anzeigen', control: 'boolean' },
    showClearButton: { description: 'Löschen-Button anzeigen', control: 'boolean' },
    locale: { description: 'Locale für Monatsanzeige', control: 'text' },
    size: {
      description: 'Größe des Kalenders',
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    class: { description: 'Zusätzliche CSS-Klassen', control: 'text' },
    isValid: { description: 'Gültigkeitszustand (steuert Styles und Icons)', control: 'boolean' },
    retroDesign: { description: 'Retro-Design aktivieren', control: 'boolean' },
    error: { description: 'Fehlermeldung', control: 'text' },
    ariaLabel: { name: 'aria-label', description: 'A11y: Eigene aria-label', control: 'text' },
    ariaLabelledby: { name: 'aria-labelledby', description: 'A11y: Verweist auf ID eines Labels', control: 'text' },
    ariaDescribedby: { name: 'aria-describedby', description: 'A11y: Verweist auf ID mit Beschreibung', control: 'text' },
  },
  args: {
    label: 'Datumsbereich auswählen',
    hint: 'Wählen Sie Start- und Enddatum aus',
    size: 'medium',
    dateFormat: 'dd.MM.yyyy',
    showTodayButton: true,
    showClearButton: true,
    locale: 'de-DE',
  },
} satisfies Meta<Partial<BlnCalendarProps>>;

export default meta;

type Story = StoryObj<Partial<BlnCalendarProps>>;

export const Default: Story = {
  args: {},
};

export const WithPreselectedRange: Story = {
  args: {
    startDate: '22.10.2025',
    endDate: '25.10.2025',
    hint: 'Bereits vorausgewählter Datumsbereich',
  },
};

export const SingleDateSelection: Story = {
  args: {
    startDate: '22.10.2025',
    label: 'Einzeldatum',
    hint: 'Nur ein Startdatum ausgewählt',
  },
};

export const DateFormats: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Deutsches Format (dd.MM.yyyy)</h3>
        <bln-calendar
          label="Deutsches Format"
          date-format="dd.MM.yyyy"
          start-date="22.10.2025"
          end-date="25.10.2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">ISO Format (yyyy-MM-dd)</h3>
        <bln-calendar
          label="ISO Format"
          date-format="yyyy-MM-dd"
          start-date="2025-10-22"
          end-date="2025-10-25">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">UK Format (dd/MM/yyyy)</h3>
        <bln-calendar
          label="UK Format"
          date-format="dd/MM/yyyy"
          start-date="22/10/2025"
          end-date="25/10/2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">US Format (MM/dd/yyyy)</h3>
        <bln-calendar
          label="US Format"
          date-format="MM/dd/yyyy"
          start-date="10/22/2025"
          end-date="10/25/2025">
        </bln-calendar>
      </div>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Klein</h3>
        <bln-calendar
          label="Kleiner Kalender"
          size="small"
          start-date="22.10.2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Mittel (Standard)</h3>
        <bln-calendar
          label="Mittlerer Kalender"
          size="medium"
          start-date="22.10.2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Groß</h3>
        <bln-calendar
          label="Großer Kalender"
          size="large"
          start-date="22.10.2025">
        </bln-calendar>
      </div>
    </div>
  `,
};

export const WithDateRestrictions: Story = {
  args: {
    label: 'Eingeschränkter Datumsbereich',
    hint: 'Nur Daten zwischen dem 20. und 30. Oktober 2025 sind auswählbar',
    minDate: '20.10.2025',
    maxDate: '30.10.2025',
    startDate: '22.10.2025',
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Deaktivierter Kalender',
    hint: 'Dieser Kalender kann nicht verwendet werden',
    disabled: true,
    startDate: '22.10.2025',
    endDate: '25.10.2025',
  },
};

export const ReadonlyState: Story = {
  args: {
    label: 'Schreibgeschützter Kalender',
    hint: 'Ausgewählte Daten können nur angezeigt, nicht geändert werden',
    readonly: true,
    startDate: '22.10.2025',
    endDate: '25.10.2025',
  },
};

export const WithoutActionButtons: Story = {
  args: {
    label: 'Ohne Action-Buttons',
    hint: 'Heute und Löschen Buttons sind ausgeblendet',
    showTodayButton: false,
    showClearButton: false,
    startDate: '22.10.2025',
  },
};

export const ValidationStates: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Gültiger Datumsbereich</h3>
        <bln-calendar
          label="Gültiger Bereich"
          start-date="22.10.2025"
          end-date="25.10.2025"
          is-valid=${true}
          hint="Dieser Datumsbereich ist gültig">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Ungültiger Datumsbereich</h3>
        <bln-calendar
          label="Ungültiger Bereich"
          start-date="25.10.2025"
          end-date="22.10.2025"
          is-valid=${false}
          error="Enddatum muss nach dem Startdatum liegen">
        </bln-calendar>
      </div>
    </div>
  `,
};

export const CustomLocales: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Deutsch (de-DE)</h3>
        <bln-calendar
          label="Deutsche Monatsanzeige"
          locale="de-DE"
          start-date="22.10.2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Englisch (en-US)</h3>
        <bln-calendar
          label="English Month Display"
          locale="en-US"
          start-date="22.10.2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Französisch (fr-FR)</h3>
        <bln-calendar
          label="Affichage du mois français"
          locale="fr-FR"
          start-date="22.10.2025">
        </bln-calendar>
      </div>
    </div>
  `,
};

export const RetroDesign: Story = {
  args: {
    label: 'Retro-Design Kalender',
    hint: 'Mit eckigen Ecken und besonderen Fokus-Styles',
    retroDesign: true,
    startDate: '22.10.2025',
    endDate: '25.10.2025',
  },
};

export const AccessibilityDemo: Story = {
  args: {
    label: 'Accessibility Demo',
    ariaLabel: 'Kalender für Urlaubsplanung',
    hint: 'Verwenden Sie die Pfeiltasten zur Navigation, Enter zum Auswählen',
    startDate: '22.10.2025',
  },
  render: (args) => html`
    <div style="max-width: 600px;">
      <div id="calendar-instructions" style="background: #e3f2fd; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
        <strong>Tastaturnavigation:</strong>
        <ul style="margin: 0.5rem 0 0 1rem;">
          <li><strong>Pfeiltasten:</strong> Zwischen Tagen navigieren</li>
          <li><strong>Home/End:</strong> Zum ersten/letzten Tag des Monats</li>
          <li><strong>Enter/Space:</strong> Datum auswählen</li>
          <li><strong>Tab:</strong> Zwischen Kalender-Elementen wechseln</li>
        </ul>
      </div>
      
      <bln-calendar
        label=${args.label}
        aria-label=${args.ariaLabel}
        aria-describedby="calendar-instructions"
        hint=${args.hint}
        start-date=${args.startDate}
        @date-change=${(e: CustomEvent) => {
          console.log('Accessibility Demo - Date changed:', e.detail);
        }}>
      </bln-calendar>
    </div>
  `,
};

export const EventHandling: Story = {
  args: {
    label: 'Event Handling Demo',
    hint: 'Öffnen Sie die Browser-Konsole, um Events zu sehen',
  },
  render: (args) => html`
    <div>
      <bln-calendar
        label=${args.label}
        hint=${args.hint}
        @date-change=${(e: CustomEvent) => {
          console.log('📅 Date Change Event:', e.detail);
          // Update UI feedback
          const feedback = document.getElementById('event-feedback');
          if (feedback) {
            feedback.innerHTML = `
              <strong>Date Change:</strong><br>
              Start: ${e.detail.startDate || 'Nicht ausgewählt'}<br>
              End: ${e.detail.endDate || 'Nicht ausgewählt'}
            `;
          }
        }}
        @today-click=${(e: CustomEvent) => {
          console.log('🗓️ Today Click Event:', e.detail);
          const feedback = document.getElementById('event-feedback');
          if (feedback) {
            feedback.innerHTML = `<strong>Today clicked!</strong><br>Date: ${e.detail.startDate}`;
          }
        }}
        @clear-click=${(e: CustomEvent) => {
          console.log('🗑️ Clear Click Event:', e.detail);
          const feedback = document.getElementById('event-feedback');
          if (feedback) {
            feedback.innerHTML = '<strong>Calendar cleared!</strong>';
          }
        }}
        @validitychange=${(e: CustomEvent) => {
          console.log('✅ Validity Change Event:', e.detail);
        }}>
      </bln-calendar>
      
      <div id="event-feedback" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px; min-height: 60px;">
        <em>Event-Informationen werden hier angezeigt...</em>
      </div>
    </div>
  `,
};

export const CustomValidation: Story = {
  render: () => {
    // This would typically be done in a real component with proper state management
    return html`
      <div>
        <h3 style="margin-bottom: 1rem;">Benutzerdefinierte Validierung</h3>
        <p style="margin-bottom: 1rem;">
          Beispiel: Der Datumsbereich darf maximal 7 Tage umfassen.
        </p>
        
        <bln-calendar
          label="Maximal 7 Tage Bereich"
          hint="Wählen Sie einen Bereich von maximal 7 Tagen aus"
          .validator=${(startDate: string, endDate: string) => {
            if (!startDate || !endDate) {
              return { valid: true }; // Allow empty state
            }
            
            const start = new Date(startDate.split('.').reverse().join('-'));
            const end = new Date(endDate.split('.').reverse().join('-'));
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return {
              valid: diffDays <= 7,
              message: diffDays > 7 ? `Der Bereich umfasst ${diffDays} Tage. Maximal 7 Tage sind erlaubt.` : ''
            };
          }}
          @validitychange=${(e: CustomEvent) => {
            console.log('Custom validation result:', e.detail);
          }}>
        </bln-calendar>
      </div>
    `;
  },
};

export const BusinessUseCase: Story = {
  args: {
    label: 'Projektlaufzeit',
    hint: 'Definieren Sie den Start- und Endtermin des Projekts',
    cornerHint: 'Erforderlich',
    required: true,
    minDate: '01.01.2025',
    maxDate: '31.12.2025',
    startDate: '01.03.2025',
    endDate: '31.05.2025',
  },
  render: (args) => html`
    <div style="max-width: 500px;">
      <h3 style="margin-bottom: 1rem;">Geschäftsszenario: Projektplanung</h3>
      <div style="background: #fff3cd; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; border: 1px solid #ffeaa7;">
        <strong>Anforderungen:</strong>
        <ul style="margin: 0.5rem 0 0 1rem;">
          <li>Projekt muss im Jahr 2025 stattfinden</li>
          <li>Start- und Enddatum sind erforderlich</li>
          <li>Benutzer kann schnell "Heute" auswählen</li>
        </ul>
      </div>
      
      <bln-calendar
        label=${args.label}
        hint=${args.hint}
        corner-hint=${args.cornerHint}
        ?required=${args.required}
        min-date=${args.minDate}
        max-date=${args.maxDate}
        start-date=${args.startDate}
        end-date=${args.endDate}
        @date-change=${(e: CustomEvent) => {
          console.log('Project timeline changed:', e.detail);
          // In a real app, you would update your project data here
        }}>
      </bln-calendar>
    </div>
  `,
};

export const EdgeCases: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Sehr eingeschränkter Bereich</h3>
        <bln-calendar
          label="Nur 3 Tage verfügbar"
          hint="Nur der 22., 23. und 24. Oktober sind auswählbar"
          min-date="22.10.2025"
          max-date="24.10.2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Umgekehrte Datumsauswahl</h3>
        <bln-calendar
          label="Enddatum vor Startdatum"
          hint="System korrigiert automatisch die Reihenfolge"
          start-date="25.10.2025"
          end-date="22.10.2025">
        </bln-calendar>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Ohne Label</h3>
        <bln-calendar
          hint="Kalender ohne Label-Text"
          start-date="22.10.2025">
        </bln-calendar>
      </div>
    </div>
  `,
};