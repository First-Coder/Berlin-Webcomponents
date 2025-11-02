import type {Meta, StoryObj} from '@storybook/web-components-vite';
import {html} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';

import './BlnGrid';
import type {BlnGridProps} from './BlnGrid';
import {satisfies} from "storybook/internal/common";

const meta = {
    title: 'Base Components/Grid',
    tags: ['autodocs'],
    // genau wie bei deinem Button: eine render-Funktion,
    // die die Lit-Component direkt aus args baut
    render: (args: BlnGridProps) => html`
        <bln-grid
                .columns=${args.columns}
                .smColumns=${args.smColumns ?? 0}
                .mdColumns=${args.mdColumns ?? 0}
                .lgColumns=${args.lgColumns ?? 0}
                .gap=${args.gap ?? 'md'}
                .asList=${args.asList ?? false}
                aria-label=${ifDefined(args.ariaLabelText ?? undefined)}
                aria-describedby=${ifDefined(args.ariaDescribedById ?? undefined)}
                class=${ifDefined(args.class)}
                style="min-height: 40vh;"
        >
            <!-- Header -->
            <div slot="header" class="flex items-center justify-between gap-3">
                <h2 class="text-lg font-semibold">BlnGrid Demo</h2>
                <bln-button variant="outline" size="small">
                    <lucide-icon slot="leading" name="Filter" cls="w-4 h-4"></lucide-icon>
                    Filter
                </bln-button>
            </div>

            <!-- Beispiel-Items -->
            <article class="border rounded-lg p-4 bg-white shadow-sm">Item 1</article>
            <article class="border rounded-lg p-4 bg-white shadow-sm">Item 2</article>
            <article class="border rounded-lg p-4 bg-white shadow-sm">Item 3</article>
            <article class="border rounded-lg p-4 bg-white shadow-sm">Item 4</article>
            <article class="border rounded-lg p-4 bg-white shadow-sm">Item 5</article>
            <article class="border rounded-lg p-4 bg-white shadow-sm">Item 6</article>

            <!-- Footer -->
            <div slot="footer" class="flex justify-center mt-2">
                <bln-button variant="ghost" size="small">
                    <lucide-icon slot="leading" name="ChevronDown" cls="w-4 h-4"></lucide-icon>
                    Mehr laden
                </bln-button>
            </div>
        </bln-grid>
    `,
    argTypes: {
        columns: {
            control: {type: 'number', min: 1, max: 6},
            description: 'Basis-Spaltenanzahl',
        },
        smColumns: {
            control: {type: 'number', min: 0, max: 6},
            name: 'sm-columns',
            description: 'Spalten ab sm:',
        },
        mdColumns: {
            control: {type: 'number', min: 0, max: 6},
            name: 'md-columns',
            description: 'Spalten ab md:',
        },
        lgColumns: {
            control: {type: 'number', min: 0, max: 6},
            name: 'lg-columns',
            description: 'Spalten ab lg:',
        },
        gap: {
            control: {type: 'select'},
            options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
            description: 'Abstand zwischen den Items',
        },
        asList: {
            control: 'boolean',
            description: 'Listendarstellung (role=list) statt Grid (role=grid)',
        },
        ariaLabelText: {
            control: 'text',
            name: 'aria-label',
            description: 'Accessible Name für das Grid',
        },
        ariaDescribedById: {
            control: 'text',
            name: 'aria-describedby',
            description: 'ID eines Elements, das das Grid beschreibt',
        },
        class: {
            control: 'text',
            description: 'Zusätzliche CSS-Klassen',
        },
    },
    args: {
        columns: 2,
        smColumns: 2,
        mdColumns: 3,
        lgColumns: 4,
        gap: 'md',
        asList: false,
        ariaLabelText: 'Beispiel-Grid',
    },
}satisfies Meta<BlnGridProps>;

export default meta;
type Story = StoryObj<BlnGridProps>;

export const Default: Story = {};

export const TwoColumns: Story = {
    args: {
        columns: 2,
        smColumns: 2,
        mdColumns: 2,
        lgColumns: 2,
    },
};

export const FourColumnsDesktop: Story = {
    args: {
        columns: 1,
        smColumns: 2,
        mdColumns: 3,
        lgColumns: 4,
        gap: 'lg',
    },
};

export const AsList: Story = {
    args: {
        asList: true,
        columns: 1,
        smColumns: 1,
        mdColumns: 1,
        lgColumns: 1,
        ariaLabelText: 'Letzte Aktivitäten',
    },
    render: (args) => html`
        <bln-grid
                .columns=${args.columns}
                .smColumns=${args.smColumns ?? 0}
                .mdColumns=${args.mdColumns ?? 0}
                .lgColumns=${args.lgColumns ?? 0}
                .gap=${args.gap ?? 'sm'}
                .asList=${true}
                aria-label=${ifDefined(args.ariaLabelText ?? undefined)}
                style="max-width: 540px;"
        >
            <div slot="header" class="mb-2">
                <h2 class="text-lg font-semibold">Letzte Aktivitäten</h2>
            </div>
            ${['Login', 'Passwort geändert', 'Dokument hochgeladen', 'Rolle geändert'].map(
        (entry) => html`
                        <div class="flex items-center justify-between px-4 py-3 bg-white rounded-md border">
                            <span>${entry}</span>
                            <span class="text-xs text-gray-500">jetzt</span>
                        </div>
                    `
    )}
        </bln-grid>
    `,
};

export const WithImages: Story = {
    args: {
        columns: 2,
        mdColumns: 3,
        lgColumns: 4,
        gap: 'lg',
        ariaLabelText: 'Bildübersicht',
    },
    render: (args) => html`
        <bln-grid
                .columns=${args.columns}
                .smColumns=${args.smColumns ?? 0}
                .mdColumns=${args.mdColumns ?? 0}
                .lgColumns=${args.lgColumns ?? 0}
                .gap=${args.gap ?? 'lg'}
                aria-label=${ifDefined(args.ariaLabelText ?? undefined)}
        >
            ${[1, 2, 3, 4, 5, 6].map(
        (n) => html`
                        <figure class="bg-white rounded-lg overflow-hidden shadow-sm border">
                            <img
                                    src="https://placehold.co/400x240?text=Image+${n}"
                                    alt="Beispielbild ${n}"
                                    class="w-full h-40 object-cover"
                            />
                            <figcaption class="p-3 text-sm">
                                Bild ${n}
                            </figcaption>
                        </figure>
                    `
    )}
        </bln-grid>
    `,
};

export const Empty: Story = {
    args: {
        columns: 3,
        gap: 'md',
        ariaLabelText: 'Leeres Grid',
    },
    render: (args) => html`
        <bln-grid
                .columns=${args.columns}
                .gap=${args.gap ?? 'md'}
                aria-label=${ifDefined(args.ariaLabelText ?? undefined)}
                style="min-height: 200px;"
        >
            <div slot="header" class="mb-2">
                <h2 class="text-lg font-semibold">Keine Einträge vorhanden</h2>
            </div>
            <div slot="footer" class="flex justify-center mt-4">
                <bln-button variant="solid" size="small">
                    Eintrag hinzufügen
                </bln-button>
            </div>
        </bln-grid>
    `,
};
