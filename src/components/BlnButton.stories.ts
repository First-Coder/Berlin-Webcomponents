import type {Meta, StoryObj} from '@storybook/web-components-vite';

import {fn} from 'storybook/test';

import "./BlnButton";
import type {BlnButtonProps} from "./BlnButton";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Base Components/Button',
    tags: ['autodocs'],
    render: (args: BlnButtonProps) => html`
        <bln-button
                size=${args.size ?? 'medium'}
                variant=${args.variant ?? 'primary'}
                class-names=${ifDefined(args.class)}
                ?with-arrow=${ifDefined(args.withArrow)}
                ?disabled=${args.disabled === true}
                ?with-stripes=${ifDefined(args.withStripes)}
                ${args.withArrow ? 'with-arrow' : ''}
                retro-design=${ifDefined(args.retroDesign)}
                loading=${ifDefined(args.loading)}
                .onClick=${args.onClick}
        >${ifDefined(args.label)}
            ${args.leading
                    ? html`<lucide-icon slot="leading" name="ChevronLeft" cls="ml-2 w-4 h-4"></lucide-icon>`
                    : ''}
            ${args.trailing
                    ? html`<lucide-icon slot="trailing" name="ChevronRight" cls="mr-2 w-4 h-4"></lucide-icon>`
                    : ''}
        </bln-button>`,
    argTypes: {
        disabled: {control: 'boolean', description: 'Disabled state of the button', type: {name: 'boolean'}},
        class: {description: 'Additional CSS classes to apply to the button', type: {name: 'string'}},
        withArrow: {control: 'boolean', description: 'Whether to show an arrow icon', type: {name: 'boolean'}},
        withStripes: {control: 'boolean', description: 'Whether to show stripes', type: {name: 'boolean'}},
        loading: {control: 'boolean', description: 'Whether the button is in loading state', type: {name: 'boolean'}},
        retroDesign: {control: 'boolean', description: 'Whether to use the retro design', type: {name: 'boolean'}},
        variant: {
            description: 'Variant of the button',
            type: {name: 'string'},
            control: {type: 'select'},
            options: ['solid', 'link', 'outline', 'ghost', 'soft'],
        },
        size: {
            description: 'Size of the button',
            type: {name: 'string'},
            control: {type: 'select'},
            options: ['small', 'medium', 'large'],
        },
    },
    args: {label: 'Button', onClick: fn()},
} satisfies Meta<BlnButtonProps>;

export default meta;
type Story = StoryObj<BlnButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Solid: Story = {
    args: {
        variant: 'solid',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
    },
};

export const Soft: Story = {
    args: {
        variant: 'soft',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
    },
};

export const Arrow: Story = {
    args: {
        variant: 'arrow',
    },
};

export const ArrowRed: Story = {
    args: {
        variant: 'arrow-red',
    },
};

export const LoadingButton: Story = {
    args: {
        variant: 'solid',
        loading: true,
    }
};

export const LoadingButtonSmall: Story = {
    args: {
        variant: 'solid',
        loading: true,
        size: 'small'
    }
};

export const LoadingButtonOutline: Story = {
    args: {
        variant: 'outline',
        loading: true,
    }
};

export const LoadingButtonGhost: Story = {
    args: {
        variant: 'ghost',
        loading: true,
    }
};

export const LoadingButtonSoft: Story = {
    args: {
        variant: 'soft',
        loading: true,
    }
};

export const LeadingButton: Story = {
    args: {
        variant: 'solid',
        leading: true,
    }
};

export const TrailingButton: Story = {
    args: {
        variant: 'solid',
        trailing: true,
    }
};

export const Retro: Story = {
    args: {
        retroDesign: true,
    },
};

export const RetroLink: Story = {
    args: {
        variant: 'link',
        retroDesign: true,
    },
};

export const RetroArrow: Story = {
    args: {
        variant: 'arrow',
        retroDesign: true,
    },
};

export const RetroArrowRed: Story = {
    args: {
        variant: 'arrow-red',
        retroDesign: true,
    },
};

export const Stripes: Story = {
    args: {
        withStripes: true,
        variant: 'solid',
        retroDesign: true,
        size: 'small'
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const DisabledRetro: Story = {
    args: {
        disabled: true,
        retroDesign: true,
    },
};