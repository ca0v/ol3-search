import ol = require("openlayers");
import $ = require("jquery");

import { Grid } from "ol3-grid";
import { StyleConverter } from "ol3-symbolizer";
import { SearchForm } from "../ol3-search";
import { OpenStreet } from "../providers/osm";
import { GoogleGeocode } from "../providers/google";
import { BingGeocode } from "../providers/bing";
import { cssin, mixin, navigation } from "ol3-fun";
import { ArcGisVectorSourceFactory } from "ol3-symbolizer/ol3-symbolizer/ags/ags-source";

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

    //let searchProvider = new GoogleGeocode();
    // let searchProvider = new OpenStreet();
    let searchProvider = new BingGeocode();

    let center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');

    let mapContainer = document.getElementsByClassName("map")[0];

    let map = new ol.Map({
        loadTilesWhileAnimating: true,
        target: mapContainer,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
                opacity: 0.8
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

    ArcGisVectorSourceFactory.create({
        map: map,
        services: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services',
        serviceName: 'USA_States_Generalized',
        layers: [0]
    }).then(layers => {
        layers.forEach(layer => {

            layer.setStyle((feature: ol.Feature, resolution) => {
                let style = <ol.style.Style>feature.getStyle();
                if (!style) {
                    style = symbolizer.fromJson({
                        fill: {
                            color: "rgba(200,200,200,0.5)"
                        },
                        stroke: {
                            color: "rgba(33,33,33,0.8)",
                            width: 3
                        },
                        text: {
                            text: feature.get("STATE_ABBR")
                        }
                    });
                    feature.setStyle(style);
                }
                return style;
            });

            map.getLayers().insertAt(0, layer);

            let grid = Grid.create({
                map: map,
                className: "ol-grid",
                position: "statecode top left-2",
                expanded: true,
                currentExtent: true,
                autoCollapse: true,
                // we do it ourselves
                autoPan: false,
                showIcon: true,
                layers: [layer]
            });

            grid.on("feature-click", args => {
                navigation.zoomToFeature(map, args.feature);
            });

            grid.on("feature-hover", args => {
                // TODO: highlight args.feature
            });

        });
    }).then(() => {
        map.addLayer(vector);
    });

    let searchFields = searchProvider.fields.concat([
        {
            name: "bounded",
            alias: "Current Extent?",
            default: true
        }
    ]);

    searchFields[0].default = "LAX";

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "Search",
        showLabels: false,
        autoClear: true,
        autoCollapse: true,
        canCollapse: true,
        fields: searchFields
    });


    form.on("change", (args: {
        value: BingGeocode.Request & {
            bounded: boolean
        }
    }) => {
        if (!args.value) return;
        console.log("search", args.value);

        let searchArgs = searchProvider.getParameters({
            bounded: args.value.bounded,
            params: args.value
        }, map);

        $.ajax({
            url: searchArgs.url,
            method: searchArgs.method || 'GET',
            data: searchArgs.params,
            dataType: searchArgs.dataType || 'json',
            jsonp: searchArgs.callbackName
        }).then(json => {
            let results = searchProvider.handleResponse(json);
            results.some(r => {
                console.log(r);
                if (r.extent) {
                    let feature = new ol.Feature(r.extent.transform("EPSG:4326", "EPSG:3857"));

                    feature.set("text", r.title);
                    source.addFeature(feature);
                    navigation.zoomToFeature(map, feature);
                } else {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.title);
                    source.addFeature(feature);
                    navigation.zoomToFeature(map, feature);
                }
                return true;
            });
        }).fail(() => {
            console.error("geocoder failed");
        });

    });

    map.addControl(form);

}