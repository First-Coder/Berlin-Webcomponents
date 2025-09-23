import "./TreeView";
import { html } from "lit";
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
    title: 'Example/TreeView',
    tags: ['autodocs'],
    render: (args) => html `
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
       
        `,
    argTypes: {},
    args: {},
};
export default meta;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultInput = {};
