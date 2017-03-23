import ol = require("openlayers");
import $ = require("jquery");

import { Grid } from "ol3-grid";
import { StyleConverter } from "ol3-symbolizer";
import { SearchForm } from "../ol3-search";
import { OpenStreetGeocode as Geocoder } from "../providers/osm";
import { cssin, mixin, navigation } from "ol3-fun";

export function run() {

    cssin("examples/osm-search", `
.ol-search label.ol-search-label {
    white-space: nowrap;
}
.ol-search form {
    max-width: 12em;
}
    `);

    let center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');

    let mapContainer = document.getElementsByClassName("map")[0];

    let map = new ol.Map({
        loadTilesWhileAnimating: true,
        target: mapContainer,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: center,
            projection: 'EPSG:3857',
            zoom: 6
        })
    });

    let source = new ol.source.Vector();

    let symbolizer = new StyleConverter();

    let vector = new ol.layer.Vector({
        source: source,
        style: (feature: ol.Feature, resolution: number) => {
            let style = feature.getStyle();
            if (!style) {
                style = symbolizer.fromJson({
                    circle: {
                        radius: 4,
                        fill: {
                            color: "rgba(33, 33, 33, 0.2)"
                        },
                        stroke: {
                            color: "#F00"
                        }
                    },
                    text: {
                        text: feature.get("text")
                    }
                });
                feature.setStyle(style);
            }
            return <ol.style.Style>style;
        }
    });
    map.addLayer(vector);

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