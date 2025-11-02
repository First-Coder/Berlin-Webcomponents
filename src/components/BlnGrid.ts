import {customElement, property, state} from "lit/decorators.js";
import {html, PropertyValues, nothing} from "lit";
import TailwindElement from "../app/TailwindElement";

export interface BlnGridProps {
    columns: number;
    smColumns?: number;
    mdColumns?: number;
    lgColumns?: number;
    gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
    asList?: boolean;
    ariaLabelText?: string | null;
    ariaDescribedById?: string | null;
    class?: string;
}

@customElement("bln-grid")
export class BlnGrid extends TailwindElement {
    @property({type: Number})
    columns: BlnGridProps["columns"] = 1;

    @property({type: Number, attribute: "sm-columns"})
    smColumns: BlnGridProps["smColumns"] = 0;

    @property({type: Number, attribute: "md-columns"})
    mdColumns: BlnGridProps["mdColumns"] = 0;

    @property({type: Number, attribute: "lg-columns"})
    lgColumns: BlnGridProps["lgColumns"] = 0;

    @property()
    gap: BlnGridProps["gap"] = "md";

    @property({type: Boolean, reflect: true, attribute: "as-list"})
    asList: BlnGridProps["asList"] = false;

    @property({attribute: "aria-label"})
    ariaLabelText: BlnGridProps["ariaLabelText"] = null;

    @property({attribute: "aria-describedby"})
    ariaDescribedById: BlnGridProps["ariaDescribedById"] = null;

    @property()
    class: BlnGridProps["class"] = "";

    @state()
    private itemCount = 0;

    @state()
    private slottedElements: HTMLElement[] = [];

    constructor() {
        super();
        this.addEventListener("keydown", this.onKeyDown);
    }

    private onMainSlotChange = (e: Event): void => {
        const slot = e.target as HTMLSlotElement;

        const htmlItems = slot
            .assignedElements({flatten: true})
            .filter((el): el is HTMLElement => el instanceof HTMLElement && !el.hasAttribute("slot"));

        this.slottedElements = htmlItems;
        this.itemCount = htmlItems.length;

        this.annotateItems(htmlItems);

        this.dispatchEvent(new CustomEvent("grid-change", {
            detail: {count: this.itemCount},
            bubbles: true,
            composed: true,
        }));
    };

    private onHeaderSlotChange = () => {
        this.dispatchEvent(new CustomEvent("grid-header-change", {
            bubbles: true,
            composed: true,
        }));
    };

    private onFooterSlotChange = () => {
        this.dispatchEvent(new CustomEvent("grid-footer-change", {
            bubbles: true,
            composed: true,
        }));
    };

    private annotateItems(items: HTMLElement[]): void {
        items.forEach((el, index) => {
            if (!el.getAttribute("role")) {
                el.setAttribute("role", this.asList ? "listitem" : "row");
            }
            el.dataset.blnIndex = String(index);

            if (!(el as any).__blnGridClickAttached) {
                el.addEventListener("click", (ev) => this.onItemClick(ev, el));
                (el as any).__blnGridClickAttached = true;
            }

            if (!el.hasAttribute("tabindex")) {
                el.setAttribute("tabindex", "0");
            }
        });
    }

    private onItemClick(e: Event, target: HTMLElement): void {
        const index = target.dataset.blnIndex ? Number(target.dataset.blnIndex) : -1;
        this.dispatchEvent(new CustomEvent("grid-item-activate", {
            detail: {
                index,
                item: target,
                originalEvent: e,
            },
            bubbles: true,
            composed: true,
        }));
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        const target = e.target as HTMLElement;
        if (!this.slottedElements.includes(target)) return;

        const currentIndex = this.slottedElements.indexOf(target);
        if (currentIndex === -1) return;

        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown": {
                const next = this.slottedElements[currentIndex + 1];
                if (next) {
                    next.focus();
                    e.preventDefault();
                }
                break;
            }
            case "ArrowLeft":
            case "ArrowUp": {
                const prev = this.slottedElements[currentIndex - 1];
                if (prev) {
                    prev.focus();
                    e.preventDefault();
                }
                break;
            }
            case "Enter":
            case " ": {
                this.onItemClick(e, target);
                e.preventDefault();
                break;
            }
        }
    };

    protected updated(changed: PropertyValues<this>): void {
        const needsReannotate =
            changed.has("asList") ||
            changed.has("columns") ||
            changed.has("smColumns") ||
            changed.has("mdColumns") ||
            changed.has("lgColumns");

        if (needsReannotate && this.slottedElements.length > 0) {
            this.annotateItems(this.slottedElements);
        }

        const root = this.shadowRoot;
        if (root) {
            const grid = root.querySelector("div[data-part='grid']");
            if (grid) {
                if (this.itemCount === 0) {
                    grid.classList.add("bln-grid--empty");
                } else {
                    grid.classList.remove("bln-grid--empty");
                }
            }
        }
    }

    private gapClass(): string {
        switch (this.gap) {
            case "none":
                return "gap-0";
            case "xs":
                return "gap-1";
            case "sm":
                return "gap-2";
            case "lg":
                return "gap-6";
            case "xl":
                return "gap-8";
            case "md":
            default:
                return "gap-4";
        }
    }

    private colsClass(prefix: string | null, value: number): string | null {
        if (!value || value < 1) return null;
        const base = `grid-cols-${value}`;
        return prefix ? `${prefix}:${base}` : base;
    }

    protected render() {
        const baseCols = this.colsClass(null, this.columns);
        const smCols = this.colsClass("sm", this.smColumns ?? 0);
        const mdCols = this.colsClass("md", this.mdColumns ?? 0);
        const lgCols = this.colsClass("lg", this.lgColumns ?? 0);
        const role = this.asList ? "list" : "grid";

        return html`
            <section
                    class="${this.cn("flex flex-col gap-3", [])}"
                    aria-label=${this.ariaLabelText ?? ""}
                    aria-describedby=${this.ariaDescribedById ?? ""}
            >
                <header class="contents">
                    <slot name="header" @slotchange=${this.onHeaderSlotChange}></slot>
                </header>

                <div
                        data-part="grid"
                        role=${role}
                        aria-rowcount=${!this.asList ? String(this.itemCount) : nothing}
                        aria-multiselectable="false"
                        class="${this.cn(
                                "grid",
                                [
                                    this.gapClass(),
                                    baseCols,
                                    smCols,
                                    mdCols,
                                    lgCols,
                                    this.class
                                ]
                        )}"
                >
                    <slot @slotchange=${this.onMainSlotChange}></slot>
                </div>

                <footer class="contents">
                    <slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>
                </footer>
            </section>
        `;
    }
}
