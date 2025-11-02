import {expect, fixture, html, oneEvent} from "@open-wc/testing";
import "./BlnGrid";

describe("<bln-grid>", () => {

    it("is defined as a custom element", () => {
        const el = document.createElement("bln-grid");
        expect(el).to.be.instanceOf(HTMLElement);
    });

    it("renders a grid container with default 1 column", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div>Item 1</div>
            </bln-grid>
        `);

        const grid = el.shadowRoot!.querySelector("div[data-part='grid']");
        expect(grid).to.exist;
        expect(grid!.className).to.contain("grid-cols-1");
    });

    it("applies responsive columns (sm, md, lg)", async () => {
        const el = await fixture(html`
            <bln-grid columns="1" sm-columns="2" md-columns="3" lg-columns="4">
                <div>1</div>
                <div>2</div>
                <div>3</div>
            </bln-grid>
        `);

        const grid = el.shadowRoot!.querySelector("div[data-part='grid']");
        const cls = grid!.className;
        expect(cls).to.contain("grid-cols-1");
        expect(cls).to.contain("sm:grid-cols-2");
        expect(cls).to.contain("md:grid-cols-3");
        expect(cls).to.contain("lg:grid-cols-4");
    });

    it("fires grid-change when a new item is added to default slot", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div>Item A</div>
            </bln-grid>
        `);

        // wir hängen ein zweites Item an -> sollte Event auslösen
        const wait = oneEvent(el, "grid-change");

        const extra = document.createElement("div");
        extra.textContent = "Item B";
        el.appendChild(extra);

        const ev = await wait;
        expect(ev).to.exist;
        expect(ev.detail.count).to.equal(2);
    });

    it("does NOT count header items as grid items", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div slot="header">Header</div>
                <div>Item A</div>
            </bln-grid>
        `);

        const grid = el.shadowRoot!.querySelector("div[data-part='grid']");
        // es gibt 1 echtes Item → Grid darf nicht empty sein
        expect(grid!.classList.contains("bln-grid--empty")).to.be.false;
    });

    it("adds empty class when there are no items", async () => {
        const el = await fixture(html`
            <bln-grid></bln-grid>
        `);
        const grid = el.shadowRoot!.querySelector("div[data-part='grid']");
        expect(grid).to.exist;
        expect(grid!.classList.contains("bln-grid--empty")).to.be.true;
    });

    it("removes empty class when items appear", async () => {
        const el = await fixture(html`
            <bln-grid></bln-grid>
        `);
        const grid = el.shadowRoot!.querySelector("div[data-part='grid']");
        expect(grid!.classList.contains("bln-grid--empty")).to.be.true;

        const wait = oneEvent(el, "grid-change");
        const item = document.createElement("div");
        item.textContent = "X";
        el.appendChild(item);
        await wait;

        expect(grid!.classList.contains("bln-grid--empty")).to.be.false;
    });

    it("annotates slotted items with role='row' by default", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div id="i1">Item 1</div>
                <div id="i2">Item 2</div>
            </bln-grid>
        `);

        const i1 = el.querySelector("#i1") as HTMLElement;
        const i2 = el.querySelector("#i2") as HTMLElement;

        expect(i1.getAttribute("role")).to.equal("row");
        expect(i2.getAttribute("role")).to.equal("row");
    });

    it("uses role='list' and listitem when as-list is true", async () => {
        const el = await fixture(html`
            <bln-grid as-list>
                <div id="a">A</div>
            </bln-grid>
        `);

        const grid = el.shadowRoot!.querySelector("div[data-part='grid']");
        expect(grid!.getAttribute("role")).to.equal("list");

        const a = el.querySelector("#a") as HTMLElement;
        expect(a.getAttribute("role")).to.equal("listitem");
    });

    it("dispatches grid-item-activate when an item is clicked", async () => {
        const el = await fixture(html`
            <bln-grid>
                <button id="btn">Click</button>
            </bln-grid>
        `);

        const btn = el.querySelector("#btn") as HTMLButtonElement;
        const wait = oneEvent(el, "grid-item-activate");

        btn.click();
        const ev = await wait;

        expect(ev.detail.index).to.equal(0);
        expect(ev.detail.item).to.equal(btn);
        expect(ev.detail.originalEvent).to.exist;
    });

    it("makes items focusable if they are not already focusable", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div id="focus-target">A</div>
            </bln-grid>
        `);

        const item = el.querySelector("#focus-target") as HTMLElement;
        expect(item.getAttribute("tabindex")).to.equal("0");
    });

    it("sets aria-label on the host section when aria-label attribute is used", async () => {
        const el = await fixture(html`
            <bln-grid aria-label="Meine Liste">
                <div>Item</div>
            </bln-grid>
        `);

        const section = el.shadowRoot!.querySelector("section");
        expect(section!.getAttribute("aria-label")).to.equal("Meine Liste");
    });

    it("emits header/footer change events separately", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div slot="header">Header</div>
            </bln-grid>
        `);

        const waitFooter = oneEvent(el, "grid-footer-change");
        const footer = document.createElement("div");
        footer.setAttribute("slot", "footer");
        footer.textContent = "Footer";
        el.appendChild(footer);
        const ev = await waitFooter;
        expect(ev).to.exist;
    });

    it("accepts figure/image elements as grid items", async () => {
        const el = await fixture(html`
            <bln-grid>
                <figure id="img"><img src="x" alt="demo" /></figure>
            </bln-grid>
        `);
        const fig = el.querySelector("#img") as HTMLElement;
        // Grid sollte Rolle gesetzt haben
        expect(fig.getAttribute("role")).to.equal("row");
    });


    it("renders footer slot for paging", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div>Item</div>
                <div slot="footer" id="pager">Pager</div>
            </bln-grid>
        `);
        const pager = el.querySelector("#pager");
        expect(pager).to.exist;
    });


    it("keyboard: ArrowDown focuses the next item", async () => {
        const el = await fixture(html`
            <bln-grid>
                <div id="i1">Item 1</div>
                <div id="i2">Item 2</div>
            </bln-grid>
        `);

        const i1 = el.querySelector("#i1") as HTMLElement;
        const i2 = el.querySelector("#i2") as HTMLElement;

        // fokus auf i1
        i1.focus();
        // keydown simulieren
        const event = new KeyboardEvent("keydown", {
            key: "ArrowDown",
            bubbles: true,
            composed: true,
        });
        i1.dispatchEvent(event);

        // jetzt sollte i2 Fokus haben
        expect(document.activeElement === i2 || i2.matches(":focus")).to.be.true;
    });
});
