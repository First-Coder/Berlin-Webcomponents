import { describe, it, expect, beforeEach } from "vitest";
import './BlnAutocompleteSelect';
describe('BlnAutocompleteSelect', () => {
    const sampleOptions = [
        { label: 'Berlin', value: 'berlin' },
        { label: 'München', value: 'munich' },
        { label: 'Hamburg', value: 'hamburg' },
        { label: 'Köln', value: 'cologne' },
        { label: 'Frankfurt', value: 'frankfurt' },
        { label: 'Stuttgart', value: 'stuttgart', disabled: true }
    ];
    beforeEach(() => {
        document.body.innerHTML = "";
    });
    const mount = async (props = {}) => {
        const el = document.createElement("bln-autocomplete-select");
        Object.entries(props).forEach(([k, v]) => (el[k] = v));
        document.body.appendChild(el);
        await el.updateComplete;
        return el;
    };
    it("rendert Autocomplete Select mit Label", async () => {
        const el = await mount({ label: "Stadt auswählen" });
        const label = el.shadowRoot.querySelector("label");
        const input = el.shadowRoot.querySelector("input");
        expect(label).toBeTruthy();
        expect(label.textContent).toContain("Stadt auswählen");
        expect(input).toBeTruthy();
        expect(input.getAttribute("role")).toBe("combobox");
    });
    it("setzt Optionen programmatisch", async () => {
        const el = await mount({ options: sampleOptions });
        expect(el.options).toEqual(sampleOptions);
    });
    it("filtert Optionen basierend auf Sucheingabe", async () => {
        const el = await mount({
            options: sampleOptions,
            minSearchChars: 1
        });
        const input = el.shadowRoot.querySelector("input");
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        // Dropdown sollte sichtbar sein
        const listbox = el.shadowRoot.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
        // Nur Berlin sollte gefiltert werden
        const options = el.shadowRoot.querySelectorAll('[role="option"]');
        expect(options.length).toBe(1);
        expect(options[0].textContent?.trim()).toBe('Berlin');
    });
    it("respektiert minSearchChars Einstellung", async () => {
        const el = await mount({
            options: sampleOptions,
            minSearchChars: 3
        });
        const input = el.shadowRoot.querySelector("input");
        // Weniger als minSearchChars
        input.value = 'be';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        let listbox = el.shadowRoot.querySelector('[role="listbox"]');
        expect(listbox).toBeFalsy();
        // Genug Zeichen
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        listbox = el.shadowRoot.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
    });
    it("wählt Option bei Klick aus (Single)", async () => {
        const el = await mount({
            options: sampleOptions,
            minSearchChars: 1
        });
        const input = el.shadowRoot.querySelector("input");
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        const option = el.shadowRoot.querySelector('[role="option"]');
        option.click();
        await el.updateComplete;
        expect(el.value).toBe('berlin');
        expect(input.value).toBe('Berlin');
    });
    it("unterstützt Mehrfachauswahl", async () => {
        const el = await mount({
            options: sampleOptions,
            multiple: true,
            minSearchChars: 1
        });
        const input = el.shadowRoot.querySelector("input");
        // Erste Auswahl
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        let option = el.shadowRoot.querySelector('[role="option"]');
        option.click();
        await el.updateComplete;
        expect(Array.isArray(el.value)).toBe(true);
        expect(el.value).toContain('berlin');
        // Zweite Auswahl
        input.value = 'mün';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        option = el.shadowRoot.querySelector('[role="option"]');
        option.click();
        await el.updateComplete;
        expect(el.value).toContain('munich');
        expect(el.value.length).toBe(2);
    });
    it("zeigt ausgewählte Optionen als Tags", async () => {
        const el = await mount({
            options: sampleOptions,
            multiple: true,
            value: ['berlin', 'munich']
        });
        const tags = el.shadowRoot.querySelectorAll('.bg-blue-100');
        expect(tags.length).toBe(2);
    });
    it("hat korrekte ARIA-Attribute", async () => {
        const el = await mount({
            label: "Test Select",
            ariaLabel: "Custom Label"
        });
        const input = el.shadowRoot.querySelector("input");
        expect(input.getAttribute("role")).toBe("combobox");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.getAttribute("aria-invalid")).toBe("false");
        expect(input.getAttribute("aria-label")).toBe("Custom Label");
    });
    it("öffnet Dropdown bei Pfeil-nach-unten", async () => {
        const el = await mount({
            options: sampleOptions,
            minSearchChars: 1
        });
        const input = el.shadowRoot.querySelector("input");
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        await el.updateComplete;
        const listbox = el.shadowRoot.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
    });
    it("schließt Dropdown bei Escape", async () => {
        const el = await mount({
            options: sampleOptions,
            minSearchChars: 1
        });
        const input = el.shadowRoot.querySelector("input");
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        let listbox = el.shadowRoot.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await el.updateComplete;
        listbox = el.shadowRoot.querySelector('[role="listbox"]');
        expect(listbox).toBeFalsy();
    });
    it("zeigt Validierungsstatus korrekt", async () => {
        const validEl = await mount({
            isValid: true,
            value: 'test'
        });
        const validInput = validEl.shadowRoot.querySelector("input");
        expect(validInput.classList.contains('border-teal-500')).toBe(true);
        expect(validEl.shadowRoot.querySelector('lucide-icon[name="Check"]')).toBeTruthy();
        const invalidEl = await mount({
            isValid: false,
            value: 'test'
        });
        const invalidInput = invalidEl.shadowRoot.querySelector("input");
        expect(invalidInput.classList.contains('border-red-500')).toBe(true);
        expect(invalidEl.shadowRoot.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
    });
    it("emittiert change Event bei Auswahl", async () => {
        const el = await mount({
            options: sampleOptions,
            minSearchChars: 1
        });
        let changeEventFired = false;
        el.addEventListener('change', () => {
            changeEventFired = true;
        });
        const input = el.shadowRoot.querySelector("input");
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        const option = el.shadowRoot.querySelector('[role="option"]');
        option.click();
        await el.updateComplete;
        expect(changeEventFired).toBe(true);
    });
    it("emittiert search Event bei Eingabe", async () => {
        const el = await mount({ options: sampleOptions });
        let searchEventDetail = null;
        el.addEventListener('search', (e) => {
            searchEventDetail = e.detail;
        });
        const input = el.shadowRoot.querySelector("input");
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        await el.updateComplete;
        expect(searchEventDetail).toEqual({ searchTerm: 'test' });
    });
});
