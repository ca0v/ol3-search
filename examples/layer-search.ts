import ol = require("openlayers");
import $ = require("jquery");

import { SearchForm } from "../index";
import { LayerGeocode as Geocoder } from "../ol3-search/providers/layer";
import { cssin, mixin, navigation } from "ol3-fun/index";
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
        count: 1,
        map: map,
        params: {
            query: '',
            layers: [],
            searchNames: ["STATE_ABBR", "STATE_NAME", "SUB_REGION"],
            propertyNames: ["STATE_NAME", "STATE_ABBR", "SUB_REGION"]
        }
    });

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "Layer Search",
        showLabels: false,
        autoClear: true,
        autoCollapse: true,
        canCollapse: true,
        fields: searchProvider.fields
    });

    let search = (params: Geocoder.Request, bounded: boolean) => {
        let layers = map.getLayers().getArray().filter(l => l instanceof ol.layer.Vector).map((l: ol.layer.Vector) => l);
        searchProvider.options.params.layers = layers.filter(l => l.getSource() !== source);

        searchProvider.execute({ params: params }).then(results =>
            results.some(r => {
                console.log(r);
                if (r.address) {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.title);
                    source.addFeature(feature);
                }
                if (r.extent) {
                    let feature = new ol.Feature(r.extent.transform("EPSG:4326", "EPSG:3857"));
                    navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                }
                return true;
            }));
    }

    form.on("change", (args: {
        value: any
    }) => {
        if (!args.value) return;
        console.log("search", args.value);
        search(args.value, args.value.bounded);
    });

    map.addControl(form);

}