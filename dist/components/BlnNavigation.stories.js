import { html } from 'lit';
import './BlnNavigation';
export default {
    title: 'Navigation/BlnNavigation',
    tags: ['autodocs'],
    render: (args) => html `
    <bln-navigation
      title="${args.title}"
      icon="${args.icon}"
      ?collapsed=${args.collapsed}
      class="${args.class ?? ''}"
    >
      <li><a class="px-4 py-2 hover:bg-gray-100" href="#">Start</a></li>
      <li><a class="px-4 py-2 hover:bg-gray-100" href="#">Themen</a></li>
      <li><button class="text-left w-full px-4 py-2 hover:bg-gray-100">Aktion</button></li>
    </bln-navigation>
  `,
    args: {
        title: 'Navigation',
        icon: 'Menu',
        collapsed: false,
    }
};
export const Default = {};
