import ol = require("openlayers");
import { defaults } from "ol3-fun";
import { Request, Result, SearchField } from "./index";

const SampleResponse = [{
    "place_id": "96646138",
    "licence": "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
    "osm_type": "way",
    "osm_id": "131190417",
    "boundingbox": ["33.9311771", "33.9530757", "-118.4387216", "-118.3701912"],
    "lat": "33.94203285",
    "lon": "-118.410103847565",
    "display_name": "Los Angeles International Airport, Service road S, Westchester, Playa del Rey, Los Angeles, Los Angeles County, California, 90245, United States of America",
    "class": "aeroway",
    "type": "aerodrome",
    "importance": 0.50388163735627,
    "icon": "http:\/\/ip-10-98-174-147.mq-us-east-1.ec2.aolcloud.net:8000\/nominatim\/v1\/images\/mapicons\/transport_airport2.p.20.png",
    "address": {
        "aerodrome": "Los Angeles International Airport",
        "road": "Service road S",
        "neighbourhood": "Westchester",
        "suburb": "Playa del Rey",
        "city": "Los Angeles",
        "county": "Los Angeles County",
        "state": "California",
        "postcode": "90245",
        "country": "United States of America",
        "country_code": "us"
    }
}];

export module MapQuestGeocode {

    export interface Request {
        viewbox?: string;
        bounded?: 0 | 1;
        q: string;
        key: string;
        format?: string;
        addressdetails?: 0 | 1;
        limit?: number;
        countrycodes?: string;
        'accept-language': string;
    }

    export interface Resource {
        place_id: string;
        license: string;
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
        address: {
            neighbourhood: string;
            road: string;
            postcode: string;
            city: string;
            town: string;
            state: string;
            country: string;
        }
    }

    export type Response = Resource[];

}

export interface MapQuestGeocodeOptions extends Request<MapQuestGeocode.Request> {
}


export class MapQuestGeocode {

    private options: MapQuestGeocodeOptions;

    private static DEFAULT_OPTIONS = <MapQuestGeocodeOptions>{
        url: '//open.mapquestapi.com/nominatim/v1/search.php',
        params: {
            q: '',
            key: 'X2CL1j8ekBW6g0U80tP0OogXILAQWkG4',
            format: 'json',
            addressdetails: 1,
            limit: 1,
            countrycodes: '',
            'accept-language': 'en-US'
        }
    };

    constructor(options?: typeof MapQuestGeocode.DEFAULT_OPTIONS) {
        this.options = defaults(options || {}, MapQuestGeocode.DEFAULT_OPTIONS);
    }

    get fields() {
        return <Array<SearchField>>[{
            name: "q",
            alias: "Location",
            length: 50
        }]
    }

    getParameters(options: Request<MapQuestGeocode.Request>, map?: ol.Map) {
        defaults(options.params, this.options.params);
        defaults(options, this.options);

        if (map && options.bounded) {
            let extent = map.getView().calculateExtent(map.getSize());
            let p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
            {
                let b = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent().map(v => v.toFixed(6));
                options.params.viewbox = `${b[0]},${b[3]},${b[2]},${b[1]}`;
                options.params.bounded = 0; // viewbox is just a suggestion
            }
        }
        return options;
    }

    handleResponse(response: MapQuestGeocode.Response): Result<MapQuestGeocode.Resource>[] {

        let asExtent = (r: MapQuestGeocode.Resource) => {
            let v = r.boundingbox.map(v => parseFloat(v));
            return new ol.geom.Polygon([[[v[2], v[0]], [v[3], v[1]]]]);
        };

        return response.map(result => ({
            title: result.display_name,
            extent: asExtent(result),
            lon: parseFloat(result.lon),
            lat: parseFloat(result.lat),
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