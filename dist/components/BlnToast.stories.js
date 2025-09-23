import './BlnToast';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
const meta = {
    title: 'Feedback/Toast',
    tags: ['autodocs'],
    render: (args) => html `
    <div class="fixed inset-0 pointer-events-none flex items-start justify-end p-4">
      <bln-toast
        ?open=${args.open}
        variant=${args.variant}
        title=${ifDefined(args.title)}
        auto-hide=${ifDefined(args.autoHide)}
        auto-hide-delay=${ifDefined(args.autoHideDelay)}
        close-button=${ifDefined(args.closeButton)}
        aria-live=${args.ariaLive}
        aria-atomic=${ifDefined(args.ariaAtomic)}
        retro-design=${ifDefined(args.retroDesign)}
      >${ifDefined(args.message)}</bln-toast>
    </div>
  `,
    argTypes: {
        variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
        open: { control: 'boolean' },
        autoHide: { control: 'boolean' },
        autoHideDelay: { control: 'number' },
        closeButton: { control: 'boolean' },
        ariaLive: { control: 'select', options: ['polite', 'assertive', 'off'] },
        ariaAtomic: { control: 'boolean' },
        retroDesign: { control: 'boolean' },
    },
    args: {
        open: true,
        variant: 'info',
        title: 'Hinweis',
        message: 'Das ist eine Meldung.',
        autoHide: true,
        autoHideDelay: 4000,
        closeButton: true,
        ariaLive: 'polite',
        ariaAtomic: true,
        retroDesign: false,
    }
};
export default meta;
export const Info = { args: { variant: 'info' } };
export const Success = { args: { variant: 'success' } };
export const Warning = { args: { variant: 'warning' } };
export const Error = { args: { variant: 'error' } };
export const Retro = { args: { retroDesign: true } };
