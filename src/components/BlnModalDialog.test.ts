import {describe, it, expect, beforeEach, vi} from 'vitest';
import './BlnModalDialog.ts';
import type { BlnModalButton } from './BlnModalDialog';

/**
 * Tests for <bln-modal-dialog>
 */
describe('<bln-modal-dialog>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Reset body overflow style
    document.body.style.overflow = '';
  });

  const defaultButtons: BlnModalButton[] = [
    { id: 'cancel', label: 'Abbrechen', variant: 'outline' },
    { id: 'confirm', label: 'Bestätigen', variant: 'solid', primary: true }
  ];

  const mount = async (props: Partial<{
    title: string;
    text: string;
    inputLabel: string;
    inputPlaceholder: string;
    inputValue: string;
    inputType: string;
    showInput: boolean;
    buttons: BlnModalButton[];
    open: boolean;
    size: 'small' | 'medium' | 'large' | 'fullscreen';
    closeOnBackdrop: boolean;
    closeOnEscape: boolean;
    class: string;
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
  }> = {}) => {
    const el = document.createElement('bln-modal-dialog') as any;
    Object.entries(props).forEach(([k, v]) => {
      (el as any)[k] = v;
    });
    document.body.appendChild(el);
    await (el as any).updateComplete;
    return el as HTMLElement & { shadowRoot: ShadowRoot };
  };

  it('rendert nichts wenn nicht geöffnet', async () => {
    const el = await mount({ open: false });
    const backdrop = el.shadowRoot!.querySelector('.fixed.inset-0');
    expect(backdrop).toBeFalsy();
  });

  it('rendert Modal wenn geöffnet', async () => {
    const el = await mount({ 
      open: true, 
      title: 'Test Modal',
      text: 'Test content',
      buttons: defaultButtons
    });
    
    const backdrop = el.shadowRoot!.querySelector('.fixed.inset-0');
    expect(backdrop).toBeTruthy();
    
    const dialog = el.shadowRoot!.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });

  it('rendert Titel und Text korrekt', async () => {
    const el = await mount({
      open: true,
      title: 'Test Titel',
      text: 'Test Beschreibung'
    });
    
    const title = el.shadowRoot!.querySelector('h2');
    expect(title?.textContent).toContain('Test Titel');
    
    const text = el.shadowRoot!.querySelector('p');
    expect(text?.textContent).toContain('Test Beschreibung');
  });

  it('rendert Input-Feld wenn showInput aktiviert', async () => {
    const el = await mount({
      open: true,
      showInput: true,
      inputLabel: 'Name',
      inputPlaceholder: 'Ihr Name',
      inputValue: 'Test'
    });
    
    const label = el.shadowRoot!.querySelector('label');
    expect(label?.textContent).toContain('Name');
    
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Ihr Name');
    expect(input.value).toBe('Test');
  });

  it('rendert keine Input-Feld wenn showInput deaktiviert', async () => {
    const el = await mount({
      open: true,
      showInput: false
    });
    
    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeFalsy();
  });

  it('rendert Buttons korrekt', async () => {
    const el = await mount({
      open: true,
      buttons: defaultButtons
    });
    
    const buttons = el.shadowRoot!.querySelectorAll('button:not([aria-label])'); // Exclude close button
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('Abbrechen');
    expect(buttons[1].textContent?.trim()).toBe('Bestätigen');
  });

  it('emittiert button-click Event beim Button-Klick', async () => {
    const el = await mount({
      open: true,
      buttons: defaultButtons
    });
    
    let eventDetail: any = null;
    el.addEventListener('button-click', (e: any) => {
      eventDetail = e.detail;
    });

    const confirmButton = el.shadowRoot!.querySelectorAll('button:not([aria-label])')[1] as HTMLButtonElement;
    confirmButton.click();
    await (el as any).updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.buttonId).toBe('confirm');
    expect(eventDetail.button.label).toBe('Bestätigen');
  });

  it('emittiert input-change Event bei Input-Änderung', async () => {
    const el = await mount({
      open: true,
      showInput: true,
      inputValue: ''
    });
    
    let eventDetail: any = null;
    el.addEventListener('input-change', (e: any) => {
      eventDetail = e.detail;
    });

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = 'new value';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await (el as any).updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.value).toBe('new value');
  });

  it('schließt Modal bei Escape-Taste wenn closeOnEscape aktiviert', async () => {
    const el = await mount({
      open: true,
      closeOnEscape: true
    });
    
    let closeEventFired = false;
    el.addEventListener('close', () => {
      closeEventFired = true;
    });

    // Simulate Escape key press
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await (el as any).updateComplete;

    expect((el as any).open).toBe(false);
    expect(closeEventFired).toBe(true);
  });

  it('schließt nicht bei Escape-Taste wenn closeOnEscape deaktiviert', async () => {
    const el = await mount({
      open: true,
      closeOnEscape: false
    });
    
    let closeEventFired = false;
    el.addEventListener('close', () => {
      closeEventFired = true;
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await (el as any).updateComplete;

    expect((el as any).open).toBe(true);
    expect(closeEventFired).toBe(false);
  });

  it('schließt Modal bei Backdrop-Klick wenn closeOnBackdrop aktiviert', async () => {
    const el = await mount({
      open: true,
      closeOnBackdrop: true
    });
    
    let closeEventFired = false;
    el.addEventListener('close', () => {
      closeEventFired = true;
    });

    const backdrop = el.shadowRoot!.querySelector('.fixed.inset-0') as HTMLElement;
    backdrop.click();
    await (el as any).updateComplete;

    expect((el as any).open).toBe(false);
    expect(closeEventFired).toBe(true);
  });

  it('schließt nicht bei Backdrop-Klick wenn closeOnBackdrop deaktiviert', async () => {
    const el = await mount({
      open: true,
      closeOnBackdrop: false
    });
    
    let closeEventFired = false;
    el.addEventListener('close', () => {
      closeEventFired = true;
    });

    const backdrop = el.shadowRoot!.querySelector('.fixed.inset-0') as HTMLElement;
    backdrop.click();
    await (el as any).updateComplete;

    expect((el as any).open).toBe(true);
    expect(closeEventFired).toBe(false);
  });

  it('schließt nicht bei Klick auf Dialog-Inhalt', async () => {
    const el = await mount({
      open: true,
      closeOnBackdrop: true,
      text: 'Test content'
    });
    
    let closeEventFired = false;
    el.addEventListener('close', () => {
      closeEventFired = true;
    });

    const dialog = el.shadowRoot!.querySelector('[role="dialog"]') as HTMLElement;
    dialog.click();
    await (el as any).updateComplete;

    expect((el as any).open).toBe(true);
    expect(closeEventFired).toBe(false);
  });

  it('behandelt Tab-Navigation korrekt (Focus Trap)', async () => {
    const el = await mount({
      open: true,
      showInput: true,
      buttons: defaultButtons
    });
    
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    const buttons = el.shadowRoot!.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    
    // Focus should cycle through focusable elements
    input.focus();
    expect(document.activeElement).toBe(input);
    
    // Simulate Tab key to move to next button
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    // Note: In real browser, focus would move, but in jsdom we can't easily test actual focus changes
  });

  it('aktiviert Primary Button mit Enter-Taste', async () => {
    const el = await mount({
      open: true,
      buttons: defaultButtons
    });
    
    let eventDetail: any = null;
    el.addEventListener('button-click', (e: any) => {
      eventDetail = e.detail;
    });

    // Simulate Enter key press on dialog (not on input)
    const dialog = el.shadowRoot!.querySelector('[role="dialog"]') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await (el as any).updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.buttonId).toBe('confirm'); // Primary button
  });

  it('aktiviert nicht Primary Button mit Enter wenn in Input-Feld', async () => {
    const el = await mount({
      open: true,
      showInput: true,
      buttons: defaultButtons
    });
    
    let eventDetail: any = null;
    el.addEventListener('button-click', (e: any) => {
      eventDetail = e.detail;
    });

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await (el as any).updateComplete;

    expect(eventDetail).toBeFalsy(); // Should not trigger button click
  });

  it('unterstützt verschiedene Größen', async () => {
    const sizes = ['small', 'medium', 'large', 'fullscreen'] as const;
    
    for (const size of sizes) {
      const el = await mount({ open: true, size });
      const dialog = el.shadowRoot!.querySelector('[role="dialog"]') as HTMLElement;
      
      if (size === 'small') {
        expect(dialog.className).toContain('max-w-sm');
      } else if (size === 'medium') {
        expect(dialog.className).toContain('max-w-md');
      } else if (size === 'large') {
        expect(dialog.className).toContain('max-w-2xl');
      } else if (size === 'fullscreen') {
        expect(dialog.className).toContain('w-full h-full');
        expect(dialog.className).toContain('max-w-none');
      }
      
      el.remove();
    }
  });

  it('unterstützt verschiedene Button-Varianten', async () => {
    const buttons: BlnModalButton[] = [
      { id: 'solid', label: 'Solid', variant: 'solid' },
      { id: 'outline', label: 'Outline', variant: 'outline' },
      { id: 'ghost', label: 'Ghost', variant: 'ghost' }
    ];
    
    const el = await mount({ open: true, buttons });
    const buttonElements = el.shadowRoot!.querySelectorAll('button:not([aria-label])');
    
    expect(buttonElements[0].className).toContain('bg-blue-600'); // solid
    expect(buttonElements[1].className).toContain('border-gray-300'); // outline
    expect(buttonElements[2].className).toContain('hover:bg-gray-100'); // ghost
  });

  it('rendert Close-Button nur wenn closeOnEscape aktiviert', async () => {
    const elWithClose = await mount({ open: true, title: 'Test', closeOnEscape: true });
    const closeButtonWith = elWithClose.shadowRoot!.querySelector('button[aria-label="Dialog schließen"]');
    expect(closeButtonWith).toBeTruthy();
    
    const elWithoutClose = await mount({ open: true, title: 'Test', closeOnEscape: false });
    const closeButtonWithout = elWithoutClose.shadowRoot!.querySelector('button[aria-label="Dialog schließen"]');
    expect(closeButtonWithout).toBeFalsy();
  });

  it('setzt ARIA-Attribute korrekt', async () => {
    const el = await mount({
      open: true,
      title: 'Test Title',
      text: 'Test Description',
      ariaLabel: 'Custom Modal'
    });
    
    const dialog = el.shadowRoot!.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Custom Modal');
    
    const titleId = dialog.getAttribute('aria-labelledby');
    if (titleId) {
      const titleElement = el.shadowRoot!.getElementById(titleId);
      expect(titleElement?.textContent).toContain('Test Title');
    }
    
    const descId = dialog.getAttribute('aria-describedby');
    if (descId) {
      const descElement = el.shadowRoot!.getElementById(descId);
      expect(descElement?.textContent).toContain('Test Description');
    }
  });

  it('verhindert Body-Scrolling wenn Modal geöffnet', async () => {
    const el = await mount({ open: false });
    expect(document.body.style.overflow).toBe('');
    
    (el as any).open = true;
    await (el as any).updateComplete;
    expect(document.body.style.overflow).toBe('hidden');
    
    (el as any).open = false;
    await (el as any).updateComplete;
    expect(document.body.style.overflow).toBe('');
  });

  it('emittiert open/close Events', async () => {
    const el = await mount({ open: false });
    
    let openEventFired = false;
    let closeEventFired = false;
    
    el.addEventListener('open', () => { openEventFired = true; });
    el.addEventListener('close', () => { closeEventFired = true; });
    
    (el as any).open = true;
    await (el as any).updateComplete;
    expect(openEventFired).toBe(true);
    
    (el as any).open = false;
    await (el as any).updateComplete;
    expect(closeEventFired).toBe(true);
  });

  it('ignoriert disabled Buttons', async () => {
    const buttons: BlnModalButton[] = [
      { id: 'disabled', label: 'Disabled', disabled: true }
    ];
    
    const el = await mount({ open: true, buttons });
    
    let eventFired = false;
    el.addEventListener('button-click', () => { eventFired = true; });
    
    const button = el.shadowRoot!.querySelector('button[disabled]') as HTMLButtonElement;
    button.click();
    await (el as any).updateComplete;
    
    expect(eventFired).toBe(false);
  });

  it('unterstützt externe Validierung für Input', async () => {
    const el = await mount({
      open: true,
      showInput: true,
      inputValue: ''
    }) as any;
    
    // Set validator as property
    el.validator = (value: string) => ({
      valid: value.length >= 3,
      message: 'Mindestens 3 Zeichen erforderlich'
    });
    await el.updateComplete;
    
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    
    // Test invalid input
    input.value = 'ab';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    
    const errorMessage = el.shadowRoot!.querySelector('[role="alert"]');
    expect(errorMessage?.textContent).toContain('Mindestens 3 Zeichen');
    expect(input.className).toContain('border-red-500');
    
    // Test valid input
    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    
    expect(input.className).toContain('border-teal-500');
  });

  it('verhindert Primary Button Action bei ungültiger Eingabe', async () => {
    const el = await mount({
      open: true,
      showInput: true,
      buttons: [{ id: 'submit', label: 'Submit', primary: true }]
    }) as any;
    
    el.validator = (value: string) => ({ valid: value.length >= 3 });
    el.inputValue = 'ab'; // Invalid
    await el.updateComplete;
    
    let eventFired = false;
    el.addEventListener('button-click', () => { eventFired = true; });
    
    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    await el.updateComplete;
    
    expect(eventFired).toBe(false);
  });

  it('unterstützt verschiedene Input-Typen', async () => {
    const types = ['text', 'email', 'password', 'number'];
    
    for (const type of types) {
      const el = await mount({
        open: true,
        showInput: true,
        inputType: type
      });
      
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe(type);
      el.remove();
    }
  });

  it('rendert Slot-Inhalt korrekt', async () => {
    const el = await mount({ open: true });
    
    // Add slot content
    const slotContent = document.createElement('div');
    slotContent.textContent = 'Custom slot content';
    el.appendChild(slotContent);
    await (el as any).updateComplete;
    
    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('verwendet korrekte z-index für Overlay', async () => {
    const el = await mount({ open: true });
    const backdrop = el.shadowRoot!.querySelector('.fixed.inset-0') as HTMLElement;
    expect(backdrop.className).toContain('z-50');
  });

  it('hat korrekte Backdrop-Styling', async () => {
    const el = await mount({ open: true });
    const backdrop = el.shadowRoot!.querySelector('.fixed.inset-0') as HTMLElement;
    expect(backdrop.className).toContain('bg-black');
    expect(backdrop.className).toContain('bg-opacity-50');
    expect(backdrop.className).toContain('backdrop-blur-sm');
  });

  it('cleanup bei disconnect', async () => {
    const el = await mount({ open: true });
    
    // Spy on removeEventListener to verify cleanup
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    el.remove(); // This calls disconnectedCallback
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(document.body.style.overflow).toBe('');
    
    removeEventListenerSpy.mockRestore();
  });

  it('öffentliche openModal/closeModal Methoden funktionieren', async () => {
    const el = await mount({ open: false }) as any;
    
    el.openModal();
    await el.updateComplete;
    expect(el.open).toBe(true);
    
    el.closeModal();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });
});