import {customElement, property, state} from "lit/decorators.js";
import {html} from "lit";
import TailwindElement from "../app/TailwindElement";
import {booleanStringFalseConverter} from "../utils/converters";
import "./LucideIcon";

export interface BlnTabItem {
    id: string;
    label: string;
    content?: string;
    disabled?: boolean;
    icon?: string; // lucide icon name
}

export interface BlnTabsProps {
    items: BlnTabItem[];
    activeId: string;
    variant: "default" | "pills" | "underlined";
    size: "small" | "medium" | "large";
    orientation: "horizontal" | "vertical";
    disabled: boolean;
    class: string;
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
}

@customElement("bln-tabs")
export class BlnTabs extends TailwindElement {
    // Data
    @property({attribute: false}) items: BlnTabsProps["items"] = [];
    @property({attribute: "active-id"}) activeId: BlnTabsProps["activeId"] = "";

    // Visual/Behavior
    @property() variant: BlnTabsProps["variant"] = "default";
    @property() size: BlnTabsProps["size"] = "medium";
    @property() orientation: BlnTabsProps["orientation"] = "horizontal";
    @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnTabsProps["disabled"] = false;
    @property() class: BlnTabsProps["class"] = "";

    // A11y
    @property({attribute: "aria-label"}) ariaLabel: BlnTabsProps["ariaLabel"] = "";
    @property({attribute: "aria-labelledby"}) ariaLabelledby: BlnTabsProps["ariaLabelledby"] = "";
    @property({attribute: "aria-describedby"}) ariaDescribedby: BlnTabsProps["ariaDescribedby"] = "";

    // Internal state
    @state() private _tablistId = `bln-tabs-list-${Math.random().toString(36).slice(2)}`;
    @state() private _activeTabIndex = 0;

    protected willUpdate(changed: Map<string, any>) {
        if (changed.has('items') || changed.has('activeId')) {
            this.updateActiveIndex();
        }
    }

    private updateActiveIndex() {
        if (this.items.length === 0) {
            this._activeTabIndex = 0;
            return;
        }

        const activeIndex = this.items.findIndex(item => item.id === this.activeId);
        this._activeTabIndex = activeIndex >= 0 ? activeIndex : 0;

        // Ensure we have a valid activeId
        if (activeIndex === -1 && this.items.length > 0) {
            const firstEnabledTab = this.items.find(item => !item.disabled);
            if (firstEnabledTab) {
                this.activeId = firstEnabledTab.id;
                this._activeTabIndex = this.items.indexOf(firstEnabledTab);
            }
        }
    }

    private handleTabClick = (item: BlnTabItem, index: number) => {
        if (item.disabled || this.disabled) return;

        this.activeId = item.id;
        this._activeTabIndex = index;
        this.dispatchEvent(new CustomEvent('tab-change', {
            detail: { activeId: item.id, activeItem: item },
            bubbles: true,
            composed: true
        }));
    };

    private handleKeyDown = (e: KeyboardEvent, index: number) => {
        if (this.disabled) return;

        const enabledItems = this.items.filter(item => !item.disabled);
        const currentEnabledIndex = enabledItems.findIndex(item => item.id === this.activeId);
        let newIndex = currentEnabledIndex;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                newIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledItems.length - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = currentEnabledIndex < enabledItems.length - 1 ? currentEnabledIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = enabledItems.length - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                const currentItem = this.items[index];
                if (!currentItem.disabled) {
                    this.handleTabClick(currentItem, index);
                }
                return;
        }

        if (newIndex !== currentEnabledIndex && enabledItems[newIndex]) {
            const newItem = enabledItems[newIndex];
            this.activeId = newItem.id;
            this._activeTabIndex = this.items.indexOf(newItem);
            
            // Focus the new tab
            this.updateComplete.then(() => {
                const tabElement = this.shadowRoot?.querySelector(`[role="tab"][data-id="${newItem.id}"]`) as HTMLElement;
                tabElement?.focus();
            });

            this.dispatchEvent(new CustomEvent('tab-change', {
                detail: { activeId: newItem.id, activeItem: newItem },
                bubbles: true,
                composed: true
            }));
        }
    };

    private getTabClasses(item: BlnTabItem, index: number, isActive: boolean) {
        const baseClasses = [
            'flex items-center gap-2 px-4 py-2 font-medium text-sm transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:pointer-events-none'
        ];

        // Size classes
        const sizeClasses = {
            small: ['text-xs px-3 py-1.5'],
            medium: ['text-sm px-4 py-2'],
            large: ['text-base px-6 py-3']
        };
        baseClasses.push(...sizeClasses[this.size]);

        // Variant classes
        if (this.variant === 'pills') {
            baseClasses.push('rounded-md');
            if (isActive) {
                baseClasses.push('bg-blue-600 text-white');
            } else {
                baseClasses.push('text-gray-700 hover:bg-gray-100');
            }
        } else if (this.variant === 'underlined') {
            baseClasses.push('border-b-2 rounded-none');
            if (isActive) {
                baseClasses.push('border-blue-600 text-blue-600');
            } else {
                baseClasses.push('border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900');
            }
        } else { // default
            baseClasses.push('border border-b-0 rounded-t-md');
            if (isActive) {
                baseClasses.push('bg-white border-gray-300 text-gray-900');
            } else {
                baseClasses.push('bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100');
            }
        }

        if (item.disabled) {
            baseClasses.push('cursor-not-allowed');
        } else {
            baseClasses.push('cursor-pointer');
        }

        return baseClasses;
    }

    private getTablistClasses() {
        const baseClasses = [
            'flex',
            this.orientation === 'vertical' ? 'flex-col' : 'flex-row',
            this.variant === 'underlined' ? 'border-b border-gray-200' : '',
            this.variant === 'default' ? 'border-b border-gray-300' : '',
            this.class
        ].filter(Boolean);

        return baseClasses;
    }

    protected render() {
        const activeItem = this.items.find(item => item.id === this.activeId);
        
        return html`
            <div class="w-full">
                <!-- Tab List -->
                <div
                    id="${this._tablistId}"
                    role="tablist"
                    aria-label=${this.ariaLabel || "Tabs"}
                    aria-labelledby=${this.ariaLabelledby || nothing}
                    aria-describedby=${this.ariaDescribedby || nothing}
                    aria-orientation=${this.orientation}
                    class="${this.cn(...this.getTablistClasses())}"
                >
                    ${this.items.map((item, index) => {
                        const isActive = item.id === this.activeId;
                        const tabPanelId = `${this._tablistId}-panel-${item.id}`;
                        
                        return html`
                            <button
                                role="tab"
                                data-id="${item.id}"
                                aria-selected="${isActive}"
                                aria-controls="${tabPanelId}"
                                tabindex="${isActive ? '0' : '-1'}"
                                ?disabled="${item.disabled || this.disabled}"
                                class="${this.cn(...this.getTabClasses(item, index, isActive))}"
                                @click="${() => this.handleTabClick(item, index)}"
                                @keydown="${(e: KeyboardEvent) => this.handleKeyDown(e, index)}"
                            >
                                ${item.icon ? html`<lucide-icon name="${item.icon}" cls="w-4 h-4" aria-hidden="true"></lucide-icon>` : ''}
                                <span>${item.label}</span>
                            </button>
                        `;
                    })}
                </div>

                <!-- Tab Panels -->
                <div class="mt-4">
                    ${this.items.map((item) => {
                        const isActive = item.id === this.activeId;
                        const tabPanelId = `${this._tablistId}-panel-${item.id}`;
                        
                        return html`
                            <div
                                id="${tabPanelId}"
                                role="tabpanel"
                                tabindex="0"
                                aria-labelledby="${this._tablistId}-${item.id}"
                                ?hidden="${!isActive}"
                                class="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                            >
                                ${isActive ? html`
                                    ${item.content ? html`<div class="text-sm text-gray-700">${item.content}</div>` : ''}
                                    <slot name="${item.id}"></slot>
                                ` : ''}
                            </div>
                        `;
                    })}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'bln-tabs': BlnTabs;
    }
}

const nothing = undefined;