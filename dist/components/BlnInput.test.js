import { describe, it, expect, beforeEach } from 'vitest';
import './BlnInput.ts';
/**
 * Tests for <bln-input>
 */
describe('<bln-input>', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });
    const mount = async (props = {}) => {
        const el = document.createElement('bln-input');
        Object.entries(props).forEach(([k, v]) => (el[k] = v));
        document.body.appendChild(el);
        await el.updateComplete;
        return el;
    };
    it('rendert Label und Corner-Hint', async () => {
        const el = await mount({ label: 'Name', cornerHint: 'optional' });
        const label = el.shadowRoot.querySelector('label');
        expect(label?.textContent).toContain('Name');
        const hint = el.shadowRoot.querySelector('span.block.mb-2.text-sm.text-gray-500');
        expect(hint?.textContent).toContain('optional');
    });
    it('bindet hint und error via aria-describedby an', async () => {
        const el = await mount({ hint: 'Hilfetext', error: 'Fehler' });
        const input = el.shadowRoot.querySelector('input');
        const describedby = input.getAttribute('aria-describedby') || '';
        expect(describedby.length).toBeGreaterThan(0);
        // Both hint and error ids should be included
        const ids = describedby.split(' ');
        // elements exist
        ids.forEach((id) => {
            expect(el.shadowRoot.getElementById(id)).toBeTruthy();
        });
    });
    it('setzt disabled/required/readonly korrekt', async () => {
        const el = await mount({ disabled: true, required: true, readonly: true });
        const input = el.shadowRoot.querySelector('input');
        expect(input.hasAttribute('disabled')).toBe(true);
        expect(input.hasAttribute('required')).toBe(true);
        expect(input.hasAttribute('readonly')).toBe(true);
    });
    it('unterstützt verschiedene Typen', async () => {
        const types = ['text', 'email', 'number', 'password', 'url', 'tel', 'search'];
        for (const t of types) {
            const el = await mount({ type: t });
            const input = el.shadowRoot.querySelector('input');
            expect(input.getAttribute('type')).toBe(t);
            el.remove();
        }
    });
    it('ändert Klassen je nach Größe', async () => {
        const s = await mount({ size: 'small' });
        const si = s.shadowRoot.querySelector('input');
        expect(si.className).toContain('py-1.5');
        const l = await mount({ size: 'large' });
        const li = l.shadowRoot.querySelector('input');
        expect(li.className).toContain('p-3.5');
    });
    it('emittiert input/change Events und spiegelt value', async () => {
        const el = await mount({ value: '' });
        const input = el.shadowRoot.querySelector('input');
        let inputCount = 0;
        let changeCount = 0;
        el.addEventListener('input', () => inputCount++);
        el.addEventListener('change', () => changeCount++);
        input.value = 'abc';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(inputCount).toBe(1);
        await el.updateComplete;
        expect(el.value).toBe('abc');
        input.dispatchEvent(new Event('change', { bubbles: true }));
        expect(changeCount).toBe(1);
    });
    it('zeigt Validitäts-Icons abhängig von is-valid', async () => {
        const ok = await mount({ isValid: true });
        expect(ok.shadowRoot.querySelector('lucide-icon[name="Check"]')).toBeTruthy();
        const bad = await mount({ isValid: false });
        expect(bad.shadowRoot.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
    });
    it('rendert Fehlermeldung in <span role="alert">', async () => {
        const el = await mount({ error: 'Dies ist falsch' });
        const span = el.shadowRoot.querySelector('span[role="alert"]');
        expect(span?.textContent).toContain('Dies ist falsch');
    });
    it('setzt weitere Attribute wie min/max/step/pattern/minlength/maxlength', async () => {
        const el = await mount({ type: 'number', min: '1', max: '10', step: '2', minlength: 3, maxlength: 5, pattern: '[0-9]+' });
        const input = el.shadowRoot.querySelector('input');
        expect(input.getAttribute('min')).toBe('1');
        expect(input.getAttribute('max')).toBe('10');
        expect(input.getAttribute('step')).toBe('2');
        expect(input.getAttribute('minlength')).toBe('3');
        expect(input.getAttribute('maxlength')).toBe('5');
        expect(input.getAttribute('pattern')).toBe('[0-9]+');
    });
    it('setzt inputmode und autocomplete', async () => {
        const el = await mount({ inputmode: 'numeric', autocomplete: 'email' });
        const input = el.shadowRoot.querySelector('input');
        expect(input.getAttribute('inputmode')).toBe('numeric');
        expect(input.getAttribute('autocomplete')).toBe('email');
    });
});
it('unterstützt externe Validierung über validator-Property', async () => {
    const el = await mount({ label: 'Test' });
    // Set validator as property (cannot be attribute)
    el.validator = (v) => ({ valid: v.length >= 3, message: 'Mindestens 3 Zeichen' });
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input');
    // Empty -> neutral (no icons, no error)
    expect(el.isValid).toBeUndefined();
    expect(el.shadowRoot.querySelector('lucide-icon[name="Check"]')).toBeFalsy();
    expect(el.shadowRoot.querySelector('lucide-icon[name="CircleAlert"]')).toBeFalsy();
    // Type 2 chars -> invalid
    input.value = 'ab';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(el.isValid).toBe(false);
    // icon rendered
    expect(el.shadowRoot.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
    // error shown
    const err = el.shadowRoot.querySelector('span[role="alert"]');
    expect(err?.textContent).toContain('Mindestens 3 Zeichen');
    // Type 3 chars -> valid
    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(el.isValid).toBe(true);
    expect(el.shadowRoot.querySelector('lucide-icon[name="Check"]')).toBeTruthy();
});
