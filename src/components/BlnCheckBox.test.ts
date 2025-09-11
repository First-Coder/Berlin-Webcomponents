import {describe, it, expect, beforeEach} from 'vitest';
import './BlnCheckBox.ts';

describe('<bln-checkbox>', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  const mount = async (props: Partial<{
    label: string;
    hint: string;
    cornerHint: string;
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
    required: boolean;
    size: 'small' | 'medium' | 'large';
    class: string;
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
  }> = {}, slotted = 'Option A') => {
    const el = document.createElement('bln-checkbox') as any;
    Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
    el.textContent = slotted;
    document.body.appendChild(el);
    await (el as any).updateComplete;
    return el as HTMLElement & { shadowRoot: ShadowRoot };
  };

  it('rendert Checkbox und Label inkl. Corner-Hint', async () => {
    const el = await mount({ label: 'Akzeptieren', cornerHint: 'optional' });
    const label = el.shadowRoot!.querySelector('label');
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]');
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('bindet hint via aria-describedby an', async () => {
    const el = await mount({ hint: 'Hilfetext' });
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]')!;
    const hint = el.shadowRoot!.querySelector('p[id]')!;
    expect(hint.textContent).toContain('Hilfetext');
    const describedby = input.getAttribute('aria-describedby');
    expect(describedby && describedby.length > 0).toBe(true);
  });

  it('setzt checked und emittiert change/input', async () => {
    const el = await mount({ checked: false });
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    let changes = 0; let inputs = 0;
    el.addEventListener('change', () => changes++);
    el.addEventListener('input', () => inputs++);
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await (el as any).updateComplete;
    expect((el as any).checked).toBe(true);
    expect(changes).toBe(1);
    expect(inputs).toBe(1);
  });

  it('deaktiviert Interaktion via disabled Klasse', async () => {
    const el = await mount({ disabled: true });
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]')!;
    expect(input.hasAttribute('disabled')).toBe(true);
    expect(input.className).toContain('disabled:pointer-events-none');
    expect(input.className).toContain('disabled:opacity-50');
  });

  it('ändert Größenklassen korrekt', async () => {
    const sm = await mount({ size: 'small' });
    const smInput = sm.shadowRoot!.querySelector('input[type="checkbox"]')!;
    expect(smInput.className).toContain('h-4');
    const lg = await mount({ size: 'large' });
    const lgInput = lg.shadowRoot!.querySelector('input[type="checkbox"]')!;
    expect(lgInput.className).toContain('h-6');
  });
  it('nutzt aria-label wenn kein sichtbares Label vorhanden ist', async () => {
    const el = await mount({ ariaLabel: 'Zustimmen' }, '');
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]')!;
    expect(input.getAttribute('aria-label')).toBe('Zustimmen');
  });

  it('Label-Klick toggelt Checkbox', async () => {
    const el = await mount({}, 'Ich stimme zu');
    const label = el.shadowRoot!.querySelector('label')!;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    label.click();
    await (el as any).updateComplete;
    expect(input.checked).toBe(true);
  });

  it('name/value/required werden durchgereicht', async () => {
    const el = await mount({ name: 'agb', value: 'yes', required: true });
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]')!;
    expect(input.getAttribute('name')).toBe('agb');
    expect(input.getAttribute('value')).toBe('yes');
    expect(input.hasAttribute('required')).toBe(true);
  });
});
