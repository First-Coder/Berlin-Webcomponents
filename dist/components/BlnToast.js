var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property, state } from 'lit/decorators.js';
import { html } from 'lit';
import TailwindElement from '../app/TailwindElement';
import { booleanStringFalseConverter } from '../utils/converters';
import './LucideIcon';
let BlnToast = class BlnToast extends TailwindElement {
    constructor() {
        super(...arguments);
        // state/behavior
        this.open = false;
        this.variant = 'info';
        this.autoHide = true;
        this.autoHideDelay = 4000;
        this.closeButton = true;
        // visuals/content
        this.title = '';
        this.message = '';
        this.class = '';
        // a11y
        this.ariaLive = 'polite';
        this.ariaAtomicBool = true;
        // inherited style flag
        this.retroDesign = false;
    }
    clearTimer() {
        if (this._hideTimer) {
            window.clearTimeout(this._hideTimer);
            this._hideTimer = undefined;
        }
    }
    updated(changed) {
        if (changed.has('open') || changed.has('autoHide') || changed.has('autoHideDelay')) {
            this.clearTimer();
            if (this.open && this.autoHide) {
                this._hideTimer = window.setTimeout(() => {
                    this.close();
                }, Math.max(1000, this.autoHideDelay));
            }
        }
    }
    show() {
        if (!this.open) {
            this.open = true;
            this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
        }
    }
    close() {
        if (this.open) {
            this.open = false;
            this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
        }
    }
    iconName() {
        switch (this.variant) {
            case 'success':
                return 'CheckCircle2';
            case 'warning':
                return 'AlertTriangle';
            case 'error':
                return 'CircleAlert';
            default:
                return 'Info';
        }
    }
    render() {
        const colors = this.retroDesign
            ? {
                base: 'border-2 border-black bg-white',
                text: 'text-black',
                accent: this.variant === 'error' ? 'bg-police-red' : this.variant === 'warning' ? 'bg-yellow-400' : this.variant === 'success' ? 'bg-green-600' : 'bg-black',
            }
            : {
                base: 'rounded-md shadow-lg ring-1 ring-black/5 bg-white',
                text: 'text-gray-900',
                accent: this.variant === 'error' ? 'bg-red-600' : this.variant === 'warning' ? 'bg-yellow-500' : this.variant === 'success' ? 'bg-green-600' : 'bg-blue-600',
            };
        return html `
      <div
        role="status"
        aria-live="${this.ariaLive}"
        aria-atomic="${String(this.ariaAtomicBool)}"
        class="${this.cn('pointer-events-auto max-w-sm w-full transition-opacity duration-300', this.open ? 'opacity-100' : 'opacity-0 pointer-events-none', colors.base, this.class)}"
      >
        <div class="flex items-start gap-3 p-4">
          <div class="flex-shrink-0 ${colors.accent} rounded-full p-2">
            <lucide-icon name="${this.iconName()}" cls="w-5 h-5 text-white"></lucide-icon>
          </div>
          <div class="flex-1 ${colors.text}">
            ${this.title ? html `<div class="font-semibold">${this.title}</div>` : ''}
            <div class="text-sm"><slot>${this.message}</slot></div>
          </div>
          ${this.closeButton
            ? html `<button
                class="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 ${this.retroDesign ? 'border-2 border-black px-2' : ''}"
                aria-label="Schließen"
                @click=${() => this.close()}
              >
                <lucide-icon name="X" cls="w-4 h-4"></lucide-icon>
              </button>`
            : ''}
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ reflect: true, converter: booleanStringFalseConverter })
], BlnToast.prototype, "open", void 0);
__decorate([
    property()
], BlnToast.prototype, "variant", void 0);
__decorate([
    property({ attribute: 'auto-hide', converter: booleanStringFalseConverter })
], BlnToast.prototype, "autoHide", void 0);
__decorate([
    property({ attribute: 'auto-hide-delay', type: Number })
], BlnToast.prototype, "autoHideDelay", void 0);
__decorate([
    property({ attribute: 'close-button', converter: booleanStringFalseConverter })
], BlnToast.prototype, "closeButton", void 0);
__decorate([
    property()
], BlnToast.prototype, "title", void 0);
__decorate([
    property()
], BlnToast.prototype, "message", void 0);
__decorate([
    property()
], BlnToast.prototype, "class", void 0);
__decorate([
    property({ attribute: 'aria-live' })
], BlnToast.prototype, "ariaLive", void 0);
__decorate([
    property({ attribute: 'aria-atomic', converter: booleanStringFalseConverter })
], BlnToast.prototype, "ariaAtomicBool", void 0);
__decorate([
    property({ attribute: 'retro-design', converter: booleanStringFalseConverter })
], BlnToast.prototype, "retroDesign", void 0);
__decorate([
    state()
], BlnToast.prototype, "_hideTimer", void 0);
BlnToast = __decorate([
    customElement('bln-toast')
], BlnToast);
export { BlnToast };
