// to be shared across providers
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

export interface Request<T> {
    url?: string;
    method?: string;
    dataType?: string;
    callbackName?: string;
    query?: string;
    key?: string;
    lang?: string;
    bounded?: boolean;
    params: T
}

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

