var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property, state } from "lit/decorators.js";
import { html } from "lit";
import TailwindElement from "../app/TailwindElement";
import './BlnButton';
import './LucideIcon';
/**
 * Seitliche Navigation mit auf-/einklappbarem Inhalt. Nutzt BlnButton für den Toggle.
 * - Beliebige Navigationselemente per Slot (Links, Buttons etc.)
 * - Header mit Icon + Überschrift
 */
let BlnNavigation = class BlnNavigation extends TailwindElement {
    constructor() {
        super(...arguments);
        this.title = 'Navigation';
        this.icon = 'Menu';
        this.collapsed = false;
        this.class = '';
        this._internalCollapsed = this.collapsed;
        this._panelId = `bln-nav-panel-${Math.random().toString(36).slice(2)}`;
        this.toggle = () => {
            this._internalCollapsed = !this._internalCollapsed;
            this.collapsed = this._internalCollapsed;
            this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: this._internalCollapsed } }));
        };
    }
    willUpdate(changed) {
        if (changed.has('collapsed')) {
            this._internalCollapsed = this.collapsed;
        }
    }
    render() {
        const isCollapsed = this._internalCollapsed;
        return html `
      <nav class="${this.cn('w-64', this.class)}" aria-label="Seitennavigation">
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center gap-2 min-w-0">
            ${this.icon ? html `<lucide-icon name="${this.icon}" cls="w-5 h-5 shrink-0"></lucide-icon>` : ''}
            <h2 class="text-base font-semibold truncate">${this.title}</h2>
          </div>
          <bln-button size="small" variant="ghost" aria-controls="${this._panelId}" aria-expanded="${String(!isCollapsed)}" aria-label="${isCollapsed ? 'Navigation ausklappen' : 'Navigation einklappen'}" .onClick=${this.toggle}>
            ${isCollapsed
            ? html `<lucide-icon name="ChevronDown" cls="w-5 h-5" aria-hidden="true"></lucide-icon>`
            : html `<lucide-icon name="X" cls="w-5 h-5" aria-hidden="true"></lucide-icon>`}
          </bln-button>
        </div>
        <div id="${this._panelId}" aria-hidden="${String(isCollapsed)}" class="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[80vh] opacity-100'}">
          <ul class="flex flex-col py-2">
            <slot></slot>
          </ul>
        </div>
      </nav>
    `;
    }
};
__decorate([
    property({ type: String })
], BlnNavigation.prototype, "title", void 0);
__decorate([
    property({ type: String })
], BlnNavigation.prototype, "icon", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], BlnNavigation.prototype, "collapsed", void 0);
__decorate([
    property({ type: String })
], BlnNavigation.prototype, "class", void 0);
__decorate([
    state()
], BlnNavigation.prototype, "_internalCollapsed", void 0);
__decorate([
    state()
], BlnNavigation.prototype, "_panelId", void 0);
BlnNavigation = __decorate([
    customElement('bln-navigation')
], BlnNavigation);
export { BlnNavigation };
