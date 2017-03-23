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
 * 
 * wfs filter options:
    * and	
    * or	
    * not	
    * bbox	
    * intersects	
    * within	
    * equalTo	
    * notEqualTo	
    * lessThan	
    * lessThanOrEqualTo	
    * greaterThan	
    * greaterThanOrEqualTo	
    * isNull	
    * between	
    * like	
    * And	
    * Bbox	
    * Comparison	
    * ComparisonBinary	
    * EqualTo	
    * Filter	
    * GreaterThan	
    * GreaterThanOrEqualTo	
    * Intersects	
    * IsBetween	
    * IsLike	
    * IsNull	
    * LessThan	
    * LessThanOrEqualTo	
    * Not	
    * NotEqualTo	
    * Or	
    * Spatial	
    * Within
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
        featureTypes: string[];
        // field to search
        searchNames: string[];
        propertyNames: string[];
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
        url: 'http://localhost:8080/geoserver/cite/wfs',
        dataType: 'xml',
        contentType: 'application/xml',
        method: 'POST',
        params: {
            featureNS: "http://www.opengeospatial.net/cite",
            featurePrefix: "cite",
            count: 1,
            featureTypes: ["addresses"],
            searchNames: ["comment", "strname"],
            propertyNames: ["comment", "strname", "geom"]
        }
    }

    constructor(options?: WfsGeocodeOptions) {
        this.options = defaults(options || {}, WfsGeocode.DEFAULT_OPTIONS);
    }

    get fields(): SearchField[] {
        return [];
    }

    getParameters(options: Request<WfsGeocode.WfsRequest>, map?: ol.Map) {
        defaults(options.params, this.options.params);
        defaults(options, this.options);

        let format = new ol.format.WFS();

        let searchText = options.query.replace(/ /g, "*");
        let filters = options.params.searchNames.map(searchName => ol.format.filter.like(searchName, `*${searchText}*`));
        let filter = (filters.length > 1) ? ol.format.filter.or.apply(ol.format.filter.or, filters) : filter[0];

        if (map && options.bounded && !options.extent) {
            let extent = map.getView().calculateExtent(map.getSize());
            let p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
            options.extent = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent();
        }

        let getFeatureRequest = format.writeGetFeature({
            featureNS: options.params.featureNS,
            featurePrefix: options.params.featurePrefix,
            featureTypes: options.params.featureTypes,
            srsName: "EPSG:4326",
            outputFormat: '',
            maxFeatures: <number>options.count,
            geometryName: 'geom',
            propertyNames: options.params.propertyNames,
            bbox: <ol.Extent>options.extent,
            filter: filter
        });

        options.params = getFeatureRequest.outerHTML;

        return options;
    }

    handleResponse(response: WfsGeocode.WfsResponse): Result<WfsGeocode.WfsResult>[] {
        let format = new ol.format.WFS();
        let result = format.readFeatures(response);

        let asExtent = (r: ol.Feature) => {
            let [lon1, lat1, lon2, lat2] = r.getGeometry().getExtent();

            return new ol.geom.Polygon([[
                [lat1, lon1],
                [lat1, lon2],
                [lat2, lon2],
                [lat2, lon1],
                [lat1, lon1]
            ]]);
        };

        return result.map(f => {
            let [lat, lon] = ol.extent.getCenter(f.getGeometry().getExtent());

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