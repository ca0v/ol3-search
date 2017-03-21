import ol = require("openlayers");
import { Request, Result, SearchField } from "./index";

const SampleError = {
    "authenticationResultCode": "NoCredentials",
    "brandLogoUri": "http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png",
    "copyright": "Copyright © 2017 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
    "errorDetails": ["Access was denied. You may have entered your credentials incorrectly, or you might not have access to the requested resource or operation."],
    "resourceSets": [],
    "statusCode": 401,
    "statusDescription": "Unauthorized",
    "traceId": "4c1f421581304d2db0de98984d325333|BN20130523|7.7.0.0|"
}

const SampleResponse = {
    "authenticationResultCode": "ValidCredentials",
    "brandLogoUri": "http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png",
    "copyright": "Copyright © 2017 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
    "resourceSets": [{
        "estimatedTotal": 1,
        "resources": [{
            "__type": "Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1",
            "bbox": [33.8865585327148, -118.485336303711, 34.004810333252, -118.296867370605],
            "name": "Los Angeles International Airport, CA",
            "point": {
                "type": "Point",
                "coordinates": [33.9457054138184, -118.391105651855]
            },
            "address": {
                "adminDistrict": "CA",
                "adminDistrict2": "Los Angeles County",
                "countryRegion": "United States",
                "formattedAddress": "Los Angeles International Airport, CA",
                "locality": "Los Angeles"
            },
            "confidence": "High",
            "entityType": "Airport",
            "geocodePoints": [{
                "type": "Point",
                "coordinates": [33.9457054138184, -118.391105651855],
                "calculationMethod": "Rooftop",
                "usageTypes": ["Display"]
            }],
            "matchCodes": ["Good"]
        }]
    }],
    "statusCode": 200,
    "statusDescription": "OK",
    "traceId": "a7eba6ba242b4ffe93e28046a127dd23|BN20130442|7.7.0.0|"
}

export module Bing {

    export interface Point {
        type: string;
        coordinates: number[];
    }

    export interface Address {
        addressLine: string;
        neighborhood: string;        
        locality: string;
        adminDistrict: string;
        adminDistrict2: string;
        countryRegion: string;
        countryRegionIso2: string;
        postalCode: string;
        formattedAddress: string;
        landmark: string;
    }

    export interface GeocodePoint {
        type: string;
        coordinates: number[];
        calculationMethod: string;
        usageTypes: string[];
    }

    export interface Resource {
        bbox: number[];
        name: string;
        point: Point;
        address: Address;
        confidence: string;
        entityType: string;
        geocodePoints: GeocodePoint[];
        matchCodes: Array<'Good'|'Ambiguous'|'UpHierarchy'>;
    }

    export interface ResourceSet {
        estimatedTotal: number;
        resources: Resource[];
    }

    export interface Response {
        authenticationResultCode: string;
        brandLogoUri: string;
        copyright: string;
        resourceSets: ResourceSet[];
        statusCode: number;
        statusDescription: string;
        traceId: string;
    }
}

export class Bing {

    constructor(public settings = {
        url: '//dev.virtualearth.net/REST/v1/Locations',
        callbackName: 'jsonp',
        dataType: 'jsonp',
        method: 'GET',
        params: {
            query: '',
            key: 'As7mdqzf-iBHBqrSHonXJQHrytZ_SL9Z2ojSyOAYoWTceHYYLKUy0C8X8R5IABRg',
            includeNeighborhood: 0,
            maxResults: 10
        }
    }) {
    }

    get fields() {
        return <Array<SearchField>>[{
            name: "query",
            alias: "Location",
            length: 50
        },
        {
            name: "includeNeighborhood",
            alias: "Include Neighborhoods?",
            default: false
        }]
    }

    getParameters(options: {
        params: {
            query?: string;
            key?: string;
            includeNeighborhood?: boolean;
            maxResults?: number;
        }
    }, map?: ol.Map) {
        return {
            url: this.settings.url,
            callbackName: this.settings.callbackName,
            dataType: this.settings.dataType,
            method: this.settings.method,
            params: {
                query: options.params.query,
                key: options.params.key || this.settings.params.key,
                includeNeighborhood: options.params.includeNeighborhood || this.settings.params.includeNeighborhood,
                maxResults: options.params.maxResults || this.settings.params.maxResults
            }
        };
    }

    handleResponse(response: Bing.Response): Result<Bing.Resource>[] {

        let asExtent = (r: Bing.Resource) => {
            let v = r.bbox;
            return new ol.geom.Polygon([[[v[1], v[0]], [v[3], v[2]]]]);
        };

        return response.resourceSets.map(resourceSet => {

            return resourceSet.resources.map(result => ({
                extent: asExtent(result),
                title: result.name,
                lon: result.point.coordinates[1],
                lat: result.point.coordinates[0],
                address: {
                    name: result.address.formattedAddress,
                    road: result.address.adminDistrict,
                    postcode: result.address.adminDistrict2,
                    city: result.address.countryRegion,
                    state: "",
                    country: "",
                },
                original: result
            }));
        })[0];
    }
}