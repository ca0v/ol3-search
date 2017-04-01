import ol = require("openlayers");
import { Grid } from "ol3-grid";
import { ArcGisVectorSourceFactory } from "ol3-symbolizer/ol3-symbolizer/ags/ags-source";
import { StyleConverter } from "ol3-symbolizer";
import { navigation } from "ol3-fun";

export function create() {

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
                switch (feature.getGeometry().getType()) {
                    case "Point":
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
                        break;
                    case "LineString":
                        style = symbolizer.fromJson({
                            fill: {
                                color: "rgba(33, 33, 33, 0.2)"
                            },
                            stroke: {
                                color: "#F00"
                            },
                            text: {
                                text: feature.get("text")
                            }
                        });
                        break;
                    default:
                        debugger;
                        style = symbolizer.fromJson({
                            fill: {
                                color: "rgba(33, 33, 33, 0.2)"
                            },
                            stroke: {
                                color: "#F00"
                            },
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
                        break;
                }
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

    return {
        map: map,
        source: source
    };

}