import { OpenStreetGeocode as Geocoder } from "../ol3-search/providers/osm";
import { cssin } from "ol3-fun/index";
import { create as makeMap } from "./mapmaker";
import { create as makeForm } from "./formmaker";

export function run() {

    cssin("examples/osm-search", `
.ol-search label.ol-search-label {
    white-space: nowrap;
}
.ol-search form {
    max-width: 12em;
}
    `);

    let { map, source } = makeMap();

    let searchProvider = new Geocoder({
        count: 1,
        map: map
    });

    makeForm({
        map: map,
        searchProvider: searchProvider,
        source: source
    });

}