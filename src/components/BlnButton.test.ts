import {describe, it, expect, vi, beforeEach} from "vitest";
import "./BlnButton.ts";


describe("<bln-button>", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    const mount = async (props: Partial<{
        variant: "primary" | "link" | "secondary";
        withArrow: boolean;
        withStripes: boolean;
        size: "small" | "medium" | "large";
        label: string; // nicht genutzt; Inhalt kommt über Slot
        disabled: boolean;
        class: string;
        onClick: (e: MouseEvent) => void;
    }> = {}, slottedText = "Klick mich") => {
        const el = document.createElement("bln-button") as any;
        // Props zuweisen
        Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
        el.textContent = slottedText; // Slot-Inhalt
        document.body.appendChild(el);
        await (el as any).updateComplete; // Auf Rendering warten
        return el as HTMLElement & { shadowRoot: ShadowRoot };
    };

    it("rendert einen Button und zeigt den Slot-Inhalt", async () => {
        const el = await mount();
        const btn = el.shadowRoot!.querySelector("button");
        expect(btn).toBeTruthy();
        // Slot-Inhalt sollte im Button-Text erscheinen
        expect(btn!.textContent).toContain("Klick mich");
    });


    it("setzt disabled korrekt und verhindert Pointer-Interaktion", async () => {
        const el = await mount({ disabled: true });
        const btn = el.shadowRoot!.querySelector("button")!;
        expect(btn.hasAttribute("disabled")).toBe(true);
        expect(btn.className).toContain("opacity-50");
        expect(btn.className).toContain("cursor-not-allowed");
    });

    it("ruft onClick-Handler auf, wenn geklickt wird", async () => {
        const onClick = vi.fn();
        const el = await mount({ onClick });
        const btn = el.shadowRoot!.querySelector("button")!;
        btn.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("rendert die Pfeilfläche, wenn withArrow = true", async () => {
        const el = await mount({ withArrow: true });
        const arrowContainer = el.shadowRoot!.querySelector("div > svg")?.parentElement;
        expect(arrowContainer).toBeTruthy();
        // Hintergrundfarbe aus Inline-Style (#e40422 für Standard/primary)
        expect(arrowContainer!.getAttribute("style")).toContain("background: #e40422");
    });

    it("nutzt beim Variant link andere Grundklassen", async () => {
        const el = await mount({ variant: "link" });
        const btn = el.shadowRoot!.querySelector("button")!;
        // Link-Variante: rote Border-Klasse aus Template
        expect(btn.className).toContain("border-[#e40422]");
        expect(btn.className).toContain("font-bold");
    });

    it("berechnet die Größe in den Klassen (small/large)", async () => {
        const smallEl = await mount({ size: "small" });
        const smallBtn = smallEl.shadowRoot!.querySelector("button")!;
        expect(smallBtn.className).toContain("text-sm");

        const largeEl = await mount({ size: "large" });
        const largeBtn = largeEl.shadowRoot!.querySelector("button")!;
        expect(largeBtn.className).toContain("text-lg");
    });

    it("rendert Streifenhintergrund, wenn withStripes = true", async () => {
        const el = await mount({ withStripes: true });
        // Bei withStripes wird ein section-Wrapper gerendert
        const section = el.shadowRoot!.querySelector("section");
        expect(section).toBeTruthy();
        expect(section!.getAttribute("style")).toContain("background-image");
    });

    it("ändert Pfeilhintergrund bei variant = secondary auf schwarz", async () => {
        const el = await mount({ withArrow: true, variant: "secondary" as any });
        const arrowContainer = el.shadowRoot!.querySelector("div > svg")?.parentElement!;
        expect(arrowContainer.getAttribute("style")).toContain("background: black");
    });
});
