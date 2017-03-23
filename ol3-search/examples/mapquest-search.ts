import ol = require("openlayers");
import $ = require("jquery");

import { SearchForm } from "../ol3-search";
import { MapQuestGeocode as Geocoder } from "../providers/mapquest";
import { cssin, mixin, navigation } from "ol3-fun";

import { create as makeMap } from "./mapmaker";

export function run() {

    cssin("examples/ol3-search", `

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

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "MapQuest Search",
        showLabels: false,
        autoClear: true,
        autoCollapse: true,
        canCollapse: true,
        fields: searchProvider.fields
    });

    form.on("change", (args: {
        value: Geocoder.Request
    }) => {
        if (!args.value) return;
        console.log("search", args.value);

        searchProvider.execute(args.value).then(results => {

            let toSrs = map.getView().getProjection();

            results.some(r => {
                console.log(r);
                if (r.address) {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", toSrs);
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.title);
                    source.addFeature(feature);
                }
                if (r.extent) {
                    let feature = new ol.Feature(r.extent.transform("EPSG:4326", toSrs));
                    navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                }
                return true;
            });

        });


    });

    map.addControl(form);

}