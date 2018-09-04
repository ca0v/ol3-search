/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    export function uuid(): string;
    export function asArray<T extends HTMLInputElement>(list: NodeList): T[];
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
    export function parse<T>(v: string, type: T): T;
    /**
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
    export function getQueryParameters(options: any, url?: string): void;
    /**
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     */
    export function getParameterByName(name: string, url?: string): string;
    /**
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    export function doif<T>(v: T, cb: (v: T) => void): void;
    /**
     * @param a target
     * @param b values to shallow copy into target
     */
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    /**
     * @param a target
     * @param b values to copy into target if they are not already present
     */
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    /**
     * Adds exactly one instance of the CSS to the app with a mechanism
     * for disposing by invoking the destructor returned by this method.
     * Note the css will not be removed until the dependency count reaches
     * 0 meaning the number of calls to cssin('id') must match the number
     * of times the destructor is invoked.
     * let d1 = cssin('foo', '.foo { background: white }');
     * let d2 = cssin('foo', '.foo { background: white }');
     * d1(); // reduce dependency count
     * d2(); // really remove the css
     * @param name unique id for this style tag
     * @param css css content
     * @returns destructor
     */
    export function cssin(name: string, css: string): () => void;
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    export function range(n: number): number[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    export function parse(dmsString: string): {
        lon: number;
        lat: number;
    } | number;
}
declare module "node_modules/ol3-fun/index" {
    import common = require("node_modules/ol3-fun/ol3-fun/common");
    import navigation = require("node_modules/ol3-fun/ol3-fun/navigation");
    import dms = require("node_modules/ol3-fun/ol3-fun/parse-dms");
    let index: typeof common & {
        dms: typeof dms;
        navigation: typeof navigation;
    };
    export = index;
}
declare module "ol3-search/ol3-search" {
    import ol = require("openlayers");
    import { olx } from "openlayers";
    import { SearchField } from "./providers/index";
    export interface IOptions extends olx.control.ControlOptions {
        className?: string;
        position?: string;
        expanded?: boolean;
        hideButton?: boolean;
        autoChange?: boolean;
        autoClear?: boolean;
        autoCollapse?: boolean;
        canCollapse?: boolean;
        closedText?: string;
        showLabels?: boolean;
        openedText?: string;
        source?: HTMLElement;
        target?: HTMLElement;
        searchButton?: HTMLInputElement;
        title?: string;
        fields?: SearchField[];
    }
    export class SearchForm extends ol.control.Control {
        static DEFAULT_OPTIONS: IOptions;
        static create(options?: IOptions): SearchForm;
        button: HTMLButtonElement;
        form: HTMLFormElement;
        options: IOptions;
        handlers: Array<() => void>;
        private constructor();
        destroy(): void;
        setPosition(position: string): void;
        cssin(): void;
        collapse(options?: IOptions): void;
        expand(options?: IOptions): void;
        on(type: string, cb: ol.EventsListenerFunctionType): any;
        on<T>(type: "change", cb: ((args: {
            type: string;
            target: SearchForm;
            value: {
                [name: string]: any;
            };
        }) => void) | ol.EventsListenerFunctionType): any;
        readonly value: {
            [name: string]: any;
        };
    }
}
declare module "index" {
    /**
     * forces 'ol3-popup' namespace
     */
    import Input = require("ol3-search/ol3-search");
    export = Input;
}
declare module "ol3-search/providers/bing" {
    import { Request, Result, SearchField, Geocoder } from "./index";
    export module BingGeocode {
        interface Request {
            query?: string;
            key?: string;
            includeNeighborhood?: 0 | 1;
            maxResults?: number;
            umv?: string;
            ul?: string;
            userRegion?: string;
        }
        interface Point {
            type: string;
            coordinates: number[];
        }
        interface Address {
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
        interface GeocodePoint {
            type: string;
            coordinates: number[];
            calculationMethod: string;
            usageTypes: string[];
        }
        interface Resource {
            bbox: number[];
            name: string;
            point: Point;
            address: Address;
            confidence: string;
            entityType: string;
            geocodePoints: GeocodePoint[];
            matchCodes: Array<'Good' | 'Ambiguous' | 'UpHierarchy'>;
        }
        interface ResourceSet {
            estimatedTotal: number;
            resources: Resource[];
        }
        interface Response {
            authenticationResultCode: string;
            brandLogoUri: string;
            copyright: string;
            resourceSets: ResourceSet[];
            statusCode: number;
            statusDescription: string;
            traceId: string;
        }
    }
    export interface BingGeocodeOptions extends Request<BingGeocode.Request> {
    }
    export class BingGeocode implements Geocoder<BingGeocode.Request, BingGeocode.Resource> {
        options: BingGeocodeOptions;
        static DEFAULT_OPTIONS: BingGeocodeOptions;
        constructor(options?: BingGeocodeOptions);
        readonly fields: SearchField[];
        execute(options: Request<BingGeocode.Request>): JQuery.Deferred<Result<BingGeocode.Resource>[], any, any>;
        private getParameters;
        private handleResponse;
    }
}
declare module "ol3-search/providers/google" {
    import { Geocoder, Request, Result, SearchField } from "./index";
    export module GoogleGeocode {
        interface Request {
            address?: string;
            key?: string;
            language?: string;
            route?: string;
            locality?: string;
            administrative_area?: string;
            postal_code?: string;
            country?: string;
            components?: string;
            bounds?: string;
            region?: string;
        }
        interface AddressComponent {
            types: Array<string>;
            long_name: string;
        }
        interface ResponseItem {
            address_components: Array<AddressComponent>;
            geometry: {
                location: {
                    lat: number;
                    lng: number;
                };
                location_type: string;
                viewport: {
                    northeast: {
                        lat: number;
                        lng: number;
                    };
                    southwest: {
                        lat: number;
                        lng: number;
                    };
                };
            };
            formatted_address: string;
            place_id: string;
            types: string[];
        }
        interface Response {
            status: string;
            results: Array<ResponseItem>;
        }
        type ResultType = Result<ResponseItem>;
    }
    export interface GoogleGeocodeOptions extends Request<GoogleGeocode.Request> {
    }
    export class GoogleGeocode implements Geocoder<GoogleGeocode.Request, GoogleGeocode.ResponseItem> {
        static DEFAULT_OPTIONS: GoogleGeocodeOptions;
        private options;
        readonly fields: SearchField[];
        constructor(options?: GoogleGeocodeOptions);
        execute(options: Request<GoogleGeocode.Request>): JQuery.Deferred<Result<GoogleGeocode.ResponseItem>[], any, any>;
        private getParameters;
        private handleResponse;
        private parseComponents;
    }
}
declare module "ol3-search/providers/layer" {
    /**
     * Searches features in a layer
     */
    import ol = require("openlayers");
    import { Request, Result, SearchField, Geocoder } from "./index";
    export module LayerGeocode {
        interface Request {
            query: string;
            layers?: ol.layer.Vector[];
            searchNames: string[];
            propertyNames?: string[];
        }
        interface Result {
        }
        interface Response {
            features: ol.Feature[];
        }
    }
    export interface LayerGeocodeOptions extends Request<LayerGeocode.Request> {
    }
    export class LayerGeocode implements Geocoder<LayerGeocode.Request, LayerGeocode.Result> {
        options: LayerGeocodeOptions;
        static DEFAULT_OPTIONS: LayerGeocodeOptions;
        constructor(options?: LayerGeocodeOptions);
        readonly fields: SearchField[];
        /**
         * Performs the actual search
         */
        execute(options: Request<LayerGeocode.Request>): JQuery.Deferred<Result<LayerGeocode.Result>[], any, any>;
        private getParameters;
        private handleResponse;
    }
}
declare module "ol3-search/providers/mapquest" {
    import { Geocoder, Request, Result, SearchField } from "./index";
    export module MapQuestGeocode {
        interface Request {
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
        interface Resource {
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
            };
        }
        type Response = Resource[];
    }
    export interface MapQuestGeocodeOptions extends Request<MapQuestGeocode.Request> {
    }
    export class MapQuestGeocode implements Geocoder<MapQuestGeocode.Request, MapQuestGeocode.Resource> {
        private options;
        private static DEFAULT_OPTIONS;
        constructor(options?: typeof MapQuestGeocode.DEFAULT_OPTIONS);
        readonly fields: SearchField[];
        execute(options: Request<MapQuestGeocode.Request>): JQuery.Deferred<Result<MapQuestGeocode.Resource>[], any, any>;
        private getParameters;
        private handleResponse;
    }
}
declare module "ol3-search/providers/osm" {
    import { Geocoder, Request, Result, SearchField } from "./index";
    export module OpenStreetGeocode {
        interface Request {
            format?: "json";
            callback?: "define";
            "accept-language"?: "en-US";
            q?: string | {
                street?: {
                    housenumber?: number;
                    streetname?: string;
                };
                city?: string;
                county?: string;
                state?: string;
                country?: string;
                postalcode?: string;
            };
            countrycodes?: string[];
            viewbox?: {
                left: number;
                top: number;
                right: number;
                bottom: number;
            };
            bounded?: boolean;
            addressdetails?: boolean;
            email?: string;
            exclude_place_ids?: string[];
            limit?: number;
            dedupe?: boolean;
            polygon?: "geojson" | "kml" | "svg" | "wkt";
            extratags?: boolean;
            namedetails?: boolean;
        }
        interface Address {
            road: string;
            state: string;
            country: string;
        }
        interface Address {
            neighbourhood: string;
            postcode: string;
            city: string;
            town: string;
        }
        interface Address {
            peak: string;
            county: string;
            country_code: string;
            sports_centre: string;
        }
        interface ResponseItem {
            place_id: string;
            licence: string;
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
            address: Address;
        }
        type Response = ResponseItem[];
    }
    export interface OpenStreetGeocodeOptions extends Request<OpenStreetGeocode.Request> {
    }
    export class OpenStreetGeocode implements Geocoder<OpenStreetGeocode.Request, OpenStreetGeocode.ResponseItem> {
        static DEFAULT_OPTIONS: OpenStreetGeocodeOptions;
        private options;
        constructor(options?: OpenStreetGeocodeOptions);
        readonly fields: SearchField[];
        execute(options: Request<OpenStreetGeocode.Request>): JQuery.Deferred<Result<OpenStreetGeocode.ResponseItem>[], any, any>;
        private getParameters;
        private handleResponse;
    }
}
declare module "ol3-search/providers/wfs" {
    import { Request, Result, SearchField, Geocoder } from "./index";
    export module WfsGeocode {
        interface WfsRequest {
            query?: string;
            featureNS?: string;
            featurePrefix?: string;
            featureTypes?: string[];
            searchNames?: string[];
            propertyNames?: string[];
        }
        interface WfsResult {
        }
        interface WfsResponse {
        }
    }
    export interface WfsGeocodeOptions extends Request<WfsGeocode.WfsRequest> {
    }
    export class WfsGeocode implements Geocoder<WfsGeocode.WfsRequest, WfsGeocode.WfsResult> {
        private options;
        static DEFAULT_OPTIONS: WfsGeocodeOptions;
        constructor(options?: WfsGeocodeOptions);
        readonly fields: SearchField[];
        execute(options: Request<WfsGeocode.WfsRequest>): JQuery.Deferred<Result<WfsGeocode.WfsResult>[], any, any>;
        private getParameters;
        private handleResponse;
    }
}
