var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let TreeView = class TreeView extends LitElement {
    constructor() {
        super(...arguments);
        this.nodes = [];
    }
    setNodes(nodes) {
        this.nodes = nodes;
    }
    static { this.styles = css `
    .node {
      margin-left: 1rem;
      cursor: pointer;
      user-select: none;
    }
    .children {
      margin-left: 1rem;
      border-left: 1px solid #ccc;
      padding-left: 0.5rem;
    } 
  `; }
    toggle(node) {
        node.expanded = !node.expanded;
        this.requestUpdate();
    }
    renderNode(node) {
        return html `
      <div class="node">
        <span @click=${() => this.toggle(node)}>
          ${node.children?.length
            ? node.expanded
                ? '📂'
                : '📁'
            : '📄'} ${node.label}
        </span>
        ${node.expanded && node.children
            ? html `<div class="children">
              ${node.children.map((child) => this.renderNode(child))}
            </div>`
            : null}
      </div>
    `;
    }
    render() {
        return html ` ${this.nodes.map((node) => this.renderNode(node))}`;
    }
};
__decorate([
    property({ type: Array })
], TreeView.prototype, "nodes", void 0);
TreeView = __decorate([
    customElement('tree-view')
], TreeView);
export { TreeView };
