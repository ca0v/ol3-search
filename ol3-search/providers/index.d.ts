/**
 * Search field meta-data
 */
export interface SearchField {
    // field name
    name: string;
    type?: "string" | "integer" | "number" | "boolean";
    default?: string | number | boolean;
    placeholder?: string;
    // field label
    alias?: string;
    // validation expression
    regex?: RegExp;
    // dropdown/checkbox options
    domain?: {
        type: string;
        name: string;
        codedValues: {
            name: string;
            code: string;
        }[];
    };
    editable?: boolean;
    nullable?: boolean;
    length?: number;
}

/**
 * A common request representation
 */
export interface Request<T> {
    // associated map, for context and potential interactivity
    map?: ol.Map;
    // endpoint to query
    url?: string;
    method?: 'GET' | 'POST';
    // ajax response type, bing uses jsonp, wfs uses xml, others use json
    dataType?: 'json' | 'jsonp' | 'xml' | 'text';
    // ajax content type, required for wfs
    contentType?: 'application/xml' | 'application/json' | 'text/plain';
    // jsonp query parameter identifying the 'callback', required for bing
    callbackName?: string;
    // API key, when applicable
    key?: string;
    // desired language, when applicable
    lang?: string;
    // limit the number of return values
    count?: number;
    // ol.format filter
    filter?: any; //ol.format;
    // EPSG:4326
    internalSrs?: string;
    // prefer results within this extent
    extent?: ol.Extent;
    // do not show results outside of extent
    bounded?: boolean;
    // generic and service-specific query settings
    params?: T & {
        // query to be turned into service-specific parameter
        query?: string;
    }
}

/**
 * A common result representation
 */
export interface Result<T> {
    // idenfier the search result to detect and prevent duplicates
    placeId: string;
    // general description from service
    title: string;
    // specific location (change to ol.geom.Point)
    lon: number;
    lat: number;
    // general location
    extent: ol.geom.Polygon;
    // best attempt and making it look like an address (drop this part?)
    address: {
        name: string;
        road: string;
        postcode: string;
        city: string;
        state: string;
        country: string;
    };
    // full content of original response
    original: T;
}

/**
 * Minimal provider interface
 */
export interface Geocoder<TRequest, TResult> {
    // suggested search fields
    fields: SearchField[];
    // execute the query/geocoding service
    execute(options: Request<TRequest>): JQueryPromise<Result<TResult>[]>;
}
