// https://github.com/jonataswalker/ol3-geocoder/blob/master/src/js/providers/osm.js
import ol = require("openlayers");
import { mixin } from "ol3-fun/ol3-fun/common";
import { Result } from "./index";

export module OpenStreet {

    export interface Address {
        road: string;
        state: string;
        country: string;
    }

    export interface Address {
        neighbourhood: string;
        postcode: string;
        city: string;
        town: string;
    }

    export interface Address {
        peak: string;
        county: string;
        country_code: string;
        sports_centre: string;
    }

    export interface ResponseItem {
        place_id: string;
        licence: string;
        osm_type: string;
        osm_id: string;
        boundingbox: string[];
        lat: string;
        lon: string;
        display_name: string;
        class: string;
        type: string;
        importance: number;
        icon: string;
        address: Address;
    }

    export type Response = ResponseItem[];

}

export interface OpenStreetRequest {
    format?: "json";
    callback?: "define";
    "accept-language"?: "en-US";
    q?: string | {
        street: {
            housenumber: number;
            streetname: string;
        };
        city: string;
        county: string;
        state: string;
        country: string;
        postalcode: string;
    };
    countrycodes?: string[];
    viewbox?: { left: number, top: number, right: number, bottom: number };
    bounded?: boolean;
    addressdetails?: boolean;
    email?: string;
    exclude_place_ids?: string[];
    limit?: number;
    dedupe?: boolean;
    polygon?: "geojson" | "kml" | "svg" | "wkt";
    extratags?: boolean;
    namedetails?: boolean;
}

const DEFAULTS = {
    url: '//nominatim.openstreetmap.org/search/',
    params: <OpenStreetRequest>{
        q: '',
        format: 'json',
        addressdetails: true,
        limit: 10,
        countrycodes: ['us'],
        'accept-language': 'en-US'
    }
};

export class OpenStreet {

    public dataType = 'json';
    public method = 'GET';

    getParameters(options: OpenStreetRequest, map?: ol.Map) {
        let result = {
            url: DEFAULTS.url,
            params: mixin(mixin({}, DEFAULTS.params), options)
        };

        if (!result.params.viewbox && map) {
            let extent = map.getView().calculateExtent(map.getSize());
            let [left, bottom] = ol.extent.getBottomLeft(extent);
            let [right, top] = ol.extent.getTopRight(extent);
            let inSrs = map.getView().getProjection();
            [left, top] = ol.proj.transform([left, top], inSrs, "EPSG:4326");
            [right, bottom] = ol.proj.transform([right, bottom], inSrs, "EPSG:4326");

            result.params.viewbox = {
                bottom: bottom,
                top: top,
                left: left,
                right: right
            }
        }

        if (result.params.countrycodes) {
            result.params.countrycodes = <any>result.params.countrycodes.join(",");
        }

        if (result.params.viewbox) {
            let x = result.params.viewbox;
            result.params.viewbox = <any>[x.left, x.top, x.right, x.bottom].map(v => v.toFixed(5)).join(",");
        }

        Object.keys(result.params).filter(k => typeof result.params[k] === "boolean").forEach(k => {
            result.params[k] = result.params[k] ? "1" : "0";
        });

        return result;
    }

    handleResponse(args: OpenStreet.Response) {
        return args.sort(v => v.importance || 1).map(result => (<Result<typeof result>>{
            original: result,
            lon: parseFloat(result.lon),
            lat: parseFloat(result.lat),
            address: {
                name: result.address.neighbourhood || '',
                road: result.address.road || '',
                postcode: result.address.postcode,
                city: result.address.city || result.address.town,
                state: result.address.state,
                country: result.address.country
            }
        }));
    }
}