import {customElement, property} from "lit/decorators.js";
import TailwindElement from "../app/TailwindElement";
import {html} from "lit";


export interface IDataModel {
    id: string;
    subTitle: string;
    title: string;
    level: string;
    hasChildren: boolean;
    children?: IDataModel[];
}

export interface ModernTreeProps {

}

@customElement('modern-tree')
export class ModernTree extends TailwindElement {

    // @ts-ignore
    @property({type: String, state: true, attribute: 'data-json', converter: (value: string,type: any ) => {
            return JSON.parse(value);
        }})
    dataModel: IDataModel| undefined; //state

    //@property({type: String, state: true, attribute: 'data-json', converter: (value: string) => {JSON.parse(value)}})
    //dataJson: string| undefined =undefined;

    @property({type: Number})
    level: number | undefined; //

    @property({type: ModernTree, state: true})
    firstNode: ModernTree | undefined; //

    @property({type: Boolean, state: true})
    initComplete:boolean = false;


    @property()
    lvlConverter : ((lvl: string) => number) | undefined;



    setDataModel = (dataModel: IDataModel) => {
        this.dataModel = dataModel as IDataModel;
    }

    async firstUpdated(changedProperties:any) {
        super.firstUpdated(changedProperties);

        this.shadowRoot?.append(this.generateTreeSkeleton(this.level ?? 0));

        if (!this.isDataModelValid()) {
            this.initComplete = true;
            return;
        }

        this.shadowRoot?.getElementById("skeleton")?.remove();
    }

    isDataModelValid = () => {
        // TODO : Schema validation
        return true;
    }


    setLevelConverter:(func:(lvl: string) => number) => void = (func:(lvl: string) => number): void => {
       this.lvlConverter =  func;
    }

    /**
     * Add a skeleton tree element
     * @param level - The depth level of the tree (optional)
     * @returns {HTMLDivElement}
     */
    generateTreeSkeleton = (level = 0) => {
        const element = document.createElement("div");
        element.id = "skeleton";
        element.classList.add("flex", "items-center", "border", "border-gray-300", "rounded", "my-2", "animate-pulse");
        element.style.marginLeft = (level * 2) + "em";

        // Add icon
        const icon = document.createElement("div");
        icon.classList.add("my-2", "ml-2", "mr-4", "h-4", "w-4", "bg-gray-300", "rounded");
        element.append(icon);

        // Add title & description
        const wrapper = document.createElement("div");
        wrapper.classList.add("flex", "flex-col");
        element.append(wrapper);

        const title = document.createElement("div");
        title.classList.add("bg-gray-300", "h-5", "w-20", "mt-1", "rounded");
        wrapper.append(title);

        const description = document.createElement("div");
        description.classList.add("bg-gray-300", "h-4", "w-40", "my-1", "rounded");
        wrapper.append(description);
        return element;
    }

    generateDetails = (data : IDataModel |undefined) => {
        const details: HTMLElement = document.createElement("div");
        details.classList.add("flex", "flex-col");
        details.onclick = () => {
            this.firstNode?.dispatchEvent(new CustomEvent('node.select', {detail: data?.id}));
        }

        const titleElement = document.createElement("h1");
        titleElement.innerText = data?.title ?? "";
        titleElement.classList.add("font-medium", "text-gray-900");
        details.append(titleElement);

        const descriptionElement = document.createElement("small");
        descriptionElement.innerText = data?.subTitle ?? "";
        descriptionElement.classList.add("text-gray-600", "text-sm");
        details.append(descriptionElement);

        return details;
    }

    generateExtandebleButton = (hasChildren: boolean) => {
        const extandebleButton = document.createElement("button");
        const buttonDisabledClass = hasChildren ? "" : "fill: #9ca3af;";
        extandebleButton.onclick = () => this.firstNode?.dispatchEvent(new CustomEvent('node.select', {detail: this.dataModel?.id}));
        extandebleButton.classList.add("p-2", "mr-2");
        extandebleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" style="${buttonDisabledClass}">
                            <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
                            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                        </svg>`;
        return extandebleButton;
    }

    generateNode = (parentNode: HTMLElement|undefined, child: IDataModel |undefined )  => {

        if (this.firstNode === undefined) {
            this.firstNode = this
        }

        let hasChildren: boolean| undefined ;
        let level : number = 0;

        if (parentNode === undefined && child === undefined) {
            hasChildren = this.dataModel?.hasChildren;
            if (this.lvlConverter) {
                level = this.lvlConverter(this.dataModel?.level ?? ""); // level 0 ,1 ,2,3,4,5 .... a,b,c, ...... /1/1/2 ..... a/aa/b/bb...
            }
        } else {
            hasChildren = child?.hasChildren ?? false;
            if (this.lvlConverter) {
                level = this.lvlConverter(child?.level ?? "");
            }
        }

        let treeNode: HTMLElement = document.createElement("div");

        treeNode.style.marginLeft = (level * 2) + "em";
        treeNode.style.width = "36em";
        treeNode.classList.add("flex", "items-center", "justify-between", "border", "border-gray-400", "rounded", "hover:bg-gray-200", "my-2");

        // Left side
        const leftSide: HTMLElement = document.createElement("div");
        leftSide.classList.add("flex");
        treeNode.append(leftSide);


        leftSide.append(this.generateExtandebleButton(hasChildren ?? false));
        leftSide.append(this.generateDetails( parentNode === undefined ?   this.dataModel : child));

        // Right side
        const rightSide = document.createElement("div");
        treeNode.append(rightSide);

        if (hasChildren === true) {
            if(parentNode === undefined) {
                console.log("root children:", this.dataModel?.children )
                this.dataModel?.children?.forEach((child: IDataModel) => {
                    this.generateNode(this,child);
                })
            } else {
                child?.children?.forEach((child: IDataModel) => {
                    console.log("child children:", child?.children )
                    this.generateNode(this,child);
                })
            }
        }

        if(parentNode === undefined) {
            return treeNode;
        } else {
            parentNode.append(treeNode);
        }
    }


    render() {
        if (!this.isDataModelValid()) {
            console.error(`Data-Model is not valid. Please check your data-model.`);
            return;
        }
        return html`
                ${this.generateNode(undefined, undefined)}
        `;
    }
}