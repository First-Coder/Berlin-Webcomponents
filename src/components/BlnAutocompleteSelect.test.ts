import {describe, it, expect, beforeEach} from "vitest";
import './BlnAutocompleteSelect';
import type { BlnSelectOption } from './BlnSelect';

describe('BlnAutocompleteSelect', () => {
    const sampleOptions: BlnSelectOption[] = [
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

    const mount = async (props: Partial<{
        label: string;
        hint: string;
        cornerHint: string;
        name: string;
        placeholder: string;
        searchPlaceholder: string;
        value: string | string[];
        disabled: boolean;
        required: boolean;
        multiple: boolean;
        size: "small" | "medium" | "large";
        class: string;
        isValid: boolean;
        retroDesign: boolean;
        minSearchChars: number;
        noResultsText: string;
        loadingText: string;
        options: BlnSelectOption[];
        ariaLabel: string;
        ariaLabelledby: string;
        ariaDescribedby: string;
    }> = {}) => {
        const el = document.createElement("bln-autocomplete-select") as any;
        Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
        document.body.appendChild(el);
        await (el as any).updateComplete;
        return el as HTMLElement & { shadowRoot: ShadowRoot };
    };

    it("rendert Autocomplete Select mit Label", async () => {
        const el = await mount({ label: "Stadt auswählen" });
        const label = el.shadowRoot!.querySelector("label");
        const input = el.shadowRoot!.querySelector("input");
        expect(label).toBeTruthy();
        expect(label!.textContent).toContain("Stadt auswählen");
        expect(input).toBeTruthy();
        expect(input!.getAttribute("role")).toBe("combobox");
    });

    it("setzt Optionen programmatisch", async () => {
        const el = await mount({ options: sampleOptions });
        expect((el as any).options).toEqual(sampleOptions);
    });

    it("filtert Optionen basierend auf Sucheingabe", async () => {
        const el = await mount({ 
            options: sampleOptions,
            minSearchChars: 1
        });
        
        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        // Dropdown sollte sichtbar sein
        const listbox = el.shadowRoot!.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
        
        // Nur Berlin sollte gefiltert werden
        const options = el.shadowRoot!.querySelectorAll('[role="option"]');
        expect(options.length).toBe(1);
        expect(options[0].textContent?.trim()).toBe('Berlin');
    });

    it("respektiert minSearchChars Einstellung", async () => {
        const el = await mount({ 
            options: sampleOptions,
            minSearchChars: 3
        });
        
        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        
        // Weniger als minSearchChars
        input.value = 'be';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        let listbox = el.shadowRoot!.querySelector('[role="listbox"]');
        expect(listbox).toBeFalsy();

        // Genug Zeichen
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        listbox = el.shadowRoot!.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
    });

    it("wählt Option bei Klick aus (Single)", async () => {
        const el = await mount({ 
            options: sampleOptions,
            minSearchChars: 1
        });
        
        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        const option = el.shadowRoot!.querySelector('[role="option"]') as HTMLElement;
        option.click();
        await (el as any).updateComplete;

        expect((el as any).value).toBe('berlin');
        expect(input.value).toBe('Berlin');
    });

    it("unterstützt Mehrfachauswahl", async () => {
        const el = await mount({ 
            options: sampleOptions,
            multiple: true,
            minSearchChars: 1
        });
        
        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        
        // Erste Auswahl
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        let option = el.shadowRoot!.querySelector('[role="option"]') as HTMLElement;
        option.click();
        await (el as any).updateComplete;

        expect(Array.isArray((el as any).value)).toBe(true);
        expect((el as any).value).toContain('berlin');

        // Zweite Auswahl
        input.value = 'mün';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        option = el.shadowRoot!.querySelector('[role="option"]') as HTMLElement;
        option.click();
        await (el as any).updateComplete;

        expect((el as any).value).toContain('munich');
        expect((el as any).value.length).toBe(2);
    });

    it("zeigt ausgewählte Optionen als Tags", async () => {
        const el = await mount({ 
            options: sampleOptions,
            multiple: true,
            value: ['berlin', 'munich']
        });

        const tags = el.shadowRoot!.querySelectorAll('.bg-blue-100');
        expect(tags.length).toBe(2);
    });

    it("hat korrekte ARIA-Attribute", async () => {
        const el = await mount({ 
            label: "Test Select",
            ariaLabel: "Custom Label"
        });

        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
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

        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        await (el as any).updateComplete;

        const listbox = el.shadowRoot!.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
    });

    it("schließt Dropdown bei Escape", async () => {
        const el = await mount({ 
            options: sampleOptions,
            minSearchChars: 1
        });

        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        let listbox = el.shadowRoot!.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await (el as any).updateComplete;

        listbox = el.shadowRoot!.querySelector('[role="listbox"]');
        expect(listbox).toBeFalsy();
    });

    it("zeigt Validierungsstatus korrekt", async () => {
        const validEl = await mount({ 
            isValid: true,
            value: 'test'
        });
        
        const validInput = validEl.shadowRoot!.querySelector("input") as HTMLInputElement;
        expect(validInput.classList.contains('border-teal-500')).toBe(true);
        expect(validEl.shadowRoot!.querySelector('lucide-icon[name="Check"]')).toBeTruthy();

        const invalidEl = await mount({ 
            isValid: false,
            value: 'test'
        });
        
        const invalidInput = invalidEl.shadowRoot!.querySelector("input") as HTMLInputElement;
        expect(invalidInput.classList.contains('border-red-500')).toBe(true);
        expect(invalidEl.shadowRoot!.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
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

        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        input.value = 'ber';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        const option = el.shadowRoot!.querySelector('[role="option"]') as HTMLElement;
        option.click();
        await (el as any).updateComplete;

        expect(changeEventFired).toBe(true);
    });

    it("emittiert search Event bei Eingabe", async () => {
        const el = await mount({ options: sampleOptions });
        
        let searchEventDetail: any = null;
        el.addEventListener('search', (e: Event) => {
            searchEventDetail = (e as CustomEvent).detail;
        });

        const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        await (el as any).updateComplete;

        expect(searchEventDetail).toEqual({ searchTerm: 'test' });
    });
});