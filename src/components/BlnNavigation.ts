import {customElement, property, state} from "lit/decorators.js";
import {html} from "lit";
import TailwindElement from "../app/TailwindElement";
import './BlnButton';
import './LucideIcon';

export interface BlnNavigationProps {
  title: string;
  icon?: string; // lucide icon name
  collapsed?: boolean;
  class?: string;
}

/**
 * Seitliche Navigation mit auf-/einklappbarem Inhalt. Nutzt BlnButton für den Toggle.
 * - Beliebige Navigationselemente per Slot (Links, Buttons etc.)
 * - Header mit Icon + Überschrift
 */
@customElement('bln-navigation')
export class BlnNavigation extends TailwindElement {
  @property({type: String}) title: BlnNavigationProps['title'] = 'Navigation';
  @property({type: String}) icon: BlnNavigationProps['icon'] = 'Menu';
  @property({type: Boolean, reflect: true}) collapsed: BlnNavigationProps['collapsed'] = false;
  @property({type: String}) class: BlnNavigationProps['class'] = '';

  @state() private _internalCollapsed = this.collapsed;
  @state() private _panelId = `bln-nav-panel-${Math.random().toString(36).slice(2)}`;

  private toggle = () => {
    this._internalCollapsed = !this._internalCollapsed;
    this.collapsed = this._internalCollapsed;
    this.dispatchEvent(new CustomEvent('toggle', {detail: {collapsed: this._internalCollapsed}}));
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('collapsed')) {
      this._internalCollapsed = this.collapsed;
    }
  }

  protected render() {
    const isCollapsed = this._internalCollapsed;
    return html`
      <nav class="${this.cn('w-64', this.class)}" aria-label="Seitennavigation">
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center gap-2 min-w-0">
            ${this.icon ? html`<lucide-icon name="${this.icon}" cls="w-5 h-5 shrink-0"></lucide-icon>` : ''}
            <h2 class="text-base font-semibold truncate">${this.title}</h2>
          </div>
          <bln-button size="small" variant="ghost" aria-controls="${this._panelId}" aria-expanded="${String(!isCollapsed)}" aria-label="${isCollapsed ? 'Navigation ausklappen' : 'Navigation einklappen'}" .onClick=${this.toggle}>
            ${isCollapsed 
              ? html`<lucide-icon name="ChevronDown" cls="w-5 h-5" aria-hidden="true"></lucide-icon>`
              : html`<lucide-icon name="X" cls="w-5 h-5" aria-hidden="true"></lucide-icon>`}
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
}

declare global {
  interface HTMLElementTagNameMap {
    'bln-navigation': BlnNavigation;
  }
}
