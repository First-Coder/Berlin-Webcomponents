import {describe, it, expect, beforeEach} from 'vitest';
import './BlnTextarea.ts';

/**
 * Tests for <bln-textarea>
 */
describe('<bln-textarea>', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    const mount = async (props: Partial<{
        label: string;
        name: string;
        placeholder: string;
        hint: string;
        error: string;
        value: string;
        disabled: boolean;
        required: boolean;
        readonly: boolean;
        class: string;
        size: 'small' | 'medium' | 'large';
        cornerHint: string;
        isValid: boolean;
        minlength: number;
        maxlength: number;
        rows: number;
        cols: number;
        wrap: 'soft' | 'hard' | 'off';
        resize: 'none' | 'both' | 'horizontal' | 'vertical';
        autocomplete: string;
        retroDesign: boolean;
    }> = {}) => {
        const el = document.createElement('bln-textarea') as any;
        Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
        document.body.appendChild(el);
        await (el as any).updateComplete;
        return el as HTMLElement & { shadowRoot: ShadowRoot };
    };

    it('rendert Label und Corner-Hint', async () => {
        const el = await mount({label: 'Beschreibung', cornerHint: 'optional'});
        const label = el.shadowRoot!.querySelector('label');
        expect(label?.textContent).toContain('Beschreibung');
        const hint = el.shadowRoot!.querySelector('span.block.mb-2.text-sm.text-gray-500');
        expect(hint?.textContent).toContain('optional');
    });

    it('bindet hint und error via aria-describedby an', async () => {
        const el = await mount({hint: 'Hilfetext', error: 'Fehler'});
        const textarea = el.shadowRoot!.querySelector('textarea')!;
        const describedby = textarea.getAttribute('aria-describedby') || '';
        expect(describedby.length).toBeGreaterThan(0);
        // Both hint and error ids should be included
        const ids = describedby.split(' ');
        // elements exist
        ids.forEach((id) => {
            expect(el.shadowRoot!.getElementById(id)).toBeTruthy();
        });
    });

    it('setzt disabled/required/readonly korrekt', async () => {
        const el = await mount({disabled: true, required: true, readonly: true});
        const textarea = el.shadowRoot!.querySelector('textarea')! as HTMLTextAreaElement;
        expect(textarea.hasAttribute('disabled')).toBe(true);
        expect(textarea.hasAttribute('required')).toBe(true);
        expect(textarea.hasAttribute('readonly')).toBe(true);
    });

    it('setzt rows und cols korrekt', async () => {
        const el = await mount({rows: 6, cols: 40});
        const textarea = el.shadowRoot!.querySelector('textarea')! as HTMLTextAreaElement;
        expect(textarea.getAttribute('rows')).toBe('6');
        expect(textarea.getAttribute('cols')).toBe('40');
    });

    it('setzt wrap-Attribut korrekt', async () => {
        const wraps = ['soft', 'hard', 'off'] as const;
        for (const wrap of wraps) {
            const el = await mount({wrap});
            const textarea = el.shadowRoot!.querySelector('textarea')!;
            expect(textarea.getAttribute('wrap')).toBe(wrap);
            el.remove();
        }
    });

    it('ändert Klassen je nach Größe', async () => {
        const s = await mount({size: 'small'});
        const st = s.shadowRoot!.querySelector('textarea')!;
        expect(st.className).toContain('py-1.5');
        expect(st.className).toContain('text-xs');

        const l = await mount({size: 'large'});
        const lt = l.shadowRoot!.querySelector('textarea')!;
        expect(lt.className).toContain('p-3.5');
        expect(lt.className).toContain('text-base');
    });

    it('setzt resize-Klassen korrekt', async () => {
        const resizeOptions = [
            {resize: 'none', expectedClass: 'resize-none'},
            {resize: 'both', expectedClass: 'resize'},
            {resize: 'horizontal', expectedClass: 'resize-x'},
            {resize: 'vertical', expectedClass: 'resize-y'}
        ] as const;

        for (const {resize, expectedClass} of resizeOptions) {
            const el = await mount({resize});
            const textarea = el.shadowRoot!.querySelector('textarea')!;
            expect(textarea.className).toContain(expectedClass);
            el.remove();
        }
    });

    it('emittiert input/change Events und spiegelt value', async () => {
        const el = await mount({value: ''});
        const textarea = el.shadowRoot!.querySelector('textarea')! as HTMLTextAreaElement;

        let inputCount = 0;
        let changeCount = 0;
        el.addEventListener('input', () => inputCount++);
        el.addEventListener('change', () => changeCount++);

        textarea.value = 'Mehrzeiliger\nText';
        textarea.dispatchEvent(new Event('input', {bubbles: true}));
        expect(inputCount).toBe(1);
        await (el as any).updateComplete;
        expect((el as any).value).toBe('Mehrzeiliger\nText');

        textarea.dispatchEvent(new Event('change', {bubbles: true}));
        expect(changeCount).toBe(1);
    });

    it('zeigt Validitäts-Icons abhängig von is-valid', async () => {
        const ok = await mount({isValid: true, value: 'test'});
        expect(ok.shadowRoot!.querySelector('lucide-icon[name="Check"]')).toBeTruthy();

        const bad = await mount({isValid: false, value: 'test'});
        expect(bad.shadowRoot!.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
    });

    it('rendert Fehlermeldung in <span role="alert">', async () => {
        const el = await mount({error: 'Dies ist falsch'});
        const span = el.shadowRoot!.querySelector('span[role="alert"]');
        expect(span?.textContent).toContain('Dies ist falsch');
    });

    it('setzt minlength/maxlength Attribute', async () => {
        const el = await mount({minlength: 10, maxlength: 500});
        const textarea = el.shadowRoot!.querySelector('textarea')! as HTMLTextAreaElement;
        expect(textarea.getAttribute('minlength')).toBe('10');
        expect(textarea.getAttribute('maxlength')).toBe('500');
    });

    it('setzt autocomplete', async () => {
        const el = await mount({autocomplete: 'street-address'});
        const textarea = el.shadowRoot!.querySelector('textarea')! as HTMLTextAreaElement;
        expect(textarea.getAttribute('autocomplete')).toBe('street-address');
    });

    it('unterstützt retroDesign Styling', async () => {
        const el = await mount({retroDesign: true, label: 'Test'});
        const label = el.shadowRoot!.querySelector('label');
        expect(label?.className).toContain('font-bold');
        expect(label?.className).toContain('text-black');

        const textarea = el.shadowRoot!.querySelector('textarea')!;
        expect(textarea.className).toContain('rounded-none');
        expect(textarea.className).toContain('focus:border-retro-blue');
    });

    it('setzt aria-Attribute korrekt', async () => {
        const el = await mount({
           ariaLabel: 'Beschreibung eingeben',
            ariaLabelledby: 'external-label',
            ariaDescribedby: 'external-desc'
        });
        const textarea = el.shadowRoot!.querySelector('textarea')!;
        expect(textarea.getAttribute('aria-label')).toBe('Beschreibung eingeben');
        expect(textarea.getAttribute('aria-labelledby')).toBe('external-label');
        expect(textarea.getAttribute('aria-describedby')).toContain('external-desc');
    });

    it('unterstützt externe Validierung über validator-Property', async () => {
        const el = await mount({label: 'Test'}) as any;
        // Set validator as property (cannot be attribute)
        el.validator = (v: string) => ({valid: v.length >= 10, message: 'Mindestens 10 Zeichen'});
        await el.updateComplete;
        const textarea = el.shadowRoot!.querySelector('textarea')! as HTMLTextAreaElement;

        // Empty -> neutral (no icons, no error)
        expect(el.isValid).toBeUndefined();
        expect(el.shadowRoot!.querySelector('lucide-icon[name="Check"]')).toBeFalsy();
        expect(el.shadowRoot!.querySelector('lucide-icon[name="CircleAlert"]')).toBeFalsy();

        // Type 5 chars -> invalid
        textarea.value = 'kurz';
        textarea.dispatchEvent(new Event('input', {bubbles: true}));
        await el.updateComplete;
        expect(el.isValid).toBe(false);
        // icon rendered
        expect(el.shadowRoot!.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
        // error shown
        const err = el.shadowRoot!.querySelector('span[role="alert"]');
        expect(err?.textContent).toContain('Mindestens 10 Zeichen');

        // Type 10+ chars -> valid
        textarea.value = 'Das ist ein längerer Text';
        textarea.dispatchEvent(new Event('input', {bubbles: true}));
        await el.updateComplete;
        expect(el.isValid).toBe(true);
        expect(el.shadowRoot!.querySelector('lucide-icon[name="Check"]')).toBeTruthy();
    });

    it('dispatcht focus, blur, keydown und keyup Events', async () => {
        const el = await mount({});
        const textarea = el.shadowRoot!.querySelector('textarea')! as HTMLTextAreaElement;

        let focusCount = 0;
        let blurCount = 0;
        let keydownCount = 0;
        let keyupCount = 0;

        el.addEventListener('focus', () => focusCount++);
        el.addEventListener('blur', () => blurCount++);
        el.addEventListener('keydown', () => keydownCount++);
        el.addEventListener('keyup', () => keyupCount++);

        textarea.dispatchEvent(new Event('focus', {bubbles: true}));
        expect(focusCount).toBe(1);

        textarea.dispatchEvent(new Event('blur', {bubbles: true}));
        expect(blurCount).toBe(1);

        textarea.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
        expect(keydownCount).toBe(1);

        textarea.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter', bubbles: true}));
        expect(keyupCount).toBe(1);
    });

    it('hat default rows von 4', async () => {
        const el = await mount({});
        const textarea = el.shadowRoot!.querySelector('textarea')!;
        expect(textarea.getAttribute('rows')).toBe('4');
    });

    it('hat default resize von vertical', async () => {
        const el = await mount({});
        const textarea = el.shadowRoot!.querySelector('textarea')!;
        expect(textarea.className).toContain('resize-y');
    });
});