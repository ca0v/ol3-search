/**
 * Searches a WFS service
 * The current architecture assumes the response works nicely with $.ajax
 * In this case the ol WFS request builder will produce XML so we'll need
 * to extend that logic to work with XML.  
 * This would be a good time to wrap $.ajax in a module.
 * 
 * Framework todos...
 * Eliminate custom query params from other providers and rely on options.query
 * Replace option.bounded with option.extent
 * Add options.count
 */

import ol = require("openlayers");
import { defaults } from "ol3-fun";
import { Request, Result, SearchField, Geocoder } from "./index";

export module WfsGeocode {

    export interface WfsRequest {
        // namespace
        featureNS: string;
        // namespace prefix
        featurePrefix: string;
        // geometry types
        featureTypes: ('Point' | 'MultiLineString' | 'MultiPolygon')[];
        // field to search
        searchName: string;
    }

    export interface WfsResult {

    }

    export interface WfsResponse {

    }
}

export interface WfsGeocodeOptions extends Request<WfsGeocode.WfsRequest> {
}

export class WfsGeocode implements Geocoder<WfsGeocode.WfsRequest, WfsGeocode.WfsResult> {

    private options: WfsGeocodeOptions;

    static DEFAULT_OPTIONS = <WfsGeocodeOptions>{
        url: '//dev.virtualearth.net/REST/v1/Locations',
        dataType: 'xml',
        method: 'GET',
        params: {
            featureNS: "http://www.opengeospatial.net/cite",
            featurePrefix: "cite",
            count: 1,
            featureTypes: ["Point", "MultiLineString", "MultiPolygon"],
            searchName: "address"
        }
    }

    constructor(options?: WfsGeocodeOptions) {
        this.options = defaults(options || {}, WfsGeocode.DEFAULT_OPTIONS);
    }

    get fields(): SearchField[] {
        return [];
    }

    getParameters(options: Request<WfsGeocode.WfsRequest>, map?: ol.Map) {
        let format = new ol.format.WFS();

        let filter = ol.format.filter.isLike(options.params.searchName, options.query);

        let getFeatureRequest = format.writeGetFeature({
            featureNS: options.params.featureNS,
            featurePrefix: options.params.featurePrefix,
            featureTypes: options.params.featureTypes,
            srsName: "EPSG:4326",
            outputFormat: '',
            maxFeatures: <number>options.count,
            geometryName: 'geom',
            propertyNames: [''],
            bbox: <ol.Extent>options.extent,
            filter: filter
        });

        options.params = getFeatureRequest;

        return options;
    }

    handleResponse(response: WfsGeocode.WfsResponse): Result<WfsGeocode.WfsResult>[] {
        return [];
    }
}