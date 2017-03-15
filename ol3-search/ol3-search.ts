import ol = require("openlayers");
import { html, cssin, mixin, debounce } from "ol3-fun/ol3-fun/common";

const css = (I => `
    .${I.name} {
        position:absolute;
    }
    .${I.name}.top {
        top: 0.5em;
    }
    .${I.name}.top-1 {
        top: 1.5em;
    }
    .${I.name}.top-2 {
        top: 2.5em;
    }
    .${I.name}.top-3 {
        top: 3.5em;
    }
    .${I.name}.top-4 {
        top: 4.5em;
    }
    .${I.name}.left {
        left: 0.5em;
    }
    .${I.name}.left-1 {
        left: 1.5em;
    }
    .${I.name}.left-2 {
        left: 2.5em;
    }
    .${I.name}.left-3 {
        left: 3.5em;
    }
    .${I.name}.left-4 {
        left: 4.5em;
    }
    .${I.name}.bottom {
        bottom: 0.5em;
    }
    .${I.name}.bottom-1 {
        bottom: 1.5em;
    }
    .${I.name}.bottom-2 {
        bottom: 2.5em;
    }
    .${I.name}.bottom-3 {
        bottom: 3.5em;
    }
    .${I.name}.bottom-4 {
        bottom: 4.5em;
    }
    .${I.name}.right {
        right: 0.5em;
    }
    .${I.name}.right-1 {
        right: 1.5em;
    }
    .${I.name}.right-2 {
        right: 2.5em;
    }
    .${I.name}.right-3 {
        right: 3.5em;
    }
    .${I.name}.right-4 {
        right: 4.5em;
    }
    .${I.name} button {
        min-height: 1.375em;
        min-width: 1.375em;
        width: auto;
        display: inline;
    }
    .${I.name}.left button {
        float:right;
    }
    .${I.name}.right button {
        float:left;
    }
    .${I.name} form {
        width: 16em;
        border: none;
        padding: 0;
        margin: 0;
        margin-left: 2px;
        margin-top: 2px;
        vertical-align: top;
    }
    .${I.name} form.ol-hidden {
        display: none;
    }
`)({ name: 'ol-search' });

let olcss = {
    CLASS_CONTROL: 'ol-control',
    CLASS_UNSELECTABLE: 'ol-unselectable',
    CLASS_UNSUPPORTED: 'ol-unsupported',
    CLASS_HIDDEN: 'ol-hidden'
};

export interface IOptions {
    // what css class name to assign to the main element
    className?: string;
    expanded?: boolean;
    hideButton?: boolean;
    autoChange?: boolean;
    autoClear?: boolean;
    autoCollapse?: boolean;
    canCollapse?: boolean;
    closedText?: string;
    showLabels?: boolean;
    openedText?: string;
    source?: HTMLElement;
    target?: HTMLElement;
    // what to show on the tooltip
    title?: string;
    fields?: {
        name: string;
        type?: "string" | "integer" | "number" | "boolean";
        default?: string | number | boolean;
        placeholder?: string;
        alias?: string;
        regex?: RegExp;
        domain?: {
            type: string;
            name: string;
            codedValues: {
                name: string;
                code: string;
            }[];
        };
        editable?: boolean;
        nullable?: boolean;
        length?: number;
    }[];
}

const expando = {
    right: '»',
    left: '«'
};

const defaults: IOptions = {
    className: 'ol-search bottom left',
    expanded: false,
    autoChange: false,
    autoClear: false,
    autoCollapse: true,
    canCollapse: true,
    hideButton: false,
    closedText: expando.right,
    openedText: expando.left,
    title: 'Search',
    showLabels: false,
};

export class SearchForm extends ol.control.Control {

    static create(options?: IOptions): SearchForm {

        cssin('ol-search', css);

        // provide computed defaults        
        options = mixin({
            openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
            closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
        }, options || {});

        // provide static defaults        
        options = mixin(mixin({}, defaults), options);

        let element = document.createElement('div');
        element.className = `${options.className} ${olcss.CLASS_UNSELECTABLE} ${olcss.CLASS_CONTROL}`;

        let geocoderOptions = mixin({
            element: element,
            target: options.target,
            expanded: false
        }, options);

        return new SearchForm(geocoderOptions);
    }

    button: HTMLButtonElement;
    form: HTMLFormElement;
    options: IOptions;

    constructor(options: IOptions & {
        element: HTMLElement;
        target: HTMLElement;
    }) {

        if (options.hideButton) {
            options.canCollapse = false;
            options.autoCollapse = false;
            options.expanded = true;
        }

        super({
            element: options.element,
            target: options.target
        });

        this.options = options;

        let button = this.button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.title = options.title;
        options.element.appendChild(button);
        if (options.hideButton) {
            button.style.display = "none";
        }

        let form = this.form = <HTMLFormElement>html(`
        <form>
            ${options.title ? `<label class="title">${options.title}</label>` : ""}
            <section class="header"></section>
            <section class="body">
            <table class="fields">
            ${options.showLabels ? `<thead><tr><td>Field</td><td>Value</td></tr></thead>` : ""}
                <tbody>
                    <tr><td>Field</td><td>Value</td></tr>
                </tbody>
            </table>
            </section>
            <section class="footer"></section>
        </form>
        `.trim());

        options.element.appendChild(form);

        {
            let body = form.getElementsByTagName("tbody")[0];
            body.innerHTML = "";
            options.fields.forEach(field => {
                field.alias = field.alias || field.name;
                field.name = field.name || field.alias;

                let tr = document.createElement("tr");
                let value = document.createElement("td");
                if (!field.type && typeof field.default !== "undefined") {
                    field.type = <any>typeof field.default;
                }
                field.type = field.type || "string";
                if (options.showLabels) {
                    let label = document.createElement("td");
                    label.innerHTML = `<label for="${field.name}" class="ol-search-label">${field.alias}</label>`;
                    tr.appendChild(label);
                }
                tr.appendChild(value);

                let input: HTMLInputElement;
                switch (field.type) {
                    case "boolean":
                        input = <HTMLInputElement>html(`<input class="input ${field.name}" name="${field.name}" type="checkbox" ${field.default ? "checked" : ""} />`);
                        break;
                    case "integer":
                        input = <HTMLInputElement>html(`<input class="input ${field.name}" name="${field.name}" type="number" min="0" step="1" ${field.default ? `value="${field.default}"` : ""} />`);
                        break;
                    case "number":
                        input = <HTMLInputElement>html(`<input class="input ${field.name}" name="${field.name}" type="number" min="0" max="${Array(field.length || 3).join("9")}" />`);
                        break;
                    case "string":
                    default:
                        input = <HTMLInputElement>html(`<input class="input ${field.name}" name="${field.name}" type="text" ${field.default ? `value="${field.default}"` : ""} />`);
                        input.maxLength = field.length || 20;
                        break;
                }

                input.title = field.alias;
                input.placeholder = field.placeholder || field.alias;

                input.addEventListener("focus", () => tr.classList.add("focus"));
                input.addEventListener("blur", () => tr.classList.remove("focus"));

                value.appendChild(input);
                body.appendChild(tr);
            });
        }

        {
            let footer = form.getElementsByClassName("footer")[0];
            let searchButton = <HTMLInputElement>html(`<input type="button" class="ol-search-button" value="Search"/>`);
            footer.appendChild(searchButton);

            form.addEventListener("keydown", (args: KeyboardEvent) => {
                if (args.key === "Enter") {
                    if (args.srcElement !== searchButton) {
                        searchButton.focus();
                    } else {
                        options.autoCollapse && button.focus();
                    }
                }
            });

            searchButton.addEventListener("click", () => {
                this.dispatchEvent({
                    type: "change",
                    value: this.value
                });
            });

        }

        button.addEventListener("click", () => {
            options.expanded ? this.collapse(options) : this.expand(options);
        });

        if (options.autoCollapse) {

            form.addEventListener("blur", () => {
                this.collapse(options);
            });

        }

        if (options.autoChange) {
            form.addEventListener("keypress", debounce(() => {
                this.dispatchEvent({
                    type: "change",
                    value: this.value
                });
            }, 500));
        }

        options.expanded ? this.expand(options) : this.collapse(options);
    }

    collapse(options: IOptions) {
        if (!options.canCollapse) return;
        options.expanded = false;
        this.form.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.innerHTML = options.closedText;
    }

    expand(options: IOptions) {
        options.expanded = true;
        this.form.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.innerHTML = options.openedText;
        this.form.focus();
    }

    on(type: string, cb: Function);
    on<T>(type: "change", cb: (args: {
        type: string;
        target: SearchForm;
        value: { [name: string]: any };
    }) => void);
    on(type: string, cb: Function) {
        super.on(type, cb);
    }

    get value() {
        let result = <{ [name: string]: any }>{};
        this.options.fields.forEach(field => {
            let input = <HTMLInputElement>this.form.querySelector(`[name="${field.name}"]`);
            let value = <any>input.value;
            switch (field.type) {
                case "integer":
                    value = parseInt(value, 10);
                    value = isNaN(value) ? null : value;
                    break;
                case "number":
                    value = parseFloat(value);
                    value = isNaN(value) ? null : value;
                    break;
                case "boolean":
                    value = input.checked;
                    break;
                case "string":
                    value = value || null;
                    break;
            }
            if (undefined !== value && null !== value) {
                result[input.name] = value;
            }
        });
        return result;
    }
}