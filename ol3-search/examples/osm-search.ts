import ol = require("openlayers");
import $ = require("jquery");

import { Grid } from "ol3-grid";
import { StyleConverter } from "ol3-symbolizer";
import { SearchForm } from "../ol3-search";
import { OpenStreet } from "../providers/osm";
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

    let searchProvider = new OpenStreet();

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

    let form = SearchForm.create({
        className: 'ol-search top right',
        expanded: true,
        title: "Nominatim Search Form",
        fields: [
            {
                name: "q",
                alias: "*"
            },
            {
                name: "postalcode",
                alias: "Postal Code"
            },
            {
                name: "housenumber",
                alias: "House Number",
                length: 10,
                type: "integer"
            },
            {
                name: "streetname",
                alias: "Street Name"
            },
            {
                name: "city",
                alias: "City"
            },
            {
                name: "county",
                alias: "County"
            },
            {
                name: "country",
                alias: "Country",
                domain: {
                    type: "",
                    name: "",
                    codedValues: [
                        {
                            name: "us", code: "us"
                        }
                    ]
                }
            },
            {
                name: "bounded",
                alias: "Current Extent?",
                type: "boolean"
            }
        ]
    });

    form.on("change", args => {
        if (!args.value) return;
        console.log("search", args.value);

        let searchArgs = searchProvider.getParameters(args.value, map);

        $.ajax({
            url: searchArgs.url,
            method: searchProvider.method || 'GET',
            data: searchArgs.params,
            dataType: searchProvider.dataType || 'json'
        }).then(json => {
            let results = searchProvider.handleResponse(json);
            results.some(r => {
                console.log(r);
                if (r.original.boundingbox) {
                    let [lat1, lat2, lon1, lon2] = r.original.boundingbox.map(v => parseFloat(v));
                    [lon1, lat1] = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:3857");
                    [lon2, lat2] = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:3857");
                    let extent = <ol.Extent>[lon1, lat1, lon2, lat2];

                    let feature = new ol.Feature(new ol.geom.Polygon([[
                        ol.extent.getBottomLeft(extent),
                        ol.extent.getTopLeft(extent),
                        ol.extent.getTopRight(extent),
                        ol.extent.getBottomRight(extent),
                        ol.extent.getBottomLeft(extent)
                    ]]));

                    feature.set("text", r.original.display_name);
                    source.addFeature(feature);
                    navigation.zoomToFeature(map, feature);
                } else {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.original.display_name);
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