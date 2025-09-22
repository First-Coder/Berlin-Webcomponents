import {describe, it, expect, vi} from 'vitest';
import './BlnFormular';
import './BlnInput';

function nextFrame() { return new Promise(r => setTimeout(r)); }

describe('<bln-formular>', () => {
  it('renders slots and collects data on submit', async () => {
    const el = document.createElement('bln-formular') as any;
    el.legend = 'Demo';
    document.body.appendChild(el);
    el.innerHTML = `
      <bln-input name="email" value="a@b" label="E-Mail"></bln-input>
      <div slot="actions">
        <button type="button">Speichern</button>
        <button type="button">Löschen</button>
        <button type="button">Leeren</button>
      </div>
    `;
    await nextFrame();

    const submitSpy = vi.fn();
    el.addEventListener('bln-submit', (e: any) => submitSpy(e.detail.data));

    el.submit();
    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(submitSpy.mock.calls[0][0]).toMatchObject({ email: 'a@b' });
  });

  it('clear() empties values and emits bln-clear', async () => {
    const el = document.createElement('bln-formular') as any;
    document.body.appendChild(el);
    el.innerHTML = `<bln-input name="n" value="x"></bln-input>`;
    await nextFrame();

    const clearSpy = vi.fn();
    el.addEventListener('bln-clear', clearSpy);
    el.clear();
    await nextFrame();

    const input = el.querySelector('bln-input') as any;
    expect(input.value).toBe('');
    expect(clearSpy).toHaveBeenCalled();
  });

  it('delete() emits bln-delete', async () => {
    const el = document.createElement('bln-formular') as any;
    document.body.appendChild(el);
    const delSpy = vi.fn();
    el.addEventListener('bln-delete', delSpy);
    el.delete();
    expect(delSpy).toHaveBeenCalled();
  });

  it('is accessible: has role and optional legend id', async () => {
    const el = document.createElement('bln-formular') as any;
    el.legend = 'Title';
    document.body.appendChild(el);
    await nextFrame();
    const form = el.shadowRoot!.querySelector('form')!;
    expect(form.getAttribute('role')).toBe('form');
    const legend = el.shadowRoot!.getElementById('bln-form-legend');
    expect(legend?.textContent).toBe('Title');
  });

  it('Enter key triggers submit by default', async () => {
    const el = document.createElement('bln-formular') as any;
    document.body.appendChild(el);
    el.innerHTML = `<input name="x" value="1">`;
    await nextFrame();
    const spy = vi.fn();
    el.addEventListener('bln-submit', spy);

    const input = el.querySelector('input')!;
    const evt = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(evt);
    expect(spy).toHaveBeenCalled();
  });
});
