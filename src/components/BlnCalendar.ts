import {customElement, property, state} from "lit/decorators.js";
import {html} from "lit";
import TailwindElement from "../app/TailwindElement";
import {booleanStringFalseConverter} from "../utils/converters";
import "./LucideIcon";

export interface BlnCalendarProps {
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
    size: "small" | "medium" | "large";
    cornerHint: string;
    isValid: boolean | undefined;
    retroDesign: boolean;
    minDate: string;
    maxDate: string;
    ariaLabel: string;
    ariaLabelledby: string;
    ariaDescribedby: string;
    showTodayButton: boolean;
    showClearButton: boolean;
    locale: string;
    /** Optional externe Validierungsfunktion. Nur als Property (nicht als Attribut) setzbar. */
    validator?: (startDate: string, endDate: string, el: BlnCalendar) => boolean | { valid: boolean; message?: string };
}

@customElement('bln-calendar')
export class BlnCalendar extends TailwindElement {
    // Visual/Meta
    @property() label: BlnCalendarProps['label'] = "";
    @property({attribute: 'corner-hint'}) cornerHint: BlnCalendarProps['cornerHint'] = "";
    @property() hint: BlnCalendarProps['hint'] = "";
    @property() error: BlnCalendarProps['error'] = "";

    // Form/Behavior
    @property() name: BlnCalendarProps['name'] = "";
    @property({attribute: 'start-date'}) startDate: BlnCalendarProps['startDate'] = "";
    @property({attribute: 'end-date'}) endDate: BlnCalendarProps['endDate'] = "";
    @property({attribute: 'date-format'}) dateFormat: BlnCalendarProps['dateFormat'] = "dd.MM.yyyy";
    @property({reflect: true, converter: booleanStringFalseConverter}) disabled: BlnCalendarProps['disabled'] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) required: BlnCalendarProps['required'] = false;
    @property({reflect: true, converter: booleanStringFalseConverter}) readonly: BlnCalendarProps['readonly'] = false;
    @property({attribute: 'min-date'}) minDate: BlnCalendarProps['minDate'] = "";
    @property({attribute: 'max-date'}) maxDate: BlnCalendarProps['maxDate'] = "";
    @property({attribute: 'show-today-button', converter: booleanStringFalseConverter}) showTodayButton: BlnCalendarProps['showTodayButton'] = true;
    @property({attribute: 'show-clear-button', converter: booleanStringFalseConverter}) showClearButton: BlnCalendarProps['showClearButton'] = true;
    @property() locale: BlnCalendarProps['locale'] = "de-DE";
    /** Externe Validierungsfunktion: nur als Property setzbar (attribute: false). */
    @property({attribute: false}) validator?: BlnCalendarProps['validator'];

    // Sizing/Styles
    @property() size: BlnCalendarProps['size'] = "medium";
    @property() class: BlnCalendarProps['class'] = "";
    @property({attribute: 'is-valid', reflect: true, converter: booleanStringFalseConverter}) isValid: BlnCalendarProps['isValid'] = undefined;
    @property({attribute: 'retro-design', reflect: true, converter: booleanStringFalseConverter}) retroDesign: BlnCalendarProps['retroDesign'] = false;

    // A11y
    @property({attribute: 'aria-label'}) ariaLabel: BlnCalendarProps['ariaLabel'] = "";
    @property({attribute: 'aria-labelledby'}) ariaLabelledby: BlnCalendarProps['ariaLabelledby'] = "";
    @property({attribute: 'aria-describedby'}) ariaDescribedby: BlnCalendarProps['ariaDescribedby'] = "";

    // Internal state
    @state() private _calendarId = `bln-calendar-${Math.random().toString(36).slice(2)}`;
    @state() private _hintId = `bln-calendar-hint-${Math.random().toString(36).slice(2)}`;
    @state() private _errorId = `bln-calendar-error-${Math.random().toString(36).slice(2)}`;
    @state() private _isValidSet = false;
    @state() private _currentMonth = new Date().getMonth();
    @state() private _currentYear = new Date().getFullYear();
    @state() private _isOpen = false;
    @state() private _focusedDate: Date | null = null;
    @state() private _selectedStartDate: Date | null = null;
    @state() private _selectedEndDate: Date | null = null;

    protected willUpdate(changed: Map<string, any>) {
        if (changed.has('isValid')) this._isValidSet = true;
        if (changed.has('startDate') || changed.has('endDate')) {
            this.updateInternalDates();
            this.runValidation();
        }
    }

    private updateInternalDates() {
        this._selectedStartDate = this.startDate ? this.parseDate(this.startDate) : null;
        this._selectedEndDate = this.endDate ? this.parseDate(this.endDate) : null;
    }

    private parseDate(dateString: string): Date | null {
        if (!dateString) return null;
        
        // Support various date formats
        const formats = [
            /^(\d{2})\.(\d{2})\.(\d{4})$/, // dd.MM.yyyy
            /^(\d{4})-(\d{2})-(\d{2})$/, // yyyy-MM-dd
            /^(\d{2})\/(\d{2})\/(\d{4})$/, // dd/MM/yyyy
        ];
        
        for (const format of formats) {
            const match = dateString.match(format);
            if (match) {
                if (format === formats[0] || format === formats[2]) { // dd.MM.yyyy or dd/MM/yyyy
                    return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
                } else { // yyyy-MM-dd
                    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
                }
            }
        }
        
        // Fallback to Date constructor
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    }

    private formatDate(date: Date): string {
        if (!date) return '';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        switch (this.dateFormat.toLowerCase()) {
            case 'yyyy-mm-dd':
                return `${year}-${month}-${day}`;
            case 'dd/mm/yyyy':
                return `${day}/${month}/${year}`;
            case 'mm/dd/yyyy':
                return `${month}/${day}/${year}`;
            default: // dd.MM.yyyy
                return `${day}.${month}.${year}`;
        }
    }

    private getMonthName(monthIndex: number): string {
        const date = new Date(2000, monthIndex, 1);
        return date.toLocaleDateString(this.locale, { month: 'long' });
    }

    private getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    private getFirstDayOfMonth(year: number, month: number): number {
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday = 0
    }

    private isSameDate(date1: Date | null, date2: Date | null): boolean {
        if (!date1 || !date2) return false;
        return date1.getTime() === date2.getTime();
    }

    private isDateInRange(date: Date): boolean {
        if (!this._selectedStartDate || !this._selectedEndDate) return false;
        const startTime = Math.min(this._selectedStartDate.getTime(), this._selectedEndDate.getTime());
        const endTime = Math.max(this._selectedStartDate.getTime(), this._selectedEndDate.getTime());
        return date.getTime() >= startTime && date.getTime() <= endTime;
    }

    private isDateDisabled(date: Date): boolean {
        if (this.disabled) return true;
        
        if (this.minDate) {
            const minDate = this.parseDate(this.minDate);
            if (minDate && date < minDate) return true;
        }
        
        if (this.maxDate) {
            const maxDate = this.parseDate(this.maxDate);
            if (maxDate && date > maxDate) return true;
        }
        
        return false;
    }

    private handleDateClick = (date: Date) => {
        if (this.isDateDisabled(date) || this.readonly) return;

        if (!this._selectedStartDate || (this._selectedStartDate && this._selectedEndDate)) {
            // Start new selection
            this._selectedStartDate = date;
            this._selectedEndDate = null;
            this.startDate = this.formatDate(date);
            this.endDate = "";
        } else {
            // Complete range selection
            if (date < this._selectedStartDate) {
                this._selectedEndDate = this._selectedStartDate;
                this._selectedStartDate = date;
                this.endDate = this.formatDate(this._selectedEndDate);
                this.startDate = this.formatDate(date);
            } else {
                this._selectedEndDate = date;
                this.endDate = this.formatDate(date);
            }
        }

        this.runValidation();
        this.dispatchEvent(new CustomEvent('date-change', {
            detail: { startDate: this.startDate, endDate: this.endDate },
            bubbles: true,
            composed: true
        }));
    };

    private handleTodayClick = () => {
        if (this.disabled || this.readonly) return;
        
        const today = new Date();
        this._selectedStartDate = today;
        this._selectedEndDate = today;
        this.startDate = this.formatDate(today);
        this.endDate = this.formatDate(today);
        this._currentMonth = today.getMonth();
        this._currentYear = today.getFullYear();
        
        this.runValidation();
        this.dispatchEvent(new CustomEvent('today-click', {
            detail: { startDate: this.startDate, endDate: this.endDate },
            bubbles: true,
            composed: true
        }));
    };

    private handleClearClick = () => {
        if (this.disabled || this.readonly) return;
        
        this._selectedStartDate = null;
        this._selectedEndDate = null;
        this.startDate = "";
        this.endDate = "";
        
        this.runValidation();
        this.dispatchEvent(new CustomEvent('clear-click', {
            detail: { startDate: this.startDate, endDate: this.endDate },
            bubbles: true,
            composed: true
        }));
    };

    private handlePreviousMonth = () => {
        if (this._currentMonth === 0) {
            this._currentMonth = 11;
            this._currentYear--;
        } else {
            this._currentMonth--;
        }
    };

    private handleNextMonth = () => {
        if (this._currentMonth === 11) {
            this._currentMonth = 0;
            this._currentYear++;
        } else {
            this._currentMonth++;
        }
    };

    private handleKeyDown = (e: KeyboardEvent, date: Date) => {
        if (this.disabled) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.handleDateClick(date);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.navigateDate(date, -1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.navigateDate(date, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateDate(date, -7);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateDate(date, 7);
                break;
            case 'Home':
                e.preventDefault();
                this.navigateToDate(new Date(date.getFullYear(), date.getMonth(), 1));
                break;
            case 'End':
                e.preventDefault();
                this.navigateToDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
                break;
        }
    };

    private navigateDate(currentDate: Date, days: number) {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        this.navigateToDate(newDate);
    }

    private navigateToDate(date: Date) {
        if (date.getMonth() !== this._currentMonth || date.getFullYear() !== this._currentYear) {
            this._currentMonth = date.getMonth();
            this._currentYear = date.getFullYear();
        }
        this._focusedDate = date;
        
        this.updateComplete.then(() => {
            const button = this.shadowRoot?.querySelector(`[data-date="${date.getTime()}"]`) as HTMLElement;
            button?.focus();
        });
    }

    private renderCalendarGrid() {
        const daysInMonth = this.getDaysInMonth(this._currentYear, this._currentMonth);
        const firstDay = this.getFirstDayOfMonth(this._currentYear, this._currentMonth);
        const days: (Date | null)[] = [];
        
        // Previous month trailing days
        const prevMonth = this._currentMonth === 0 ? 11 : this._currentMonth - 1;
        const prevYear = this._currentMonth === 0 ? this._currentYear - 1 : this._currentYear;
        const daysInPrevMonth = this.getDaysInMonth(prevYear, prevMonth);
        
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(this._currentYear, this._currentMonth, day));
        }
        
        // Next month leading days
        const totalCells = Math.ceil(days.length / 7) * 7;
        const nextMonth = this._currentMonth === 11 ? 0 : this._currentMonth + 1;
        const nextYear = this._currentMonth === 11 ? this._currentYear + 1 : this._currentYear;
        
        for (let day = 1; days.length < totalCells; day++) {
            days.push(new Date(nextYear, nextMonth, day));
        }

        const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

        return html`
            <!-- Day headers -->
            <div class="grid grid-cols-7 gap-1 mb-2">
                ${dayLabels.map(label => html`
                    <div class="text-center text-xs font-medium text-gray-500 p-2">${label}</div>
                `)}
            </div>
            
            <!-- Calendar days -->
            <div class="grid grid-cols-7 gap-1">
                ${days.map(date => {
                    if (!date) return html`<div></div>`;
                    
                    const isCurrentMonth = date.getMonth() === this._currentMonth;
                    const isToday = this.isSameDate(date, new Date());
                    const isStartDate = this.isSameDate(date, this._selectedStartDate);
                    const isEndDate = this.isSameDate(date, this._selectedEndDate);
                    const isInRange = this.isDateInRange(date);
                    const isDisabled = this.isDateDisabled(date);
                    
                    return html`
                        <button
                            type="button"
                            data-date="${date.getTime()}"
                            ?disabled="${isDisabled}"
                            tabindex="${this.isSameDate(date, this._focusedDate) ? '0' : '-1'}"
                            class="${this.cn(
                                'p-2 text-sm rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                                'transition-all duration-150',
                                !isCurrentMonth ? 'text-gray-300' : 'text-gray-900',
                                isToday ? 'font-bold' : '',
                                isStartDate || isEndDate ? 'bg-blue-600 text-white' : '',
                                isInRange && !isStartDate && !isEndDate ? 'bg-blue-100 text-blue-900' : '',
                                !isDisabled && isCurrentMonth && !isStartDate && !isEndDate && !isInRange ? 'hover:bg-gray-100' : '',
                                isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                            )}"
                            @click="${() => this.handleDateClick(date)}"
                            @keydown="${(e: KeyboardEvent) => this.handleKeyDown(e, date)}"
                            aria-label="${date.toLocaleDateString(this.locale)}"
                            aria-selected="${isStartDate || isEndDate ? 'true' : 'false'}"
                        >
                            ${date.getDate()}
                        </button>
                    `;
                })}
            </div>
        `;
    }

    protected render() {
        const describedBy = [
            this.ariaDescribedby || '',
            this.hint ? this._hintId : '',
            this.error ? this._errorId : ''
        ].filter(Boolean).join(' ') || undefined;

        const hasValue = this.startDate || this.endDate;
        const invalid = this._isValidSet && hasValue ? !this.isValid : undefined;

        return html`
            <div class="max-w-md">
                ${this.label || this.cornerHint ? html`
                    <div class="flex flex-wrap justify-between items-center gap-2">
                        ${this.label ? html`<label for="${this._calendarId}" class="${this.cn(
                            this.retroDesign ? ['font-bold text-black'] : ['text-sm font-medium text-gray-700'],
                            ['block mb-2']
                        )}">${this.label}</label>` : ''}
                        ${this.cornerHint ? html`<span class="block mb-2 text-sm text-gray-500 dark:text-neutral-500">${this.cornerHint}</span>` : ''}
                    </div>` : ''}

                <div class="relative">
                    <!-- Selected dates display -->
                    <div
                        id="${this._calendarId}"
                        class="${this.cn(
                            'w-full p-3 border-2 rounded-md bg-white',
                            'focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600',
                            this.size === 'small' ? ['p-2 text-sm'] : '',
                            this.size === 'large' ? ['p-4 text-lg'] : '',
                            hasValue ? ['border-gray-200'] : ['border-black'],
                            invalid === false ? ['border-teal-500'] : '',
                            invalid === true ? ['border-red-500'] : '',
                            this.disabled ? ['opacity-50 pointer-events-none bg-gray-50'] : '',
                            this.class
                        )}"
                        aria-describedby="${describedBy || nothing}"
                        aria-label="${this.ariaLabel || 'Datumsbereich auswählen'}"
                        aria-invalid="${invalid === undefined ? 'false' : String(invalid)}"
                    >
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-4">
                                <div class="text-sm">
                                    <span class="font-medium">Von:</span> 
                                    <span class="${!this.startDate ? 'text-gray-400' : ''}">${this.startDate || 'Nicht ausgewählt'}</span>
                                </div>
                                <div class="text-sm">
                                    <span class="font-medium">Bis:</span> 
                                    <span class="${!this.endDate ? 'text-gray-400' : ''}">${this.endDate || 'Nicht ausgewählt'}</span>
                                </div>
                            </div>
                            <div class="flex space-x-1">
                                ${this.showTodayButton ? html`
                                    <button
                                        type="button"
                                        @click="${this.handleTodayClick}"
                                        ?disabled="${this.disabled || this.readonly}"
                                        class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Heute auswählen"
                                    >
                                        <lucide-icon name="Calendar" cls="w-3 h-3"></lucide-icon>
                                    </button>
                                ` : ''}
                                ${this.showClearButton ? html`
                                    <button
                                        type="button"
                                        @click="${this.handleClearClick}"
                                        ?disabled="${this.disabled || this.readonly || (!this.startDate && !this.endDate)}"
                                        class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Auswahl löschen"
                                    >
                                        <lucide-icon name="X" cls="w-3 h-3"></lucide-icon>
                                    </button>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Calendar navigation -->
                        <div class="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                @click="${this.handlePreviousMonth}"
                                ?disabled="${this.disabled}"
                                class="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Vorheriger Monat"
                            >
                                <lucide-icon name="ChevronLeft" cls="w-5 h-5"></lucide-icon>
                            </button>
                            
                            <h3 class="text-lg font-semibold">
                                ${this.getMonthName(this._currentMonth)} ${this._currentYear}
                            </h3>
                            
                            <button
                                type="button"
                                @click="${this.handleNextMonth}"
                                ?disabled="${this.disabled}"
                                class="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Nächster Monat"
                            >
                                <lucide-icon name="ChevronRight" cls="w-5 h-5"></lucide-icon>
                            </button>
                        </div>

                        <!-- Calendar grid -->
                        <div role="grid" aria-label="Kalender" tabindex="0">
                            ${this.renderCalendarGrid()}
                        </div>
                    </div>

                    <!-- Validation icons -->
                    <div class="absolute top-3 right-3 flex items-center pointer-events-none">
                        ${invalid === false
                            ? html`<lucide-icon name="Check" cls="text-teal-500"></lucide-icon>`
                            : nothing}
                        ${invalid === true
                            ? html`<lucide-icon name="CircleAlert" cls="text-red-500"></lucide-icon>`
                            : nothing}
                    </div>
                </div>

                ${this.hint ? html`<p id="${this._hintId}" class="mt-2 text-sm text-gray-500">${this.hint}</p>` : ''}
                ${this.error ? html`<span id="${this._errorId}" class="mt-1 text-sm text-red-600" role="alert" aria-live="polite">${this.error}</span>` : ''}
            </div>
        `;
    }

    private runValidation() {
        if (!this.validator) return;
        
        const startDate = this.startDate || '';
        const endDate = this.endDate || '';
        
        // Neutral state for empty unless validator explicitly handles it
        if (!startDate && !endDate) {
            this.isValid = undefined as any;
            this.error = '' as any;
            return;
        }
        
        try {
            const res = this.validator(startDate, endDate, this as any);
            const result = typeof res === 'boolean' ? { valid: res } : res ?? { valid: true };
            this.isValid = result.valid as any;
            this.error = (!result.valid && result.message) ? result.message : (!result.valid ? (this.error || '') : '');
            this._isValidSet = true;
            this.dispatchEvent(new CustomEvent('validitychange', { 
                detail: { isValid: this.isValid, message: this.error, startDate, endDate }, 
                bubbles: true, 
                composed: true 
            }));
        } catch (e) {
            this.isValid = false as any;
            this.error = this.error || 'Ungültiger Datumsbereich';
            this._isValidSet = true;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateInternalDates();
        if (this._selectedStartDate) {
            this._currentMonth = this._selectedStartDate.getMonth();
            this._currentYear = this._selectedStartDate.getFullYear();
            this._focusedDate = this._selectedStartDate;
        } else {
            this._focusedDate = new Date();
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'bln-calendar': BlnCalendar;
    }
}

const nothing = undefined;