import ol = require("openlayers");
import $ = require("jquery");

import { Grid } from "ol3-grid";
import { StyleConverter, Format } from "ol3-symbolizer";
import { SearchForm } from "../ol3-search";
import { GoogleGeocode } from "../providers/google";
import { cssin, navigation, mixin } from "ol3-fun";
import { ArcGisVectorSourceFactory } from "ol3-symbolizer/ol3-symbolizer/ags/ags-source";

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

    let searchProvider = new GoogleGeocode();

    let center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');

    let mapContainer = document.getElementsByClassName("map")[0];

    let map = new ol.Map({
        loadTilesWhileAnimating: true,
        target: mapContainer,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
                visible: true
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
                let styleJson: Array<Format.Style> = [{
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
                        text: feature.get("text"),
                        "offset-y": -15
                    }
                }];
                if (feature.get("airport")) {
                    styleJson.push(
                        {
                            "svg": {
                                "scale": 2,
                                "imgSize": [
                                    15,
                                    15
                                ],
                                "rotation": 0, "anchorOrigin": "top-left",
                                "anchor": [
                                    15,
                                    15
                                ],
                                "offset": [
                                    0,
                                    0
                                ],
                                "fill": {
                                    "color": "rgba(250,25,250,1)"
                                },
                                "stroke": {
                                    "color": "rgba(0,0,0,1)",
                                    "width": 1
                                },
                                "path": "M15,6.8182L15,8.5l-6.5-1l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182L15,6.8182z"
                            }
                        }
                    );
                }
                style = styleJson.map(s => symbolizer.fromJson(s));
                feature.setStyle(style);
            }
            return <ol.style.Style>style;
        }
    });
    map.addLayer(vector);

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "Google Search",
        fields: [
            {
                name: "address",
                alias: "Location",
                default: "LAX",
                length: 50
            },
            {
                name: "bounded",
                alias: "Current Extent?",
                default: true
            }
        ]
    });

    form.on("change", (args: {
        value: GoogleGeocode.Request & {
            bounded: boolean
        }
    }) => {
        if (!args.value) return;

        let searchArgs = searchProvider.getParameters({
            bounded: args.value.bounded,
            params: args.value
        }, map);

        $.ajax({
            url: searchArgs.url,
            method: searchArgs.method || 'GET',
            data: searchArgs.params,
            dataType: searchArgs.dataType || 'json'
        }).then(json => {
            let results = searchProvider.handleResponse(json);
            results.some(r => {
                if (r.address) {
                    let geom = new ol.geom.Point([r.lon, r.lat]).transform("EPSG:4326", map.getView().getProjection());
                    let feature = new ol.Feature(geom);
                    feature.set("text", r.original.formatted_address);
                    r.original.types.forEach(t => feature.set(t, true));
                    source.addFeature(feature);
                }
                if (r.extent) {
                    r.extent.transform("EPSG:4326", map.getView().getProjection());
                    let feature = new ol.Feature(r.extent);
                    navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                }
                return true;
            });
        }).fail(() => {
            console.error("geocoder failed");
        });

    });

    map.addControl(form);

}