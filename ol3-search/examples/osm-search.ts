import ol = require("openlayers");
import $ = require("jquery");

import { SearchForm } from "../ol3-search";
import { OpenStreetGeocode as Geocoder } from "../providers/osm";
import { cssin, mixin, navigation } from "ol3-fun";
import { create as makeMap } from "./mapmaker";

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

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "OSM Search",
        fields: searchProvider.fields
    });

    form.on("change", (args: {
        value: Geocoder.Request
    }) => {
        if (!args.value) return;

        searchProvider.execute(args.value).then(results => {
            results.some(r => {
                if (r.address) {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.original.display_name);
                    source.addFeature(feature);
                }
                if (r.extent) {
                    r.extent.transform("EPSG:4326", map.getView().getProjection());
                    let feature = new ol.Feature(r.extent);
                    navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                }
                return true;
            });
        });

    });

    map.addControl(form);

}