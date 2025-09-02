import type {Meta, StoryObj} from '@storybook/web-components-vite';

import "./ModernTree";
import {ModernTree, ModernTreeProps} from "./ModernTree";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Modern Components/ModernTree',
    tags: ['autodocs'],
    render: (args: ModernTreeProps) => {
        let tree: ModernTree = document.createElement('modern-tree') as ModernTree;
        tree.setLevelConverter((lvl)=> parseInt(lvl) );
        tree.setDataModel(
            {
                id:'1',
                subTitle:'test',
                title:'First Node',
                level:"0",
                hasChildren: true,
                children:[
                    {
                        id:'2',
                        subTitle:'test',
                        title:'Second Node',
                        level:"1",
                        hasChildren: true,
                        children:[
                            {
                                id:'3',
                                subTitle:'test',
                                title:'Third Node',
                                level:"2",
                                hasChildren: false,
                                children:[]
                            }]
                    }]
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