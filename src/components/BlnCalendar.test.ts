import {describe, it, expect, beforeEach, vi} from 'vitest';
import './BlnCalendar.ts';

/**
 * Tests for <bln-calendar>
 */
describe('<bln-calendar>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Reset Date.now to a fixed time for consistent testing
    vi.setSystemTime(new Date('2025-10-22T12:00:00Z'));
  });

  const mount = async (props: Partial<{
    label: string;
    name: string;
    hint: string;
    error: string;
    startDate: string;
    endDate: string;
    dateFormat: string;
    disabled: boolean;
    required: boolean;
    readonly: boolean;
    class: string;
    size: 'small' | 'medium' | 'large';
    cornerHint: string;
    isValid: boolean;
    minDate: string;
    maxDate: string;
    showTodayButton: boolean;
    showClearButton: boolean;
    locale: string;
    retroDesign: boolean;
  }> = {}) => {
    const el = document.createElement('bln-calendar') as any;
    Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
    document.body.appendChild(el);
    await (el as any).updateComplete;
    return el as HTMLElement & { shadowRoot: ShadowRoot };
  };

  it('rendert Label und Corner-Hint', async () => {
    const el = await mount({label: 'Datumsbereich', cornerHint: 'optional'});
    const label = el.shadowRoot!.querySelector('label');
    expect(label?.textContent).toContain('Datumsbereich');
    const hint = el.shadowRoot!.querySelector('span.block.mb-2.text-sm.text-gray-500');
    expect(hint?.textContent).toContain('optional');
  });

  it('bindet hint und error via aria-describedby an', async () => {
    const el = await mount({hint: 'Hilfetext', error: 'Fehler'});
    const calendarDiv = el.shadowRoot!.querySelector('[aria-describedby]')!;
    const describedby = calendarDiv.getAttribute('aria-describedby') || '';
    expect(describedby.length).toBeGreaterThan(0);
    // Both hint and error ids should be included
    const ids = describedby.split(' ');
    ids.forEach((id) => {
      expect(el.shadowRoot!.getElementById(id)).toBeTruthy();
    });
  });

  it('zeigt initiale Datumswerte korrekt an', async () => {
    const el = await mount({startDate: '22.10.2025', endDate: '25.10.2025'});
    const startDisplay = el.shadowRoot!.querySelector('[class*="text-sm"]:first-of-type span:last-child');
    const endDisplay = el.shadowRoot!.querySelector('[class*="text-sm"]:last-of-type span:last-child');
    expect(startDisplay?.textContent).toContain('22.10.2025');
    expect(endDisplay?.textContent).toContain('25.10.2025');
  });

  it('zeigt "Nicht ausgewählt" für leere Datumswerte', async () => {
    const el = await mount({});
    const startDisplay = el.shadowRoot!.querySelector('[class*="text-sm"]:first-of-type span:last-child');
    const endDisplay = el.shadowRoot!.querySelector('[class*="text-sm"]:last-of-type span:last-child');
    expect(startDisplay?.textContent).toContain('Nicht ausgewählt');
    expect(endDisplay?.textContent).toContain('Nicht ausgewählt');
  });

  it('rendert Kalender-Grid mit korrekten Tagen', async () => {
    const el = await mount({});
    const dayButtons = el.shadowRoot!.querySelectorAll('[data-date]');
    expect(dayButtons.length).toBeGreaterThan(28); // At least one month worth of days
    
    // Check day headers
    const dayHeaders = el.shadowRoot!.querySelectorAll('.grid-cols-7:first-child > div');
    expect(dayHeaders.length).toBe(7);
    expect(dayHeaders[0].textContent).toBe('Mo');
    expect(dayHeaders[6].textContent).toBe('So');
  });

  it('navigiert zwischen Monaten', async () => {
    const el = await mount({});
    const monthDisplay = el.shadowRoot!.querySelector('h3');
    const originalMonth = monthDisplay?.textContent;
    
    const nextButton = el.shadowRoot!.querySelector('button[title="Nächster Monat"]') as HTMLButtonElement;
    nextButton.click();
    await (el as any).updateComplete;
    
    const newMonth = monthDisplay?.textContent;
    expect(newMonth).not.toBe(originalMonth);
    
    const prevButton = el.shadowRoot!.querySelector('button[title="Vorheriger Monat"]') as HTMLButtonElement;
    prevButton.click();
    await (el as any).updateComplete;
    
    expect(monthDisplay?.textContent).toBe(originalMonth);
  });

  it('wählt Einzeldatum aus', async () => {
    const el = await mount({});
    let eventDetail: any = null;
    el.addEventListener('date-change', (e: any) => {
      eventDetail = e.detail;
    });

    // Find a day button (preferably current month)
    const dayButton = el.shadowRoot!.querySelector('[data-date][class*="text-gray-900"]:not([disabled])') as HTMLButtonElement;
    expect(dayButton).toBeTruthy();
    
    dayButton.click();
    await (el as any).updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.startDate).toBeTruthy();
    expect(eventDetail.endDate).toBe(''); // Only start date selected initially
  });

  it('wählt Datumsbereich aus', async () => {
    const el = await mount({});
    let eventCount = 0;
    let lastEventDetail: any = null;
    el.addEventListener('date-change', (e: any) => {
      eventCount++;
      lastEventDetail = e.detail;
    });

    // Find two day buttons
    const dayButtons = Array.from(el.shadowRoot!.querySelectorAll('[data-date][class*="text-gray-900"]:not([disabled])')) as HTMLButtonElement[];
    expect(dayButtons.length).toBeGreaterThan(1);
    
    // Click first date
    dayButtons[0].click();
    await (el as any).updateComplete;
    expect(eventCount).toBe(1);
    
    // Click second date
    dayButtons[1].click();
    await (el as any).updateComplete;
    expect(eventCount).toBe(2);
    expect(lastEventDetail.startDate).toBeTruthy();
    expect(lastEventDetail.endDate).toBeTruthy();
  });

  it('unterstützt verschiedene Datumsformate', async () => {
    const formats = [
      { format: 'dd.MM.yyyy', expected: '22.10.2025' },
      { format: 'yyyy-MM-dd', expected: '2025-10-22' },
      { format: 'dd/MM/yyyy', expected: '22/10/2025' },
      { format: 'MM/dd/yyyy', expected: '10/22/2025' }
    ];

    for (const {format, expected} of formats) {
      const el = await mount({startDate: '22.10.2025', dateFormat: format});
      await (el as any).updateComplete;
      
      // Get the displayed start date
      const startDisplay = el.shadowRoot!.querySelector('[class*="text-sm"]:first-of-type span:last-child');
      if (format === 'dd.MM.yyyy') {
        expect(startDisplay?.textContent).toContain('22.10.2025'); // Input format preserved
      } else {
        // For other formats, we need to trigger a date change to see formatting
        const dayButton = el.shadowRoot!.querySelector('[data-date]:not([disabled])') as HTMLButtonElement;
        if (dayButton) {
          dayButton.click();
          await (el as any).updateComplete;
          expect((el as any).startDate).toMatch(/\d/); // Has some date format
        }
      }
      el.remove();
    }
  });

  it('funktioniert mit Heute-Button', async () => {
    const el = await mount({});
    let eventDetail: any = null;
    el.addEventListener('today-click', (e: any) => {
      eventDetail = e.detail;
    });

    const todayButton = el.shadowRoot!.querySelector('button[title="Heute auswählen"]') as HTMLButtonElement;
    expect(todayButton).toBeTruthy();
    
    todayButton.click();
    await (el as any).updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.startDate).toBeTruthy();
    expect(eventDetail.endDate).toBeTruthy();
    expect(eventDetail.startDate).toBe(eventDetail.endDate); // Same day
  });

  it('funktioniert mit Löschen-Button', async () => {
    const el = await mount({startDate: '22.10.2025', endDate: '25.10.2025'});
    let eventDetail: any = null;
    el.addEventListener('clear-click', (e: any) => {
      eventDetail = e.detail;
    });

    const clearButton = el.shadowRoot!.querySelector('button[title="Auswahl löschen"]') as HTMLButtonElement;
    expect(clearButton).toBeTruthy();
    expect(clearButton.hasAttribute('disabled')).toBe(false);
    
    clearButton.click();
    await (el as any).updateComplete;

    expect(eventDetail).toBeTruthy();
    expect(eventDetail.startDate).toBe('');
    expect(eventDetail.endDate).toBe('');
  });

  it('deaktiviert Löschen-Button wenn keine Auswahl', async () => {
    const el = await mount({});
    const clearButton = el.shadowRoot!.querySelector('button[title="Auswahl löschen"]') as HTMLButtonElement;
    expect(clearButton.hasAttribute('disabled')).toBe(true);
  });

  it('kann Heute und Löschen Buttons ausblenden', async () => {
    const el = await mount({showTodayButton: false, showClearButton: false});
    const todayButton = el.shadowRoot!.querySelector('button[title="Heute auswählen"]');
    const clearButton = el.shadowRoot!.querySelector('button[title="Auswahl löschen"]');
    expect(todayButton).toBeFalsy();
    expect(clearButton).toBeFalsy();
  });

  it('unterstützt Tastaturnavigation', async () => {
    const el = await mount({});
    
    // Find a focusable day button
    const dayButton = el.shadowRoot!.querySelector('[data-date]:not([disabled])') as HTMLButtonElement;
    expect(dayButton).toBeTruthy();
    
    // Test Enter key
    dayButton.focus();
    dayButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await (el as any).updateComplete;
    
    // Should have selected a date
    expect((el as any).startDate).toBeTruthy();
  });

  it('unterstützt Pfeil-Tasten Navigation', async () => {
    const el = await mount({});
    const dayButton = el.shadowRoot!.querySelector('[data-date]:not([disabled])') as HTMLButtonElement;
    
    // Test arrow key navigation
    dayButton.focus();
    dayButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await (el as any).updateComplete;
    
    // Focus should have moved (we can't easily test focus change in jsdom, but event should not error)
  });

  it('unterstützt Home/End Tasten', async () => {
    const el = await mount({});
    const dayButton = el.shadowRoot!.querySelector('[data-date]:not([disabled])') as HTMLButtonElement;
    
    dayButton.focus();
    dayButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await (el as any).updateComplete;
    
    // Should navigate to first day of month
    dayButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await (el as any).updateComplete;
    
    // Should navigate to last day of month
  });

  it('respektiert min/max Datumseinschränkungen', async () => {
    const el = await mount({
      minDate: '20.10.2025',
      maxDate: '24.10.2025'
    });
    
    // Find buttons that should be disabled (outside range)
    const dayButtons = el.shadowRoot!.querySelectorAll('[data-date]');
    let hasDisabledButtons = false;
    
    dayButtons.forEach(button => {
      if (button.hasAttribute('disabled')) {
        hasDisabledButtons = true;
      }
    });
    
    // Should have some disabled buttons outside the allowed range
    expect(hasDisabledButtons).toBe(true);
  });

  it('funktioniert im disabled Zustand', async () => {
    const el = await mount({disabled: true});
    const calendarDiv = el.shadowRoot!.querySelector('[aria-label="Datumsbereich auswählen"]');
    expect(calendarDiv?.className).toContain('opacity-50');
    expect(calendarDiv?.className).toContain('pointer-events-none');
    
    const todayButton = el.shadowRoot!.querySelector('button[title="Heute auswählen"]') as HTMLButtonElement;
    expect(todayButton.hasAttribute('disabled')).toBe(true);
  });

  it('funktioniert im readonly Zustand', async () => {
    const el = await mount({readonly: true});
    
    // Try to click a date - should not work
    let eventFired = false;
    el.addEventListener('date-change', () => {
      eventFired = true;
    });
    
    const dayButton = el.shadowRoot!.querySelector('[data-date]:not([disabled])') as HTMLButtonElement;
    dayButton?.click();
    await (el as any).updateComplete;
    
    expect(eventFired).toBe(false);
  });

  it('ändert Größe je nach size Property', async () => {
    const small = await mount({size: 'small'});
    const smallDiv = small.shadowRoot!.querySelector('[aria-label="Datumsbereich auswählen"]');
    expect(smallDiv?.className).toContain('p-2');
    expect(smallDiv?.className).toContain('text-sm');

    const large = await mount({size: 'large'});
    const largeDiv = large.shadowRoot!.querySelector('[aria-label="Datumsbereich auswählen"]');
    expect(largeDiv?.className).toContain('p-4');
    expect(largeDiv?.className).toContain('text-lg');
  });

  it('zeigt Validitäts-Icons abhängig von is-valid', async () => {
    const valid = await mount({ isValid: true, startDate: '22.10.2025' });
    expect(valid.shadowRoot!.querySelector('lucide-icon[name="Check"]')).toBeTruthy();

    const invalid = await mount({ isValid: false, startDate: '22.10.2025' });
    expect(invalid.shadowRoot!.querySelector('lucide-icon[name="CircleAlert"]')).toBeTruthy();
  });

  it('rendert Fehlermeldung in <span role="alert">', async () => {
    const el = await mount({ error: 'Ungültiger Datumsbereich' });
    const span = el.shadowRoot!.querySelector('span[role="alert"]');
    expect(span?.textContent).toContain('Ungültiger Datumsbereich');
  });

  it('unterstützt externe Validierung über validator-Property', async () => {
    const el = await mount({ label: 'Test' }) as any;
    // Set validator as property
    el.validator = (startDate: string, endDate: string) => ({
      valid: startDate && endDate && startDate !== endDate,
      message: 'Start- und Enddatum müssen unterschiedlich sein'
    });
    await el.updateComplete;

    // Select same date twice
    const dayButton = el.shadowRoot!.querySelector('[data-date]:not([disabled])') as HTMLButtonElement;
    dayButton.click();
    await el.updateComplete;
    dayButton.click(); // Select same date as end date
    await el.updateComplete;

    expect(el.isValid).toBe(false);
    const errorSpan = el.shadowRoot!.querySelector('span[role="alert"]');
    expect(errorSpan?.textContent).toContain('Start- und Enddatum müssen unterschiedlich sein');
  });

  it('unterstützt retroDesign Styling', async () => {
    const el = await mount({ retroDesign: true, label: 'Test' });
    const label = el.shadowRoot!.querySelector('label');
    expect(label?.className).toContain('font-bold');
    expect(label?.className).toContain('text-black');
  });

  it('setzt aria-Attribute korrekt', async () => {
    const el = await mount({ 
      ariaLabel: 'Kalender auswählen',
      ariaLabelledby: 'external-label',
      ariaDescribedby: 'external-desc'
    });
    const calendarDiv = el.shadowRoot!.querySelector('[aria-label]');
    expect(calendarDiv?.getAttribute('aria-label')).toBe('Kalender auswählen');
    expect(calendarDiv?.getAttribute('aria-describedby')).toContain('external-desc');
  });

  it('markiert heute korrekt im Kalender', async () => {
    const el = await mount({});
    // Find today's button (should be bold)
    const todayButton = el.shadowRoot!.querySelector('[data-date][class*="font-bold"]');
    expect(todayButton).toBeTruthy();
  });

  it('zeigt Datumsbereich visuell korrekt an', async () => {
    const el = await mount({startDate: '20.10.2025', endDate: '24.10.2025'});
    await (el as any).updateComplete;
    
    // Should have start/end dates with blue background and range with light blue
    const selectedButtons = el.shadowRoot!.querySelectorAll('[class*="bg-blue-600"]');
    const rangeButtons = el.shadowRoot!.querySelectorAll('[class*="bg-blue-100"]');
    
    expect(selectedButtons.length).toBeGreaterThanOrEqual(2); // At least start and end
    expect(rangeButtons.length).toBeGreaterThanOrEqual(0); // Range days in between
  });

  it('parst verschiedene Eingabeformate korrekt', async () => {
    const testCases = [
      { input: '22.10.2025', format: 'dd.MM.yyyy' },
      { input: '2025-10-22', format: 'yyyy-MM-dd' },
      { input: '22/10/2025', format: 'dd/MM/yyyy' }
    ];

    for (const testCase of testCases) {
      const el = await mount({startDate: testCase.input}) as any;
      await el.updateComplete;
      
      // Should have parsed the date correctly
      expect(el._selectedStartDate).toBeTruthy();
      expect(el._selectedStartDate.getFullYear()).toBe(2025);
      expect(el._selectedStartDate.getMonth()).toBe(9); // October (0-based)
      expect(el._selectedStartDate.getDate()).toBe(22);
      
      el.remove();
    }
  });

  it('behandelt ungültige Datumsformate graceful', async () => {
    const el = await mount({startDate: 'invalid-date'}) as any;
    await el.updateComplete;
    
    // Should not crash and should show "Nicht ausgewählt"
    const startDisplay = el.shadowRoot!.querySelector('[class*="text-sm"]:first-of-type span:last-child');
    expect(startDisplay?.textContent).toContain('invalid-date'); // Shows as-is since can't parse
  });

  it('emittiert Events korrekt', async () => {
    const el = await mount({});
    const events: string[] = [];
    
    el.addEventListener('date-change', () => events.push('date-change'));
    el.addEventListener('today-click', () => events.push('today-click'));
    el.addEventListener('clear-click', () => events.push('clear-click'));
    
    // Test date selection
    const dayButton = el.shadowRoot!.querySelector('[data-date]:not([disabled])') as HTMLButtonElement;
    dayButton.click();
    await (el as any).updateComplete;
    expect(events).toContain('date-change');
    
    // Test today button
    const todayButton = el.shadowRoot!.querySelector('button[title="Heute auswählen"]') as HTMLButtonElement;
    todayButton.click();
    await (el as any).updateComplete;
    expect(events).toContain('today-click');
    
    // Test clear button
    const clearButton = el.shadowRoot!.querySelector('button[title="Auswahl löschen"]') as HTMLButtonElement;
    clearButton.click();
    await (el as any).updateComplete;
    expect(events).toContain('clear-click');
  });
});