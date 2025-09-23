import "./BlnFooter";
import { html } from "lit";
const meta = {
    title: 'Navigation/Footer',
    tags: ['autodocs'],
    render: (args) => html `
        <bln-footer .title=${args.title} .subTitle=${args.subTitle} .links=${args.links}></bln-footer>
        <div style="height: 50vh;"></div>`,
    argTypes: {
        title: { description: 'Footer title', type: { name: 'string' } },
        subTitle: { description: 'Footer subtitle', type: { name: 'string' } },
        links: { description: 'Footer links', control: 'object' },
    },
    args: {
        title: 'Das offizielle Hauptstadtportal',
        subTitle: 'Berlin.de',
        links: [
            { title: 'Impressum', url: '#' },
            { title: 'Datenschutz', url: '#' },
        ],
    },
};
export default meta;
export const Default = {};
