import {describe, it, expect, beforeEach} from 'vitest';
import './BlnTreeView.ts';

type Node = { id: string; label: string; children?: Node[]; hasChildren?: boolean };

describe('<bln-tree>', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  const mount = async (props: Partial<{ items: Node[]; selectedIds: string[]; expandedIds: string[]; multiSelect: boolean; } > = {}) => {
    const el = document.createElement('bln-tree') as any;
    Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
    document.body.appendChild(el);
    await (el as any).updateComplete;
    return el as HTMLElement & { shadowRoot: ShadowRoot } & any;
  };

  const sample: Node[] = [
    { id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }, { id: 'a2', label: 'A2' }] },
    { id: 'b', label: 'B', hasChildren: true },
  ];

  it('renders items with proper roles', async () => {
    const el = await mount({ items: sample });
    const tree = el.shadowRoot!.querySelector('[role="tree"]');
    const items = el.shadowRoot!.querySelectorAll('[role="treeitem"]');
    expect(tree).toBeTruthy();
    expect(items.length).toBeGreaterThan(0);
  });

  it('toggles expand state and emits events', async () => {
    const el = await mount({ items: sample, expandedIds: [] });
    const firstToggleBtn = el.shadowRoot!.querySelector('button');
    let toggled: any = null;
    el.addEventListener('bln-tree:toggle', (e: any) => toggled = e.detail);
    (firstToggleBtn as HTMLButtonElement).click();
    await (el as any).updateComplete;
    expect(toggled).toBeTruthy();
    expect(Array.isArray((el as any).expandedIds)).toBe(true);
  });

  it('supports selection and multiSelect', async () => {
    const el = await mount({ items: sample, multiSelect: true });
    const treeitems = Array.from(el.shadowRoot!.querySelectorAll('[role="treeitem"]')) as HTMLElement[];
    let last: any = null;
    el.addEventListener('bln-tree:select', (e: any) => last = e.detail);
    treeitems[0].click();
    treeitems[1].click();
    await (el as any).updateComplete;
    expect(last.selectedIds.length).toBe(2);
  });

  it('requests async children via event and applies them with applyChildren', async () => {
    const el = await mount({ items: sample });
    const bToggle = Array.from(el.shadowRoot!.querySelectorAll('button'))[1] as HTMLButtonElement; // for node b
    let requested: string | null = null;
    el.addEventListener('bln-tree:load-needed', (e: any) => {
      requested = e.detail.id;
      // simulate async resolve
      e.detail.resolve([{ id: 'b1', label: 'B1' }]);
    });
    bToggle.click();
    await (el as any).updateComplete;
    // expanded group should contain new child
    const group = el.shadowRoot!.querySelector('[role="group"]:last-of-type');
    expect(requested).toBe('b');
    expect(group?.textContent).toContain('B1');
  });
});
