import {html, TemplateResult} from "lit";
import {List} from "lucide";


 export default class FormBuilder {

    fields: TemplateResult[] | undefined;

    // Sync validation functions
    validateFunctions : Map<string,((value: string) => string)> = new Map<string,((value: string) => string)> ;

    // Async validation functions (optional)
    asyncValidateFunctions: Map<string, (value: string) => Promise<string>> = new Map<string, (value: string) => Promise<string>>();

    constructor() {
        // default sync email validator
        this.validateFunctions.set("email", (value:string)=> {
            return !value.includes('@') ? "Falsches Email Format" : "";
        });
    }

    // Register/override a sync validator
    setCustomValidateFunction = (type:string, func: (value: string)=>string)=>{
        this.validateFunctions.delete(type)
        this.validateFunctions.set(type,func);
        return this;
    }

    // Register/override an async validator
    setCustomValidateFunctionAsync = (type: string, func: (value: string) => Promise<string>) => {
        this.asyncValidateFunctions.delete(type);
        this.asyncValidateFunctions.set(type, func);
        return this;
    }

    // Synchronous validation API (existing)
    validate = (type: string, value: string)=> {
        let error = "";
        const func = this.validateFunctions.get(type);
        if(func) {
            error = func(value);
        } else {
            if (type === 'email') {
                // Platzhalter für weitere Sync-Validierungen
                // ungültige E-Mail, ungültiges Format, etc.
            }
        }
        return error;
    }

    // Asynchronous validation API (new)
    validateAsync = async (type: string, value: string): Promise<string> => {
        const asyncFunc = this.asyncValidateFunctions.get(type);
        if (asyncFunc) {
            try {
                return await asyncFunc(value);
            } catch (e) {
                // On error, return a generic message; consumers may override by their async validator
                return typeof e === 'string' ? e : 'Validierung fehlgeschlagen';
            }
        }
        // Fallback to sync validator wrapped in a Promise
        return Promise.resolve(this.validate(type, value));
    }

    /**
     * Dynamically sets a form field element based on the provided type, label, and value.
     *
     * @param {string} label - The label for the form field.
     * @param {string} value - The value to populate the form field with.
     * @param {string} type - The type of the form field (e.g., 'email', 'password', etc.).
     * @return {this} The instance of the class for method chaining.
     */
    setField(label: string, value:string, type: string) {
        let field: TemplateResult | undefined = undefined;

        switch (type) {
            case 'email':

                field =  html`
                <div class="form-group">
                    <label for="exampleInputEmail1">${label}</label>
                    <input type="email" class="form-control" id="" aria-describedby="emailHelp" placeholder="Enter email" value=${value}></input>
                    <small id="" class="form-text text-muted">${this.validate(type, value)}</small>
                </div>`;
                break;
            case 'password':
                field =  html`
                <div class="form-group">
                    <label for="exampleInputEmail1">Passwort</label>
                    <input type="password" class="form-control" id="" aria-describedby="" placeholder=""></input>
                </div>`;
                break;
            default:
                field =  html`
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="text" class="form-control" id="" aria-describedby="" placeholder="text"></input>
                    </div>`;
                break;

        }
        this.fields?.push(field);
        return this;
    }


    setClassForField= (id:string)=> {

    }

    /**
     * Adds a button element with specified text and functionality to a collection of fields.
     *
     * @param {string} btntext - The text to be displayed on the button.
     * @param {Function} func - The callback function to be executed when the button is clicked.
     * @returns {Object} The current object instance for method chaining.
     */
    setButton= (btntext:string,func: ()=>void)=>{
        this.fields?.push(html`
             <button type="submit" onclick=${func} class="btn btn-primary">${btntext}</button>
        `);
        return this;
    }

    /**
     * Retrieves the fields associated with the current instance.
     *
     * @return {Array|Object} The fields associated with this instance.
     */
    getFields() {
        return this.fields;
    }


}