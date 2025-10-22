import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnModalDialog';
import type { BlnModalProps, BlnModalButton } from './BlnModalDialog';

const meta = {
  title: 'Base Components/Modal Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Ein vollständig zugänglicher modaler Dialog mit konfigurierbaren Eigenschaften.

**Hauptfunktionen:**
- Konfigurierbare Überschrift, Text, Eingabefeld und Buttons
- Event-System für Rückgabewerte und Benutzerinteraktionen
- Vollständige Barrierefreiheit (Fokusmanagement, Tastaturnavigation, ARIA)
- Modal-Hintergrund mit konfigurierbarem Verhalten
- Validierung für Eingabefelder

**Accessibility Features:**
- Fokus-Trap: Fokus bleibt innerhalb des Modals
- Tastaturnavigation: Escape, Tab, Enter
- ARIA-Attribute: role="dialog", aria-modal="true"
- Automatische Fokuswiederherstellung beim Schließen
- Screen Reader Unterstützung

**Event-System:**
- \`open\`: Modal wird geöffnet
- \`close\`: Modal wird geschlossen  
- \`button-click\`: Button wurde geklickt (mit buttonId und inputValue)
- \`input-change\`: Eingabefeld wurde geändert

**Tastaturnavigation:**
- **Escape**: Modal schließen (wenn aktiviert)
- **Tab/Shift+Tab**: Zwischen fokussierbaren Elementen wechseln
- **Enter**: Primary Button aktivieren (wenn nicht im Eingabefeld)
        `.trim(),
      },
    },
  },
  render: (args: Partial<BlnModalProps>) => {
    const buttons = args.buttons || [];
    return html`
      <div>
        <button 
          @click=${() => {
            const modal = document.querySelector('bln-modal-dialog') as any;
            if (modal) modal.openModal();
          }}
          style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Modal öffnen
        </button>
        
        <bln-modal-dialog
          title=${ifDefined(args.title)}
          text=${ifDefined(args.text)}
          input-label=${ifDefined(args.inputLabel)}
          input-placeholder=${ifDefined(args.inputPlaceholder)}
          input-value=${ifDefined(args.inputValue)}
          input-type=${ifDefined(args.inputType)}
          ?show-input=${args.showInput}
          .buttons=${buttons}
          ?open=${args.open}
          size=${ifDefined(args.size)}
          ?close-on-backdrop=${args.closeOnBackdrop}
          ?close-on-escape=${args.closeOnEscape}
          class="${args.class ?? ''}"
          aria-label=${ifDefined(args.ariaLabel)}
          aria-labelledby=${ifDefined(args.ariaLabelledby)}
          aria-describedby=${ifDefined(args.ariaDescribedby)}
          @open=${(e: CustomEvent) => console.log('Modal opened:', e.detail)}
          @close=${(e: CustomEvent) => console.log('Modal closed:', e.detail)}
          @button-click=${(e: CustomEvent) => {
            console.log('Button clicked:', e.detail);
            if (!args.title?.includes('Validierung')) {
              const modal = e.target as any;
              modal.closeModal();
            }
          }}
          @input-change=${(e: CustomEvent) => console.log('Input changed:', e.detail)}
        >
        </bln-modal-dialog>
      </div>
    `;
  },
  argTypes: {
    title: { description: 'Überschrift des Modals', control: 'text' },
    text: { description: 'Beschreibungstext im Modal', control: 'text' },
    inputLabel: { description: 'Label für das Eingabefeld', control: 'text' },
    inputPlaceholder: { description: 'Platzhalter für das Eingabefeld', control: 'text' },
    inputValue: { description: 'Wert des Eingabefelds', control: 'text' },
    inputType: { 
      description: 'Typ des Eingabefelds', 
      control: { type: 'select' }, 
      options: ['text', 'email', 'password', 'number', 'tel', 'url'] 
    },
    showInput: { description: 'Eingabefeld anzeigen', control: 'boolean' },
    buttons: {
      description: 'Array von Button-Objekten mit id, label, variant, disabled, primary',
      control: 'object',
    },
    open: { description: 'Modal ist geöffnet', control: 'boolean' },
    size: {
      description: 'Größe des Modals',
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'fullscreen'],
    },
    closeOnBackdrop: { description: 'Modal beim Klick auf Hintergrund schließen', control: 'boolean' },
    closeOnEscape: { description: 'Modal mit Escape-Taste schließen', control: 'boolean' },
    class: { description: 'Zusätzliche CSS-Klassen', control: 'text' },
    ariaLabel: { name: 'aria-label', description: 'A11y: Eigene aria-label', control: 'text' },
    ariaLabelledby: { name: 'aria-labelledby', description: 'A11y: Verweist auf ID eines Labels', control: 'text' },
    ariaDescribedby: { name: 'aria-describedby', description: 'A11y: Verweist auf ID mit Beschreibung', control: 'text' },
  },
  args: {
    title: 'Modal Dialog',
    text: 'Dies ist ein Beispiel für einen modalen Dialog.',
    buttons: [
      { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
      { id: 'confirm', label: 'Bestätigen', variant: 'solid', primary: true }
    ] as BlnModalButton[],
    open: false,
    size: 'medium',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showInput: false,
  },
} satisfies Meta<Partial<BlnModalProps>>;

export default meta;

type Story = StoryObj<Partial<BlnModalProps>>;

export const Default: Story = {
  args: {},
};

export const WithInput: Story = {
  args: {
    title: 'Benutzername eingeben',
    text: 'Bitte geben Sie Ihren Benutzernamen ein:',
    showInput: true,
    inputLabel: 'Benutzername',
    inputPlaceholder: 'max.mustermann',
    inputType: 'text',
    buttons: [
      { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
      { id: 'submit', label: 'Speichern', variant: 'solid', primary: true }
    ],
  },
};

export const PasswordPrompt: Story = {
  args: {
    title: 'Passwort erforderlich',
    text: 'Bitte geben Sie Ihr Passwort ein, um fortzufahren:',
    showInput: true,
    inputLabel: 'Passwort',
    inputPlaceholder: '••••••••',
    inputType: 'password',
    buttons: [
      { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
      { id: 'authenticate', label: 'Anmelden', variant: 'solid', primary: true }
    ],
  },
};

export const ConfirmationDialog: Story = {
  args: {
    title: 'Aktion bestätigen',
    text: 'Sind Sie sicher, dass Sie diese Aktion ausführen möchten? Diese Änderung kann nicht rückgängig gemacht werden.',
    showInput: false,
    buttons: [
      { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
      { id: 'delete', label: 'Löschen', variant: 'solid', primary: true }
    ],
  },
};

export const MultipleButtons: Story = {
  args: {
    title: 'Speichern',
    text: 'Möchten Sie die Änderungen speichern?',
    buttons: [
      { id: 'discard', label: 'Verwerfen', variant: 'ghost' },
      { id: 'draft', label: 'Als Entwurf', variant: 'outline' },
      { id: 'save', label: 'Speichern', variant: 'solid', primary: true }
    ],
  },
};

export const SmallModal: Story = {
  args: {
    title: 'Kleines Modal',
    text: 'Dies ist ein kleines Modal.',
    size: 'small',
    buttons: [
      { id: 'close', label: 'Schließen', variant: 'solid', primary: true }
    ],
  },
};

export const LargeModal: Story = {
  args: {
    title: 'Großes Modal',
    text: 'Dies ist ein großes Modal mit mehr Platz für Inhalte.',
    size: 'large',
    buttons: [
      { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
      { id: 'confirm', label: 'Bestätigen', variant: 'solid', primary: true }
    ],
  },
};

export const FullscreenModal: Story = {
  args: {
    title: 'Vollbild Modal',
    text: 'Dies ist ein Vollbild-Modal, das den gesamten Bildschirm ausfüllt.',
    size: 'fullscreen',
    buttons: [
      { id: 'close', label: 'Schließen', variant: 'solid', primary: true }
    ],
  },
};

export const EmailInput: Story = {
  args: {
    title: 'E-Mail eingeben',
    text: 'Bitte geben Sie Ihre E-Mail-Adresse ein:',
    showInput: true,
    inputLabel: 'E-Mail-Adresse',
    inputPlaceholder: 'user@example.com',
    inputType: 'email',
    buttons: [
      { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
      { id: 'submit', label: 'Speichern', variant: 'solid', primary: true }
    ],
  },
};

export const NumberInput: Story = {
  args: {
    title: 'Nummer eingeben',
    text: 'Bitte geben Sie eine Nummer ein:',
    showInput: true,
    inputLabel: 'Nummer',
    inputPlaceholder: '42',
    inputType: 'number',
    buttons: [
      { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
      { id: 'submit', label: 'OK', variant: 'solid', primary: true }
    ],
  },
};

export const ButtonVariants: Story = {
  args: {
    title: 'Button-Varianten',
    text: 'Verschiedene Button-Stile im Modal:',
    buttons: [
      { id: 'link', label: 'Link', variant: 'link' },
      { id: 'ghost', label: 'Ghost', variant: 'ghost' },
      { id: 'soft', label: 'Soft', variant: 'soft' },
      { id: 'outline', label: 'Outline', variant: 'outline' },
      { id: 'solid', label: 'Solid', variant: 'solid', primary: true }
    ],
  },
};

export const DisabledButtons: Story = {
  args: {
    title: 'Deaktivierte Buttons',
    text: 'Einige Buttons können deaktiviert sein:',
    buttons: [
      { id: 'disabled', label: 'Deaktiviert', variant: 'outline', disabled: true },
      { id: 'enabled', label: 'Aktiviert', variant: 'solid', primary: true }
    ],
  },
};

export const NoBackdropClose: Story = {
  args: {
    title: 'Kein Backdrop-Schließen',
    text: 'Dieses Modal kann nur über Buttons oder Escape geschlossen werden.',
    closeOnBackdrop: false,
    buttons: [
      { id: 'close', label: 'Schließen', variant: 'solid', primary: true }
    ],
  },
};

export const NoEscapeClose: Story = {
  args: {
    title: 'Kein Escape-Schließen',
    text: 'Dieses Modal kann nur über Buttons geschlossen werden (kein X-Button, keine Escape-Taste).',
    closeOnEscape: false,
    buttons: [
      { id: 'close', label: 'Schließen', variant: 'solid', primary: true }
    ],
  },
};

export const ValidationExample: Story = {
  render: () => html`
    <div>
      <button 
        @click=${() => {
          const modal = document.querySelector('bln-modal-dialog[data-validation]') as any;
          if (modal) modal.openModal();
        }}
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Validierung Demo öffnen
      </button>
      
      <bln-modal-dialog
        data-validation
        title="E-Mail Validierung"
        text="Bitte geben Sie eine gültige E-Mail-Adresse ein:"
        show-input="true"
        input-label="E-Mail-Adresse"
        input-placeholder="user@example.com"
        input-type="email"
        .validator=${(value: string) => ({
          valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
        })}
        .buttons=${[
          { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
          { id: 'submit', label: 'Speichern', variant: 'solid', primary: true }
        ]}
        @button-click=${(e: CustomEvent) => {
          console.log('Validation result:', e.detail);
          if (e.detail.buttonId === 'submit' && e.detail.inputValid !== false) {
            const modal = e.target as any;
            modal.closeModal();
          }
        }}
      >
      </bln-modal-dialog>
    </div>
  `,
};

export const CustomContent: Story = {
  render: () => html`
    <div>
      <button 
        @click=${() => {
          const modal = document.querySelector('bln-modal-dialog[data-custom]') as any;
          if (modal) modal.openModal();
        }}
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Custom Content Modal
      </button>
      
      <bln-modal-dialog
        data-custom
        title="Custom Content"
        text="Zusätzlich zum Standard-Text können Sie eigene Inhalte hinzufügen:"
        .buttons=${[
          { id: 'close', label: 'Schließen', variant: 'solid', primary: true }
        ]}
        @button-click=${(e: CustomEvent) => {
          const modal = e.target as any;
          modal.closeModal();
        }}
      >
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
          <h4 style="margin: 0 0 0.5rem 0; font-weight: 600;">Benutzerdefinierter Inhalt</h4>
          <p style="margin: 0; color: #6b7280;">
            Hier können Sie beliebige HTML-Inhalte einfügen:
          </p>
          <ul style="margin: 0.5rem 0 0 1rem; color: #6b7280;">
            <li>Listen</li>
            <li>Bilder</li>
            <li>Formulare</li>
            <li>Andere Komponenten</li>
          </ul>
        </div>
      </bln-modal-dialog>
    </div>
  `,
};

export const AccessibilityDemo: Story = {
  render: () => html`
    <div style="max-width: 800px;">
      <div id="a11y-instructions" style="background: #e3f2fd; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
        <strong>Accessibility Demo:</strong>
        <ul style="margin: 0.5rem 0 0 1rem;">
          <li><strong>Fokus-Trap:</strong> Fokus bleibt innerhalb des Modals</li>
          <li><strong>Escape:</strong> Schließt das Modal</li>
          <li><strong>Tab/Shift+Tab:</strong> Navigation zwischen Elementen</li>
          <li><strong>Enter:</strong> Aktiviert den Primary Button</li>
          <li><strong>Fokuswiederherstellung:</strong> Nach dem Schließen kehrt der Fokus zum auslösenden Element zurück</li>
        </ul>
      </div>
      
      <button 
        @click=${() => {
          const modal = document.querySelector('bln-modal-dialog[data-a11y]') as any;
          if (modal) modal.openModal();
        }}
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Accessibility Demo öffnen
      </button>
      
      <bln-modal-dialog
        data-a11y
        title="Barrierefreiheit Demo"
        text="Testen Sie die Tastaturnavigation und Fokusverhalten:"
        aria-describedby="a11y-instructions"
        show-input="true"
        input-label="Test-Eingabe"
        input-placeholder="Probieren Sie Tab-Navigation aus"
        .buttons=${[
          { id: 'secondary', label: 'Sekundär', variant: 'outline' },
          { id: 'primary', label: 'Primär (Enter)', variant: 'solid', primary: true }
        ]}
        @button-click=${(e: CustomEvent) => {
          console.log('A11y Demo - Button clicked:', e.detail.buttonId);
          const modal = e.target as any;
          modal.closeModal();
        }}
      >
        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border: 1px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;">
            <strong>Tipp:</strong> Verwenden Sie die Tab-Taste, um zwischen den Elementen zu navigieren. 
            Der Fokus ist innerhalb des Modals gefangen.
          </p>
        </div>
      </bln-modal-dialog>
    </div>
  `,
};

export const EventHandling: Story = {
  render: () => html`
    <div>
      <p style="margin-bottom: 1rem;">
        <strong>Event Handling Demo:</strong> Öffnen Sie die Browser-Konsole, um Events zu sehen.
      </p>
      
      <button 
        @click=${() => {
          const modal = document.querySelector('bln-modal-dialog[data-events]') as any;
          if (modal) modal.openModal();
        }}
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Event Demo öffnen
      </button>
      
      <bln-modal-dialog
        data-events
        title="Event Demo"
        text="Interagieren Sie mit diesem Modal und beobachten Sie die Events in der Konsole:"
        show-input="true"
        input-label="Eingabe"
        input-placeholder="Tippen Sie etwas..."
        .buttons=${[
          { id: 'info', label: 'Info', variant: 'ghost' },
          { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
          { id: 'save', label: 'Speichern', variant: 'solid', primary: true }
        ]}
        @open=${(e: CustomEvent) => {
          console.log('🔓 Modal opened:', e.detail);
          const feedback = document.getElementById('event-feedback');
          if (feedback) feedback.innerHTML = '<strong>Modal geöffnet!</strong>';
        }}
        @close=${(e: CustomEvent) => {
          console.log('🔒 Modal closed:', e.detail);
          const feedback = document.getElementById('event-feedback');
          if (feedback) feedback.innerHTML = '<strong>Modal geschlossen!</strong>';
        }}
        @button-click=${(e: CustomEvent) => {
          console.log('🖱️ Button clicked:', e.detail);
          const feedback = document.getElementById('event-feedback');
          if (feedback) {
            feedback.innerHTML = `<strong>Button geklickt:</strong> ${e.detail.buttonId}<br><strong>Input Wert:</strong> "${e.detail.inputValue}"`;
          }
          if (e.detail.buttonId !== 'info') {
            const modal = e.target as any;
            modal.closeModal();
          }
        }}
        @input-change=${(e: CustomEvent) => {
          console.log('📝 Input changed:', e.detail);
        }}
      >
      </bln-modal-dialog>
      
      <div id="event-feedback" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px; min-height: 60px;">
        <em>Event-Informationen werden hier angezeigt...</em>
      </div>
    </div>
  `,
};

export const BusinessUseCases: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
      <!-- Delete Confirmation -->
      <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="margin: 0 0 0.5rem 0;">Löschbestätigung</h4>
        <p style="margin: 0 0 1rem 0; color: #6b7280; font-size: 0.875rem;">
          Kritische Aktionen bestätigen lassen
        </p>
        <button 
          @click=${() => {
            const modal = document.querySelector('bln-modal-dialog[data-delete]') as any;
            if (modal) modal.openModal();
          }}
          style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;"
        >
          Element löschen
        </button>
        
        <bln-modal-dialog
          data-delete
          title="Element löschen"
          text="Sind Sie sicher, dass Sie dieses Element dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
          .buttons=${[
            { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
            { id: 'delete', label: 'Dauerhaft löschen', variant: 'solid', primary: true }
          ]}
          @button-click=${(e: CustomEvent) => {
            if (e.detail.buttonId === 'delete') {
              alert('Element wurde gelöscht!');
            }
            const modal = e.target as any;
            modal.closeModal();
          }}
        >
        </bln-modal-dialog>
      </div>

      <!-- User Registration -->
      <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="margin: 0 0 0.5rem 0;">Benutzerregistrierung</h4>
        <p style="margin: 0 0 1rem 0; color: #6b7280; font-size: 0.875rem;">
          Eingabeaufforderung mit Validierung
        </p>
        <button 
          @click=${() => {
            const modal = document.querySelector('bln-modal-dialog[data-register]') as any;
            if (modal) modal.openModal();
          }}
          style="padding: 6px 12px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;"
        >
          Registrieren
        </button>
        
        <bln-modal-dialog
          data-register
          title="Benutzer registrieren"
          text="Bitte geben Sie eine E-Mail-Adresse für den neuen Benutzer ein:"
          show-input="true"
          input-label="E-Mail-Adresse"
          input-placeholder="benutzer@firma.com"
          input-type="email"
          .validator=${(value: string) => ({
            valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length > 0,
            message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
          })}
          .buttons=${[
            { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
            { id: 'register', label: 'Registrieren', variant: 'solid', primary: true }
          ]}
          @button-click=${(e: CustomEvent) => {
            if (e.detail.buttonId === 'register' && e.detail.inputValid !== false) {
              alert(`Benutzer ${e.detail.inputValue} wurde registriert!`);
              const modal = e.target as any;
              modal.closeModal();
            }
          }}
        >
        </bln-modal-dialog>
      </div>

      <!-- Settings -->
      <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="margin: 0 0 0.5rem 0;">Einstellungen</h4>
        <p style="margin: 0 0 1rem 0; color: #6b7280; font-size: 0.875rem;">
          Mehrere Aktionsmöglichkeiten
        </p>
        <button 
          @click=${() => {
            const modal = document.querySelector('bln-modal-dialog[data-settings]') as any;
            if (modal) modal.openModal();
          }}
          style="padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;"
        >
          Einstellungen
        </button>
        
        <bln-modal-dialog
          data-settings
          title="Einstellungen speichern"
          text="Wie möchten Sie mit den Änderungen verfahren?"
          .buttons=${[
            { id: 'discard', label: 'Verwerfen', variant: 'ghost' },
            { id: 'draft', label: 'Als Entwurf', variant: 'outline' },
            { id: 'apply', label: 'Anwenden', variant: 'solid', primary: true }
          ]}
          @button-click=${(e: CustomEvent) => {
            const actions = {
              'discard': 'Änderungen verworfen',
              'draft': 'Als Entwurf gespeichert',
              'apply': 'Einstellungen angewendet'
            };
            alert(actions[e.detail.buttonId as keyof typeof actions] || 'Aktion ausgeführt');
            const modal = e.target as any;
            modal.closeModal();
          }}
        >
        </bln-modal-dialog>
      </div>
    </div>
  `,
};

export const EdgeCases: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <!-- No title -->
      <div>
        <h4>Ohne Titel</h4>
        <button 
          @click=${() => {
            const modal = document.querySelector('bln-modal-dialog[data-no-title]') as any;
            if (modal) modal.openModal();
          }}
          style="padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Ohne Titel
        </button>
        
        <bln-modal-dialog
          data-no-title
          text="Modal ohne Titel - nur mit Text und Buttons."
          .buttons=${[
            { id: 'close', label: 'Schließen', variant: 'solid', primary: true }
          ]}
          @button-click=${(e: CustomEvent) => {
            const modal = e.target as any;
            modal.closeModal();
          }}
        >
        </bln-modal-dialog>
      </div>

      <!-- No buttons -->
      <div>
        <h4>Ohne Buttons</h4>
        <button 
          @click=${() => {
            const modal = document.querySelector('bln-modal-dialog[data-no-buttons]') as any;
            if (modal) modal.openModal();
          }}
          style="padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Ohne Buttons
        </button>
        
        <bln-modal-dialog
          data-no-buttons
          title="Nur Information"
          text="Dieses Modal hat keine Buttons. Drücken Sie Escape zum Schließen."
          .buttons=${[]}
        >
        </bln-modal-dialog>
      </div>

      <!-- Empty modal -->
      <div>
        <h4>Minimales Modal</h4>
        <button 
          @click=${() => {
            const modal = document.querySelector('bln-modal-dialog[data-empty]') as any;
            if (modal) modal.openModal();
          }}
          style="padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Minimal
        </button>
        
        <bln-modal-dialog
          data-empty
          .buttons=${[
            { id: 'close', label: 'Schließen', variant: 'solid', primary: true }
          ]}
          @button-click=${(e: CustomEvent) => {
            const modal = e.target as any;
            modal.closeModal();
          }}
        >
          <p style="margin: 1rem; text-align: center; color: #6b7280;">
            Nur Slot-Inhalt, kein Titel oder Text.
          </p>
        </bln-modal-dialog>
      </div>
    </div>
  `,
};