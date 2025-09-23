// Basic sanity suite so Vitest recognizes this file as a test suite
import { describe, it, expect } from 'vitest';
import FormBuilder from '../components/FormBuilder';
import { render, html } from 'lit-html';
describe('FormBuilder (smoke)', () => {
    it('runs a trivial assertion', () => {
        expect(1 + 1).toBe(2);
    });
});
describe('FormBuilder (setPassword with length < minLength)', () => {
    it('returns an error message because the password is too short ', () => {
        const fb = new FormBuilder();
        expect(fb.validate('password', '123')).toBe('Passwort zu kurz (mindestens 5 Zeichen)');
    });
});
describe('FormBuilder (setPassword with correct length)', () => {
    it('returns empty error', () => {
        const fb = new FormBuilder();
        expect(fb.validate('password', '1234567')).toBe('');
    });
});
describe('FormBuilder (set NumberInput with incorrect numbers)', () => {
    it('returns error where number is too high', () => {
        const fb = new FormBuilder();
        expect(fb.validate('number', '1234567')).toBe('Wert zu hoch (maximal 99)');
    });
});
describe('FormBuilder (set NumberInput with incorrect numbers)', () => {
    it('returns error where number is too low', () => {
        const fb = new FormBuilder();
        expect(fb.validate('number', '1')).toBe('Wert zu niedrig (mindestens 10)');
    });
});
describe('FormBuilder', () => {
    it('validates email format', () => {
        const fb = new FormBuilder();
        expect(fb.validate('email', 'invalid')).toBe('Falsches Email Format');
        expect(fb.validate('email', 'user@example.com')).toBe('');
    });
    it('allows overriding sync validators with setCustomValidateFunction', () => {
        const fb = new FormBuilder();
        fb.setCustomValidateFunction('password', (v) => v === 'ok' ? '' : 'bad');
        expect(fb.validate('password', 'nope')).toBe('bad');
        expect(fb.validate('password', 'ok')).toBe('');
    });
    it('supports async validation with setCustomValidateFunctionAsync and fallback to sync', async () => {
        const fb = new FormBuilder();
        fb.setCustomValidateFunctionAsync('email', async (v) => {
            await new Promise(r => setTimeout(r, 1));
            return v.includes('@') ? '' : 'async-fail';
        });
        expect(await fb.validateAsync('email', 'x')).toBe('async-fail');
        expect(await fb.validateAsync('email', 'a@b')).toBe('');
        // Fallback to sync if no async validator exists
        expect(await fb.validateAsync('number', '5')).toBe('Wert zu niedrig (mindestens 10)');
        expect(await fb.validateAsync('number', '55')).toBe('');
    });
    it('accumulates fields via builder methods and exposes them via getFields()', () => {
        const fb = new FormBuilder();
        fb.addField('text', 'Name', 'Alice')
            .addButton('Save')
            .addBlnSelect({ label: 'Choose', options: [{ label: 'A', value: 'a' }] })
            .addBlnButton('Click')
            .addBlnCheckbox({ label: 'Agree', checked: true })
            .addBlnTree({ items: [{ id: '1', label: 'Root' }] })
            .addBlnToast({ title: 'Hi', message: 'Msg' });
        const fields = fb.getFields();
        expect(Array.isArray(fields)).toBe(true);
        expect(fields.length).toBeGreaterThan(0);
    });
    it('renders created elements with correct tag names in a container', () => {
        const container = document.createElement('div');
        const fb = new FormBuilder();
        fb.addBlnSelect({ name: 's', options: [{ label: 'X', value: 'x' }] });
        fb.addBlnButton('Label');
        fb.addBlnCheckbox({ name: 'c' });
        fb.addBlnTree({ items: [] });
        fb.addBlnToast({ open: false });
        // Render all fields at once to avoid overwriting previous nodes
        render(html `${fb.getFields()}`, container);
        // Only assert tag presence, not internal behavior
        expect(container.querySelector('bln-select')).toBeTruthy();
        expect(container.querySelector('bln-button')).toBeTruthy();
        expect(container.querySelector('bln-checkbox')).toBeTruthy();
        expect(container.querySelector('bln-tree')).toBeTruthy();
        expect(container.querySelector('bln-toast')).toBeTruthy();
    });
});
