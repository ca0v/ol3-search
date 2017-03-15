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
                source: new ol.source.OSM({ opaque: true }),
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
                let styleJson = <Array<Format.Style>>[{
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
                    styleJson.push({
                        text: {
                            text: "AIRPORT",
                            "offset-y": 15
                        }
                    });
                }
                style = styleJson.map(s => symbolizer.fromJson(s));
                feature.setStyle(style);
            }
            return <ol.style.Style>style;
        }
    });
    map.addLayer(vector);

    let form = SearchForm.create({
        className: 'ol-search top right',
        expanded: true,
        title: "Google Search Form",
        fields: [
            {
                name: "query",
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

    form.on("change", args => {
        if (!args.value) return;

        let searchArgs = searchProvider.getParameters(args.value, map);

        $.ajax({
            url: searchArgs.url,
            method: 'GET',
            data: searchArgs.params,
            dataType: 'json'
        }).then(json => {
            let results = searchProvider.handleResponse(json);
            results.some(r => {
                console.log(r);
                if (r.address) {
                    let geom = new ol.geom.Point([r.lon, r.lat]).transform("EPSG:4326", map.getView().getProjection());
                    let feature = new ol.Feature(geom);
                    feature.set("text", r.original.formatted_address);
                    r.original.types.forEach(t => feature.set(t, true));
                    source.addFeature(feature);
                }
                if (r.original.geometry.viewport) {
                    let v = r.original.geometry.viewport;
                    let geom = new ol.geom.Polygon([[
                        [v.southwest.lng, v.southwest.lat],
                        [v.northeast.lng, v.northeast.lat]
                    ]]).transform("EPSG:4326", map.getView().getProjection());

                    let feature = new ol.Feature(geom);
                    //source.addFeature(feature);
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