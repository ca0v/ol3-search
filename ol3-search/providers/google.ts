import { defaults } from "ol3-fun";

const types = {
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

export interface GoogleOptions {
    url?: string;
    params?: {
        address?: string;
        key?: string;
        language?: string;
    }
}

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

    getParameters(options: {
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

    handleResponse(results: Array<{
        address_components: Array<{
            types: Array<any>;
            long_name: string;
        }>;
        geometry: {
            location: {
                lat: number;
                lng: number;
            }
        };
        formatted_address: string;
    }>) {
        /*
         * @param {Array} details - address_components
         */
        const getDetails = (details: Array<{
            types: Array<any>;
            long_name: string;
        }>) => {
            let parts = <keyof typeof types>{};
            let typeKeys = <Array<keyof typeof types>>Object.keys(types);

            details.forEach(detail => {
                typeKeys.forEach(typeKey => {
                    parts[typeKey] = [];
                    detail.types.forEach(t => {
                        if (0 <= types[typeKey].indexOf(t)) parts[typeKey].push(detail.long_name);
                    });
                })
            });
            return parts;
        };

        return results
            .map(result => {
                let details = getDetails(result.address_components);
                return {
                    empty: Object.keys(details).every(k => !details[k].length),
                    lon: result.geometry.location.lng,
                    lat: result.geometry.location.lat,
                    address: details,
                    original: {
                        formatted: result.formatted_address,
                        details: result.address_components
                    }
                };
            })
            .filter(result => !result.empty);
    }
}