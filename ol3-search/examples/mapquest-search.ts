import { MapQuestGeocode as Geocoder } from "../providers/mapquest";
import { cssin } from "ol3-fun";
import { create as makeMap } from "./mapmaker";
import { create as makeForm } from "./formmaker";

export function run() {

    cssin("examples/mapquest-search", `

.ol-grid.statecode .ol-grid-container {
    background-color: white;
    width: 10em;
}

.ol-grid .ol-grid-container.ol-hidden {
}

.ol-grid .ol-grid-container {
    width: 15em;
}

.ol-grid-table {
    width: 100%;
}

table.ol-grid-table {
    border-collapse: collapse;
    width: 100%;
}

table.ol-grid-table > td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.ol-search tr.focus {
    background: white;
}

.ol-search:hover {
    background: white;
}

.ol-search label.ol-search-label {
    white-space: nowrap;
}

    `);


    let { map, source } = makeMap();

    let searchProvider = new Geocoder({
        map: map,
        count: 1,
    });

    makeForm({
        map: map,
        searchProvider: searchProvider,
        source: source
    });

}