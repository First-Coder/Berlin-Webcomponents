import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './BlnTreeView';
import type { BlnTreeProps, BlnTreeNode } from './BlnTreeView';

const meta = {
  title: 'Base Components/Tree',
  tags: ['autodocs'],
  render: (args: Partial<BlnTreeProps>) => html`
    <bln-tree
      aria-label=${ifDefined(args.ariaLabel)}
      aria-labelledby=${ifDefined(args.ariaLabelledby)}
      aria-describedby=${ifDefined(args.ariaDescribedby)}
      class="${args.class ?? ''}"
      size=${ifDefined(args.size)}
      .items=${args.items as any}
      .selectedIds=${args.selectedIds as any}
      .expandedIds=${args.expandedIds as any}
      multi-select=${ifDefined(args.multiSelect as any)}
    ></bln-tree>
  `,
  argTypes: {
    items: { control: 'object', description: 'Tree nodes' },
    selectedIds: { control: 'object' },
    expandedIds: { control: 'object' },
    multiSelect: { name: 'multi-select', description: 'Allow multi selection', type: { name: 'boolean' } },
    size: { control: { type: 'select' }, options: ['small','medium','large'] },
    class: { type: { name: 'string' } },
    ariaLabel: { name: 'aria-label', type: { name: 'string' } },
    ariaLabelledby: { name: 'aria-labelledby', type: { name: 'string' } },
    ariaDescribedby: { name: 'aria-describedby', type: { name: 'string' } },
  },
  args: {
    items: [
      { id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }, { id: 'a2', label: 'A2' }] },
      { id: 'b', label: 'B', hasChildren: true },
    ] as BlnTreeNode[],
    expandedIds: ['a'],
    selectedIds: [],
    multiSelect: false,
  },
} satisfies Meta<Partial<BlnTreeProps>>;

export default meta;

type Story = StoryObj<Partial<BlnTreeProps>>;

export const Default: Story = {};

export const MultiSelect: Story = { args: { multiSelect: true } };

export const AsyncLoading: Story = {
  render: (args) => html`
    <bln-tree
      .items=${args.items as any}
      .expandedIds=${args.expandedIds as any}
      .selectedIds=${args.selectedIds as any}
      @bln-tree:load-needed=${(e: CustomEvent) => {
        const { id, resolve } = (e as any).detail;
        setTimeout(() => resolve([{ id: id + '-1', label: 'Loaded child' }]), 600);
      }}
    ></bln-tree>
  `,
};
