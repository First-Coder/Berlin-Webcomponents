import { describe, it, expect, beforeEach, vi } from "vitest";
import "./BlnButton.ts";
describe("<bln-button>", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });
    const mount = async (props = {}, slottedText = "Click me") => {
        const el = document.createElement("bln-button");
        Object.entries(props).forEach(([k, v]) => (el[k] = v));
        el.textContent = slottedText;
        document.body.appendChild(el);
        await el.updateComplete;
        return el;
    };
    // it("renders a button and shows the slot content", async () => {
    //     const el = await mount();
    //     const btn = el.shadowRoot!.querySelector("button");
    //     expect(btn).toBeTruthy();
    //     const content = el.shadowRoot!.querySelector("span#content")!;
    //     expect(content.textContent).toContain("Click me");
    // });
    it("applies disabled correctly and includes utility classes", async () => {
        const el = await mount({ disabled: true });
        const btn = el.shadowRoot.querySelector("button");
        expect(btn.hasAttribute("disabled")).toBe(true);
        expect(btn.className).toContain("disabled:opacity-50");
        expect(btn.className).toContain("disabled:cursor-not-allowed");
    });
    it("invokes onClick handler when clicked", async () => {
        const onClick = vi.fn();
        const el = await mount({ onClick });
        const btn = el.shadowRoot.querySelector("button");
        btn.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it("link variant in retro design has red border and bold font", async () => {
        const el = await mount({ variant: "link", retroDesign: true });
        const btn = el.shadowRoot.querySelector("button");
        expect(btn.className).toContain("border-2");
        expect(btn.className).toContain("!border-[#e40422]");
        expect(btn.className).toContain("font-bold");
    });
    it("sizes affect vertical padding classes", async () => {
        const smallEl = await mount({ size: "small" });
        const smallContent = smallEl.shadowRoot.querySelector("span#content");
        expect(smallContent.className).toContain("py-2");
        const largeEl = await mount({ size: "large" });
        const largeContent = largeEl.shadowRoot.querySelector("span#content");
        expect(largeContent.className).toContain("py-4");
        expect(largeContent.className).toContain("sm:py-5");
    });
    it("renders striped wrapper when withStripes = true", async () => {
        const el = await mount({ withStripes: true });
        const section = el.shadowRoot.querySelector("section");
        expect(section).toBeTruthy();
        expect(section.getAttribute("style")).toContain("background-image");
    });
    it("arrow variants: arrow container exists and background depends on variant (retro)", async () => {
        // arrow => black background in retro design
        const elBlack = await mount({ variant: "arrow", retroDesign: true });
        const arrowContainerBlack = elBlack.shadowRoot.querySelector("div");
        expect(arrowContainerBlack?.className).toContain("bg-black");
        // arrow-red => red background in retro design
        const elRed = await mount({ variant: "arrow-red", retroDesign: true });
        const arrowContainerRed = elRed.shadowRoot.querySelector("div");
        expect(arrowContainerRed?.className).toContain("bg-police-red");
    });
    it("shows loading spinner and adjusts padding when loading=true (non-retro)", async () => {
        const el = await mount({ loading: true, retroDesign: false });
        const loading = el.shadowRoot.querySelector("span#loading");
        expect(loading).toBeTruthy();
        // updated() adds ml-2 to the left element
        expect(loading.className).toContain("ml-2");
    });
});
