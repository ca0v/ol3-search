declare module "bower_components/ol3-fun/ol3-fun/common" {
    export function asArray<T extends HTMLInputElement>(list: NodeList): T[];
    export function toggle(e: HTMLElement, className: string, toggle?: boolean): void;
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
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
    export function range(n: number): any[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "bower_components/ol3-fun/ol3-fun/navigation" {
    import ol = require("openlayers");
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): void;
}
declare module "bower_components/ol3-fun/ol3-fun/parse-dms" {
    export function parse(dmsString: string): number | {
        [x: number]: number;
    };
}
declare module "bower_components/ol3-fun/index" {
    import common = require("bower_components/ol3-fun/ol3-fun/common");
    import navigation = require("bower_components/ol3-fun/ol3-fun/navigation");
    import dms = require("bower_components/ol3-fun/ol3-fun/parse-dms");
    let index: typeof common & {
        dms: typeof dms;
        navigation: typeof navigation;
    };
    export = index;
}
declare module "ol3-search/ol3-search" {
    import ol = require("openlayers");
    import { SearchField } from "./providers";
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
        title?: string;
        fields?: SearchField[];
    }
    export class SearchForm extends ol.control.Control {
        static create(options?: IOptions): SearchForm;
        button: HTMLButtonElement;
        form: HTMLFormElement;
        options: IOptions;
        handlers: Array<() => void>;
        constructor(options: IOptions & {
            element: HTMLElement;
            target: HTMLElement;
        });
        destroy(): void;
        setPosition(position: string): void;
        cssin(): void;
        collapse(options?: IOptions): void;
        expand(options?: IOptions): void;
        on(type: string, cb: Function): any;
        on<T>(type: "change", cb: (args: {
            type: string;
            target: SearchForm;
            value: {
                [name: string]: any;
            };
        }) => void): any;
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
declare module "bower_components/ol3-fun/ol3-fun/snapshot" {
    import ol = require("openlayers");
    class Snapshot {
        static render(canvas: HTMLCanvasElement, feature: ol.Feature): void;
        /**
         * convert features into data:image/png;base64;
         */
        static snapshot(feature: ol.Feature): string;
    }
    export = Snapshot;
}
declare module "bower_components/ol3-grid/ol3-grid/ol3-grid" {
    import ol = require("openlayers");
    export interface GridOptions {
        map?: ol.Map;
        className?: string;
        position?: string;
        expanded?: boolean;
        hideButton?: boolean;
        autoCollapse?: boolean;
        autoPan?: boolean;
        canCollapse?: boolean;
        currentExtent?: boolean;
        showIcon?: boolean;
        labelAttributeName?: string;
        closedText?: string;
        openedText?: string;
        element?: HTMLElement;
        target?: HTMLElement;
        layers?: ol.layer.Vector[];
        placeholderText?: string;
        zoomDuration?: number;
        zoomPadding?: number;
        zoomMinResolution?: number;
    }
    export class Grid extends ol.control.Control {
        static DEFAULT_OPTIONS: GridOptions;
        static create(options: GridOptions): Grid;
        private features;
        private button;
        private grid;
        private options;
        handlers: Array<() => void>;
        private constructor(options);
        destroy(): void;
        setPosition(position: string): void;
        cssin(): void;
        redraw(): void;
        private featureMap;
        add(feature: ol.Feature, layer?: ol.layer.Vector): void;
        remove(feature: ol.Feature, layer: ol.layer.Vector): void;
        clear(): void;
        collapse(): void;
        expand(): void;
        on(type: string, cb: Function): ol.Object | ol.Object[];
        on(type: "feature-click", cb: (args: {
            type: "feature-click";
            feature: ol.Feature;
            row: HTMLTableRowElement;
        }) => void): void;
    }
}
declare module "bower_components/ol3-grid/index" {
    import Grid = require("bower_components/ol3-grid/ol3-grid/ol3-grid");
    export = Grid;
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/base" {
    /**
     * implemented by all style serializers
     */
    export interface IConverter<T> {
        fromJson: (json: T) => ol.style.Style;
        toJson(style: ol.style.Style): T;
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer" {
    import ol = require("openlayers");
    import Serializer = require("bower_components/ol3-symbolizer/ol3-symbolizer/format/base");
    export namespace Format {
        type Color = number[] | string;
        type Size = number[];
        type Offset = number[];
        type LineDash = number[];
        interface Fill {
            color?: string;
            gradient?: {
                type?: string;
                stops?: string;
            };
        }
        interface Stroke {
            color?: string;
            width?: number;
            lineCap?: string;
            lineJoin?: string;
            lineDash?: LineDash;
            miterLimit?: number;
        }
        interface Style {
            fill?: Fill;
            image?: Image;
            stroke?: Stroke;
            text?: Text;
            zIndex?: number;
        }
        interface Image {
            opacity?: number;
            rotateWithView?: boolean;
            rotation?: number;
            scale?: number;
            snapToPixel?: boolean;
        }
        interface Circle {
            radius: number;
            stroke?: Stroke;
            fill?: Fill;
            snapToPixel?: boolean;
        }
        interface Star extends Image {
            angle?: number;
            fill?: Fill;
            points?: number;
            stroke?: Stroke;
            radius?: number;
            radius2?: number;
        }
        interface Icon extends Image {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: "fraction" | "pixels";
            anchorYUnits?: "fraction" | "pixels";
            color?: Color;
            crossOrigin?: string;
            src?: string;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            size?: Size;
        }
        interface Text {
            fill?: Fill;
            font?: string;
            offsetX?: number;
            offsetY?: number;
            rotation?: number;
            scale?: number;
            stroke?: Stroke;
            text?: string;
            textAlign?: string;
            textBaseline?: string;
        }
    }
    export namespace Format {
        interface Style {
            image?: Icon & Svg;
            icon?: Icon;
            svg?: Svg;
            star?: Star;
            circle?: Circle;
            text?: Text;
            fill?: Fill;
            stroke?: Stroke;
        }
        interface Icon {
            "anchor-x"?: number;
            "anchor-y"?: number;
        }
        interface Text {
            "offset-x"?: number;
            "offset-y"?: number;
        }
        interface Circle {
            opacity?: number;
        }
        interface Svg {
            anchor?: Offset;
            anchorOrigin?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
            anchorXUnits?: string;
            anchorYUnits?: string;
            color?: Color;
            crossOrigin?: string;
            img?: string;
            imgSize?: Size;
            offset?: Offset;
            offsetOrigin?: 'top_left' | 'top_right' | 'bottom-left' | 'bottom-right';
            path?: string;
            stroke?: Stroke;
            fill?: Fill;
        }
    }
    export class StyleConverter implements Serializer.IConverter<Format.Style> {
        fromJson(json: Format.Style): ol.style.Style;
        toJson(style: ol.style.Style): Format.Style;
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        setGeometry(feature: ol.Feature): ol.geom.Geometry;
        private assign(obj, prop, value);
        private serializeStyle(style);
        private serializeColor(color);
        private serializeFill(fill);
        private deserializeStyle(json);
        private deserializeText(json);
        private deserializeCircle(json);
        private deserializeStar(json);
        private deserializeIcon(json);
        private deserializeSvg(json);
        private deserializeFill(json);
        private deserializeStroke(json);
        private deserializeColor(fill);
        private deserializeLinearGradient(json);
        private deserializeRadialGradient(json);
    }
}
declare module "bower_components/ol3-symbolizer/index" {
    import Symbolizer = require("bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer");
    export = Symbolizer;
}
declare module "ol3-search/providers/osm" {
    import ol = require("openlayers");
    import { Request, Result, SearchField } from "./index";
    export module OpenStreet {
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
    export interface GeocodeOptions extends Request<OpenStreet.Request> {
    }
    export class OpenStreet {
        static DEFAULT_OPTIONS: GeocodeOptions;
        private options;
        constructor(options?: GeocodeOptions);
        readonly fields: SearchField[];
        getParameters(options: Request<OpenStreet.Request>, map?: ol.Map): Request<OpenStreet.Request>;
        handleResponse(response: OpenStreet.Response): Result<OpenStreet.ResponseItem>[];
    }
}
declare module "ol3-search/providers/google" {
    import ol = require("openlayers");
    import { Request, Result, SearchField } from "./index";
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
    export class GoogleGeocode {
        static DEFAULT_OPTIONS: GoogleGeocodeOptions;
        private options;
        readonly fields: SearchField[];
        constructor(options?: GoogleGeocodeOptions);
        getParameters(options: Request<GoogleGeocode.Request>, map?: ol.Map): Request<GoogleGeocode.Request>;
        handleResponse(response: GoogleGeocode.Response): Result<GoogleGeocode.ResponseItem>[];
        private parseComponents(address_components, result);
    }
}
declare module "ol3-search/providers/bing" {
    import ol = require("openlayers");
    import { Result, SearchField } from "./index";
    export module Bing {
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
    export class Bing {
        settings: {
            url: string;
            callbackName: string;
            dataType: string;
            method: string;
            params: {
                query: string;
                key: string;
                includeNeighborhood: number;
                maxResults: number;
            };
        };
        constructor(settings?: {
            url: string;
            callbackName: string;
            dataType: string;
            method: string;
            params: {
                query: string;
                key: string;
                includeNeighborhood: number;
                maxResults: number;
            };
        });
        readonly fields: SearchField[];
        getParameters(options: {
            params: {
                query?: string;
                key?: string;
                includeNeighborhood?: boolean;
                maxResults?: number;
            };
        }, map?: ol.Map): {
            url: string;
            callbackName: string;
            dataType: string;
            method: string;
            params: {
                query: string;
                key: string;
                includeNeighborhood: number | boolean;
                maxResults: number;
            };
        };
        handleResponse(response: Bing.Response): Result<Bing.Resource>[];
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/common/ajax" {
    class Ajax {
        url: string;
        options: {
            use_json: boolean;
            use_cors: boolean;
        };
        constructor(url: string);
        jsonp<T>(args?: any, url?: string): JQueryDeferred<T>;
        private ajax<T>(method, args?, url?);
        get<T>(args?: any): JQueryDeferred<T>;
        post<T>(args?: any): JQueryDeferred<T>;
        put<T>(args?: any): JQueryDeferred<T>;
        delete(args?: any): JQueryDeferred<{}>;
    }
    export = Ajax;
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/ags/ags-catalog" {
    export interface Service {
        name: string;
        type: string;
    }
    export interface CatalogInfo {
        currentVersion: number;
        folders: string[];
        services: Service[];
    }
    export interface SpatialReference {
        wkid: number;
        latestWkid: number;
        wkt: string;
    }
    export interface Extent {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: SpatialReference;
    }
    export interface DocumentInfo {
        Title: string;
        Author: string;
        Comments: string;
        Subject: string;
        Category: string;
        AntialiasingMode: string;
        TextAntialiasingMode: string;
        Keywords: string;
    }
    export interface Layer {
        id: number;
        name: string;
        parentLayerId: number;
        defaultVisibility: boolean;
        subLayerIds?: any;
        minScale: number;
        maxScale: number;
    }
    export interface FeatureServerInfo {
        currentVersion: number;
        serviceDescription: string;
        hasVersionedData: boolean;
        supportsDisconnectedEditing: boolean;
        syncEnabled: boolean;
        supportedQueryFormats: string;
        maxRecordCount: number;
        capabilities: string;
        description: string;
        copyrightText: string;
        spatialReference: SpatialReference;
        initialExtent: Extent;
        fullExtent: Extent;
        allowGeometryUpdates: boolean;
        units: string;
        documentInfo: DocumentInfo;
        layers: Layer[];
        tables: any[];
        enableZDefaults: boolean;
        zDefault: number;
    }
    export interface AdvancedQueryCapabilities {
        supportsPagination: boolean;
        supportsStatistics: boolean;
        supportsOrderBy: boolean;
        supportsDistinct: boolean;
    }
    export interface EsriTSSymbol {
        type: string;
        color: number[];
        backgroundColor?: any;
        borderLineColor?: any;
        borderLineSize?: any;
        verticalAlignment: string;
        horizontalAlignment: string;
        rightToLeft: boolean;
        angle: number;
        xoffset: number;
        yoffset: number;
        kerning: boolean;
        haloColor?: any;
        haloSize?: any;
        font: Font;
    }
    export interface DefaultSymbol {
        type: string;
        url: string;
        imageData: string;
        contentType: string;
        width: number;
        height: number;
        angle: number;
        xoffset: number;
        yoffset: number;
    }
    export interface UniqueValueInfo {
        symbol: DefaultSymbol;
        value: string;
        label: string;
        description: string;
    }
    export interface Renderer {
        type: string;
        field1: string;
        field2?: any;
        field3?: any;
        fieldDelimiter: string;
        defaultSymbol: DefaultSymbol;
        defaultLabel: string;
        uniqueValueInfos: UniqueValueInfo[];
    }
    export interface Font {
        family: string;
        size: number;
        style: string;
        weight: string;
        decoration: string;
    }
    export interface LabelingInfo {
        labelPlacement: string;
        where?: any;
        labelExpression: string;
        useCodedValues: boolean;
        symbol: DefaultSymbol & EsriTSSymbol;
        minScale: number;
        maxScale: number;
    }
    export interface DrawingInfo {
        renderer: Renderer;
        transparency: number;
        labelingInfo: LabelingInfo[];
    }
    export interface CodedValue {
        name: string;
        code: any;
    }
    export interface Domain {
        type: string;
        name: string;
        codedValues: CodedValue[];
        range: number[];
    }
    export interface Field {
        name: string;
        type: string;
        alias: string;
        domain: Domain;
        editable: boolean;
        nullable: boolean;
        length?: number;
    }
    export interface Domains {
        [n: string]: {
            type: string;
        };
    }
    export interface Attributes {
        [n: string]: string;
    }
    export interface Prototype {
        attributes: Attributes;
    }
    export interface Template {
        name: string;
        description: string;
        prototype: Prototype;
        drawingTool: string;
    }
    export interface Type {
        id: string;
        name: string;
        domains: Domains;
        templates: Template[];
    }
    export interface FeatureLayerInfo {
        currentVersion: number;
        id: number;
        name: string;
        type: string;
        description: string;
        copyrightText: string;
        defaultVisibility: boolean;
        editFieldsInfo?: any;
        ownershipBasedAccessControlForFeatures?: any;
        syncCanReturnChanges: boolean;
        relationships: any[];
        isDataVersioned: boolean;
        supportsRollbackOnFailureParameter: boolean;
        supportsStatistics: boolean;
        supportsAdvancedQueries: boolean;
        advancedQueryCapabilities: AdvancedQueryCapabilities;
        geometryType: string;
        minScale: number;
        maxScale: number;
        extent: Extent;
        drawingInfo: DrawingInfo;
        hasM: boolean;
        hasZ: boolean;
        enableZDefaults: boolean;
        zDefault: number;
        allowGeometryUpdates: boolean;
        hasAttachments: boolean;
        htmlPopupType: string;
        objectIdField: string;
        globalIdField: string;
        displayField: string;
        typeIdField: string;
        fields: Field[];
        types: Type[];
        templates: any[];
        maxRecordCount: number;
        supportedQueryFormats: string;
        capabilities: string;
        useStandardizedQueries: boolean;
    }
    export interface Origin {
        x: number;
        y: number;
    }
    export interface Lod {
        level: number;
        resolution: number;
        scale: number;
    }
    export interface TileInfo {
        rows: number;
        cols: number;
        dpi: number;
        format: string;
        compressionQuality: number;
        origin: Origin;
        spatialReference: SpatialReference;
        lods: Lod[];
    }
    export interface InitialExtent {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: SpatialReference;
    }
    export interface FullExtent {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: SpatialReference;
    }
    export interface MapServerInfo {
        currentVersion: number;
        serviceDescription: string;
        mapName: string;
        description: string;
        copyrightText: string;
        supportsDynamicLayers: boolean;
        layers: Layer[];
        tables: any[];
        spatialReference: SpatialReference;
        singleFusedMapCache: boolean;
        tileInfo: TileInfo;
        initialExtent: InitialExtent;
        fullExtent: FullExtent;
        minScale: number;
        maxScale: number;
        units: string;
        supportedImageFormatTypes: string;
        documentInfo: DocumentInfo;
        capabilities: string;
        supportedQueryFormats: string;
        exportTilesAllowed: boolean;
        maxRecordCount: number;
        maxImageHeight: number;
        maxImageWidth: number;
        supportedExtensions: string;
    }
    export class Catalog {
        private ajax;
        constructor(url: string);
        about(data?: any): JQueryDeferred<CatalogInfo>;
        aboutFolder(folder: string): JQueryDeferred<CatalogInfo>;
        aboutFeatureServer(name: string): JQueryDeferred<FeatureServerInfo> & {
            url: string;
        };
        aboutMapServer(name: string): JQueryDeferred<MapServerInfo> & {
            url: string;
        };
        aboutLayer(layer: number): JQueryDeferred<FeatureLayerInfo>;
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer" {
    export namespace ArcGisFeatureServerLayer {
        type SpatialReference = {
            wkid: string;
        };
        type Extent = {
            xmin: number;
        };
        type Styles = "esriSMSCircle" | "esriSMSCross" | "esriSMSDiamond" | "esriSMSPath" | "esriSMSSquare" | "esriSMSX" | "esriSFSSolid" | "esriSFSForwardDiagonal" | "esriSLSSolid" | "esriSLSDot" | "esriSLSDash" | "esriSLSDashDot" | "esriSLSDashDotDot";
        type SymbolTypes = "esriSMS" | "esriSLS" | "esriSFS" | "esriPMS" | "esriPFS" | "esriTS";
        type Color = number[];
        interface AdvancedQueryCapabilities {
            supportsPagination: boolean;
            supportsStatistics: boolean;
            supportsOrderBy: boolean;
            supportsDistinct: boolean;
        }
        interface Outline {
            style?: Styles;
            color?: number[];
            width?: number;
            type?: SymbolTypes;
            d?: Date;
        }
        interface Font {
            weight: string;
            style: string;
            family: string;
            size: number;
        }
        interface Symbol {
            type: SymbolTypes;
            style?: Styles;
            color?: number[];
            outline?: Outline;
            width?: number;
            horizontalAlignment?: string;
            verticalAlignment?: string;
            font?: Font;
            height?: number;
            xoffset?: number;
            yoffset?: number;
            contentType?: string;
            url?: string;
            size?: number;
            angle?: number;
            imageData?: string;
            path?: string;
        }
        interface UniqueValueInfo {
            symbol: Symbol;
            value?: string;
            label?: string;
            description?: string;
        }
        interface VisualVariable {
            type: string;
            field: string;
            valueUnit: string;
            minSize: number;
            maxSize: number;
            minDataValue: number;
            maxDataValue: number;
            minSliderValue: number;
            maxSliderValue: number;
        }
        interface ClassBreakInfo {
            symbol: Symbol;
            classMaxValue: number;
        }
        interface Renderer extends Attributes {
            type: string;
            label?: string;
            description?: string;
            field1?: string;
            field2?: string;
            field3?: string;
            fieldDelimiter?: string;
            defaultSymbol?: Symbol;
            defaultLabel?: any;
            symbol?: Symbol;
            uniqueValueInfos?: UniqueValueInfo[];
        }
        interface ClassBreakRenderer extends Renderer {
            field?: string;
            minValue?: number;
            classBreakInfos?: ClassBreakInfo[];
            visualVariables?: VisualVariable[];
            authoringInfo: {
                visualVariables: VisualVariable[];
            };
        }
        interface DrawingInfo {
            renderer: Renderer;
            transparency?: number;
            labelingInfo?: any;
        }
        interface CodedValue {
            name: string;
            code: string;
        }
        interface Domain {
            type: string;
            name: string;
            codedValues: CodedValue[];
        }
        interface Field {
            name: string;
            type: string;
            alias: string;
            domain: Domain;
            editable: boolean;
            nullable: boolean;
            length?: number;
        }
        interface Domains {
        }
        interface Attributes {
            [attribute: string]: any;
        }
        interface Prototype {
            attributes: Attributes;
        }
        interface Template {
            name: string;
            description: string;
            prototype: Prototype;
            drawingTool: string;
        }
        interface Type {
            id: string;
            name: string;
            domains: Domains;
            templates: Template[];
        }
        interface RootObject {
            currentVersion: string | number;
            id: number;
            name: string;
            type: string;
            description: string;
            copyrightText: string;
            defaultVisibility: boolean;
            editFieldsInfo?: any;
            ownershipBasedAccessControlForFeatures?: any;
            syncCanReturnChanges: boolean;
            relationships: any[];
            isDataVersioned: boolean;
            supportsRollbackOnFailureParameter: boolean;
            supportsStatistics: boolean;
            supportsAdvancedQueries: boolean;
            advancedQueryCapabilities: AdvancedQueryCapabilities;
            geometryType: string;
            minScale: number;
            maxScale: number;
            extent: Extent;
            drawingInfo: DrawingInfo;
            hasM: boolean;
            hasZ: boolean;
            allowGeometryUpdates: boolean;
            hasAttachments: boolean;
            htmlPopupType: string;
            objectIdField: string;
            globalIdField: string;
            displayField: string;
            typeIdField: string;
            fields: Field[];
            types: Type[];
            templates: any[];
            maxRecordCount: number;
            supportedQueryFormats: string;
            capabilities: string;
            useStandardizedQueries: boolean;
            spatialReference?: SpatialReference;
            displayFieldName?: string;
        }
    }
    export class StyleConverter {
        private asWidth(v);
        private asColor(color);
        private fromSFSSolid(symbol, style);
        private fromSFS(symbol, style);
        private fromSMSCircle(symbol, style);
        private fromSMSCross(symbol, style);
        private fromSMSDiamond(symbol, style);
        private fromSMSPath(symbol, style);
        private fromSMSSquare(symbol, style);
        private fromSMSX(symbol, style);
        private fromSMS(symbol, style);
        private fromPMS(symbol, style);
        private fromSLSSolid(symbol, style);
        private fromSLS(symbol, style);
        private fromPFS(symbol, style);
        private fromTS(symbol, style);
        fromJson(symbol: ArcGisFeatureServerLayer.Symbol): ol.style.Style;
        private fromSymbol(symbol, style);
        fromRenderer(renderer: ArcGisFeatureServerLayer.Renderer, args: {
            url: string;
        }): ol.style.Style | ((feature: ol.Feature) => ol.style.Style);
    }
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/common/common" {
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    export function defaults<T extends any>(a: T, b: T): T;
    export function cssin(name: string, css: string): () => void;
}
declare module "bower_components/ol3-symbolizer/ol3-symbolizer/ags/ags-source" {
    import ol = require("openlayers");
    export interface IOptions extends olx.source.VectorOptions {
        services: string;
        serviceName: string;
        map: ol.Map;
        layers: number[];
        tileSize?: number;
        where?: string;
    }
    export class ArcGisVectorSourceFactory {
        static create(options: IOptions): JQueryDeferred<ol.layer.Vector[]>;
    }
}
declare module "ol3-search/examples/bing-search" {
    export function run(): void;
}
declare module "ol3-search/examples/google-search" {
    export function run(): void;
}
declare module "ol3-search/examples/index" {
    export function run(): void;
}
declare module "ol3-search/examples/ol3-search" {
    export function run(): void;
}
declare module "ol3-search/examples/osm-search" {
    export function run(): void;
}
declare module "ol3-search/tests/index" {
    export function run(): void;
}
