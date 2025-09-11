import {customElement, property} from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import {html} from "lit";

export interface BlnFooterProps {
    class: string;
    title: string;
    subTitle: string;
    links: {title: string; url: string}[];
}

@customElement('bln-footer')
export class BlnFooter extends TailwindElement {
    @property() class: BlnFooterProps['class'] = "";
    @property({attribute: false}) title: BlnFooterProps['title'] = "Das offizielle Hauptstadtportal";
    @property({attribute: false}) subTitle: BlnFooterProps['subTitle'] = "Berlin.de";
    @property({attribute: false}) links: BlnFooterProps['links'] = [];

    protected render() {
        return html`
            <footer class="border-t border-black px-6 py-6" role="contentinfo">
                <div class="flex flex-col gap-2">
                    <div class="min-w-80 max-w-[24vw]">
                        <small class="block text-xs text-gray-700">${this.subTitle}</small>
                        <span class="block text-xl font-bold">${this.title}</span>
                    </div>
                    ${this.links?.length ? html`<ul class="flex flex-wrap gap-4 text-sm">
                        ${this.links.map(l => html`<li><a class="underline" href="${l.url}">${l.title}</a></li>`)}
                    </ul>` : ''}
                </div>
            </footer>
        `;
    }
}
