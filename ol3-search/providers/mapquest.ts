import $ = require("jquery");
import ol = require("openlayers");
import { defaults } from "ol3-fun/index";
import { Geocoder, Request, Result, SearchField } from "./index";

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
        // lat, lat, lon, lon
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


export class MapQuestGeocode implements Geocoder<MapQuestGeocode.Request, MapQuestGeocode.Resource> {

    private options: MapQuestGeocodeOptions;

    private static DEFAULT_OPTIONS = <MapQuestGeocodeOptions>{
        url: '//open.mapquestapi.com/nominatim/v1/search.php',
        params: {
            q: '',
            key: 'X2CL1j8ekBW6g0U80tP0OogXILAQWkG4',
            format: 'json',
            addressdetails: 1,
            limit: 1,
            countrycodes: 'US',
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
        },
        {
            name: "bounded",
            alias: "Current Extent?",
            default: true
        }
        ]
    }

    execute(options: Request<MapQuestGeocode.Request>) {
        options = this.getParameters(options, this.options.map);
        let d = $.Deferred<Result<MapQuestGeocode.Resource>[]>();

        // cleanup
        delete options.params.query;

        $.ajax({
            url: options.url,
            method: options.method,
            data: options.params,
            dataType: options.dataType,
            jsonp: options.callbackName
        })
            .then(json => d.resolve(this.handleResponse(json)))
            .fail(() => d.reject("geocoder failed"));
            
        return d;
    }

    private getParameters(options: Request<MapQuestGeocode.Request>, map?: ol.Map) {
        defaults(options.params, this.options.params);
        defaults(options, this.options);

        // compute viewbox
        if (map && options.bounded && !options.params.viewbox) {
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

    private handleResponse(response: MapQuestGeocode.Response): Result<MapQuestGeocode.Resource>[] {

        let asExtent = (r: MapQuestGeocode.Resource) => {
            let [lat1, lat2, lon1, lon2] = r.boundingbox.map(v => parseFloat(v));
            return ol.geom.Polygon.fromExtent([lon1, lat1, lon2, lat2]);
        };

        return response.map(result => ({
            placeId: result.place_id,
            title: result.display_name,
            lon: parseFloat(result.lon),
            lat: parseFloat(result.lat),
            extent: asExtent(result),
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