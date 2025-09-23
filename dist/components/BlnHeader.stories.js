import "./BlnHeader";
import { html } from "lit";
const meta = {
    title: 'Navigation/Header',
    tags: ['autodocs'],
    render: (args) => html `
        <bln-header></bln-header>
        <div style="height: 50vh;"></div>`,
    argTypes: {
        logoUrl: { description: 'Logo URL', type: { name: 'string' } },
    },
    args: {},
};
export default meta;
export const Default = {};
