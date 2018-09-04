import ol = require("openlayers");
import { olx } from "openlayers";

import { html, cssin, debounce, mixin, pair, range } from "ol3-fun/index";
import { SearchField } from "./providers/index";

let olcss = {
    CLASS_CONTROL: 'ol-control',
    CLASS_UNSELECTABLE: 'ol-unselectable',
    CLASS_UNSUPPORTED: 'ol-unsupported',
    CLASS_HIDDEN: 'ol-hidden'
};

export interface IOptions extends olx.control.ControlOptions {
    // what css class name to assign to the main element
    className?: string;
    position?: string;
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
    searchButton?: HTMLInputElement;
    // what to show on the tooltip
    title?: string;
    fields?: SearchField[];
}

const expando = {
    right: '»',
    left: '«'
};

const defaults: IOptions = {
    className: 'ol-search',
    position: 'bottom left',
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

    static DEFAULT_OPTIONS = defaults;

    static create(options?: IOptions): SearchForm {

        // provide computed defaults        
        options = mixin({
            openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
            closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
        }, options || {});

        // provide static defaults        
        options = mixin(mixin({}, defaults), options);

        let element = document.createElement('div');
        element.className = `${options.className} ${options.position} ${olcss.CLASS_UNSELECTABLE} ${olcss.CLASS_CONTROL}`;

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
    public handlers: Array<() => void>;

    private constructor(options: IOptions & {
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
        this.handlers = [];
        this.cssin();

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

                if (field.domain) {
                    let select = document.createElement("select");
                    select.name = field.name;
                    select.className = `input ${field.name}`;
                    field.domain.codedValues.forEach(cv => {
                        let option = document.createElement("option");
                        select.appendChild(option);
                        option.text = `${cv.name} (${cv.code})`;
                        option.value = cv.code;
                    });
                    input = <any>select;
                }
                else {
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

            if (!this.options.searchButton) {
                let searchButton = <HTMLInputElement>html(`<input type="button" class="ol-search-button" value="Search"/>`);
                footer.appendChild(searchButton);
                this.options.searchButton = searchButton;

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
                    if (this.options.autoCollapse && this.options.canCollapse) {
                        this.collapse();
                    }
                    if (this.options.autoClear) {
                        this.options.fields.forEach(f => {
                            form[f.name].value = f.default === undefined ? "" : f.default;
                        });
                    }
                });
            }

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

    destroy() {
        this.handlers.forEach(h => h());
        this.setTarget(null);
    }

    setPosition(position: string) {
        this.options.position.split(' ')
            .forEach(k => this.options.element.classList.remove(k));

        position.split(' ')
            .forEach(k => this.options.element.classList.add(k));

        this.options.position = position;
    }

    cssin() {
        let className = this.options.className;
        let positions = pair("top left right bottom".split(" "), range(24))
            .map(pos => `.${className}.${pos[0] + (-pos[1] || '')} { ${pos[0]}:${0.5 + pos[1]}em; }`);

        this.handlers.push(cssin(className, `
.${className} {
    position: absolute;
}

.${className} button {
    min-height: 1.375em;
    min-width: 1.375em;
    width: auto;
    display: inline;
}

.${className}.left button {
    float:right;
}

.${className}.right button {
    float:left;
}

.${className} form {
    width: 16em;
    border: none;
    padding: 0;
    margin: 0;
    margin-left: 2px;
    margin-top: 2px;
    vertical-align: top;
}
.${className} form.ol-hidden {
    display: none;
}
${positions.join('\n')}`));
    }

    collapse(options = this.options) {
        if (!options.canCollapse) return;
        options.expanded = false;
        this.form.classList.add(olcss.CLASS_HIDDEN);
        this.button.classList.remove(olcss.CLASS_HIDDEN);
        this.button.innerHTML = options.closedText;
    }

    expand(options = this.options) {
        options.expanded = true;
        this.form.classList.remove(olcss.CLASS_HIDDEN);
        this.button.classList.add(olcss.CLASS_HIDDEN);
        this.button.innerHTML = options.openedText;
        this.form.focus();
    }

    on(type: string, cb: ol.EventsListenerFunctionType): any;
    on<T>(type: "change", cb: ((args: {
        type: string;
        target: SearchForm;
        value: { [name: string]: any };
    }) => void) | ol.EventsListenerFunctionType);
    on(type: string, cb: ol.EventsListenerFunctionType) {
        return super.on(type, cb);
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