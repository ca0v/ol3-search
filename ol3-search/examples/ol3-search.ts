import ol = require("openlayers");
import $ = require("jquery");

import { Grid } from "ol3-grid";
import { StyleConverter } from "ol3-symbolizer";
import { SearchForm } from "../ol3-search";

import { BingGeocode } from "../providers/bing";
import { GoogleGeocode } from "../providers/google";
import { MapQuestGeocode } from "../providers/mapquest";
import { OpenStreetGeocode } from "../providers/osm";
import { WfsGeocode } from "../providers/wfs";

import { cssin, mixin, navigation } from "ol3-fun";
import { ArcGisVectorSourceFactory } from "ol3-symbolizer/ol3-symbolizer/ags/ags-source";
import { Geocoder, Request, Result, SearchField } from "../providers/index";

function clone(value: Object) {
    return JSON.parse(JSON.stringify(value));
}

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
    }).then(() => map.addLayer(vector));

    let providers = <Array<Geocoder<any, any>>>[
        new BingGeocode({
            count: 1,
            map: map,
            key: 'As7mdqzf-iBHBqrSHonXJQHrytZ_SL9Z2ojSyOAYoWTceHYYLKUy0C8X8R5IABRg'
        }),
        new GoogleGeocode({
            count: 1,
            map: map
        }),
        new MapQuestGeocode({
            count: 1,
            map: map
        }),
        new OpenStreetGeocode({
            count: 1,
            map: map
        }),
        new WfsGeocode({
            count: 1,
            map: map,
            url: 'http://localhost:8080/geoserver/ips/wfs',
            params: {
                featureNS: 'http://inforpublicsector.com/geoserver',
                featurePrefix: 'ips',
                featureTypes: ['ADDRESS'],
                searchNames: 'CITY,STNAME,STATE'.split(','),
                propertyNames: ['STNAME', 'GEOM']
            }
        }),
    ];

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "LAX Search",
        showLabels: false,
        autoClear: true,
        autoCollapse: true,
        canCollapse: true,
        fields: [{
            name: "query",
            alias: "Location",
            default: "LAX",
            length: 50
        }]
    });

    let search = (value: { query: string }, bounded: boolean) => {
        // clone value before passing to provider so each gets pristine arguments
        providers[0].execute(clone(value)).then(results => {
            if (results.length) {
                process(results);
                // switch primary provider
                providers.push(providers.shift());
            } else {
                // run all the remaining providers at once
                providers.filter((v, i) => i > 0).forEach(provider => {
                    provider.execute(clone(value)).then(results => {
                        process(results);
                    });
                })
            }
        }).fail(() => {
            // switch primary provider
            providers.push(providers.shift());
            search(clone(value), bounded);
        });
    }

    let process = (results: Result<any>[]) => {
        return results.some(r => {
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
        });
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