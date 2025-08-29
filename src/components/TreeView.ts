import {LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface TreeNode {
    label: string;
    children?: TreeNode[];
    expanded?: boolean;
}

@customElement('tree-view')
export class TreeView extends LitElement {

    @property({ type: Array })
    nodes: TreeNode[] = [];

    setNodes(nodes: TreeNode[]) {
        this.nodes = nodes;
    }

    static styles = css`
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
  `;

    private toggle(node: TreeNode) {
        node.expanded = !node.expanded;
        this.requestUpdate();
    }

    private renderNode(node: TreeNode): TemplateResult  {
        return html`
      <div class="node">
        <span @click=${() => this.toggle(node)}>
          ${node.children?.length
            ? node.expanded
                ? '📂'
                : '📁'
            : '📄'} ${node.label}
        </span>
        ${node.expanded && node.children
            ? html`<div class="children">
              ${node.children.map((child) => this.renderNode(child))}
            </div>`
            : null}
      </div>
    `;
    }

    render() {
        return html` ${this.nodes.map((node) => this.renderNode(node))}`;
    }
}