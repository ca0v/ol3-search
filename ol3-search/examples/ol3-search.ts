import ol = require("openlayers");
import $ = require("jquery");

import { SearchForm } from "../ol3-search";

import { BingGeocode } from "../providers/bing";
import { GoogleGeocode } from "../providers/google";
import { MapQuestGeocode } from "../providers/mapquest";
import { OpenStreetGeocode } from "../providers/osm";
import { WfsGeocode } from "../providers/wfs";

import { cssin, mixin, navigation } from "ol3-fun";
import { Geocoder, Request, Result, SearchField } from "../providers/index";

import { create as makeMap } from "./mapmaker";

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

    let { map, source } = makeMap();

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
        providers[0].execute({ params: clone(value) }).then(results => {
            if (results.length) {
                process(results);
                // switch primary provider
                providers.push(providers.shift());
            } else {
                // run all the remaining providers at once
                providers.filter((v, i) => i > 0).forEach(provider => {
                    provider.execute({ params: clone(value) }).then(results => {
                        process(results);
                    });
                })
            }
        }).fail(() => {
            // switch primary provider
            providers.push(providers.shift());
            search(value, bounded);
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