import type {Meta, StoryObj} from '@storybook/web-components-vite';

import "./ModernTree";
import {ModernTree, ModernTreeProps} from "./ModernTree";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';
import {v4 as uuidv4} from 'uuid';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Modern Components/ModernTree',
    tags: ['autodocs'],
    render: (args: ModernTreeProps) => {
        let tree: ModernTree = document.createElement('modern-tree') as ModernTree;
        tree.setLevelConverter((lvl)=> parseInt(lvl) );
        tree.setDataModel(
            {
                id:uuidv4(),
                subTitle:'Root subtitle',
                title:'Root Node',
                level:"0",
                hasChildren: true,
                children:[]
            });
        // Simulate lazy loading: listen for request and provide children
        tree.addEventListener('tree.request-children', (ev:any) => {
            ev = ev as {detail: {id:string,level:string}}
            const parentId = ev.detail.id;
            // Normally you'd call an API here; we'll simulate async fetch
            setTimeout(() => {
                const children = [
                    { id: uuidv4(), subTitle: 'child A', title: 'Child A', level: (parseInt(ev.detail.level)+1).toString(), hasChildren: true, children: [] },
                    { id: uuidv4(), subTitle: 'child B', title: 'Child B', level: (parseInt(ev.detail.level)+1).toString(), hasChildren: false, children: [] }
                ];
                tree.addChildren(parentId, children);
            }, 300);
        });
        return tree
    },
    argTypes: {
    },
    args: {
    },
} satisfies Meta<ModernTree>;

export default meta;
type Story = StoryObj<ModernTree>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultIcon: Story = {};