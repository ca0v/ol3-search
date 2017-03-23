/**
 * Searches features in a layer
 */

import ol = require("openlayers");
import { defaults } from "ol3-fun";
import { Request, Result, SearchField, Geocoder } from "./index";

export module LayerGeocode {

    export interface Request {
        map: ol.Map;
        layers: ol.layer.Vector[];
        searchNames: string[];
        propertyNames: string[];
    }

    export interface Result {

    }

    export interface Response {
        features: ol.Feature[];
    }
}

export interface LayerGeocodeOptions extends Request<LayerGeocode.Request> {
}

export class LayerGeocode implements Geocoder<LayerGeocode.Request, LayerGeocode.Result> {

    public options: LayerGeocodeOptions;

    static DEFAULT_OPTIONS = <LayerGeocodeOptions>{
    }

    constructor(options?: LayerGeocodeOptions) {
        this.options = defaults(options || {}, LayerGeocode.DEFAULT_OPTIONS);
    }

    get fields(): SearchField[] {
        return [];
    }

    getParameters(options: Request<LayerGeocode.Request>, map?: ol.Map) {
        defaults(options.params, this.options.params);
        defaults(options, this.options);
        return options;
    }

    /**
     * Performs the actual search
     */
    execute(options: Request<LayerGeocode.Request>): LayerGeocode.Response {
        let searchText = options.query;
        let results = <ol.Feature[]>[];
        options.params.layers.forEach(l => {
            let features = l.getSource().getFeatures();
            results = results.concat(features.filter(f => {
                return options.params.propertyNames.some(propertyName => {
                    let value = <string>f.get(propertyName);
                    return -1 < value.indexOf(searchText);
                });
            }));
        });

        if (0 < options.count && options.count < results.length) {
            // TODO: remove all but the best matches
        }
        results = results.map(f => f.clone());
        results.forEach(f => f.getGeometry().transform(options.params.map.getView().getProjection(), "EPSG:4326"));
        return { features: results };
    }

    handleResponse(response: LayerGeocode.Response): Result<LayerGeocode.Result>[] {

        let asExtent = (r: ol.Feature) =>  ol.geom.Polygon.fromExtent(r.getGeometry().getExtent());

        return response.features.map(f => {
            let [lon, lat] = ol.extent.getCenter(f.getGeometry().getExtent());

            return {
                title: f.get(this.options.params.propertyNames[0]),
                lat: lat,
                lon: lon,
                extent: asExtent(f),
                address: <any>this.options.params.propertyNames.map(n => f.get(n)),
                original: f
            }
        });
    }
}