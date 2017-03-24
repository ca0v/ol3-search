import { GoogleGeocode as Geocoder } from "../providers/google";
import { cssin } from "ol3-fun";
import { create as makeMap } from "./mapmaker";
import { create as makeForm } from "./formmaker";

export function run() {

    cssin("examples/google-search", `

.ol-search tr.focus {
    background: white;
}

.ol-search:hover {
    background: white;
}

.ol-search label.ol-search-label {
    white-space: nowrap;
}

.ol-search table {
    width: 100%;
}

.ol-search .input {
    width: 100%;
}

.ol-search input[type="checkbox"] {
    width: auto;
}
    `);

    let { map, source } = makeMap();

    let searchProvider = new Geocoder({
        map: map,
        count: 1
    });

    makeForm({
        map: map,
        searchProvider: searchProvider,
        source: source
    });

}