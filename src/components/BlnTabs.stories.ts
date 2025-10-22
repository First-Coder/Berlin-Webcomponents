import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnTabs';
import type { BlnTabsProps, BlnTabItem } from './BlnTabs';

const meta = {
  title: 'Base Components/Tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Ein vollständig zugängliches Tabs-Element mit ARIA-Unterstützung und Tastaturnavigation.

**Accessibility Features:**
- Vollständige ARIA-Unterstützung (role="tablist", role="tab", role="tabpanel")
- Roving Tabindex für korrekte Fokusreihenfolge
- Tastaturnavigation: Pfeiltasten, Home/End, Enter/Space
- Korrekte Verknüpfung von Tabs und Panels über aria-controls/aria-labelledby
- Screen Reader Unterstützung

**Tastaturnavigation:**
- **Pfeiltasten**: Navigation zwischen Tabs
- **Home/End**: Zum ersten/letzten Tab springen
- **Enter/Space**: Tab aktivieren
- **Tab**: Fokus zu Panel-Inhalt verschieben
        `.trim(),
      },
    },
  },
  render: (args: Partial<BlnTabsProps>) => {
    // Convert items to avoid Storybook serialization issues
    const items = args.items || [];
    return html`
      <bln-tabs
        .items=${items}
        active-id=${ifDefined(args.activeId)}
        variant=${ifDefined(args.variant)}
        size=${ifDefined(args.size)}
        orientation=${ifDefined(args.orientation)}
        ?disabled=${args.disabled}
        class="${args.class ?? ''}"
        aria-label=${ifDefined(args.ariaLabel)}
        aria-labelledby=${ifDefined(args.ariaLabelledby)}
        aria-describedby=${ifDefined(args.ariaDescribedby)}
        @tab-change=${(e: CustomEvent) => console.log('Tab changed:', e.detail)}
      >
        ${items.map(item => html`
          <div slot="${item.id}">
            <h3>Slot Content for ${item.label}</h3>
            <p>This content is provided via slots and can contain any HTML.</p>
          </div>
        `)}
      </bln-tabs>
    `;
  },
  argTypes: {
    items: {
      description: 'Array von Tab-Items mit id, label, content (optional), disabled (optional), icon (optional)',
      control: 'object',
    },
    activeId: {
      description: 'ID des aktiven Tabs',
      control: 'text',
    },
    variant: {
      description: 'Visueller Stil der Tabs',
      control: { type: 'select' },
      options: ['default', 'pills', 'underlined'],
    },
    size: {
      description: 'Größe der Tabs',
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    orientation: {
      description: 'Orientierung der Tab-Liste',
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    disabled: {
      description: 'Alle Tabs deaktivieren',
      control: 'boolean',
    },
    class: {
      description: 'Zusätzliche CSS-Klassen',
      control: 'text',
    },
    ariaLabel: {
      name: 'aria-label',
      description: 'A11y: Beschreibung der Tab-Liste',
      control: 'text',
    },
    ariaLabelledby: {
      name: 'aria-labelledby',
      description: 'A11y: ID eines Elements, das die Tab-Liste beschreibt',
      control: 'text',
    },
    ariaDescribedby: {
      name: 'aria-describedby',
      description: 'A11y: ID eines Elements mit weiteren Informationen',
      control: 'text',
    },
  },
  args: {
    items: [
      { id: 'tab1', label: 'Overview', content: 'This is the overview content with basic information.' },
      { id: 'tab2', label: 'Details', content: 'Here you can find detailed information and specifications.' },
      { id: 'tab3', label: 'Settings', content: 'Configuration options and settings can be found here.' },
    ] as BlnTabItem[],
    activeId: 'tab1',
    variant: 'default',
    size: 'medium',
    orientation: 'horizontal',
    disabled: false,
  },
} satisfies Meta<Partial<BlnTabsProps>>;

export default meta;

type Story = StoryObj<Partial<BlnTabsProps>>;

export const Default: Story = {
  args: {},
};

export const WithIcons: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', content: 'Welcome to the home page.', icon: 'Home' },
      { id: 'user', label: 'Profile', content: 'Manage your profile settings.', icon: 'User' },
      { id: 'settings', label: 'Settings', content: 'Configure application settings.', icon: 'Settings' },
      { id: 'help', label: 'Help', content: 'Get help and support.', icon: 'HelpCircle' },
    ],
    activeId: 'home',
  },
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Default Tabs</h3>
        <bln-tabs
          .items=${[
            { id: 'tab1', label: 'Tab 1', content: 'Default tab content 1' },
            { id: 'tab2', label: 'Tab 2', content: 'Default tab content 2' },
            { id: 'tab3', label: 'Tab 3', content: 'Default tab content 3' },
          ]}
          active-id="tab1"
          variant="default">
        </bln-tabs>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Pills Tabs</h3>
        <bln-tabs
          .items=${[
            { id: 'pill1', label: 'Pill 1', content: 'Pills tab content 1' },
            { id: 'pill2', label: 'Pill 2', content: 'Pills tab content 2' },
            { id: 'pill3', label: 'Pill 3', content: 'Pills tab content 3' },
          ]}
          active-id="pill1"
          variant="pills">
        </bln-tabs>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Underlined Tabs</h3>
        <bln-tabs
          .items=${[
            { id: 'under1', label: 'Under 1', content: 'Underlined tab content 1' },
            { id: 'under2', label: 'Under 2', content: 'Underlined tab content 2' },
            { id: 'under3', label: 'Under 3', content: 'Underlined tab content 3' },
          ]}
          active-id="under1"
          variant="underlined">
        </bln-tabs>
      </div>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Small Tabs</h3>
        <bln-tabs
          .items=${[
            { id: 'small1', label: 'Small 1', content: 'Small tab content 1' },
            { id: 'small2', label: 'Small 2', content: 'Small tab content 2' },
            { id: 'small3', label: 'Small 3', content: 'Small tab content 3' },
          ]}
          active-id="small1"
          size="small"
          variant="pills">
        </bln-tabs>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Medium Tabs (Default)</h3>
        <bln-tabs
          .items=${[
            { id: 'med1', label: 'Medium 1', content: 'Medium tab content 1' },
            { id: 'med2', label: 'Medium 2', content: 'Medium tab content 2' },
            { id: 'med3', label: 'Medium 3', content: 'Medium tab content 3' },
          ]}
          active-id="med1"
          size="medium"
          variant="pills">
        </bln-tabs>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Large Tabs</h3>
        <bln-tabs
          .items=${[
            { id: 'large1', label: 'Large 1', content: 'Large tab content 1' },
            { id: 'large2', label: 'Large 2', content: 'Large tab content 2' },
            { id: 'large3', label: 'Large 3', content: 'Large tab content 3' },
          ]}
          active-id="large1"
          size="large"
          variant="pills">
        </bln-tabs>
      </div>
    </div>
  `,
};

export const VerticalOrientation: Story = {
  args: {
    items: [
      { id: 'vert1', label: 'Navigation', content: 'Navigation content in vertical layout.', icon: 'Navigation' },
      { id: 'vert2', label: 'Dashboard', content: 'Dashboard content in vertical layout.', icon: 'LayoutDashboard' },
      { id: 'vert3', label: 'Reports', content: 'Reports content in vertical layout.', icon: 'FileText' },
      { id: 'vert4', label: 'Analytics', content: 'Analytics content in vertical layout.', icon: 'BarChart3' },
    ],
    activeId: 'vert1',
    orientation: 'vertical',
    variant: 'pills',
  },
  render: (args) => html`
    <div style="display: flex; max-width: 600px;">
      <div style="width: 200px; margin-right: 2rem;">
        <bln-tabs
          .items=${args.items}
          active-id=${args.activeId}
          orientation="vertical"
          variant="pills">
        </bln-tabs>
      </div>
    </div>
  `,
};

export const DisabledTabs: Story = {
  args: {
    items: [
      { id: 'enabled1', label: 'Enabled', content: 'This tab is enabled and clickable.' },
      { id: 'disabled1', label: 'Disabled', content: 'This content should not be accessible.', disabled: true },
      { id: 'enabled2', label: 'Also Enabled', content: 'This tab is also enabled.' },
      { id: 'disabled2', label: 'Also Disabled', content: 'This content should also not be accessible.', disabled: true },
    ],
    activeId: 'enabled1',
    variant: 'underlined',
  },
};

export const AllDisabled: Story = {
  args: {
    items: [
      { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
      { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
      { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
    ],
    activeId: 'tab1',
    disabled: true,
  },
};

export const WithSlotContent: Story = {
  args: {
    items: [
      { id: 'basic', label: 'Basic Content' },
      { id: 'form', label: 'Form Example' },
      { id: 'media', label: 'Media Content' },
    ],
    activeId: 'basic',
    variant: 'underlined',
  },
  render: (args) => html`
    <bln-tabs
      .items=${args.items}
      active-id=${args.activeId}
      variant=${args.variant}>
      
      <div slot="basic">
        <h3>Basic Content Tab</h3>
        <p>This content is provided via slots and can contain any HTML elements.</p>
        <ul>
          <li>Rich HTML content</li>
          <li>Lists and formatting</li>
          <li>Any custom components</li>
        </ul>
      </div>
      
      <div slot="form">
        <h3>Form Example</h3>
        <form style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px;">
          <label>
            Name:
            <input type="text" placeholder="Enter your name" style="margin-left: 0.5rem;" />
          </label>
          <label>
            Email:
            <input type="email" placeholder="Enter your email" style="margin-left: 0.5rem;" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
      
      <div slot="media">
        <h3>Media Content</h3>
        <p>Here you could embed images, videos, or other media content.</p>
        <div style="background: #f0f0f0; padding: 2rem; text-align: center; border-radius: 4px;">
          📷 Image Placeholder
        </div>
      </div>
    </bln-tabs>
  `,
};

export const AccessibilityDemo: Story = {
  args: {
    items: [
      { id: 'overview', label: 'Overview', content: 'General overview of accessibility features.', icon: 'Eye' },
      { id: 'keyboard', label: 'Keyboard', content: 'Keyboard navigation instructions.', icon: 'Keyboard' },
      { id: 'screen-reader', label: 'Screen Reader', content: 'Screen reader compatibility information.', icon: 'Volume2' },
    ],
    activeId: 'overview',
    ariaLabel: 'Accessibility demonstration tabs',
    variant: 'pills',
  },
  render: (args) => html`
    <div style="max-width: 800px;">
      <div id="tab-instructions" style="background: #e3f2fd; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
        <strong>Accessibility Instructions:</strong>
        <ul style="margin: 0.5rem 0 0 1rem;">
          <li><strong>Tab:</strong> Move focus to tab panel content</li>
          <li><strong>Arrow keys:</strong> Navigate between tabs</li>
          <li><strong>Home/End:</strong> Jump to first/last tab</li>
          <li><strong>Enter/Space:</strong> Activate focused tab</li>
        </ul>
      </div>
      
      <bln-tabs
        .items=${args.items}
        active-id=${args.activeId}
        aria-label=${args.ariaLabel}
        aria-describedby="tab-instructions"
        variant=${args.variant}>
        
        <div slot="overview">
          <h3>Accessibility Overview</h3>
          <p>This tabs component implements full ARIA support:</p>
          <ul>
            <li><strong>role="tablist"</strong> on the tab container</li>
            <li><strong>role="tab"</strong> on each tab button</li>
            <li><strong>role="tabpanel"</strong> on each content panel</li>
            <li><strong>aria-selected</strong> indicates the active tab</li>
            <li><strong>aria-controls</strong> links tabs to their panels</li>
            <li><strong>roving tabindex</strong> for proper focus management</li>
          </ul>
        </div>
        
        <div slot="keyboard">
          <h3>Keyboard Navigation</h3>
          <p>Full keyboard support is provided:</p>
          <ul>
            <li><strong>Left/Right Arrow:</strong> Navigate between tabs (horizontal)</li>
            <li><strong>Up/Down Arrow:</strong> Navigate between tabs (vertical)</li>
            <li><strong>Home:</strong> Move to first tab</li>
            <li><strong>End:</strong> Move to last tab</li>
            <li><strong>Enter/Space:</strong> Activate the focused tab</li>
            <li><strong>Tab:</strong> Move focus to the tab panel content</li>
          </ul>
          <p>Disabled tabs are automatically skipped during navigation.</p>
        </div>
        
        <div slot="screen-reader">
          <h3>Screen Reader Support</h3>
          <p>Screen readers will announce:</p>
          <ul>
            <li>The number of tabs and current position</li>
            <li>Tab labels and states (selected/not selected)</li>
            <li>When tabs are disabled</li>
            <li>The content of the active tab panel</li>
          </ul>
          <p>All content is properly associated through ARIA relationships.</p>
        </div>
      </bln-tabs>
    </div>
  `,
};

export const DynamicContent: Story = {
  render: () => {
    const items = [
      { id: 'dynamic1', label: 'Tab 1', content: 'Initial content 1' },
      { id: 'dynamic2', label: 'Tab 2', content: 'Initial content 2' },
      { id: 'dynamic3', label: 'Tab 3', content: 'Initial content 3' },
    ];

    return html`
      <div>
        <p style="margin-bottom: 1rem;">
          <strong>Note:</strong> In a real application, you would dynamically update the items array
          to add, remove, or modify tabs. The component will automatically handle the updates.
        </p>
        
        <bln-tabs
          .items=${items}
          active-id="dynamic1"
          variant="default"
          @tab-change=${(e: CustomEvent) => {
            console.log('Tab changed to:', e.detail.activeId);
            console.log('Tab item:', e.detail.activeItem);
          }}>
        </bln-tabs>
        
        <div style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px;">
          <strong>Event Handling:</strong>
          <p>Check the browser console to see tab-change events when switching tabs.</p>
          <p>Event detail includes: <code>{ activeId, activeItem }</code></p>
        </div>
      </div>
    `;
  },
};

export const EdgeCases: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h3 style="margin-bottom: 1rem;">Single Tab</h3>
        <bln-tabs
          .items=${[{ id: 'single', label: 'Only Tab', content: 'This is the only tab available.' }]}
          active-id="single">
        </bln-tabs>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Long Tab Labels</h3>
        <bln-tabs
          .items=${[
            { id: 'long1', label: 'This is a very long tab label that might wrap', content: 'Content for long tab 1' },
            { id: 'long2', label: 'Another extremely long tab label example', content: 'Content for long tab 2' },
            { id: 'short', label: 'Short', content: 'Short label content' },
          ]}
          active-id="long1"
          variant="pills">
        </bln-tabs>
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem;">Mixed Icons and No Icons</h3>
        <bln-tabs
          .items=${[
            { id: 'mixed1', label: 'With Icon', content: 'This tab has an icon', icon: 'Star' },
            { id: 'mixed2', label: 'No Icon', content: 'This tab has no icon' },
            { id: 'mixed3', label: 'Also Icon', content: 'This tab also has an icon', icon: 'Heart' },
          ]}
          active-id="mixed1"
          variant="underlined">
        </bln-tabs>
      </div>
    </div>
  `,
};