import $ = require("jquery");
import ol = require("openlayers");
import { defaults } from "ol3-fun";
import { Geocoder, Request, Result, SearchField } from "./index";

export module OpenStreetGeocode {

    export interface Request {
        format?: "json";
        callback?: "define";
        "accept-language"?: "en-US";
        q?: string | {
            street?: {
                housenumber?: number;
                streetname?: string;
            };
            city?: string;
            county?: string;
            state?: string;
            country?: string;
            postalcode?: string;
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

export interface OpenStreetGeocodeOptions extends Request<OpenStreetGeocode.Request> {
}

export class OpenStreetGeocode implements Geocoder<OpenStreetGeocode.Request, OpenStreetGeocode.ResponseItem> {

    static DEFAULT_OPTIONS = <OpenStreetGeocodeOptions>{
        url: '//nominatim.openstreetmap.org/search/',
        dataType: 'json',
        method: 'GET',
        params: <OpenStreetGeocode.Request>{
            format: 'json',
            addressdetails: true,
            limit: 10,
            countrycodes: ['US'],
            'accept-language': 'en-US'
        }
    }

    private options: OpenStreetGeocodeOptions;

    constructor(options?: OpenStreetGeocodeOptions) {
        this.options = defaults(options || {}, OpenStreetGeocode.DEFAULT_OPTIONS);
    }

    get fields() {
        return <Array<SearchField>>[
            {
                name: "q",
                alias: "*",
                default: "LAX",
                length: 50
            },
            {
                name: "bounded",
                alias: "Current Extent?",
                type: "boolean",
                default: true
            }
        ]
    }

    execute(options: Request<OpenStreetGeocode.Request>) {

        options = this.getParameters(options, this.options.map);
        delete options.params.query;

        let d = $.Deferred<Result<OpenStreetGeocode.ResponseItem>[]>();

        $.ajax({
            url: options.url,
            method: options.method,
            data: options.params,
            dataType: options.dataType,
            jsonp: options.callbackName
        })
            .then(json => d.resolve(this.handleResponse(json)))
            .fail(() => d.reject("geocoder failed"));
        return d;
    }

    private getParameters(options: Request<OpenStreetGeocode.Request>, map?: ol.Map) {

        defaults(options, this.options);

        defaults(options.params, {
            q: options.params.query,
            limit: options.count,
        }, this.options.params);

        if (!options.params.viewbox && map) {
            let extent = map.getView().calculateExtent(map.getSize());
            let [left, bottom] = ol.extent.getBottomLeft(extent);
            let [right, top] = ol.extent.getTopRight(extent);
            let inSrs = map.getView().getProjection();
            [left, top] = ol.proj.transform([left, top], inSrs, "EPSG:4326");
            [right, bottom] = ol.proj.transform([right, bottom], inSrs, "EPSG:4326");

            options.params.viewbox = {
                bottom: bottom,
                top: top,
                left: left,
                right: right
            }
        }

        if (options.params.countrycodes) {
            options.params.countrycodes = <any>options.params.countrycodes.join(",");
        }

        if (options.params.viewbox) {
            let x = options.params.viewbox;
            options.params.viewbox = <any>[x.left, x.top, x.right, x.bottom].map(v => v.toFixed(5)).join(",");
        }

        Object.keys(options.params).filter(k => typeof options.params[k] === "boolean").forEach(k => {
            options.params[k] = options.params[k] ? "1" : "0";
        });

        return options;
    }

    private handleResponse(response: OpenStreetGeocode.Response): Result<OpenStreetGeocode.ResponseItem>[] {

        let asExtent = (r: OpenStreetGeocode.ResponseItem) => {
            let [lat1, lat2, lon1, lon2] = r.boundingbox.map(v => parseFloat(v));
            return ol.geom.Polygon.fromExtent([lon1, lat1, lon2, lat2]);
        };

        return response.sort(v => v.importance || 1).map(result => (<Result<typeof result>>{
            title: result.display_name,
            lon: parseFloat(result.lon),
            lat: parseFloat(result.lat),
            extent: asExtent(result),
            address: {
                name: result.address.neighbourhood || '',
                road: result.address.road || '',
                postcode: result.address.postcode,
                city: result.address.city || result.address.town,
                state: result.address.state,
                country: result.address.country
            },
            original: result
        }));
    }
}