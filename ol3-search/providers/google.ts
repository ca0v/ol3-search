import ol = require("openlayers");
import { defaults } from "ol3-fun";
import { Result } from "./index";

export const GoogleMappingTable = {
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

export interface GoogleAddressComponent {
    types: Array<string>;
    long_name: string;
}

export interface GoogleRequest {
    address?: string;
    components?: string;
    key?: string;
    bounds?: string;
    language?: string;
    region?: string;
}

export interface GoogleResponseItem {
    address_components: Array<GoogleAddressComponent>;
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

export interface GoogleResponse {
    status: string;
    results: Array<GoogleResponseItem>
}

export interface GoogleGeocodeOptions {
    url?: string;
    params?: {
        address?: string;
        key?: string;
        language?: string;
        route?: string;
        locality?: string;
        administrative_area?: string;
        postal_code?: string;
        country?: string;
    }
}

export type ResultType = Result<GoogleResponseItem>;

export class GoogleGeocode {

    static DEFAULT_OPTIONS = <GoogleGeocodeOptions>{
        url: '//maps.googleapis.com/maps/api/geocode/json',
        params: {
            address: '',
            key: '',
            language: 'en-US',
            country: 'US'
        }
    }

    private options: GoogleGeocodeOptions;

    constructor(options?: GoogleGeocodeOptions) {
        this.options = defaults(options || {}, GoogleGeocode.DEFAULT_OPTIONS);
    }

    public getParameters(options: {
        query?: string;
        key?: string;
        lang?: string;
        bounded?: boolean;
    }, map?: ol.Map) {
        let params = {
            url: this.options.url,
            params: <GoogleRequest>{
                address: options.query || this.options.params.address,
                key: options.key || this.options.params.key,
                language: options.lang || this.options.params.language
            }
        };
        if (map && options.bounded) {
            let extent = map.getView().calculateExtent(map.getSize());
            let p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
            {
                let b = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent().map(v => v.toFixed(6));
                params.params.bounds = `${b[1]},${b[0]}|${b[3]},${b[2]}`;
            }
        }
        return params;
    }

    public handleResponse(response: GoogleResponse) {

        console.assert(response.status === "OK", "status OK");

        let result = response.results.map(result => {
            let returnValue = <ResultType>{
                lat: result.geometry.location.lat,
                lon: result.geometry.location.lng,
                address: {},
                original: result
            };
            this.parseComponents(result.address_components, returnValue);
            return returnValue;
        });

        return result;
    }

    private parseComponents(address_components: Array<GoogleAddressComponent>, result: ResultType) {
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