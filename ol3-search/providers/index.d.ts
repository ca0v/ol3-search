// to be shared across providers
export interface Result<T> {
    lon: number;
    lat: number;
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

