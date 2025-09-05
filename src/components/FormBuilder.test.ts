// Basic sanity suite so Vitest recognizes this file as a test suite
import { describe, it, expect } from 'vitest';
import FormBuilder from '../components/FormBuilder';
import { render } from 'lit-html';


describe('FormBuilder (smoke)', () => {
    it('runs a trivial assertion', () => {
        expect(1 + 1).toBe(2);
    });
});


describe('FormBuilder (setPassword with length < minLength)', () => {
    it('returns an error message because the password is too short ', () => {
        const fb = new FormBuilder();
        expect(fb.validate('password', '123',5)).toBe('Passwort zu kurz (mindestens 5 Zeichen)');
    })
})

describe('FormBuilder (setPassword with correct length)', () => {
    it('returns empty error', () => {
        const fb = new FormBuilder();
        expect(fb.validate('password', '1234567',6)).toBe('');
    })
})

describe('FormBuilder (set NumberInput with incorrect numbers)', () => {
    it('returns error where number is too high', () => {
        const fb = new FormBuilder();
        expect(fb.validate('number', '1234567',1, 99)).toBe('Wert zu hoch (maximal 99)');
    })
})

describe('FormBuilder (set NumberInput with incorrect numbers)', () => {
    it('returns error where number is too low', () => {
        const fb = new FormBuilder();
        expect(fb.validate('number', '1',10, 99)).toBe('Wert zu niedrig (mindestens 10)');
    })
})

describe('FormBuilder', () => {
  it('validates email format', () => {
    const fb = new FormBuilder();
    expect(fb.validate('email', 'invalid')).toBe('Falsches Email Format');
    expect(fb.validate('email', 'user@example.com')).toBe('');
  });
});