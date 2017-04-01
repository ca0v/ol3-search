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

const olFormatFilter = <{
    like: any;
    or: any;
}><any>ol.format["filter"];

export module WfsGeocode {

    export interface WfsRequest {
        query?: string;
        // namespace
        featureNS?: string;
        // namespace prefix
        featurePrefix?: string;
        // geometry types
        featureTypes?: string[];
        // field to search
        searchNames?: string[];
        propertyNames?: string[];
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
            query: '',
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
        return [
            {
                name: "query",
                alias: "Search For",
                default: "",
                length: 50
            },
            {
                name: "bounded",
                alias: "Current Extent?",
                default: true
            }
        ];
    }

    execute(options: Request<WfsGeocode.WfsRequest>) {
        options = this.getParameters(options, this.options.map);
        let d = $.Deferred<Result<WfsGeocode.WfsResult>[]>();
        $.ajax({
            url: options.url,
            method: options.method,
            contentType: options.contentType,
            data: options.params,
            dataType: options.dataType,
            jsonp: options.callbackName
        })
            .then(json => d.resolve(this.handleResponse(json)))
            .fail(() => d.reject("geocoder failed"));
        return d;
    }

    private getParameters(options: Request<WfsGeocode.WfsRequest>, map?: ol.Map) {
        defaults(options, this.options);
        defaults(options.params, this.options.params);

        let format = new ol.format.WFS();

        if (options.params.query) {
            let searchText = options.params.query.replace(/ /g, "*");
            let filters = options.params.searchNames.map(searchName => olFormatFilter.like(searchName, `*${searchText}*`));
            let filter = (filters.length > 1) ? olFormatFilter.or.apply(olFormatFilter.or, filters) : filters[0];
            options.filter = filter;
        }

        if (map && options.bounded && !options.extent) {
            let extent = map.getView().calculateExtent(map.getSize());
            let p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
            options.extent = p.transform(map.getView().getProjection(), options.internalSrs).getExtent();
        }

        let getFeatureRequest = <HTMLElement>format.writeGetFeature({
            featureNS: options.params.featureNS,
            featurePrefix: options.params.featurePrefix,
            featureTypes: options.params.featureTypes,
            srsName: options.internalSrs,
            outputFormat: 'GML3',
            maxFeatures: <number>options.count,
            geometryName: 'geom',
            propertyNames: options.params.propertyNames,
            bbox: <ol.Extent>options.extent,
            filter: options.filter
        });

        options.params = <any>getFeatureRequest.outerHTML;

        return options;
    }

    private handleResponse(response: WfsGeocode.WfsResponse): Result<WfsGeocode.WfsResult>[] {
        let format = new ol.format.WFS();
        let result = format.readFeatures(response);

        let asExtent = (r: ol.Feature) => {
            let extent = r.getGeometry().getExtent();
            return ol.geom.Polygon.fromExtent(extent);
        };

        return result.map(f => {
            let extent = asExtent(f);
            let [lon, lat] = extent.getInteriorPoint().getCoordinates();

            return {
                placeId: "" + f.getId(),
                title: f.get(this.options.params.propertyNames[0]),
                lat: lat,
                lon: lon,
                extent: extent,
                address: <any>this.options.params.propertyNames.map(n => f.get(n)),
                original: f
            }
        });
    }
}