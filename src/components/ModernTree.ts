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

    private loadedIds: Set<string> = new Set();
    @property({type: Boolean}) autoExpand: boolean = true;

    /**
     * Fires when a node with hasChildren is expanded but has no rendered children yet.
     * Event name: 'tree.request-children'
     * detail: { id: string, level: string }
     */

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

        // Auto-expand root on init if desired
        if (this.autoExpand && this.dataModel?.hasChildren) {
            const id = this.dataModel.id;
            const level = this.dataModel.level;
            this.firstNode?.dispatchEvent(new CustomEvent('tree.request-children', {
                detail: { id, level },
                bubbles: true,
                composed: true
            }));
        }
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

    generateExtandebleButton = (hasChildren: boolean, current?: IDataModel) => {
        const extandebleButton = document.createElement("button");
        const buttonDisabledClass = hasChildren ? "" : "fill: #9ca3af;";
        extandebleButton.onclick = () => {
            if (!hasChildren) return;
            const id = current?.id ?? this.dataModel?.id;
            const containerId = `${id}-children`;
            const el = this.shadowRoot?.getElementById(containerId) as HTMLElement | null;
            // If already loaded/rendered, just toggle visibility without requesting again
            if (el && el.childElementCount > 0) {
                el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
                return;
            }
            // Dispatch a request event to load children on demand
            const level = current?.level ?? this.dataModel?.level;
            this.firstNode?.dispatchEvent(new CustomEvent('tree.request-children', {
                detail: { id, level },
                bubbles: true,
                composed: true
            }));
            // ensure container is visible when they arrive; if exists, pre-open
            if (el) el.style.display = 'block';
        };
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
        let current: IDataModel | undefined;

        if (parentNode === undefined && child === undefined) {
            current = this.dataModel;
            hasChildren = this.dataModel?.hasChildren;
            if (this.lvlConverter) {
                level = this.lvlConverter(this.dataModel?.level ?? ""); // level 0 ,1 ,2,3,4,5 .... a,b,c, ...... /1/1/2 ..... a/aa/b/bb...
            }
        } else {
            current = child;
            hasChildren = child?.hasChildren ?? false;
            if (this.lvlConverter) {
                level = this.lvlConverter(child?.level ?? "");
            }
        }

        // Wrapper to hold node and its children container
        const wrapper: HTMLElement = document.createElement("div");

        let treeNode: HTMLElement = document.createElement("div");
        treeNode.style.marginLeft = (level * 2) + "em";
        treeNode.style.width = "36em";
        treeNode.classList.add("flex", "items-center", "justify-between", "border", "border-gray-400", "rounded", "hover:bg-gray-200", "my-2");

        // Left side
        const leftSide: HTMLElement = document.createElement("div");
        leftSide.classList.add("flex");
        treeNode.append(leftSide);

        leftSide.append(this.generateExtandebleButton(hasChildren ?? false, current));
        leftSide.append(this.generateDetails(current));

        // Right side
        const rightSide = document.createElement("div");
        treeNode.append(rightSide);

        wrapper.append(treeNode);

        // Create a container for children to support lazy rendering
        const id = current?.id ?? "";
        const childrenContainer = document.createElement('div');
        childrenContainer.id = `${id}-children`;
        childrenContainer.style.display = 'none';
        wrapper.append(childrenContainer);

        // If children are already provided, render them and show container
        const childrenToRender = (current?.children ?? []);
        if (hasChildren && childrenToRender.length > 0) {
            childrenContainer.style.display = 'block';
            childrenToRender.forEach((ch: IDataModel) => this.generateNode(childrenContainer, ch));
        }

        if(parentNode === undefined) {
            return wrapper;
        } else {
            parentNode.append(wrapper);
        }
    }


    addChildren = (parentId: string, children: IDataModel[]) => {
        // prevent duplicate children by checking existing ids
        const existing = this.findNodeById(this.dataModel, parentId)?.children?.map(c => c.id) ?? [];
        const incomingIds = children.map(c => c.id).join(',');
        const existingIds = existing.join(',');
        if (incomingIds === existingIds && existing.length > 0) {
            // same set already present; still ensure container is visible and return
            const cont = this.shadowRoot?.getElementById(`${parentId}-children`) as HTMLElement | null;
            if (cont) cont.style.display = 'block';
            return;
        }
        // update internal model
        const target = this.findNodeById(this.dataModel, parentId);
        if (target) {
            target.children = children;
            target.hasChildren = children.length > 0;
        }
        // render UI
        const container = this.shadowRoot?.getElementById(`${parentId}-children`) as HTMLElement | null;
        if (container) {
            this.loadedIds.add(parentId);
            container.innerHTML = '';
            children.forEach((child) => this.generateNode(container, child));
            container.style.display = 'block';
        } else {
            // If container not found (edge), re-render whole tree
            this.requestUpdate();
        }
    }

    private findNodeById = (node: IDataModel | undefined, id: string): IDataModel | undefined => {
        if (!node) return undefined;
        if (node.id === id) return node;
        if (node.children) {
            for (const ch of node.children) {
                const found = this.findNodeById(ch, id);
                if (found) return found;
            }
        }
        return undefined;
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