/**
 * A common result representation
 */
export interface Result<T> {
    title: string;
    lon: number;
    lat: number;
    extent: ol.geom.Polygon;
    address: {
        name: string;
        road: string;
        postcode: string;
        city: string;
        state: string;
        country: string;
    },
    original: T
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
    // fallback to service-specific query in params
    query?: string;
    // API key, when applicable
    key?: string;
    // desired language, when applicable
    lang?: string;
    // limit the number of return values
    count?: number;
    // prefer results within this extent
    extent?: ol.Extent;
    // do not show results outside of extent
    bounded?: boolean;
    // service-specific settings
    params?: T
}

/**
 * Search field meta-data
 */
export interface SearchField {
    name: string;
    type?: "string" | "integer" | "number" | "boolean";
    default?: string | number | boolean;
    placeholder?: string;
    alias?: string;
    regex?: RegExp;
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

export interface Geocoder<TRequest, TResult> {
    fields: SearchField[];
    execute(options: TRequest): JQueryPromise<Result<TResult>[]>;
}
