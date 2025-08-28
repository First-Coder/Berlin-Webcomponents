import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import {LitElement, html, css} from 'lit';
import {property, customElement} from 'lit/decorators.js';



interface IDataModel {
    subTitle: string;
    title: string;
    hierarchyId: string;
    hasChildren: boolean;
    children: IDataModel[];
    [key: string]: any;
}

/**
 * Represents the tree element
 */
@customElement('bln-tree')
export class BlnTree extends LitElement {
    /**
     * Properties of the component
     */
    @property({type: HTMLElement, state: true})
    firstNode?: HTMLElement = undefined; //state
    @property({useDefault: false})
    dialogVisible:boolean| undefined  = false;
    @property()
    dialogText:string | undefined ='';
    @property()
    dialogFunction: string | undefined ='';
    @property()
    dialogAdd :string | undefined ='';
    @property()
    dialogMove :string | undefined ='';
    @property({type: Object, state: true})
    dataModel: IDataModel| undefined =undefined; //state
    @property()
    isFilter:boolean = false; //state
    @property()
    childCache:boolean = false;
    @property()
    url: string = "";
    @property()
    debug: boolean = false;
    @property({type: Boolean, state: true})
    initComplete:boolean = false; //state
    @property()
    hierarchyId:string = "_";
    @property()
    id: string ="";
    @property()
    formularRootElement : Object | undefined = undefined;
    @property({type: String, state: true})
    treedata : string = ""; //state

    static styles = css`
        :host {
            transition: 0.5s;
            width: 23em;
            height: auto;
        };
    `;

    constructor() {
        super();
        this.dialogVisible = false
        this.debug = true;
        this.childCache = false;
        this.hierarchyId = "_";

        this.attachShadow({mode: "open"});
        this.writeDataObject()
    }

    /**
     * Write a message in the debug console if debug mode is activated
     * @param message
     */
    writeDebug = (message: any) => {
        if (this.debug) {
            console.log(message);
        }
    }

    writeDataObject = ()=> {
        console.log(this.getAttribute("treedata"))

    }

    /**
     * Check if the given properties and data model
     * is valid
     * @returns {boolean}
     */
    isDataModelValid = () => {
        if (this.url === undefined || this.url === "") {
            return false;
        }
        // TODO: More validation
        return true;
    }

    /**
     * Convert the hierarchy id like "/1/" to something
     * like "_1_" this
     * @param hierarchyId
     * @returns {string}
     */
    convertHierarchyIdToHtmlId = (hierarchyId :string) => {
        return hierarchyId !== undefined
            ? hierarchyId.replaceAll('/', '_')
            : "";
    }

    /**
     * Convert the hierarchy id like "_1_" to something like "/" this
     * @param hierarchyId
     * @returns {string}
     */
    convertHtmlIdToHierarchyId = (hierarchyId :string ) => {
        return hierarchyId.replaceAll('_', '/');
    }

    /**
     * Return the level based on the given hierarchy id
     * @param hierarchyId
     * @returns {number}
     */
    getLevel = (hierarchyId: string) => {
        this.writeDebug({level: ((hierarchyId.match(/\//g)?.length ?? 0) - 1)})
        return ((hierarchyId.match(/\//g)?.length ?? 0) - 1);
    }

    /**
     * Read the tree from the controller by the given url
     * @param changedProperties
     * @returns {Promise<void>}
     */
    async firstUpdated(changedProperties:any) {
        super.firstUpdated(changedProperties);

        // Create skeleton
        const level = this.hierarchyId.match(/_/g)?.length;

        this.shadowRoot?.append(this.generateTreeSkeleton(level));
        if (!this.isDataModelValid()) {
            this.initComplete = true;
            return;
        }
        this.isFilter = this.url.indexOf("Filter") !== -1;
        const hierarchyId = this.convertHtmlIdToHierarchyId(this.hierarchyId);
        this.writeDebug(`Load data from ${this.url}/${encodeURIComponent(hierarchyId)} [Filter: ${this.isFilter}]`);

        // Get data model
        // Todo: hier gibt es Probleme  mit der URL, z.Teil wird ein "/" an die FilterURL rangehangen
        let resp: AxiosResponse;
        if (this.isFilter) {
            const config: AxiosRequestConfig = {
                method: 'get',
                url:  `${this.url}`,
                headers: {
                    'Content-Type': 'application/json',
                    header: 'Access-Control-Allow-Origin',
                    withCredentials: false,
                }
            };
            resp = await axios(config);
        } else {
            const config: AxiosRequestConfig = {
                method: 'get',
                url:  `${this.url}/${encodeURIComponent(hierarchyId)}/`,
                headers: {
                    'Content-Type': 'application/json',
                    header: 'Access-Control-Allow-Origin',
                    withCredentials: false,
                }
            };
            resp = await axios(config);
        }

        this.dataModel = resp.data.model;

        if (this.debug) {
            console.groupCollapsed(`Result for tree element with the tree id ${hierarchyId ?? "initial"}`);
            console.table(resp.data.model);
            console.groupEnd();
        }
        this.initComplete = true;
        this.generateTreeElement(this);
        this.shadowRoot?.getElementById("skeleton")?.remove();
    }

    addNewItem = (parentTree: any,tree: any) => {
        this.dialogAdd = "hinzufügen"
        this.dialogMove = "verschieben"
        this.dialogFunction = "Dienststelle '"+parentTree.id+"'  bearbeiten"
        this.dialogText = "Möchten Sie eine Dienststelle hinzufügen, oder verschieben?"
        //this.dialogVisible = !this.dialogVisible
        this.generateDialog(parentTree,tree)
    }

    generateDialog = (parentTree:any, tree: any) => {
        const dialog = document.createElement("tree-dialog");
        dialog.id = "dialog";
        dialog.setAttribute("dialog_text", this.dialogText ??"");
        dialog.setAttribute("dialog_function", this.dialogFunction ?? "");
        dialog.setAttribute("dialog_add", this.dialogAdd ?? "");
        dialog.setAttribute("dialog_move", this.dialogMove ?? "");
        dialog.addEventListener('dialog.add',(event)=> {
            let eventNode = this.firstNode !== undefined ? this.firstNode : tree;
            eventNode.dispatchEvent(new CustomEvent('node.add', {detail: parentTree.id}));
            tree.shadowRoot.removeChild(dialog);
        });
        dialog.addEventListener('dialog.move',(event)=> {
            let eventNode = this.firstNode !== undefined ? this.firstNode : tree;
            eventNode.dispatchEvent(new CustomEvent('node.move', {detail: parentTree.id}));
            tree.shadowRoot.removeChild(dialog);
        });
        dialog.addEventListener('dialog.cancel', function (event) {
            // Todo: hier die Logik für das Abbrechen
            //treeElement.dialogVisible = false;
            tree.shadowRoot.removeChild(dialog);
        });
        dialog.innerHTML = ` <div>
            <tree-dialog dialog_text="${(this.dialogText)}" 
            dialog_add="${(this.dialogAdd)}" 
            dialog_move="${(this.dialogMove)}" 
            dialog_function=${(this.dialogText)}">
            </tree-dialog>
    </div>  `

        this.shadowRoot?.append(dialog);
        //return dialog;
    }


    isEmpty(obj:any) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }

        return true;
    }

    isEmptyObject(value:any) {
        if (value == null) {
            // null or undefined
            return false;
        }

        if (typeof value !== 'object') {
            // boolean, number, string, function, etc.
            return false;
        }

        const proto = Object.getPrototypeOf(value);

        // consider `Object.create(null)`, commonly used as a safe map
        // before `Map` support, an empty object as well as `{}`
        if (proto !== null && proto !== Object.prototype) {
            return false;
        }

        return this.isEmpty(value);
    }


    /**
     * Add a tree element to the tree
     * @returns {HTMLDivElement}
     */
    generateTreeElement = (tree: BlnTree) => {
        this.setAttribute("dropzone", "move");
        const treeId = this.convertHierarchyIdToHtmlId(this.dataModel?.hierarchyId ?? "");
        const level = this.getLevel(this.dataModel?.hierarchyId ?? "");
        const hasChildren = this.dataModel?.hasChildren;
        const element = document.createElement("div");
        element.id = treeId;
        element.style.marginLeft = (level * 2) + "em";
        element.style.width = "36em";
        element.classList.add("flex", "items-center", "justify-between", "border", "border-gray-400", "rounded", "hover:bg-gray-200", "my-2");

        // Left side
        const leftSide = document.createElement("div");
        leftSide.classList.add("flex");
        element.append(leftSide);

        const button = document.createElement("button");
        const buttonDisabledClass = hasChildren ? "" : "fill: #9ca3af;";
        /*
        if (Array.isArray(this.node)) {
            if (!hasChildren) {
                element.style.backgroundColor = "yellow";
            }
        }
        */
        button.onclick = () =>
            this.getNodesForNextLevel(treeId, button);
        button.classList.add("p-2", "mr-2");
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" style="${buttonDisabledClass}">
                            <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
                            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                        </svg>`;
        leftSide.append(button);

        const details = document.createElement("div");
        details.classList.add("flex", "flex-col");
        details.onclick = (ev) => {
            // Zu Beginn ist 'firstNode' noch nicht gesetzt
            if (this.firstNode === undefined) {
                this.firstNode = this
            }
            this.firstNode.dispatchEvent(new CustomEvent('node.select', {detail: this.dataModel?.hierarchyId}));
        }
        leftSide.append(details);

        const titleElement = document.createElement("h1");
        titleElement.innerText = this.dataModel?.title ?? "";
        titleElement.classList.add("font-medium", "text-gray-900");
        details.append(titleElement);

        const descriptionElement = document.createElement("small");
        descriptionElement.innerText = this.dataModel?.subTitle ?? "";
        descriptionElement.classList.add("text-gray-600", "text-sm");
        details.append(descriptionElement);

        // Right side
        const rightSide = document.createElement("div");

        // Button zum Hinzufügen einer Dienststelle
        const buttonAdd = document.createElement("button");
        //buttonAdd.onclick = () => this.getNodesForNextLevel(treeId, button);
        buttonAdd.classList.add("p-2", "mr-2");
        buttonAdd.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="200 2000 448 512" width="15" style="background-color: darkslategray">
                            <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
                            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                        </svg>`;
        buttonAdd.onclick = () => this.addNewItem(element,tree);
        rightSide.append(buttonAdd);

        element.append(rightSide);

        return element;
    }

    /**
     * Display or hide the nodes on the view
     * @param treeId - Represents the originalHierarchyId convert to html id
     * @param button - This button object itself
     * @returns {Promise<void>}
     */
    getNodesForNextLevel = async (treeId: any, button: any) => {
        if ((this.shadowRoot?.querySelectorAll('#' + treeId + "children")?.length ?? 0) > 0
            && (this.shadowRoot?.querySelector('#' + treeId + "children")  as HTMLElement).style.display !== 'none') {
            // this.writeDebug(`Hide nodes based on the hierarchy id ${this.dataModel.hierarchyId} to the html element ${treeId}`);
            if (this.childCache) {
                let child = (this.shadowRoot?.querySelector('#' + treeId + "children") as HTMLElement);
                if(child !== undefined && child !== null)
                    child.style.display = 'none';
            } else {
                this.shadowRoot?.querySelector('#' + treeId + "children")?.remove();
            }
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15">
                                    <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
                                    <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                                </svg>`;
        } else {
            //   this.writeDebug(`Display nodes based on the hierarchy id ${this.dataModel.hierarchyId} to the html element ${treeId}`);
            if (this.childCache) {
                if ((this.shadowRoot?.querySelectorAll('#' + treeId + "children")?.length ?? 0) > 0) {

                    const el = this.shadowRoot?.getElementById(`${treeId}children`) as HTMLElement | null;
                    const display = el?.style.display;
                    el!.style.display = 'block';

                    //this.shadowRoot?.querySelector('#' + treeId + "children").style.display = 'block';
                } else {
                    await this.callApiNextLevel(this.dataModel?.hierarchyId, treeId);
                }
            } else {
                await this.callApiNextLevel(this.dataModel?.hierarchyId, treeId);
            }
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15">
                                    <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
                                    <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM152 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                                </svg>`;
        }
    }

    /**
     * Get the next nodes on click
     * @param id - Represents the hierarchyIdToString
     * @param treeId - Represents the node id
     * @returns {Promise<void>}
     */
    callApiNextLevel = async (id:any , treeId:any) => {
        this.writeDebug(`Get children from the tree id ${treeId}...`);

        const config: AxiosRequestConfig = {
            method: 'get',
            url:  `${this.url}/${encodeURIComponent(this.dataModel?.hierarchyId ?? "")}/true`,
            headers: {
                'Content-Type': 'application/json',
                header: 'Access-Control-Allow-Origin',
                withCredentials: false,
            }
        };
        const resp: AxiosResponse = await axios(config);

        if (this.debug) {
            console.groupCollapsed(`Result for children with the tree id ${treeId}`)
            console.table(resp.data.model);
            console.groupEnd();
        }
        this.addChildNodes(treeId, resp.data.model);
    }

    /**
     * Add child nodes to the tree
     * @param query_hierarchyId - The query id of the parent node
     * @param children - Children nodes that need to be added
     */
    addChildNodes = (query_hierarchyId: any, children : IDataModel[]) => {
        const childWrapper = document.createElement("section");
        childWrapper.id = query_hierarchyId + "children";
        children.sort(x  => parseInt( x.hierarchyId.replaceAll('/', '') )).forEach(child  => {
            //  this.writeDebug(`Generate children with id ${child.hierarchyId}`);
            const html_hierarchyIdId = this.convertHierarchyIdToHtmlId(child.hierarchyId);
            const treeElement = document.createElement("berlin-tree");
            (treeElement as BlnTree).hierarchyId = html_hierarchyIdId;
            (treeElement as BlnTree).firstNode = this.firstNode ?? this;
            treeElement.setAttribute("url", this.url);
            treeElement.setAttribute("debug", String(this.debug));
            if (this.childCache) {
                treeElement.setAttribute("child-cache", "true");
            }
            childWrapper.append(treeElement);
        });
        this.shadowRoot?.querySelector('#' + query_hierarchyId)?.after(childWrapper);
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


    /**
     * Render the component
     * @returns {*}
     */
    render() {
        if (!this.isDataModelValid()) {
            console.error(`Please set the property "url" to a valid value`);
            return;
        }
        return html`
                <!-- Tailwind-->
                <link rel="stylesheet" href="http://assetservice-dev/lib/tailwind/tailwind-2.0.2.css"/>
                <script src="http://assetservice-dev/lib/tailwind/tailwind-3.4.5.js"></script>
                <!-- Content -->

                ${
            this.initComplete && this.generateTreeElement(this)
        }
        `;
    }
}
