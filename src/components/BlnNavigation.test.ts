import {describe, it, expect, beforeEach} from 'vitest';
import './BlnNavigation';

describe('bln-navigation', () => {
  beforeEach(() => (document.body.innerHTML = ''));

  const mount = async (attrs: Partial<{title: string; icon: string; collapsed: boolean}> = {}, slotted: string = '') => {
    const el = document.createElement('bln-navigation') as any;
    Object.assign(el, attrs);
    el.innerHTML = slotted;
    document.body.appendChild(el);
    await el.updateComplete;
    return el as HTMLElement & { shadowRoot: ShadowRoot } & { collapsed: boolean };
  };

  it('rendered with title and icon', async () => {
    const el = await mount({title: 'Menü', icon: 'Menu'});
    const shadow = (el as any).shadowRoot as ShadowRoot;
    expect(shadow.querySelector('h2')?.textContent).toContain('Menü');
    expect(shadow.querySelector('lucide-icon')).toBeTruthy();
  });

  it('toggles collapsed state on button click', async () => {
    const el = await mount({title: 'Navi'});
    const btnEl = el.shadowRoot!.querySelector('bln-button') as any;
    expect(el.collapsed).toBe(false);
    (btnEl.shadowRoot!.querySelector('button') as HTMLButtonElement).click();
    await (el as any).updateComplete;
    expect(el.collapsed).toBe(true);
  });

  it('respects slotted items', async () => {
    const el = await mount({title: 'Navi'}, `<li><a href="#">Home</a></li><li><button>Aktion</button></li>`);
    const assigned = (el.shadowRoot!.querySelector('slot') as HTMLSlotElement).assignedNodes({flatten: true});
    expect(assigned.length).toBeGreaterThan(0);
  });
});
