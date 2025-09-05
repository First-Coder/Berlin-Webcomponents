
import {customElement, property} from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import {html} from "lit";
import {booleanStringFalseConverter} from "../utils/converters";


import './LucideIcon';
import './BlnButton';
import {BlnButton} from "./BlnButton";

export interface BlnHeaderProps {
    class: string;
    logoUrl: string;
    retroDesign: boolean;
    titleUrl: string;
    title: string;
    subTitle: string;
    menuItems: BlnHeaderMenuItems[];
}

export interface BlnHeaderMenuItems {
    title: string;
    iconName: string;
    url: string;
    insideMenu: boolean;
}

@customElement('bln-header')
export class BlnHeader extends TailwindElement {
    /**
     * Represents the CSS class to be applied to a BlnInput component.
     *
     * This property allows customization of the CSS styling by providing
     * one or more class names as a string. It can be used to apply
     * additional styling or override default styles.
     *
     * The default value is an empty string, indicating no class has been assigned.
     */
    @property() class: BlnHeaderProps['class'] = "";

    /**
     * The URL of the logo image used in the header component.
     * Should point to a valid image resource accessible via HTTP/HTTPS.
     */
    @property({attribute: 'logo-url'}) logoUrl: BlnHeaderProps['logoUrl'] = "https://www.berlin.de/i9f/r1/images/logo_berlin_m_srgb.svg";

    @property({attribute: false}) titleUrl: BlnHeaderProps['titleUrl'] = "/";

    @property({attribute: false}) title: BlnHeaderProps['title'] = "Das offizielle Hauptstadtportal";

    @property({attribute: false}) subTitle: BlnHeaderProps['subTitle'] = "Berlin.de";

    @property({attribute: false}) menuItems: BlnHeaderProps['menuItems'] = [];

    protected render(): unknown {
        return html`
            <section class="flex items-center justify-start border-b border-gray-300 py-1 px-6 transition-all h-11">
                <div>
                    <a href="/">
                        <img title="Link zu: Startseite Berlin.de"
                             src="${(this.logoUrl)}"
                             alt="Berlin.de"
                             class="w-[100px] block">
                    </a>
                </div>
            </section>
            <nav class="flex items-center justify-between shadow-header py-4 px-6">
                <div class="min-w-80 max-w-[24vw] overflow-visible">
                    <a href="${this.titleUrl}">
                        <small class="block">${this.subTitle}</small>
                        <span class="block">${this.title}</span>
                    </a>
                </div>
                <div class="order-10 grow-0 flex items-end ml-[2vw]">
                    <bln-button>
                        test
                    </bln-button>
                    <button type="button"
                            aria-haspopup="true"
                            aria-expanded="false">
                        <i class="fas fa-universal-access" aria-hidden="true"></i>
                        <span>Barrierefrei</span>
                    </button>
                    <button type="button"
                            aria-haspopup="true"
                            aria-expanded="false">
                        <i class="fas fa-search" aria-hidden="true"></i>
                        <span>Suche</span>
                    </button>
                    <button @click="${() => this.openDrawer()}" type="button"
                            aria-haspopup="true"
                            aria-expanded="false">
                        <i class="fas fa-bars" aria-hidden="true"></i>
                        <span>Menü</span>
                    </button>
                </div>
            </nav>
        `;
    }
}