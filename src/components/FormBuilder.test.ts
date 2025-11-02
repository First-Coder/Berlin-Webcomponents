import {expect, fixture, html} from "@open-wc/testing";
import FormBuilder from "./FormBuilder";

// WICHTIG: damit die Custom Elements registriert sind
import "./BlnInput";
import "./BlnTextarea";
import "./BlnTabs";
import "./BlnCalendar";
import "./BlnModalDialog";
import "./BlnSelect";
import "./BlnAutocompleteSelect";
import "./BlnCheckBox";
import "./BlnTreeView";
import "./ModernTree";
import "./BlnToast";
import "./BlnButton";
import "./BlnGrid";

describe("FormBuilder", () => {

    it("can be constructed", () => {
        const fb = new FormBuilder();
        expect(fb).to.be.instanceOf(FormBuilder);
    });

    it("has default validators for email/password/number", () => {
        const fb = new FormBuilder();

        // email
        expect(fb.validate("email", "foo")).to.equal("Falsches Email Format");
        expect(fb.validate("email", "foo@bar.de")).to.equal("");

        // password
        expect(fb.validate("password", "123")).to.equal("Passwort zu kurz (mindestens 5 Zeichen)");
        expect(fb.validate("password", "12345")).to.equal("");

        // number
        expect(fb.validate("number", "abc")).to.equal("Wert ist keine Zahl");
        expect(fb.validate("number", "5")).to.equal("Wert zu niedrig (mindestens 10)");
        expect(fb.validate("number", "150")).to.equal("Wert zu hoch (maximal 99)");
        expect(fb.validate("number", "50")).to.equal("");
    });

    it("allows registering a custom sync validator", () => {
        const fb = new FormBuilder();
        fb.setCustomValidateFunction("username", (v) => v.length < 3 ? "zu kurz" : "");

        expect(fb.validate("username", "a")).to.equal("zu kurz");
        expect(fb.validate("username", "alex")).to.equal("");
    });

    it("allows registering a custom async validator", async () => {
        const fb = new FormBuilder();
        fb.setCustomValidateFunctionAsync("serverCheck", async (v) => {
            // fake async
            return v === "ok" ? "" : "nicht ok";
        });

        const res1 = await fb.validateAsync("serverCheck", "ok");
        const res2 = await fb.validateAsync("serverCheck", "nope");

        expect(res1).to.equal("");
        expect(res2).to.equal("nicht ok");
    });

    it("adds a BlnInput template to fields", () => {
        const fb = new FormBuilder();
        fb.addBlnInput({label: "Name"});
        const fields = fb.getFields();
        expect(fields.length).to.equal(1);
    });

    it("adds a BlnTextarea template to fields", () => {
        const fb = new FormBuilder();
        fb.addBlnTextarea({label: "Beschreibung"});
        const fields = fb.getFields();
        expect(fields.length).to.equal(1);
    });

    it("adds a BlnSelect template to fields", () => {
        const fb = new FormBuilder();
        fb.addBlnSelect({label: "Auswahl", options: [{label: "A", value: "a"}]});
        const fields = fb.getFields();
        expect(fields.length).to.equal(1);
    });

    it("adds an Autocomplete select template to fields", () => {
        const fb = new FormBuilder();
        fb.addBlnAutocompleteSelect({label: "Suche", options: [{label: "X", value: "x"}]});
        const fields = fb.getFields();
        expect(fields.length).to.equal(1);
    });

    it("adds a BlnButton template to fields", () => {
        const fb = new FormBuilder();
        fb.addBlnButton("Speichern", {variant: "outline"});
        const fields = fb.getFields();
        expect(fields.length).to.equal(1);
    });

    it("adds a BlnGrid template to fields", () => {
        const fb = new FormBuilder();
        fb.addBlnGrid({
            columns: 2,
            mdColumns: 3,
            ariaLabelText: "Formular-Gitter"
        });
        const fields = fb.getFields();
        expect(fields.length).to.equal(1);
    });

    it("can render a BlnGrid from the field template", async () => {
        const fb = new FormBuilder();
        fb.addBlnGrid({
            columns: 2,
            mdColumns: 3,
            lgColumns: 4,
            gap: "lg",
            ariaLabelText: "Adressen"
        });

        const [tpl] = fb.getFields();
        // wir rendern das Template in ein echtes DOM via fixture
        const el = await fixture<HTMLDivElement>(html`<div>${tpl}</div>`);
        const grid = el.querySelector("bln-grid") as HTMLElement;

        expect(grid).to.exist;
        expect(grid.getAttribute("aria-label")).to.equal("Adressen");
        // Columns werden als Property gesetzt, daher hier Zugriff über any
        expect((grid as any).columns).to.equal(2);
        expect((grid as any).mdColumns).to.equal(3);
    });

    it("supports passing inner content into BlnGrid (default demo items)", async () => {
        const fb = new FormBuilder();
        fb.addBlnGrid({columns: 1});

        const [tpl] = fb.getFields();
        const host = await fixture<HTMLDivElement>(html`<div>${tpl}</div>`);
        const grid = host.querySelector("bln-grid")!;
        // laut unserer addBlnGrid-Implementierung sind mind. 2 Items als Demo drin
        const items = grid.querySelectorAll("div.border, article, figure");
        expect(items.length).to.be.greaterThan(0);
    });

    it("returns all fields in insertion order", () => {
        const fb = new FormBuilder();
        fb.addBlnInput({label: "A"});
        fb.addBlnTextarea({label: "B"});
        fb.addBlnGrid({columns: 2});
        const fields = fb.getFields();
        expect(fields.length).to.equal(3);
        // wir prüfen hier nur, dass nichts zwischendrin verloren geht
    });

});
