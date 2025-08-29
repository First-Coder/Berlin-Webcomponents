import type {Meta, StoryObj} from '@storybook/web-components-vite';

import "./TreeView";
import type {TreeNode} from "./TreeView";

import {html} from "lit";
import {ifDefined} from 'lit/directives/if-defined.js';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Example/TreeView',
    tags: ['autodocs'],
    render: (args: TreeNode) => html`
            <button onclick="(()=>{ 
                document.querySelector('tree-view').setNodes([
                    {
                        label:'test',
                        expanded:true, 
                        children:[{
                            label: 'test 1',
                            expanded:true,
                            children:[{
                                label: 'test 1.1',
                                expanded:true,
                                children:[{
                                    label: 'test 1.1.1',
                                    expanded:false,
                                }]
                            }]
                        },
                        {
                            label: 'test 2',
                            expanded:false,
                        }]
                    }])
            })();">Show Tree with Data</button>
        <tree-view
        />
       
        `
    ,
    argTypes: {},
    args: {


    },
} satisfies Meta<TreeNode>;

export default meta;
type Story = StoryObj<TreeNode>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultInput: Story = {};

