import {describe, it, expect, beforeEach, vi} from "vitest";
import "./BlnButton.ts";

describe("<bln-button>", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    const mount = async (
        props: Partial<{
            variant: "solid" | "outline" | "ghost" | "soft" | "link" | "arrow" | "arrow-red";
            withStripes: boolean;
            size: "small" | "medium" | "large";
            disabled: boolean;
            class: string;
            retroDesign: boolean;
            loading: boolean;
            onClick: (e: MouseEvent) => void;
        }> = {},
        slottedText = "Klick mich"
    ) => {
        const el = document.createElement("bln-button") as any;
        Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
        el.textContent = slottedText;
        document.body.appendChild(el);
        await (el as any).updateComplete;
        return el as HTMLElement & { shadowRoot: ShadowRoot };
    };

    it("rendert Button und zeigt Slot-Inhalt", async () => {
        const el = await mount();
        const btn = el.shadowRoot!.querySelector("button");
        expect(btn).toBeTruthy();
        const content = el.shadowRoot!.querySelector("span#content")!;
        expect(content.textContent).toContain("Klick mich");
    });

    it("setzt disabled korrekt und enthält entsprechende Klassen", async () => {
        const el = await mount({ disabled: true });
        const btn = el.shadowRoot!.querySelector("button")!;
        expect(btn.hasAttribute("disabled")).toBe(true);
        // Klassen werden als Literal gesetzt (Tailwind utility), daher so prüfen:
        expect(btn.className).toContain("disabled:opacity-50");
        expect(btn.className).toContain("disabled:cursor-not-allowed");
    });

    it("ruft onClick-Handler beim Klick auf", async () => {
        const onClick = vi.fn();
        const el = await mount({ onClick });
        const btn = el.shadowRoot!.querySelector("button")!;
        btn.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("link-Variante im Retro-Design hat rote Border und fette Schrift", async () => {
        const el = await mount({ variant: "link", retroDesign: true });
        const btn = el.shadowRoot!.querySelector("button")!;
        expect(btn.className).toContain("border-2");
        expect(btn.className).toContain("!border-[#e40422]");
        expect(btn.className).toContain("font-bold");
    });

    it("Größen beeinflussen die vertikalen Padding-Klassen", async () => {
        const smallEl = await mount({ size: "small" });
        const smallContent = smallEl.shadowRoot!.querySelector("span#content")!;
        expect(smallContent.className).toContain("py-2");

        const largeEl = await mount({ size: "large" });
        const largeContent = largeEl.shadowRoot!.querySelector("span#content")!;
        expect(largeContent.className).toContain("py-4");
        expect(largeContent.className).toContain("sm:py-5");
    });

    it("rendert Streifen-Wrapper, wenn withStripes = true", async () => {
        const el = await mount({ withStripes: true });
        const section = el.shadowRoot!.querySelector("section");
        expect(section).toBeTruthy();
        expect(section!.getAttribute("style")).toContain("background-image");
    });

    it("Arrow-Variante: Pfeilcontainer vorhanden und Hintergrund abhängig von Variante (Retro)", async () => {
        // arrow => schwarz im Retro-Design
        const elBlack = await mount({ variant: "arrow", retroDesign: true });
        const arrowContainerBlack = elBlack.shadowRoot!.querySelector("div");
        expect(arrowContainerBlack?.className).toContain("bg-black");

        // arrow-red => rot im Retro-Design
        const elRed = await mount({ variant: "arrow-red", retroDesign: true });
        const arrowContainerRed = elRed.shadowRoot!.querySelector("div");
        // Klasse aus Template: bg-police-red
        expect(arrowContainerRed?.className).toContain("bg-police-red");
    });

    it("zeigt Loading-Spinner und verschiebt Padding, wenn loading=true (nicht Retro)", async () => {
        const el = await mount({ loading: true, retroDesign: false });
        const loading = el.shadowRoot!.querySelector('span#loading');
        expect(loading).toBeTruthy();
        // updated() fügt ml-2 am linken Element hinzu
        expect(loading!.className).toContain('ml-2');
    });
});