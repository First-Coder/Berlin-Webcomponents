var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import { html } from "lit";
let BlnFooter = class BlnFooter extends TailwindElement {
    constructor() {
        super(...arguments);
        this.class = "";
        this.title = "Das offizielle Hauptstadtportal";
        this.subTitle = "Berlin.de";
        this.links = [];
    }
    render() {
        return html `
            <footer class="border-t border-black px-6 py-6" role="contentinfo">
                <div class="flex flex-col gap-2">
                    <div class="min-w-80 max-w-[24vw]">
                        <small class="block text-xs text-gray-700">${this.subTitle}</small>
                        <span class="block text-xl font-bold">${this.title}</span>
                    </div>
                    ${this.links?.length ? html `<ul class="flex flex-wrap gap-4 text-sm">
                        ${this.links.map(l => html `<li><a class="underline" href="${l.url}">${l.title}</a></li>`)}
                    </ul>` : ''}
                </div>
            </footer>
        `;
    }
};
__decorate([
    property()
], BlnFooter.prototype, "class", void 0);
__decorate([
    property({ attribute: false })
], BlnFooter.prototype, "title", void 0);
__decorate([
    property({ attribute: false })
], BlnFooter.prototype, "subTitle", void 0);
__decorate([
    property({ attribute: false })
], BlnFooter.prototype, "links", void 0);
BlnFooter = __decorate([
    customElement('bln-footer')
], BlnFooter);
export { BlnFooter };
