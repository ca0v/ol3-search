import ol = require("openlayers");

import { SearchForm } from "../ol3-search";
import { GoogleGeocode as Geocoder } from "../providers/google";
import { cssin, navigation, mixin } from "ol3-fun";
import { create as makeMap } from "./mapmaker";

export function run() {

    cssin("examples/googl-search", `

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

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "Google Search",
        fields: searchProvider.fields
    });

    form.on("change", (args: {
        value: Geocoder.Request
    }) => {
        if (!args.value) return;

        let toSrs = map.getView().getProjection();

        searchProvider.execute(args.value).then(results => {

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