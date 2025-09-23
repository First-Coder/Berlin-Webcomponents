var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import TailwindElement from '../app/TailwindElement';
import { booleanStringFalseConverter } from '../utils/converters';
let BlnTree = class BlnTree extends TailwindElement {
    constructor() {
        super(...arguments);
        this.items = [];
        this.selectedIds = [];
        this.expandedIds = [];
        this.multiSelect = false;
        this.ariaLabel = '';
        this.ariaLabelledby = '';
        this.ariaDescribedby = '';
        this.class = '';
        this.size = 'medium';
        this._activeId = null; // roving tabindex focus
        this._loading = {};
    }
    isExpanded(id) { return this.expandedIds.includes(id); }
    isSelected(id) { return this.selectedIds.includes(id); }
    toggleNode(node) {
        if (node.disabled)
            return;
        const expanded = this.isExpanded(node.id);
        if (!expanded && node.hasChildren && (!node.children || node.children.length === 0)) {
            // request async children
            this._loading = { ...this._loading, [node.id]: true };
            const detail = { id: node.id, resolve: (children) => {
                    this.applyChildren(node.id, children);
                } };
            this.dispatchEvent(new CustomEvent('bln-tree:load-needed', { detail, bubbles: true, composed: true }));
        }
        const set = new Set(this.expandedIds);
        expanded ? set.delete(node.id) : set.add(node.id);
        this.expandedIds = Array.from(set);
        this.dispatchEvent(new CustomEvent('bln-tree:toggle', { detail: { id: node.id, expanded: !expanded }, bubbles: true, composed: true }));
    }
    applyChildren(id, children) {
        const update = (nodes) => nodes.map(n => {
            if (n.id === id) {
                return { ...n, children, hasChildren: children.length > 0 };
            }
            return n.children ? { ...n, children: update(n.children) } : n;
        });
        this.items = update(this.items);
        this._loading = { ...this._loading, [id]: false };
    }
    selectNode(node) {
        if (node.disabled)
            return;
        if (this.multiSelect) {
            const set = new Set(this.selectedIds);
            set.has(node.id) ? set.delete(node.id) : set.add(node.id);
            this.selectedIds = Array.from(set);
        }
        else {
            this.selectedIds = [node.id];
        }
        this._activeId = node.id;
        this.dispatchEvent(new CustomEvent('bln-tree:select', { detail: { id: node.id, selectedIds: this.selectedIds.slice() }, bubbles: true, composed: true }));
    }
    onKeyDown(node, e) {
        const key = e.key;
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(key)) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (key === 'Enter' || key === ' ') {
            this.selectNode(node);
        }
        else if (key === 'ArrowRight') {
            if (!this.isExpanded(node.id))
                this.toggleNode(node);
        }
        else if (key === 'ArrowLeft') {
            if (this.isExpanded(node.id))
                this.toggleNode(node);
        }
        // Simple Up/Down focus handling within rendered order
        const flat = this.flatten(this.items);
        const idx = flat.findIndex(n => n.id === node.id);
        if (key === 'ArrowDown' && idx >= 0 && idx < flat.length - 1) {
            this._activeId = flat[idx + 1].id;
            this.updateComplete.then(() => this.focusItem(this._activeId));
        }
        if (key === 'ArrowUp' && idx > 0) {
            this._activeId = flat[idx - 1].id;
            this.updateComplete.then(() => this.focusItem(this._activeId));
        }
    }
    flatten(nodes, out = []) {
        for (const n of nodes) {
            out.push(n);
            if (this.isExpanded(n.id) && n.children && n.children.length)
                this.flatten(n.children, out);
        }
        return out;
    }
    focusItem(id) {
        const el = this.renderRoot?.querySelector(`[data-tree-id="${id}"]`);
        el?.focus();
    }
    renderTreeNode(node, level) {
        const expanded = this.isExpanded(node.id);
        const selected = this.isSelected(node.id);
        const loading = !!this._loading[node.id];
        const hasKids = node.children?.length || node.hasChildren;
        const sizeCls = this.size === 'small' ? 'py-1 px-2 text-sm' : this.size === 'large' ? 'py-2.5 px-3 text-base' : 'py-2 px-3 text-sm';
        const focusCls = this.retroDesign ? 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white' : 'focus-visible:outline-none';
        return html `
      <div role="treeitem"
           aria-expanded=${hasKids ? String(!!expanded) : nothing}
           aria-selected=${String(!!selected)}
           aria-level=${String(level)}
           class="${this.cn(this.retroDesign ? ['rounded-none'] : ['rounded-md'], ['flex items-center gap-2 cursor-pointer border-2 border-transparent hover:bg-gray-50'], selected ? ['border-blue-500 bg-blue-50'] : '', node.disabled ? ['opacity-50 pointer-events-none'] : '', sizeCls, focusCls, this.class)}"
           tabindex=${this._activeId === node.id ? '0' : '-1'}
           data-tree-id=${node.id}
           @keydown=${(e) => this.onKeyDown(node, e)}
           @click=${() => this.selectNode(node)}>
        ${hasKids ? html `
          <button class="inline-flex items-center justify-center w-5 h-5 border rounded ${this.retroDesign ? 'border-black' : 'border-gray-300'}"
                  aria-label=${expanded ? 'Collapse' : 'Expand'}
                  @click=${(e) => { e.stopPropagation(); this.toggleNode(node); }}>
            ${loading ? html `<span class="animate-pulse">…</span>` : expanded ? '−' : '+'}
          </button>` : html `<span class="w-5 h-5"></span>`}
        <span class="select-none">${node.label}</span>
      </div>
      ${hasKids && expanded ? html `
        <div role="group" class="ml-5">
          ${(node.children ?? []).map(child => this.renderTreeNode(child, level + 1))}
        </div>` : nothing}
    `;
    }
    render() {
        // setup initial active id if none
        if (!this._activeId) {
            const first = this.items[0]?.id;
            if (first)
                this._activeId = first;
        }
        const describedBy = [this.ariaDescribedby || ''].filter(Boolean).join(' ') || undefined;
        return html `
      <div role="tree"
           class="${this.cn('flex flex-col gap-1', this.class)}"
           aria-multiselectable=${String(!!this.multiSelect)}
           aria-label=${this.ariaLabel || nothing}
           aria-labelledby=${this.ariaLabelledby || nothing}
           aria-describedby=${describedBy || nothing}>
        ${this.items.map(n => this.renderTreeNode(n, 1))}
      </div>
    `;
    }
};
__decorate([
    property({ attribute: false })
], BlnTree.prototype, "items", void 0);
__decorate([
    property({ attribute: false })
], BlnTree.prototype, "selectedIds", void 0);
__decorate([
    property({ attribute: false })
], BlnTree.prototype, "expandedIds", void 0);
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnTree.prototype, "multiSelect", void 0);
__decorate([
    property({ attribute: 'aria-label' })
], BlnTree.prototype, "ariaLabel", void 0);
__decorate([
    property({ attribute: 'aria-labelledby' })
], BlnTree.prototype, "ariaLabelledby", void 0);
__decorate([
    property({ attribute: 'aria-describedby' })
], BlnTree.prototype, "ariaDescribedby", void 0);
__decorate([
    property()
], BlnTree.prototype, "class", void 0);
__decorate([
    property()
], BlnTree.prototype, "size", void 0);
__decorate([
    state()
], BlnTree.prototype, "_activeId", void 0);
__decorate([
    state()
], BlnTree.prototype, "_loading", void 0);
BlnTree = __decorate([
    customElement('bln-tree')
], BlnTree);
export { BlnTree };
