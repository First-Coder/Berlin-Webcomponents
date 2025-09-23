import { describe, it, expect, beforeEach } from "vitest";
import "./BlnSelect.ts";
describe("<bln-select>", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });
    const mount = async (props = {}) => {
        const el = document.createElement("bln-select");
        Object.entries(props).forEach(([k, v]) => (el[k] = v));
        document.body.appendChild(el);
        await el.updateComplete;
        return el;
    };
    it("rendert Select und Label inkl. Corner-Hint", async () => {
        const el = await mount({ label: "Wähle etwas", cornerHint: "optional" });
        const label = el.shadowRoot.querySelector("label");
        const select = el.shadowRoot.querySelector("select");
        expect(label).toBeTruthy();
        expect(label.textContent).toContain("Wähle etwas");
        expect(select).toBeTruthy();
    });
    it("bindet hint via aria-describedby an", async () => {
        const el = await mount({ hint: "Hilfetext" });
        const select = el.shadowRoot.querySelector("select");
        const hint = el.shadowRoot.querySelector("p[id]");
        expect(hint.textContent).toContain("Hilfetext");
        const describedby = select.getAttribute("aria-describedby");
        expect(describedby && describedby.length > 0).toBe(true);
    });
    it("rendert Optionen aus props und setzt Value", async () => {
        const el = await mount({
            options: [
                { label: "A", value: "a" },
                { label: "B", value: "b" }
            ],
            value: "b"
        });
        const select = el.shadowRoot.querySelector("select");
        const opts = Array.from(select.querySelectorAll("option"));
        expect(opts.length).toBe(2);
        expect(select.value).toBe("b");
    });
    it("unterstützt placeholder (hidden, disabled) in single mode", async () => {
        const el = await mount({
            placeholder: "Bitte wählen",
            options: [{ label: "A", value: "a" }],
            value: ""
        });
        const select = el.shadowRoot.querySelector("select");
        const placeholderOpt = select.querySelector("option[value='']");
        expect(placeholderOpt).toBeTruthy();
        expect(placeholderOpt.disabled).toBe(true);
    });
    it("setzt disabled/required korrekt", async () => {
        const el = await mount({ disabled: true, required: true });
        const select = el.shadowRoot.querySelector("select");
        expect(select.hasAttribute("disabled")).toBe(true);
        expect(select.hasAttribute("required")).toBe(true);
    });
    it("ändert Klassen je nach Größe", async () => {
        const small = await mount({ size: "small" });
        const smallSelect = small.shadowRoot.querySelector("select");
        expect(smallSelect.className).toContain("py-1.5");
        const large = await mount({ size: "large" });
        const largeSelect = large.shadowRoot.querySelector("select");
        expect(largeSelect.className).toContain("p-3.5");
    });
    it("emittiert change und aktualisiert value (single)", async () => {
        const el = await mount({
            options: [{ label: "A", value: "a" }, { label: "B", value: "b" }],
            value: "a"
        });
        const select = el.shadowRoot.querySelector("select");
        let changeCount = 0;
        el.addEventListener("change", () => changeCount++);
        select.value = "b";
        select.dispatchEvent(new Event("change", { bubbles: true }));
        expect(changeCount).toBe(1);
        await el.updateComplete;
        expect(el.value).toBe("b");
    });
    it("unterstützt multiple Auswahl und setzt value als Array", async () => {
        const el = await mount({
            multiple: true,
            options: [{ label: "A", value: "a" }, { label: "B", value: "b" }, { label: "C", value: "c" }],
            value: ["a", "c"]
        });
        const select = el.shadowRoot.querySelector("select");
        // Ändere Auswahl: a + b
        Array.from(select.options).forEach(o => o.selected = (o.value === "a" || o.value === "b"));
        select.dispatchEvent(new Event("change", { bubbles: true }));
        await el.updateComplete;
        expect(Array.isArray(el.value)).toBe(true);
        expect(el.value).toEqual(["a", "b"]);
    });
    it("zeigt Validitäts-Icons abhängig von is-valid", async () => {
        const ok = await mount({ isValid: true, options: [{ label: "A", value: "a" }], value: "a" });
        expect(ok.shadowRoot.querySelector('lucide-icon[name="Check"]')).toBeTruthy();
        const bad = await mount({ isValid: false, options: [{ label: "A", value: "a" }], value: "a" });
        expect(bad.shadowRoot.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
    });
    it("deaktiviert Interaktion via disabled Klasse", async () => {
        const el = await mount({ disabled: true, options: [{ label: "A", value: "a" }] });
        const select = el.shadowRoot.querySelector("select");
        expect(select.className).toContain("disabled:pointer-events-none");
        expect(select.className).toContain("disabled:opacity-50");
    });
});
