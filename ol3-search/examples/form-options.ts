import { SearchForm } from "../ol3-search";
import { defaults } from "ol3-fun";

export function run() {

    let metaForm = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "Search",
        showLabels: true,
        autoClear: false,
        autoCollapse: false,
        canCollapse: true,
        fields: [
            {
                name: 'className',
                default: 'ol-search'
            },
            {
                name: 'position',
                default: 'bottom left'
            },
            {
                name: 'expanded',
                default: true
            },
            {
                name: 'title',
                default: 'Search'
            },
            {
                name: 'showLabels',
                default: true
            },
            {
                name: 'autoClear',
                default: true
            },
            {
                name: 'autoCollapse',
                default: true
            },
            {
                name: 'canCollapse',
                default: true
            },
            {
                name: 'fields',
                domain: {
                    name: "fieldNames",
                    type: "string",
                    codedValues: [
                        {
                            code: "boolean",
                            name: "Boolean",
                        },
                        {
                            code: "number",
                            name: "Number",
                        },
                        {
                            code: "string",
                            name: "String",
                        },
                    ]
                }
            },
        ]
    });

    metaForm.options.searchButton.value = "Create";

    let targetForm: SearchForm;

    metaForm.on("change", (args: { value: any }) => {
        if (targetForm) {
            targetForm.destroy();
            targetForm.options.element.remove();
            targetForm = null;
        }

        if (args.value.fields) {
            args.value.fields = [
                {
                    name: 'sampleField',
                    type: args.value.fields
                },
            ];
        }

        targetForm = SearchForm.create(defaults(args.value, {
        }));

        document.body.appendChild(targetForm.options.element);

    });

    document.body.appendChild(metaForm.options.element); //  map.addControl(metaForm);
}