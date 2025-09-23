import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './BlnTreeView';
const meta = {
    title: 'Base Components/Tree',
    tags: ['autodocs'],
    render: (args) => html `
    <bln-tree
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      class="${args.class ?? ''}"
      size=${ifDefined(args.size)}
      .items=${args.items}
      .selectedIds=${args.selectedIds}
      .expandedIds=${args.expandedIds}
      multi-select=${ifDefined(args.multiSelect)}
    ></bln-tree>
  `,
    argTypes: {
        items: { control: 'object', description: 'Tree nodes' },
        selectedIds: { control: 'object' },
        expandedIds: { control: 'object' },
        multiSelect: { name: 'multi-select', description: 'Allow multi selection', type: { name: 'boolean' } },
        size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
        class: { type: { name: 'string' } },
        ariaLabel: { name: 'aria-label', type: { name: 'string' } },
        ariaLabelledby: { name: 'aria-labelledby', type: { name: 'string' } },
        ariaDescribedby: { name: 'aria-describedby', type: { name: 'string' } },
    },
    args: {
        items: [
            { id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }, { id: 'a2', label: 'A2' }] },
            { id: 'b', label: 'B', hasChildren: true },
        ],
        expandedIds: ['a'],
        selectedIds: [],
        multiSelect: false,
    },
};
export default meta;
export const Default = {};
export const MultiSelect = { args: { multiSelect: true } };
export const AsyncLoading = {
    render: (args) => html `
    <bln-tree
      .items=${args.items}
      .expandedIds=${args.expandedIds}
      .selectedIds=${args.selectedIds}
      @bln-tree:load-needed=${(e) => {
        const { id, resolve } = e.detail;
        setTimeout(() => resolve([{ id: id + '-1', label: 'Loaded child' }]), 600);
    }}
    ></bln-tree>
  `,
};
