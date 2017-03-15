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

export interface GoogleResponseItem {
    address_components: Array<GoogleAddressComponent>;
    geometry: {
        location: {
            lat: number;
            lng: number;
        }
    };
    formatted_address: string;
}

export interface GoogleResponse {
    status: string;
    results: Array<GoogleResponseItem>
}

export interface GoogleOptions {
    url?: string;
    params?: {
        address?: string;
        key?: string;
        language?: string;
    }
}

export type ResultType = Result<GoogleResponseItem>;

export class Google {

    static DEFAULT_OPTIONS = <GoogleOptions>{
        url: '//maps.googleapis.com/maps/api/geocode/json',
        params: {
            address: '',
            key: '',
            language: 'en-US'
        }
    }

    private options: GoogleOptions;

    constructor(options?: GoogleOptions) {
        this.options = defaults(options || {}, Google.DEFAULT_OPTIONS);
    }

    public getParameters(options: {
        query?: string;
        key?: string;
        lang?: string;
    }, map?: ol.Map) {
        return {
            url: this.options.url,
            params: {
                address: options.query || this.options.params.address,
                key: options.key || this.options.params.key,
                language: options.lang || this.options.params.language
            }
        };
    }

    public handleResponse(response: GoogleResponse) {

        console.assert(response.status === "OK", "status OK");

        return response.results.map(result => {
            let returnValue = <ResultType>{
                lat: result.geometry.location.lat,
                lon: result.geometry.location.lng,
                address: {},
                original: result
            };
            this.parseComponents(result.address_components, returnValue);
            return returnValue;
        });

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