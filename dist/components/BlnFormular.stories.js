import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './BlnFormular';
import './BlnInput';
import './BlnButton';
import './BlnCheckBox';
import { FormBuilder } from './FormBuilder';
const meta = {
    title: 'Form/BlnFormular',
    component: 'bln-formular',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
Ein barrierefreies Formular-Container-Element, das externe Form-Elemente über Slots aufnimmt.

**Hauptfunktionen:**
- **Barrierefrei:** Verwendet semantisches <form> mit korrekten ARIA-Attributen
- **Slot-basiert:** Akzeptiert beliebige Form-Elemente im Default-Slot
- **Action-Bereich:** Drei Buttons (Speichern, Löschen, Leeren) über named slot "actions"
- **Datensammlung:** Sammelt automatisch Werte aller benannten Eingabefelder beim Submit
- **Event-API:** Emittiert bln-submit, bln-clear, bln-delete CustomEvents
- **Keyboard-Support:** Enter-Taste löst Submit aus (konfigurierbar)

**Verwendung:**
\`\`\`html
<bln-formular legend="Benutzerdaten">
  <bln-input name="email" label="E-Mail"></bln-input>
  <bln-input name="password" label="Passwort" type="password"></bln-input>
  
  <div slot="actions">
    <bln-button>Speichern</bln-button>
    <bln-button variant="outline">Löschen</bln-button>
    <bln-button variant="ghost">Leeren</bln-button>
  </div>
</bln-formular>
\`\`\`

**Events:**
- **bln-submit:** Wird beim Submit ausgelöst mit \`detail: { data: Record<string, any> }\`
- **bln-clear:** Wird bei clear() ausgelöst
- **bln-delete:** Wird bei delete() ausgelöst
        `.trim(),
            },
        },
    },
    argTypes: {
        legend: {
            description: 'Überschrift des Formulars (erscheint als H2)',
            type: { name: 'string' }
        },
        ariaLabel: {
            name: 'aria-label',
            description: 'A11y: Eigenes aria-label für das Formular',
            type: { name: 'string' }
        },
        ariaLabelledby: {
            name: 'aria-labelledby',
            description: 'A11y: Verweist auf ID eines externen Labels',
            type: { name: 'string' }
        },
        submitOnEnter: {
            description: 'Enter-Taste in Eingabefeldern löst Submit aus',
            type: { name: 'boolean' }
        },
        preventNativeSubmit: {
            description: 'Verhindert native Submit-Events (preventDefault)',
            type: { name: 'boolean' }
        },
        retroDesign: {
            name: 'retro-design',
            description: 'Aktiviert Retro-Design mit schwarzen Rändern und klassischem Stil',
            type: { name: 'boolean' }
        },
    },
    args: {
        legend: 'Benutzerdaten',
        submitOnEnter: true,
        preventNativeSubmit: true,
    },
};
export default meta;
export const Default = {
    render: (args) => html `
    <bln-formular 
      legend=${ifDefined(args.legend)}
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      ?submit-on-enter=${args.submitOnEnter}
      ?prevent-native-submit=${args.preventNativeSubmit}
      ?retro-design=${args.retroDesign}
      @bln-submit=${(e) => console.log('📋 Submit:', e.detail.data)}
      @bln-clear=${() => console.log('🧹 Clear')} 
      @bln-delete=${() => console.log('🗑️ Delete')}>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <bln-input name="email" label="E-Mail" type="email" placeholder="name@example.com" ?retro-design=${args.retroDesign}></bln-input>
        <bln-input name="password" label="Passwort" type="password" ?retro-design=${args.retroDesign}></bln-input>
        <bln-input name="age" label="Alter" type="number" value="21" ?retro-design=${args.retroDesign}></bln-input>
      </div>
      <div slot="actions" class="flex gap-2">
        <bln-button ?retro-design=${args.retroDesign} @click=${(e) => e.currentTarget.closest('bln-formular')?.submit?.()}>Speichern</bln-button>
        <bln-button variant="outline" ?retro-design=${args.retroDesign} @click=${(e) => e.currentTarget.closest('bln-formular')?.delete?.()}>Löschen</bln-button>
        <bln-button variant="ghost" ?retro-design=${args.retroDesign} @click=${(e) => e.currentTarget.closest('bln-formular')?.clear?.()}>Leeren</bln-button>
      </div>
    </bln-formular>
  `,
    parameters: {
        docs: {
            description: {
                story: 'Grundlegendes Beispiel mit BlnInput-Feldern und drei Action-Buttons. Öffnen Sie die Browser-Konsole, um Events zu sehen.',
            },
        },
    },
};
export const WithNativeInputs = {
    render: (args) => html `
    <bln-formular 
      legend=${ifDefined(args.legend)}
      @bln-submit=${(e) => console.log('📋 Native Submit:', e.detail.data)}
      @bln-clear=${() => console.log('🧹 Native Clear')} 
      @bln-delete=${() => console.log('🗑️ Native Delete')}>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="native-name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input id="native-name" name="name" type="text" value="Max Mustermann" 
                 class="block w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <div>
          <label for="native-city" class="block text-sm font-medium text-gray-700 mb-2">Stadt</label>
          <select id="native-city" name="city" 
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Bitte wählen</option>
            <option value="berlin" selected>Berlin</option>
            <option value="hamburg">Hamburg</option>
            <option value="muenchen">München</option>
          </select>
        </div>
      </div>
      <div slot="actions" class="flex gap-2">
        <bln-button @click=${(e) => e.currentTarget.closest('bln-formular')?.submit?.()}>Speichern</bln-button>
        <bln-button variant="outline" @click=${(e) => e.currentTarget.closest('bln-formular')?.delete?.()}>Löschen</bln-button>
        <bln-button variant="ghost" @click=${(e) => e.currentTarget.closest('bln-formular')?.clear?.()}>Leeren</bln-button>
      </div>
    </bln-formular>
  `,
    parameters: {
        docs: {
            description: {
                story: 'BlnFormular funktioniert auch mit nativen HTML-Formularelementen. Die Datensammlung erfasst alle benannten Eingabefelder.',
            },
        },
    },
};
export const WithoutLegend = {
    args: {
        legend: '',
        ariaLabel: 'Kontaktformular',
    },
    render: (args) => html `
    <bln-formular 
      aria-label=${ifDefined(args.ariaLabel)}
      @bln-submit=${(e) => console.log('📋 No Legend Submit:', e.detail.data)}>
      <bln-input name="subject" label="Betreff" placeholder="Ihr Anliegen"></bln-input>
      <bln-input name="message" label="Nachricht" placeholder="Beschreiben Sie Ihr Anliegen"></bln-input>
      
      <div slot="actions" class="flex gap-2">
        <bln-button @click=${(e) => e.currentTarget.closest('bln-formular')?.submit?.()}>Absenden</bln-button>
        <bln-button variant="ghost" @click=${(e) => e.currentTarget.closest('bln-formular')?.clear?.()}>Leeren</bln-button>
      </div>
    </bln-formular>
  `,
    parameters: {
        docs: {
            description: {
                story: 'Formular ohne sichtbare Überschrift, aber mit aria-label für Barrierefreiheit. Zeigt auch weniger Action-Buttons.',
            },
        },
    },
};
export const KeyboardBehavior = {
    args: {
        submitOnEnter: false,
    },
    render: (args) => html `
    <bln-formular 
      legend="Enter-Verhalten deaktiviert"
      ?submit-on-enter=${args.submitOnEnter}
      @bln-submit=${(e) => console.log('📋 Keyboard Submit:', e.detail.data)}>
      <bln-input name="test" label="Testfeld" placeholder="Drücken Sie Enter - passiert nichts"></bln-input>
      
      <div slot="actions" class="flex gap-2">
        <bln-button @click=${(e) => e.currentTarget.closest('bln-formular')?.submit?.()}>Manuell absenden</bln-button>
      </div>
    </bln-formular>
  `,
    parameters: {
        docs: {
            description: {
                story: 'Mit submit-on-enter="false" wird das automatische Submit bei Enter-Taste deaktiviert.',
            },
        },
    },
};
export const WithInputAndCheckbox = {
    render: (args) => html `
    <bln-formular 
      legend="Registrierung mit Input und Checkbox"
      @bln-submit=${(e) => console.log('📋 Input & Checkbox Submit:', e.detail.data)}
      @bln-clear=${() => console.log('🧹 Input & Checkbox Clear')} 
      @bln-delete=${() => console.log('🗑️ Input & Checkbox Delete')}>
      <div class="space-y-4">
        <bln-input name="username" label="Benutzername" placeholder="Ihr Benutzername" required></bln-input>
        <bln-input name="email" label="E-Mail" type="email" placeholder="name@example.com" required></bln-input>
        <bln-checkbox name="newsletter" label="Newsletter abonnieren" checked>
          Ich möchte regelmäßig Updates und Neuigkeiten erhalten
        </bln-checkbox>
        <bln-checkbox name="terms" label="AGB akzeptieren" required>
          Ich habe die <a href="#" class="text-blue-600 underline">Allgemeinen Geschäftsbedingungen</a> gelesen und akzeptiere diese
        </bln-checkbox>
        <bln-checkbox name="privacy" label="Datenschutz" required>
          Ich stimme der <a href="#" class="text-blue-600 underline">Datenschutzerklärung</a> zu
        </bln-checkbox>
      </div>
      
      <div slot="actions" class="flex gap-2">
        <bln-button @click=${(e) => e.currentTarget.closest('bln-formular')?.submit?.()}>Registrieren</bln-button>
        <bln-button variant="ghost" @click=${(e) => e.currentTarget.closest('bln-formular')?.clear?.()}>Zurücksetzen</bln-button>
      </div>
    </bln-formular>
  `,
    parameters: {
        docs: {
            description: {
                story: 'Beispiel einer Registrierung mit BlnInput-Feldern und BlnCheckBox-Komponenten. Zeigt die kombinierte Verwendung beider Komponenten im BlnFormular. Beim Submit werden sowohl die Text-Werte als auch die Boolean-Werte der Checkboxen in der Konsole ausgegeben.',
            },
        },
    },
};
export const WithJavaScriptElements = {
    render: (args) => {
        const formularId = `formular-${Math.random().toString(36).slice(2)}`;
        // Use setTimeout to ensure the DOM is ready before manipulating it
        setTimeout(() => {
            const formular = document.getElementById(formularId);
            if (!formular)
                return;
            // Clear any existing content
            formular.innerHTML = '';
            // Create a container div for the form fields
            const container = document.createElement('div');
            container.className = 'space-y-4';
            // Create BlnInput elements programmatically
            const nameInput = document.createElement('bln-input');
            nameInput.name = 'fullname';
            nameInput.label = 'Vollständiger Name';
            nameInput.placeholder = 'Max Mustermann';
            nameInput.required = true;
            container.appendChild(nameInput);
            const emailInput = document.createElement('bln-input');
            emailInput.name = 'email';
            emailInput.label = 'E-Mail-Adresse';
            emailInput.type = 'email';
            emailInput.placeholder = 'max@example.com';
            emailInput.required = true;
            container.appendChild(emailInput);
            const phoneInput = document.createElement('bln-input');
            phoneInput.name = 'phone';
            phoneInput.label = 'Telefonnummer';
            phoneInput.type = 'tel';
            phoneInput.placeholder = '+49 123 456789';
            container.appendChild(phoneInput);
            // Create BlnCheckBox elements programmatically
            const newsletterCheckbox = document.createElement('bln-checkbox');
            newsletterCheckbox.name = 'newsletter';
            newsletterCheckbox.label = 'Newsletter';
            newsletterCheckbox.checked = true;
            newsletterCheckbox.innerHTML = 'Ja, ich möchte den Newsletter erhalten';
            container.appendChild(newsletterCheckbox);
            const termsCheckbox = document.createElement('bln-checkbox');
            termsCheckbox.name = 'terms';
            termsCheckbox.label = 'Nutzungsbedingungen';
            termsCheckbox.required = true;
            termsCheckbox.innerHTML = 'Ich akzeptiere die <a href="#" class="text-blue-600 underline">Nutzungsbedingungen</a>';
            container.appendChild(termsCheckbox);
            // Add the container to the formular
            formular.appendChild(container);
            // Create action buttons programmatically
            const actionsDiv = document.createElement('div');
            actionsDiv.slot = 'actions';
            actionsDiv.className = 'flex gap-2';
            const submitBtn = document.createElement('bln-button');
            submitBtn.textContent = 'JavaScript Submit';
            submitBtn.onclick = () => formular.submit?.();
            actionsDiv.appendChild(submitBtn);
            const clearBtn = document.createElement('bln-button');
            clearBtn.variant = 'outline';
            clearBtn.textContent = 'JavaScript Clear';
            clearBtn.onclick = () => formular.clear?.();
            actionsDiv.appendChild(clearBtn);
            const deleteBtn = document.createElement('bln-button');
            deleteBtn.variant = 'ghost';
            deleteBtn.textContent = 'JavaScript Delete';
            deleteBtn.onclick = () => formular.delete?.();
            actionsDiv.appendChild(deleteBtn);
            formular.appendChild(actionsDiv);
        }, 100);
        return html `
      <bln-formular 
        id=${formularId}
        legend="Dynamisch erstelltes Formular"
        @bln-submit=${(e) => console.log('📋 JavaScript Submit:', e.detail.data)}
        @bln-clear=${() => console.log('🧹 JavaScript Clear')} 
        @bln-delete=${() => console.log('🗑️ JavaScript Delete')}>
        <!-- Elements will be added via JavaScript -->
      </bln-formular>
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <h4 class="font-semibold mb-2">JavaScript Code Beispiel:</h4>
        <pre class="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto"><code>// BlnInput erstellen
const nameInput = document.createElement('bln-input');
nameInput.name = 'fullname';
nameInput.label = 'Vollständiger Name';
nameInput.required = true;
formular.appendChild(nameInput);

// BlnCheckBox erstellen
const checkbox = document.createElement('bln-checkbox');
checkbox.name = 'newsletter';
checkbox.checked = true;
checkbox.innerHTML = 'Newsletter abonnieren';
formular.appendChild(checkbox);

// Action Button erstellen
const submitBtn = document.createElement('bln-button');
submitBtn.textContent = 'Absenden';
submitBtn.slot = 'actions';
submitBtn.onclick = () => formular.submit();
formular.appendChild(submitBtn);</code></pre>
      </div>
    `;
    },
    parameters: {
        docs: {
            description: {
                story: `
Dieses Beispiel zeigt, wie man Elemente programmatisch via JavaScript zu einem BlnFormular hinzufügt:

**Vorgehensweise:**
1. **BlnInput erstellen:** \`document.createElement('bln-input')\` und Properties setzen
2. **BlnCheckBox erstellen:** \`document.createElement('bln-checkbox')\` und Properties/innerHTML setzen  
3. **Action Buttons erstellen:** \`document.createElement('bln-button')\` mit \`slot="actions"\`
4. **Elemente hinzufügen:** \`formular.appendChild(element)\` für Standard-Elemente oder \`slot="actions"\` für Buttons

**Wichtige Hinweise:**
- Alle Berlin-Webcomponents können via JavaScript erstellt werden
- Properties werden direkt am Element-Objekt gesetzt
- Für Slot-Elemente das \`slot\`-Attribut setzen
- Event-Handler können via \`.onclick\` oder \`.addEventListener()\` hinzugefügt werden
- Das BlnFormular sammelt automatisch alle benannten Eingabefelder beim Submit

Öffnen Sie die Browser-Konsole, um die JavaScript-Events zu sehen.
        `.trim(),
            },
        },
    },
};
export const RetroDesign = {
    args: {
        retroDesign: true,
        legend: 'Retro-Formular',
    },
    render: (args) => html `
    <bln-formular 
      legend=${ifDefined(args.legend)}
      ?retro-design=${args.retroDesign}
      @bln-submit=${(e) => console.log('📋 Retro Submit:', e.detail.data)}
      @bln-clear=${() => console.log('🧹 Retro Clear')} 
      @bln-delete=${() => console.log('🗑️ Retro Delete')}>
      <div class="space-y-4">
        <bln-input name="name" label="Name" placeholder="Ihr Name" retro-design></bln-input>
        <bln-input name="email" label="E-Mail" type="email" placeholder="name@example.com" retro-design></bln-input>
        <bln-checkbox name="agree" label="Zustimmung" retro-design>
          Ich stimme den Bedingungen zu
        </bln-checkbox>
      </div>
      
      <div slot="actions" class="flex gap-2">
        <bln-button retro-design @click=${(e) => e.currentTarget.closest('bln-formular')?.submit?.()}>Speichern</bln-button>
        <bln-button variant="outline" retro-design @click=${(e) => e.currentTarget.closest('bln-formular')?.delete?.()}>Löschen</bln-button>
        <bln-button variant="ghost" retro-design @click=${(e) => e.currentTarget.closest('bln-formular')?.clear?.()}>Leeren</bln-button>
      </div>
    </bln-formular>
  `,
    parameters: {
        docs: {
            description: {
                story: 'Retro-Design-Variante mit schwarzen Rändern, klassischem Styling und passenden Retro-Komponenten. Das Formular erhält einen schwarzen Rahmen, die Überschrift wird fett und großgeschrieben, und die Trennlinie wird dicker.',
            },
        },
    },
};
export const WithFormBuilder = {
    render: (args) => {
        const formularId = `formular-fb-${Math.random().toString(36).slice(2)}`;
        // Use setTimeout to ensure the DOM is ready before manipulating it
        setTimeout(() => {
            const formular = document.getElementById(formularId);
            if (!formular)
                return;
            // Create FormBuilder instance with fields
            const fb = new FormBuilder()
                .addBlnInput({
                label: 'Vorname',
                name: 'firstname',
                placeholder: 'Ihr Vorname',
                required: true
            })
                .addBlnInput({
                label: 'E-Mail',
                name: 'email',
                type: 'email',
                placeholder: 'name@example.com',
                required: true
            })
                .addBlnInput({
                label: 'Alter',
                name: 'age',
                type: 'number',
                value: '25'
            })
                .addBlnCheckbox({
                name: 'newsletter',
                label: 'Newsletter',
                checked: true
            });
            // Pass FormBuilder fields to BlnFormular
            formular.templateResult = fb.getFields();
        }, 100);
        return html `
      <bln-formular 
        id=${formularId}
        legend="FormBuilder Integration"
        @bln-submit=${(e) => console.log('📋 FormBuilder Submit:', e.detail.data)}
        @bln-clear=${() => console.log('🧹 FormBuilder Clear')} 
        @bln-delete=${() => console.log('🗑️ FormBuilder Delete')}>
        
        <div slot="actions" class="flex gap-2">
          <bln-button @click=${(e) => e.currentTarget.closest('bln-formular')?.submit?.()}>Speichern</bln-button>
          <bln-button variant="outline" @click=${(e) => e.currentTarget.closest('bln-formular')?.delete?.()}>Löschen</bln-button>
          <bln-button variant="ghost" @click=${(e) => e.currentTarget.closest('bln-formular')?.clear?.()}>Leeren</bln-button>
        </div>
      </bln-formular>
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <h4 class="font-semibold mb-2">FormBuilder Integration Code:</h4>
        <pre class="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto"><code>import { FormBuilder } from './FormBuilder';

// Create FormBuilder with fields
const fb = new FormBuilder()
  .addBlnInput({ label: 'Name', name: 'name', required: true })
  .addBlnCheckbox({ name: 'newsletter', checked: true })
  .addBlnSelect({ name: 'city', options: [...] });

// Get formular element
const formular = document.getElementById('myForm');

// Pass FormBuilder fields to BlnFormular
formular.templateResult = fb.getFields();</code></pre>
      </div>
    `;
    },
    parameters: {
        docs: {
            description: {
                story: `
**FormBuilder Integration mit BlnFormular**

Dieses Beispiel zeigt, wie Sie FormBuilder-Felder direkt an ein BlnFormular übergeben können:

**Integration:**
1. **FormBuilder erstellen:** \`new FormBuilder()\` mit gewünschten Feldern
2. **Felder übergeben:** \`formular.templateResult = fb.getFields()\`
3. **Automatische Sammlung:** BlnFormular sammelt alle Daten beim Submit

**Unterstützte FormBuilder-Methoden:**
- \`addBlnInput()\` - Text, Email, Password, Number inputs
- \`addBlnCheckbox()\` - Checkboxen mit boolean values
- \`addBlnSelect()\` - Dropdown-Auswahlen

Die FormBuilder-Felder werden automatisch im BlnFormular gerendert und bei submit() in den Event-Daten erfasst. Öffnen Sie die Browser-Konsole, um die Daten zu sehen.
        `.trim(),
            },
        },
    },
};
