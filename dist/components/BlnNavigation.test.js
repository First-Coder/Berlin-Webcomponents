import { describe, it, expect, beforeEach } from 'vitest';
import './BlnNavigation';
describe('bln-navigation', () => {
    beforeEach(() => (document.body.innerHTML = ''));
    const mount = async (attrs = {}, slotted = '') => {
        const el = document.createElement('bln-navigation');
        Object.assign(el, attrs);
        el.innerHTML = slotted;
        document.body.appendChild(el);
        await el.updateComplete;
        return el;
    };
    it('rendered with title and icon', async () => {
        const el = await mount({ title: 'Menü', icon: 'Menu' });
        const shadow = el.shadowRoot;
        expect(shadow.querySelector('h2')?.textContent).toContain('Menü');
        expect(shadow.querySelector('lucide-icon')).toBeTruthy();
    });
    it('toggles collapsed state on button click', async () => {
        const el = await mount({ title: 'Navi' });
        const btnEl = el.shadowRoot.querySelector('bln-button');
        expect(el.collapsed).toBe(false);
        btnEl.shadowRoot.querySelector('button').click();
        await el.updateComplete;
        expect(el.collapsed).toBe(true);
    });
    it('respects slotted items', async () => {
        const el = await mount({ title: 'Navi' }, `<li><a href="#">Home</a></li><li><button>Aktion</button></li>`);
        const assigned = el.shadowRoot.querySelector('slot').assignedNodes({ flatten: true });
        expect(assigned.length).toBeGreaterThan(0);
    });
});
