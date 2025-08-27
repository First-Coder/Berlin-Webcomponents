import{B as t}from"./Button-BciFcutm.js";import"./iframe-DDLMmN04.js";import"./preload-helper-D9Z9MdNV.js";const{fn:n}=__STORYBOOK_MODULE_TEST__,u={title:"Example/Button",tags:["autodocs"],render:o=>t(o),argTypes:{backgroundColor:{control:"color"},size:{control:{type:"select"},options:["small","medium","large"]}},args:{onClick:n()}},r={args:{primary:!0,label:"Button"}},e={args:{label:"Button"}},a={args:{size:"large",label:"Button"}},s={args:{size:"small",label:"Button"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    primary: true,
    label: 'Button'
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Button'
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'large',
    label: 'Button'
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'small',
    label: 'Button'
  }
}`,...s.parameters?.docs?.source}}};const p=["Primary","Secondary","Large","Small"];export{a as Large,r as Primary,e as Secondary,s as Small,p as __namedExportsOrder,u as default};
