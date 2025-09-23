var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import { html } from "lit";
import './LucideIcon';
import './BlnButton';
let BlnHeader = class BlnHeader extends TailwindElement {
    constructor() {
        super(...arguments);
        /**
         * Represents the CSS class to be applied to a BlnInput component.
         *
         * This property allows customization of the CSS styling by providing
         * one or more class names as a string. It can be used to apply
         * additional styling or override default styles.
         *
         * The default value is an empty string, indicating no class has been assigned.
         */
        this.class = "";
        /**
         * The URL of the logo image used in the header component.
         * Should point to a valid image resource accessible via HTTP/HTTPS.
         */
        this.logoUrl = "https://www.berlin.de/i9f/r1/images/logo_berlin_m_srgb.svg";
        this.titleUrl = "/";
        this.title = "Das offizielle Hauptstadtportal";
        this.subTitle = "Berlin.de";
        this.menuItems = [];
    }
    render() {
        return html `
            <section class="flex items-center justify-start border-b border-black py-1 px-6 h-11">
                <div>
                    <a href="/">
                        <img title="Link zu: Startseite Berlin.de"
                             src="${(this.logoUrl)}"
                             alt="Berlin.de"
                             class="w-[100px] block">
                    </a>
                </div>
            </section>
            <nav class="flex items-center justify-between py-4 px-6">
                <div class="min-w-80 max-w-[24vw] overflow-visible">
                    <a href="${this.titleUrl}">
                        <small class="block text-xs text-gray-700">${this.subTitle}</small>
                        <span class="block text-xl font-bold">${this.title}</span>
                    </a>
                </div>
                <div class="order-10 grow-0 flex items-center gap-2 ml-[2vw]">
                    <bln-button retro-design size="small">Barrierefrei</bln-button>
                    <bln-button retro-design size="small">Suche</bln-button>
                    <bln-button retro-design size="small">Menü</bln-button>
                </div>
            </nav>
        `;
    }
};
__decorate([
    property()
], BlnHeader.prototype, "class", void 0);
__decorate([
    property({ attribute: 'logo-url' })
], BlnHeader.prototype, "logoUrl", void 0);
__decorate([
    property({ attribute: false })
], BlnHeader.prototype, "titleUrl", void 0);
__decorate([
    property({ attribute: false })
], BlnHeader.prototype, "title", void 0);
__decorate([
    property({ attribute: false })
], BlnHeader.prototype, "subTitle", void 0);
__decorate([
    property({ attribute: false })
], BlnHeader.prototype, "menuItems", void 0);
BlnHeader = __decorate([
    customElement('bln-header')
], BlnHeader);
export { BlnHeader };
