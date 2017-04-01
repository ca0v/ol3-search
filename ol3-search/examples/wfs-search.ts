import ol = require("openlayers");
import $ = require("jquery");

import { SearchForm } from "../ol3-search";
import { WfsGeocode as Geocoder } from "../providers/wfs";
import { cssin, mixin, navigation } from "ol3-fun";

import { create as makeMap } from "./mapmaker";

const internalSrs = "EPSG:3857";

function buffer([x, y]: ol.Pixel, map: ol.Map, pixels: number = 4) {
    let sw = new ol.geom.Point(map.getCoordinateFromPixel([x - pixels, y + pixels]));
    let ne = new ol.geom.Point(map.getCoordinateFromPixel([x + pixels, y - pixels]));

    let extent = ol.extent.createEmpty();
    ol.extent.extend(extent, sw.getExtent());
    ol.extent.extend(extent, ne.getExtent());

    return ol.geom.Polygon
        .fromExtent(extent)
        .transform(map.getView().getProjection(), internalSrs);
}

export function run() {

    cssin("examples/wfs-search", `

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
        url: 'http://localhost:8080/geoserver/cite/wfs',
        count: 1,
        map: map,
        internalSrs: internalSrs,
        params: {
            featureNS: 'http://www.opengeospatial.net/cite',
            featurePrefix: 'cite',
            featureTypes: ['lines', 'points'],
            searchNames: 'name'.split(','),
            propertyNames: ['name', 'highway', 'geom']
        }
    });

    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top right',
        expanded: true,
        title: "IPS Address Search",
        showLabels: false,
        autoClear: true,
        autoCollapse: true,
        canCollapse: true,
        fields: searchProvider.fields
    });


    let search = (value: any) => {

        let toSrs = map.getView().getProjection();

        searchProvider.execute(value)
            .then(results => {
                if (!results.length) {
                    // try again without extent limitation
                    if (value.bounded) {
                        value.bounded = false;
                        value.extent = null;
                        search(value);
                    }
                }
                results.some(r => {
                    console.log(r);
                    if (r.original instanceof ol.Feature) {
                        let geom = (r.original.clone()).getGeometry().transform(internalSrs, toSrs);
                        let feature = new ol.Feature(geom);
                        feature.set("text", r.title);
                        source.addFeature(feature);
                    }
                    else if (r.address) {
                        let [lon, lat] = ol.proj.transform([r.lon, r.lat], internalSrs, toSrs);
                        let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.title);
                        source.addFeature(feature);
                    }
                    if (r.extent) {
                        let feature = new ol.Feature(r.extent.transform(internalSrs, toSrs));
                        navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                    }
                    return true;
                });

            }).fail(() => {
                console.error("geocoder failed");
            });

    }

    form.on("change", (args: {
        value: any
    }) => {
        if (!args.value) return;
        console.log("search", args.value);
        search({
            bounded: args.value.bounded || false,
            params: args.value
        });
    });

    map.addControl(form);

    map.on("click", (args: ol.MapBrowserPointerEvent) => {
        let geom = buffer(args.pixel, map, 12);
        let filter = new ol.format.filter.Intersects("geom", geom, internalSrs);
        search({
            bounded: false,
            filter: filter
        });
    });

}