import { fn } from 'storybook/test';
import "./BlnButton";
import { html } from "lit";
import { ifDefined } from 'lit/directives/if-defined.js';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Base Components/Button',
    tags: ['autodocs'],
    render: (args) => html `
        <bln-button
                size=${args.size ?? 'medium'}
                variant=${args.variant ?? 'primary'}
                class-names=${ifDefined(args.class)}
                ?disabled=${args.disabled === true}
                ?with-stripes=${ifDefined(args.withStripes)}
                retro-design=${ifDefined(args.retroDesign)}
                loading=${ifDefined(args.loading)}
                .onClick=${args.onClick}
        >${ifDefined(args.label)}
            ${args.leading
        ? html `<lucide-icon slot="leading" name="ChevronLeft" cls="ml-2 w-4 h-4"></lucide-icon>`
        : ''}
            ${args.trailing
        ? html `<lucide-icon slot="trailing" name="ChevronRight" cls="mr-2 w-4 h-4"></lucide-icon>`
        : ''}
        </bln-button>`,
    argTypes: {
        disabled: { control: 'boolean', description: 'Disabled state of the button', type: { name: 'boolean' } },
        class: { description: 'Additional CSS classes to apply to the button', type: { name: 'string' } },
        withStripes: { control: 'boolean', description: 'Whether to show stripes', type: { name: 'boolean' } },
        loading: { control: 'boolean', description: 'Whether the button is in loading state', type: { name: 'boolean' } },
        retroDesign: { control: 'boolean', description: 'Whether to use the retro design', type: { name: 'boolean' } },
        variant: {
            description: 'Variant of the button',
            type: { name: 'string' },
            control: { type: 'select' },
            options: ['solid', 'link', 'outline', 'ghost', 'soft', 'arrow', 'arrow-red'],
        },
        size: {
            description: 'Size of the button',
            type: { name: 'string' },
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
    },
    args: { label: 'Button', onClick: fn() },
};
export default meta;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Solid = {
    args: {
        variant: 'solid',
    },
};
export const Outline = {
    args: {
        variant: 'outline',
    },
};
export const Ghost = {
    args: {
        variant: 'ghost',
    },
};
export const Soft = {
    args: {
        variant: 'soft',
    },
};
export const Link = {
    args: {
        variant: 'link',
    },
};
export const Arrow = {
    args: {
        variant: 'arrow',
    },
};
export const ArrowRed = {
    args: {
        variant: 'arrow-red',
    },
};
export const LoadingButton = {
    args: {
        variant: 'solid',
        loading: true,
    }
};
export const LoadingButtonSmall = {
    args: {
        variant: 'solid',
        loading: true,
        size: 'small'
    }
};
export const LoadingButtonOutline = {
    args: {
        variant: 'outline',
        loading: true,
    }
};
export const LoadingButtonGhost = {
    args: {
        variant: 'ghost',
        loading: true,
    }
};
export const LoadingButtonSoft = {
    args: {
        variant: 'soft',
        loading: true,
    }
};
export const LeadingButton = {
    args: {
        variant: 'solid',
        leading: true,
    }
};
export const TrailingButton = {
    args: {
        variant: 'solid',
        trailing: true,
    }
};
export const Retro = {
    args: {
        retroDesign: true,
    },
};
export const RetroLink = {
    args: {
        variant: 'link',
        retroDesign: true,
    },
};
export const RetroArrow = {
    args: {
        variant: 'arrow',
        retroDesign: true,
    },
};
export const RetroArrowRed = {
    args: {
        variant: 'arrow-red',
        retroDesign: true,
    },
};
export const Stripes = {
    args: {
        withStripes: true,
        variant: 'solid',
        retroDesign: true,
        size: 'small'
    },
};
export const Disabled = {
    args: {
        disabled: true,
    },
};
export const DisabledRetro = {
    args: {
        disabled: true,
        retroDesign: true,
    },
};
