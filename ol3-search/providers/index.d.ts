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
    query?: string;
    key?: string;
    lang?: string;
    bounded?: boolean;
    params: T
}