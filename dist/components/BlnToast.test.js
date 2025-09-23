import { describe, it, expect, vi, beforeEach } from 'vitest';
import './BlnToast';
const nextFrame = () => new Promise((r) => setTimeout(r));
describe('bln-toast', () => {
    let el;
    beforeEach(() => {
        document.body.innerHTML = '';
        el = document.createElement('bln-toast');
        document.body.appendChild(el);
    });
    it('renders closed by default and opens via property', async () => {
        await nextFrame();
        const root = el.shadowRoot;
        const container = root.querySelector('div[role="status"]');
        expect(container.className).toContain('opacity-0');
        el.open = true;
        await nextFrame();
        expect(container.className).not.toContain('opacity-0');
    });
    it('auto hides after delay', async () => {
        el.autoHide = true;
        el.autoHideDelay = 1000;
        el.open = true;
        await new Promise(r => setTimeout(r, 1100));
        expect(el.open).toBe(false);
    });
    it('emits open and close events', async () => {
        const onOpen = vi.fn();
        const onClose = vi.fn();
        el.addEventListener('open', onOpen);
        el.addEventListener('close', onClose);
        el.show();
        await nextFrame();
        expect(onOpen).toHaveBeenCalled();
        el.close();
        await nextFrame();
        expect(onClose).toHaveBeenCalled();
    });
    it('passes title and message through properties and slot', async () => {
        el.title = 'Hinweis';
        el.message = 'Alles gut';
        el.open = true;
        await nextFrame();
        const root = el.shadowRoot;
        expect(root.textContent).toContain('Hinweis');
        expect(root.textContent).toContain('Alles gut');
    });
});
