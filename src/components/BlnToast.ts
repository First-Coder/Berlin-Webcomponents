import {customElement, property, state} from 'lit/decorators.js';
import {html} from 'lit';
import TailwindElement from '../app/TailwindElement';
import {booleanStringFalseConverter} from '../utils/converters';
import './LucideIcon';

export interface BlnToastProps {
  open: boolean;
  variant: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  autoHide: boolean;
  autoHideDelay: number; // ms
  closeButton: boolean;
  ariaLive: 'polite' | 'assertive' | 'off';
  ariaAtomic: boolean;
  class: string;
  retroDesign: boolean;
}

@customElement('bln-toast')
export class BlnToast extends TailwindElement {
  // state/behavior
  @property({reflect: true, converter: booleanStringFalseConverter}) open: BlnToastProps['open'] = false;
  @property() variant: BlnToastProps['variant'] = 'info';
  @property({attribute: 'auto-hide', converter: booleanStringFalseConverter}) autoHide: BlnToastProps['autoHide'] = true;
  @property({attribute: 'auto-hide-delay', type: Number}) autoHideDelay: BlnToastProps['autoHideDelay'] = 4000;
  @property({attribute: 'close-button', converter: booleanStringFalseConverter}) closeButton: BlnToastProps['closeButton'] = true;

  // visuals/content
  @property() title: BlnToastProps['title'] = '';
  @property() message: BlnToastProps['message'] = '';
  @property() class: BlnToastProps['class'] = '';

  // a11y
  @property({attribute: 'aria-live'}) ariaLive: BlnToastProps['ariaLive'] = 'polite';
  @property({attribute: 'aria-atomic', converter: booleanStringFalseConverter}) ariaAtomicBool: BlnToastProps['ariaAtomic'] = true;

  // inherited style flag
  @property({attribute: 'retro-design', converter: booleanStringFalseConverter}) override retroDesign = false;

  @state() private _hideTimer: number | undefined;

  private clearTimer() {
    if (this._hideTimer) {
      window.clearTimeout(this._hideTimer);
      this._hideTimer = undefined;
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('open') || changed.has('autoHide') || changed.has('autoHideDelay')) {
      this.clearTimer();
      if (this.open && this.autoHide) {
        this._hideTimer = window.setTimeout(() => {
          this.close();
        }, Math.max(1000, this.autoHideDelay));
      }
    }
  }

  public show() {
    if (!this.open) {
      this.open = true;
      this.dispatchEvent(new CustomEvent('open', {bubbles: true, composed: true}));
    }
  }

  public close() {
    if (this.open) {
      this.open = false;
      this.dispatchEvent(new CustomEvent('close', {bubbles: true, composed: true}));
    }
  }

  private iconName() {
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

  protected render() {
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

    return html`
      <div
        role="status"
        aria-live="${this.ariaLive}"
        aria-atomic="${String(this.ariaAtomicBool)}"
        class="${this.cn(
          'pointer-events-auto max-w-sm w-full transition-opacity duration-300',
          this.open ? 'opacity-100' : 'opacity-0 pointer-events-none',
          colors.base,
          this.class
        )}"
      >
        <div class="flex items-start gap-3 p-4">
          <div class="flex-shrink-0 ${colors.accent} rounded-full p-2">
            <lucide-icon name="${this.iconName()}" cls="w-5 h-5 text-white"></lucide-icon>
          </div>
          <div class="flex-1 ${colors.text}">
            ${this.title ? html`<div class="font-semibold">${this.title}</div>` : ''}
            <div class="text-sm"><slot>${this.message}</slot></div>
          </div>
          ${this.closeButton
            ? html`<button
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
}
