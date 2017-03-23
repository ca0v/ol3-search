import $ = require("jquery");
import ol = require("openlayers");
import { defaults } from "ol3-fun";
import { Geocoder, Request, Result, SearchField } from "./index";

export module GoogleGeocode {

    export interface Request {
        address?: string;
        key?: string;
        language?: string;
        route?: string;
        locality?: string;
        administrative_area?: string;
        postal_code?: string;
        country?: string;
        components?: string;
        bounds?: string;
        region?: string;
    }

    export interface AddressComponent {
        types: Array<string>;
        long_name: string;
    }

    export interface ResponseItem {
        address_components: Array<AddressComponent>;
        geometry: {
            location: {
                lat: number;
                lng: number;
            },
            location_type: string;
            viewport: {
                northeast: {
                    lat: number;
                    lng: number;
                }
                southwest: {
                    lat: number;
                    lng: number;
                }
            }
        };
        formatted_address: string;
        place_id: string;
        types: string[];
    }

    export interface Response {
        status: string;
        results: Array<ResponseItem>
    }

    export type ResultType = Result<ResponseItem>;

}

export interface GoogleGeocodeOptions extends Request<GoogleGeocode.Request> {
}

const GoogleMappingTable = {
    name: [
        'point_of_interest',
        'establishment',
        'natural_feature',
        'airport'
    ],
    road: [
        'street_address',
        'route',
        'sublocality_level_5',
        'intersection'
    ],
    postcode: ['postal_code'],
    city: ['locality'],
    state: ['administrative_area_level_1'],
    country: ['country']
};

const GoogleMappingKeys = <Array<keyof typeof GoogleMappingTable>>Object.keys(GoogleMappingTable);

export class GoogleGeocode implements Geocoder<GoogleGeocode.Request, GoogleGeocode.ResponseItem> {

    static DEFAULT_OPTIONS = <GoogleGeocodeOptions>{
        url: '//maps.googleapis.com/maps/api/geocode/json',
        dataType: 'json',
        method: 'GET',
        params: {
            address: '',
            key: '',
            language: 'en-US',
            country: 'US'
        }
    }

    private options: GoogleGeocodeOptions;

    get fields() {
        return <Array<SearchField>>[
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
    }

    constructor(options?: GoogleGeocodeOptions) {
        this.options = defaults(options || {}, GoogleGeocode.DEFAULT_OPTIONS);
    }

    execute(params: GoogleGeocode.Request) {
        params.address = params.address || params["query"];
        let options = this.getParameters({ params: params }, this.options.map);

        let d = $.Deferred<Result<GoogleGeocode.ResponseItem>[]>();
        $.ajax({
            url: options.url,
            method: options.method || 'GET',
            data: options.params,
            dataType: options.dataType || 'json',
            jsonp: options.callbackName
        })
            .then(json => d.resolve(this.handleResponse(json)))
            .fail(() => d.reject("geocoder failed"));

        return d;
    }

    private getParameters(options: Request<GoogleGeocode.Request>, map?: ol.Map) {

        defaults(options, this.options);

        defaults(options.params, <any>{
            address: options.query,
            count: options.count,
            key: options.key,
            language: options.lang,
            url: options.url
        }, this.options.params);

        if (map && options.bounded && !options.params.bounds) {
            let extent = map.getView().calculateExtent(map.getSize());
            let p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
            {
                let b = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent().map(v => v.toFixed(6));
                options.params.bounds = `${b[1]},${b[0]}|${b[3]},${b[2]}`;
            }
        }
        return options;
    }

    private handleResponse(response: GoogleGeocode.Response): Result<GoogleGeocode.ResponseItem>[] {

        console.assert(response.status === "OK", "status OK");

        let asExtent = (r: GoogleGeocode.ResponseItem) => {
            let v = r.geometry.viewport;
            return ol.geom.Polygon.fromExtent([v.southwest.lng, v.southwest.lat, v.northeast.lng, v.northeast.lat]);
        };

        let result = response.results.map(result => {
            let returnValue = <GoogleGeocode.ResultType>{
                extent: asExtent(result),
                title: result.formatted_address,
                lat: result.geometry.location.lat,
                lon: result.geometry.location.lng,
                address: {}, // assigned below
                original: result
            };

            this.parseComponents(result.address_components, returnValue);
            return returnValue;
        });

        return result;
    }

    private parseComponents(address_components: Array<GoogleGeocode.AddressComponent>, result: GoogleGeocode.ResultType) {
        address_components.forEach(addressComponent => {
            addressComponent.types.forEach(googleType => {
                GoogleMappingKeys.forEach(typeKey => {
                    if (-1 < GoogleMappingTable[typeKey].indexOf(googleType)) {
                        result.address[typeKey] = addressComponent.long_name;
                    }
                });
            });
        });
    }


}