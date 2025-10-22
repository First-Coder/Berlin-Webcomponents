import {describe, it, expect, beforeEach} from 'vitest';
import './BlnTabs.ts';
import type { BlnTabItem } from './BlnTabs';

/**
 * Tests for <bln-tabs>
 */
describe('<bln-tabs>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const defaultItems: BlnTabItem[] = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' }
  ];

  const mount = async (props: Partial<{
    items: BlnTabItem[];
    activeId: string;
    variant: 'default' | 'pills' | 'underlined';
    size: 'small' | 'medium' | 'large';
    orientation: 'horizontal' | 'vertical';
    disabled: boolean;
    class: string;
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
  }> = {}) => {
    const el = document.createElement('bln-tabs') as any;
    // Set items first to ensure proper initialization
    el.items = props.items || defaultItems;
    Object.entries(props).forEach(([k, v]) => {
      if (k !== 'items') {
        (el as any)[k] = v;
      }
    });
    document.body.appendChild(el);
    await (el as any).updateComplete;
    return el as HTMLElement & { shadowRoot: ShadowRoot };
  };

  it('rendert Tabs mit Labels korrekt', async () => {
    const el = await mount();
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
    expect(tabs[0].textContent?.trim()).toContain('Tab 1');
    expect(tabs[1].textContent?.trim()).toContain('Tab 2');
    expect(tabs[2].textContent?.trim()).toContain('Tab 3');
  });

  it('setzt den ersten Tab als aktiv wenn kein activeId angegeben', async () => {
    const el = await mount();
    const firstTab = el.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    expect(firstTab.getAttribute('aria-selected')).toBe('true');
    expect(firstTab.getAttribute('tabindex')).toBe('0');
  });

  it('setzt das richtige Tab als aktiv basierend auf activeId', async () => {
    const el = await mount({ activeId: 'tab2' });
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[2].getAttribute('aria-selected')).toBe('false');
  });

  it('zeigt nur das aktive Tab Panel an', async () => {
    const el = await mount({ activeId: 'tab2' });
    const panels = el.shadowRoot!.querySelectorAll('[role="tabpanel"]');
    expect(panels[0].hasAttribute('hidden')).toBe(true);
    expect(panels[1].hasAttribute('hidden')).toBe(false);
    expect(panels[2].hasAttribute('hidden')).toBe(true);
  });

  it('rendert Tab Inhalte korrekt', async () => {
    const el = await mount({ activeId: 'tab1' });
    const activePanel = el.shadowRoot!.querySelector('[role="tabpanel"]:not([hidden])');
    expect(activePanel?.textContent?.trim()).toContain('Content 1');
  });

  it('emittiert tab-change Event beim Klick', async () => {
    const el = await mount();
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    const secondTab = el.shadowRoot!.querySelectorAll('[role="tab"]')[1] as HTMLElement;
    secondTab.click();
    await (el as any).updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.activeId).toBe('tab2');
    expect(eventDetail.activeItem.label).toBe('Tab 2');
  });

  it('unterstützt Tastaturnavigation mit Pfeiltasten', async () => {
    const el = await mount({ activeId: 'tab1' });
    const firstTab = el.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    firstTab.focus();
    firstTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await (el as any).updateComplete;

    expect(eventDetail.activeId).toBe('tab2');
  });

  it('unterstützt Tastaturnavigation mit ArrowLeft', async () => {
    const el = await mount({ activeId: 'tab2' });
    const secondTab = el.shadowRoot!.querySelectorAll('[role="tab"]')[1] as HTMLElement;
    
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    secondTab.focus();
    secondTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await (el as any).updateComplete;

    expect(eventDetail.activeId).toBe('tab1');
  });

  it('springt zum letzten Tab mit ArrowLeft vom ersten Tab', async () => {
    const el = await mount({ activeId: 'tab1' });
    const firstTab = el.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    firstTab.focus();
    firstTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await (el as any).updateComplete;

    expect(eventDetail.activeId).toBe('tab3');
  });

  it('springt zum ersten Tab mit ArrowRight vom letzten Tab', async () => {
    const el = await mount({ activeId: 'tab3' });
    const thirdTab = el.shadowRoot!.querySelectorAll('[role="tab"]')[2] as HTMLElement;
    
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    thirdTab.focus();
    thirdTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await (el as any).updateComplete;

    expect(eventDetail.activeId).toBe('tab1');
  });

  it('unterstützt Home/End Tasten', async () => {
    const el = await mount({ activeId: 'tab2' });
    const secondTab = el.shadowRoot!.querySelectorAll('[role="tab"]')[1] as HTMLElement;
    
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    // Test Home key
    secondTab.focus();
    secondTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await (el as any).updateComplete;
    expect(eventDetail.activeId).toBe('tab1');

    // Test End key
    const firstTab = el.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    firstTab.focus();
    firstTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await (el as any).updateComplete;
    expect(eventDetail.activeId).toBe('tab3');
  });

  it('aktiviert Tab mit Enter/Space', async () => {
    const el = await mount({ activeId: 'tab1' });
    const secondTab = el.shadowRoot!.querySelectorAll('[role="tab"]')[1] as HTMLElement;
    
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    secondTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await (el as any).updateComplete;
    expect(eventDetail.activeId).toBe('tab2');

    // Reset for Space test
    eventDetail = null;
    const thirdTab = el.shadowRoot!.querySelectorAll('[role="tab"]')[2] as HTMLElement;
    thirdTab.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await (el as any).updateComplete;
    expect(eventDetail.activeId).toBe('tab3');
  });

  it('ignoriert deaktivierte Tabs bei Navigation', async () => {
    const itemsWithDisabled: BlnTabItem[] = [
      { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
      { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
      { id: 'tab3', label: 'Tab 3', content: 'Content 3' }
    ];
    
    const el = await mount({ items: itemsWithDisabled, activeId: 'tab1' });
    const firstTab = el.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    
    let eventDetail: any = null;
    el.addEventListener('tab-change', (e: any) => {
      eventDetail = e.detail;
    });

    firstTab.focus();
    firstTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await (el as any).updateComplete;

    // Should skip disabled tab2 and go to tab3
    expect(eventDetail.activeId).toBe('tab3');
  });

  it('rendert deaktivierte Tabs mit disabled Attribut', async () => {
    const itemsWithDisabled: BlnTabItem[] = [
      { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
      { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true }
    ];
    
    const el = await mount({ items: itemsWithDisabled });
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]');
    expect(tabs[0].hasAttribute('disabled')).toBe(false);
    expect(tabs[1].hasAttribute('disabled')).toBe(true);
  });

  it('rendert Icons in Tabs', async () => {
    const itemsWithIcons: BlnTabItem[] = [
      { id: 'tab1', label: 'Home', content: 'Content 1', icon: 'Home' },
      { id: 'tab2', label: 'Settings', content: 'Content 2', icon: 'Settings' }
    ];
    
    const el = await mount({ items: itemsWithIcons });
    const icons = el.shadowRoot!.querySelectorAll('lucide-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('name')).toBe('Home');
    expect(icons[1].getAttribute('name')).toBe('Settings');
  });

  it('ändert Klassen je nach Größe', async () => {
    const small = await mount({ size: 'small' });
    const smallTab = small.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    expect(smallTab.className).toContain('text-xs');
    expect(smallTab.className).toContain('px-3');

    const large = await mount({ size: 'large' });
    const largeTab = large.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    expect(largeTab.className).toContain('text-base');
    expect(largeTab.className).toContain('px-6');
  });

  it('ändert Klassen je nach Variant', async () => {
    // Test pills variant
    const pills = await mount({ variant: 'pills' });
    const pillTab = pills.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    expect(pillTab.className).toContain('rounded-md');

    // Test underlined variant
    const underlined = await mount({ variant: 'underlined' });
    const underlinedTab = underlined.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    expect(underlinedTab.className).toContain('border-b-2');
  });

  it('setzt korrekte ARIA Attribute', async () => {
    const el = await mount({ 
      ariaLabel: 'Main navigation tabs',
      ariaLabelledby: 'nav-heading',
      ariaDescribedby: 'nav-description'
    });
    
    const tablist = el.shadowRoot!.querySelector('[role="tablist"]') as HTMLElement;
    expect(tablist.getAttribute('aria-label')).toBe('Main navigation tabs');
    expect(tablist.getAttribute('aria-labelledby')).toBe('nav-heading');
    expect(tablist.getAttribute('aria-describedby')).toBe('nav-description');
    expect(tablist.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('unterstützt vertikale Orientierung', async () => {
    const el = await mount({ orientation: 'vertical' });
    const tablist = el.shadowRoot!.querySelector('[role="tablist"]') as HTMLElement;
    expect(tablist.getAttribute('aria-orientation')).toBe('vertical');
    expect(tablist.className).toContain('flex-col');
  });

  it('unterstützt globale Deaktivierung', async () => {
    const el = await mount({ disabled: true });
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]');
    tabs.forEach(tab => {
      expect(tab.hasAttribute('disabled')).toBe(true);
    });
  });

  it('setzt roving tabindex korrekt', async () => {
    const el = await mount({ activeId: 'tab2' });
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]');
    
    expect(tabs[0].getAttribute('tabindex')).toBe('-1');
    expect(tabs[1].getAttribute('tabindex')).toBe('0');
    expect(tabs[2].getAttribute('tabindex')).toBe('-1');
  });

  it('verknüpft Tabs und Panels korrekt über aria-controls/aria-labelledby', async () => {
    const el = await mount();
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]');
    const panels = el.shadowRoot!.querySelectorAll('[role="tabpanel"]');
    
    tabs.forEach((tab, index) => {
      const controls = tab.getAttribute('aria-controls');
      const panel = panels[index];
      expect(panel.id).toBe(controls);
    });
  });

  it('wählt ersten verfügbaren Tab wenn activeId ungültig', async () => {
    const el = await mount({ activeId: 'invalid-id' });
    const firstTab = el.shadowRoot!.querySelector('[role="tab"]') as HTMLElement;
    expect(firstTab.getAttribute('aria-selected')).toBe('true');
    expect((el as any).activeId).toBe('tab1');
  });

  it('funktioniert mit leerer Items Liste', async () => {
    const el = await mount({ items: [] });
    const tabs = el.shadowRoot!.querySelectorAll('[role="tab"]');
    const panels = el.shadowRoot!.querySelectorAll('[role="tabpanel"]');
    expect(tabs.length).toBe(0);
    expect(panels.length).toBe(0);
  });

  it('rendert nur aktive Panel Inhalte (Lazy Loading)', async () => {
    const el = await mount({ activeId: 'tab1' });
    const panels = el.shadowRoot!.querySelectorAll('[role="tabpanel"]');
    
    // Only active panel should have content
    expect(panels[0].innerHTML).toContain('Content 1');
    expect(panels[1].innerHTML.trim()).toBe('');
    expect(panels[2].innerHTML.trim()).toBe('');
  });
});