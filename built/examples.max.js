var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("node_modules/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    function toggle(e, className, force) {
        var exists = e.classList.contains(className);
        if (exists && force !== true) {
            e.classList.remove(className);
            return false;
        }
        ;
        if (!exists && force !== false) {
            e.classList.add(className);
            return true;
        }
        return exists;
    }
    exports.toggle = toggle;
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return (v.split(",").map(function (v) { return parse(v, type[0]); }));
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    function getQueryParameters(options, url) {
        if (url === void 0) { url = window.location.href; }
        var opts = options;
        Object.keys(opts).forEach(function (k) {
            doif(getParameterByName(k, url), function (v) {
                var value = parse(v, opts[k]);
                if (value !== undefined)
                    opts[k] = value;
            });
        });
    }
    exports.getQueryParameters = getQueryParameters;
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    exports.defaults = defaults;
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            document.head.appendChild(styleTag);
            styleTag.appendChild(document.createTextNode(css));
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
    function debounce(func, wait, immediate) {
        if (wait === void 0) { wait = 50; }
        if (immediate === void 0) { immediate = false; }
        var timeout;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply({}, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow)
                func.apply({}, args);
        });
    }
    exports.debounce = debounce;
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return result[i++] = [v1, v2]; }); });
        return result;
    }
    exports.pair = pair;
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function zoomToFeature(map, feature, options) {
        var promise = $.Deferred();
        options = common_1.defaults(options || {}, {
            duration: 1000,
            padding: 256,
            minResolution: 2 * map.getView().getMinResolution()
        });
        var view = map.getView();
        var currentExtent = view.calculateExtent(map.getSize());
        var targetExtent = feature.getGeometry().getExtent();
        var doit = function (duration) {
            view.fit(targetExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration,
                callback: function () { return promise.resolve(); },
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else {
            var fullExtent = ol.extent.createEmpty();
            ol.extent.extend(fullExtent, currentExtent);
            ol.extent.extend(fullExtent, targetExtent);
            var dscale = ol.extent.getWidth(fullExtent) / ol.extent.getWidth(currentExtent);
            var duration = 0.5 * options.duration;
            view.fit(fullExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration
            });
            setTimeout(function () { return doit(0.5 * options.duration); }, duration);
        }
        return promise;
    }
    exports.zoomToFeature = zoomToFeature;
});
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            "N": 1,
            "S": -1,
            "E": 1,
            "W": -1
        };
        var latLonIndex = {
            "-": "",
            "N": "lat",
            "S": "lat",
            "E": "lon",
            "W": "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw 'Degrees out of range';
        if (!inRange(minutes, 0, 60))
            throw 'Minutes out of range';
        if (!inRange(seconds, 0, 60))
            throw 'Seconds out of range';
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function parse(dmsString) {
        var _a;
        dmsString = dmsString.trim();
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw 'Could not parse string';
        if (m1[1]) {
            m1[6] = undefined;
            dmsString2 = dmsString.substr(m1[0].length - 1).trim();
        }
        else {
            dmsString2 = dmsString.substr(m1[0].length).trim();
        }
        var decDeg1 = decDegFromMatch(m1);
        var m2 = dmsString2.match(dmsRe);
        var decDeg2 = m2 && decDegFromMatch(m2);
        if (typeof decDeg1.latLon === 'undefined') {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            }
            else {
                throw 'Could not parse string';
            }
        }
        if (typeof decDeg2.latLon === 'undefined') {
            decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
    }
    exports.parse = parse;
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms"], function (require, exports, common, navigation, dms) {
    "use strict";
    var index = common.defaults(common, {
        dms: dms,
        navigation: navigation
    });
    return index;
});
define("ol3-search/ol3-search", ["require", "exports", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, ol, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var olcss = {
        CLASS_CONTROL: 'ol-control',
        CLASS_UNSELECTABLE: 'ol-unselectable',
        CLASS_UNSUPPORTED: 'ol-unsupported',
        CLASS_HIDDEN: 'ol-hidden'
    };
    var expando = {
        right: '»',
        left: '«'
    };
    var defaults = {
        className: 'ol-search',
        position: 'bottom left',
        expanded: false,
        autoChange: false,
        autoClear: false,
        autoCollapse: true,
        canCollapse: true,
        hideButton: false,
        closedText: expando.right,
        openedText: expando.left,
        title: 'Search',
        showLabels: false,
    };
    var SearchForm = (function (_super) {
        __extends(SearchForm, _super);
        function SearchForm(options) {
            var _this = this;
            if (options.hideButton) {
                options.canCollapse = false;
                options.autoCollapse = false;
                options.expanded = true;
            }
            _this = _super.call(this, {
                element: options.element,
                target: options.target
            }) || this;
            _this.options = options;
            _this.handlers = [];
            _this.cssin();
            var button = _this.button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.title = options.title;
            options.element.appendChild(button);
            if (options.hideButton) {
                button.style.display = "none";
            }
            var form = _this.form = index_1.html(("\n        <form>\n            " + (options.title ? "<label class=\"title\">" + options.title + "</label>" : "") + "\n            <section class=\"header\"></section>\n            <section class=\"body\">\n            <table class=\"fields\">\n            " + (options.showLabels ? "<thead><tr><td>Field</td><td>Value</td></tr></thead>" : "") + "\n                <tbody>\n                    <tr><td>Field</td><td>Value</td></tr>\n                </tbody>\n            </table>\n            </section>\n            <section class=\"footer\"></section>\n        </form>\n        ").trim());
            options.element.appendChild(form);
            {
                var body_1 = form.getElementsByTagName("tbody")[0];
                body_1.innerHTML = "";
                options.fields.forEach(function (field) {
                    field.alias = field.alias || field.name;
                    field.name = field.name || field.alias;
                    var tr = document.createElement("tr");
                    var value = document.createElement("td");
                    if (!field.type && typeof field.default !== "undefined") {
                        field.type = typeof field.default;
                    }
                    field.type = field.type || "string";
                    if (options.showLabels) {
                        var label = document.createElement("td");
                        label.innerHTML = "<label for=\"" + field.name + "\" class=\"ol-search-label\">" + field.alias + "</label>";
                        tr.appendChild(label);
                    }
                    tr.appendChild(value);
                    var input;
                    if (field.domain) {
                        var select_1 = document.createElement("select");
                        select_1.name = field.name;
                        select_1.className = "input " + field.name;
                        field.domain.codedValues.forEach(function (cv) {
                            var option = document.createElement("option");
                            select_1.appendChild(option);
                            option.text = cv.name + " (" + cv.code + ")";
                            option.value = cv.code;
                        });
                        input = select_1;
                    }
                    else {
                        switch (field.type) {
                            case "boolean":
                                input = index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"checkbox\" " + (field.default ? "checked" : "") + " />");
                                break;
                            case "integer":
                                input = index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"number\" min=\"0\" step=\"1\" " + (field.default ? "value=\"" + field.default + "\"" : "") + " />");
                                break;
                            case "number":
                                input = index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"number\" min=\"0\" max=\"" + Array(field.length || 3).join("9") + "\" />");
                                break;
                            case "string":
                            default:
                                input = index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"text\" " + (field.default ? "value=\"" + field.default + "\"" : "") + " />");
                                input.maxLength = field.length || 20;
                                break;
                        }
                    }
                    input.title = field.alias;
                    input.placeholder = field.placeholder || field.alias;
                    input.addEventListener("focus", function () { return tr.classList.add("focus"); });
                    input.addEventListener("blur", function () { return tr.classList.remove("focus"); });
                    value.appendChild(input);
                    body_1.appendChild(tr);
                });
            }
            {
                var footer = form.getElementsByClassName("footer")[0];
                if (!_this.options.searchButton) {
                    var searchButton_1 = index_1.html("<input type=\"button\" class=\"ol-search-button\" value=\"Search\"/>");
                    footer.appendChild(searchButton_1);
                    _this.options.searchButton = searchButton_1;
                    form.addEventListener("keydown", function (args) {
                        if (args.key === "Enter") {
                            if (args.srcElement !== searchButton_1) {
                                searchButton_1.focus();
                            }
                            else {
                                options.autoCollapse && button.focus();
                            }
                        }
                    });
                    searchButton_1.addEventListener("click", function () {
                        _this.dispatchEvent({
                            type: "change",
                            value: _this.value
                        });
                        if (_this.options.autoCollapse && _this.options.canCollapse) {
                            _this.collapse();
                        }
                        if (_this.options.autoClear) {
                            _this.options.fields.forEach(function (f) {
                                form[f.name].value = f.default === undefined ? "" : f.default;
                            });
                        }
                    });
                }
            }
            button.addEventListener("click", function () {
                options.expanded ? _this.collapse(options) : _this.expand(options);
            });
            if (options.autoCollapse) {
                form.addEventListener("blur", function () {
                    _this.collapse(options);
                });
            }
            if (options.autoChange) {
                form.addEventListener("keypress", index_1.debounce(function () {
                    _this.dispatchEvent({
                        type: "change",
                        value: _this.value
                    });
                }, 500));
            }
            options.expanded ? _this.expand(options) : _this.collapse(options);
            return _this;
        }
        SearchForm.create = function (options) {
            options = index_1.mixin({
                openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
                closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
            }, options || {});
            options = index_1.mixin(index_1.mixin({}, defaults), options);
            var element = document.createElement('div');
            element.className = options.className + " " + options.position + " " + olcss.CLASS_UNSELECTABLE + " " + olcss.CLASS_CONTROL;
            var geocoderOptions = index_1.mixin({
                element: element,
                target: options.target,
                expanded: false
            }, options);
            return new SearchForm(geocoderOptions);
        };
        SearchForm.prototype.destroy = function () {
            this.handlers.forEach(function (h) { return h(); });
            this.setTarget(null);
        };
        SearchForm.prototype.setPosition = function (position) {
            var _this = this;
            this.options.position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.remove(k); });
            position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.add(k); });
            this.options.position = position;
        };
        SearchForm.prototype.cssin = function () {
            var className = this.options.className;
            var positions = index_1.pair("top left right bottom".split(" "), index_1.range(24))
                .map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || '')) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(index_1.cssin(className, "\n." + className + " {\n    position: absolute;\n}\n\n." + className + " button {\n    min-height: 1.375em;\n    min-width: 1.375em;\n    width: auto;\n    display: inline;\n}\n\n." + className + ".left button {\n    float:right;\n}\n\n." + className + ".right button {\n    float:left;\n}\n\n." + className + " form {\n    width: 16em;\n    border: none;\n    padding: 0;\n    margin: 0;\n    margin-left: 2px;\n    margin-top: 2px;\n    vertical-align: top;\n}\n." + className + " form.ol-hidden {\n    display: none;\n}\n" + positions.join('\n')));
        };
        SearchForm.prototype.collapse = function (options) {
            if (options === void 0) { options = this.options; }
            if (!options.canCollapse)
                return;
            options.expanded = false;
            this.form.classList.add(olcss.CLASS_HIDDEN);
            this.button.classList.remove(olcss.CLASS_HIDDEN);
            this.button.innerHTML = options.closedText;
        };
        SearchForm.prototype.expand = function (options) {
            if (options === void 0) { options = this.options; }
            options.expanded = true;
            this.form.classList.remove(olcss.CLASS_HIDDEN);
            this.button.classList.add(olcss.CLASS_HIDDEN);
            this.button.innerHTML = options.openedText;
            this.form.focus();
        };
        SearchForm.prototype.on = function (type, cb) {
            return _super.prototype.on.call(this, type, cb);
        };
        Object.defineProperty(SearchForm.prototype, "value", {
            get: function () {
                var _this = this;
                var result = {};
                this.options.fields.forEach(function (field) {
                    var input = _this.form.querySelector("[name=\"" + field.name + "\"]");
                    var value = input.value;
                    switch (field.type) {
                        case "integer":
                            value = parseInt(value, 10);
                            value = isNaN(value) ? null : value;
                            break;
                        case "number":
                            value = parseFloat(value);
                            value = isNaN(value) ? null : value;
                            break;
                        case "boolean":
                            value = input.checked;
                            break;
                        case "string":
                            value = value || null;
                            break;
                    }
                    if (undefined !== value && null !== value) {
                        result[input.name] = value;
                    }
                });
                return result;
            },
            enumerable: true,
            configurable: true
        });
        SearchForm.DEFAULT_OPTIONS = defaults;
        return SearchForm;
    }(ol.control.Control));
    exports.SearchForm = SearchForm;
});
define("index", ["require", "exports", "ol3-search/ol3-search"], function (require, exports, Input) {
    "use strict";
    return Input;
});
define("examples/form-options", ["require", "exports", "index", "node_modules/ol3-fun/index"], function (require, exports, index_2, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var metaForm = index_2.SearchForm.create({
            className: 'ol-search',
            position: 'top right',
            expanded: true,
            title: "Search",
            showLabels: true,
            autoClear: false,
            autoCollapse: false,
            canCollapse: true,
            fields: [
                {
                    name: 'className',
                    default: 'ol-search'
                },
                {
                    name: 'position',
                    default: 'bottom left'
                },
                {
                    name: 'expanded',
                    default: true
                },
                {
                    name: 'title',
                    default: 'Search'
                },
                {
                    name: 'showLabels',
                    default: true
                },
                {
                    name: 'autoClear',
                    default: true
                },
                {
                    name: 'autoCollapse',
                    default: true
                },
                {
                    name: 'canCollapse',
                    default: true
                },
                {
                    name: 'fields',
                    domain: {
                        name: "fieldNames",
                        type: "string",
                        codedValues: [
                            {
                                code: "boolean",
                                name: "Boolean",
                            },
                            {
                                code: "number",
                                name: "Number",
                            },
                            {
                                code: "string",
                                name: "String",
                            },
                        ]
                    }
                },
            ]
        });
        metaForm.options.searchButton.value = "Create";
        var targetForm;
        metaForm.on("change", function (args) {
            if (targetForm) {
                targetForm.destroy();
                targetForm.options.element.remove();
                targetForm = null;
            }
            if (args.value.fields) {
                args.value.fields = [
                    {
                        name: 'sampleField',
                        type: args.value.fields
                    },
                ];
            }
            targetForm = index_2.SearchForm.create(index_3.defaults(args.value, {}));
            document.body.appendChild(targetForm.options.element);
        });
        document.body.appendChild(metaForm.options.element);
    }
    exports.run = run;
});
define("ol3-search/providers/bing", ["require", "exports", "jquery", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, $, ol, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SampleError = {
        "authenticationResultCode": "NoCredentials",
        "brandLogoUri": "http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png",
        "copyright": "Copyright © 2017 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
        "errorDetails": ["Access was denied. You may have entered your credentials incorrectly, or you might not have access to the requested resource or operation."],
        "resourceSets": [],
        "statusCode": 401,
        "statusDescription": "Unauthorized",
        "traceId": "4c1f421581304d2db0de98984d325333|BN20130523|7.7.0.0|"
    };
    var SampleResponse = {
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
    };
    var BingGeocode = (function () {
        function BingGeocode(options) {
            this.options = index_4.defaults(options || {}, BingGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(BingGeocode.prototype, "fields", {
            get: function () {
                return [{
                        name: "query",
                        alias: "Location",
                        length: 50
                    },
                    {
                        name: "bounded",
                        alias: "Current Extent?",
                        default: true
                    }
                ];
            },
            enumerable: true,
            configurable: true
        });
        BingGeocode.prototype.execute = function (options) {
            var _this = this;
            options = this.getParameters(options, this.options.map);
            var d = $.Deferred();
            $.ajax({
                url: options.url,
                method: options.method,
                data: options.params,
                dataType: options.dataType,
                jsonp: options.callbackName,
            })
                .then(function (json) { return d.resolve(_this.handleResponse(json)); })
                .fail(function () { return d.reject("geocoder failed"); });
            return d;
        };
        BingGeocode.prototype.getParameters = function (options, map) {
            index_4.defaults(options, this.options);
            index_4.defaults(options.params, {
                key: options.key,
                maxResults: options.count,
            }, this.options.params);
            if (map && options.bounded) {
                var extent = map.getView().calculateExtent(map.getSize());
                var p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
                {
                    var b = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent().map(function (v) { return v.toFixed(6); });
                    options.params.umv = b[1] + "," + b[0] + "," + b[3] + "," + b[2];
                }
            }
            return options;
        };
        BingGeocode.prototype.handleResponse = function (response) {
            var asExtent = function (r) {
                var v = r.bbox;
                return ol.geom.Polygon.fromExtent([v[1], v[0], v[3], v[2]]);
            };
            var results = [];
            response.resourceSets.forEach(function (resourceSet) {
                var resultSet = resourceSet.resources.map(function (result) { return ({
                    placeId: response.traceId,
                    title: result.name,
                    lon: result.point.coordinates[1],
                    lat: result.point.coordinates[0],
                    extent: asExtent(result),
                    address: {
                        name: result.address.formattedAddress,
                        road: result.address.addressLine,
                        postcode: result.address.postalCode,
                        city: result.address.adminDistrict,
                        state: result.address.adminDistrict2,
                        country: result.address.countryRegion,
                    },
                    original: result
                }); });
                results = results.concat(resultSet);
            });
            return results;
        };
        BingGeocode.DEFAULT_OPTIONS = {
            url: '//dev.virtualearth.net/REST/v1/Locations',
            callbackName: 'jsonp',
            dataType: 'jsonp',
            method: 'GET',
            params: {
                includeNeighborhood: 0,
                maxResults: 5,
                userRegion: 'US'
            }
        };
        return BingGeocode;
    }());
    exports.BingGeocode = BingGeocode;
});
define("examples/mapmaker", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function create() {
        var center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');
        var mapContainer = document.getElementsByClassName("map")[0];
        var map = new ol.Map({
            loadTilesWhileAnimating: true,
            target: mapContainer,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                    opacity: 0.8
                })
            ],
            view: new ol.View({
                center: center,
                projection: 'EPSG:3857',
                zoom: 6
            })
        });
        var source = new ol.source.Vector();
        var vector = new ol.layer.Vector({
            source: source,
            style: function (feature, resolution) {
                var style = feature.getStyle();
                if (!style) {
                    switch (feature.getGeometry().getType()) {
                        case "Point":
                            style = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 4,
                                    fill: new ol.style.Fill({
                                        color: "rgba(33, 33, 33, 0.2)"
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: "#F00",
                                        width: 1
                                    })
                                }),
                                text: new ol.style.Text({
                                    text: feature.get("text")
                                })
                            });
                            break;
                        case "LineString":
                            style = new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: "rgba(33, 33, 33, 0.2)"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "#F00",
                                    width: 1
                                }),
                                text: new ol.style.Text({
                                    text: feature.get("text")
                                })
                            });
                            break;
                        default:
                            throw "unexpected geometry type";
                    }
                    feature.setStyle(style);
                }
                return style;
            }
        });
        return {
            map: map,
            source: source
        };
    }
    exports.create = create;
});
define("examples/formmaker", ["require", "exports", "openlayers", "node_modules/ol3-fun/index", "index"], function (require, exports, ol, index_5, index_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function create(options) {
        var map = options.map;
        var searchProvider = options.searchProvider;
        var form = index_6.SearchForm.create({
            className: 'ol-search',
            position: 'top right',
            expanded: true,
            title: "Search",
            showLabels: false,
            autoClear: true,
            autoCollapse: true,
            canCollapse: true,
            fields: searchProvider.fields
        });
        form.on("change", function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            searchProvider.execute({ params: args.value }).then(function (results) {
                var toSrs = map.getView().getProjection();
                results.some(function (r) {
                    console.log(r);
                    if (r.address) {
                        var _a = ol.proj.transform([r.lon, r.lat], "EPSG:4326", toSrs), lon = _a[0], lat = _a[1];
                        var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.title);
                        options.source.addFeature(feature);
                    }
                    if (r.extent) {
                        var feature = new ol.Feature(r.extent.transform("EPSG:4326", toSrs));
                        index_5.navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 50 });
                    }
                    return true;
                });
            });
        });
        map.addControl(form);
    }
    exports.create = create;
});
define("examples/bing-search", ["require", "exports", "ol3-search/providers/bing", "node_modules/ol3-fun/index", "examples/mapmaker", "examples/formmaker"], function (require, exports, bing_1, index_7, mapmaker_1, formmaker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        index_7.cssin("examples/ol3-search", "\n\n.ol-grid.statecode .ol-grid-container {\n    background-color: white;\n    width: 10em;\n}\n\n.ol-grid .ol-grid-container.ol-hidden {\n}\n\n.ol-grid .ol-grid-container {\n    width: 15em;\n}\n\n.ol-grid-table {\n    width: 100%;\n}\n\ntable.ol-grid-table {\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntable.ol-grid-table > td {\n    padding: 8px;\n    text-align: left;\n    border-bottom: 1px solid #ddd;\n}\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n    ");
        var _a = mapmaker_1.create(), map = _a.map, source = _a.source;
        var searchProvider = new bing_1.BingGeocode({
            map: map,
            count: 1,
            key: 'As7mdqzf-iBHBqrSHonXJQHrytZ_SL9Z2ojSyOAYoWTceHYYLKUy0C8X8R5IABRg'
        });
        formmaker_1.create({
            map: map,
            searchProvider: searchProvider,
            source: source
        });
    }
    exports.run = run;
});
define("ol3-search/providers/google", ["require", "exports", "jquery", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, $, ol, index_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GoogleMappingTable = {
        name: [
            'point_of_interest',
            'establishment',
            'natural_feature',
            'airport'
        ],
        road: [
            'street_address',
            'route',
            'sublocality_level_5',
            'intersection'
        ],
        postcode: ['postal_code'],
        city: ['locality'],
        state: ['administrative_area_level_1'],
        country: ['country']
    };
    var GoogleMappingKeys = Object.keys(GoogleMappingTable);
    var GoogleGeocode = (function () {
        function GoogleGeocode(options) {
            this.options = index_8.defaults(options || {}, GoogleGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(GoogleGeocode.prototype, "fields", {
            get: function () {
                return [
                    {
                        name: "address",
                        alias: "Location",
                        length: 50
                    },
                    {
                        name: "bounded",
                        alias: "Current Extent?",
                        default: true
                    }
                ];
            },
            enumerable: true,
            configurable: true
        });
        GoogleGeocode.prototype.execute = function (options) {
            var _this = this;
            options = this.getParameters(options, this.options.map);
            var d = $.Deferred();
            delete options.params.query;
            $.ajax({
                url: options.url,
                method: options.method,
                data: options.params,
                dataType: options.dataType,
                jsonp: options.callbackName
            })
                .then(function (json) { return d.resolve(_this.handleResponse(json)); })
                .fail(function () { return d.reject("geocoder failed"); });
            return d;
        };
        GoogleGeocode.prototype.getParameters = function (options, map) {
            index_8.defaults(options, this.options);
            index_8.defaults(options.params, {
                address: options.params.query,
                count: options.count,
                key: options.key,
                language: options.lang,
                url: options.url
            }, this.options.params);
            if (map && options.bounded && !options.params.bounds) {
                var extent = map.getView().calculateExtent(map.getSize());
                var p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
                {
                    var b = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent().map(function (v) { return v.toFixed(6); });
                    options.params.bounds = b[1] + "," + b[0] + "|" + b[3] + "," + b[2];
                }
            }
            return options;
        };
        GoogleGeocode.prototype.handleResponse = function (response) {
            var _this = this;
            console.assert(response.status === "OK", "status OK");
            var asExtent = function (r) {
                var v = r.geometry.viewport;
                return ol.geom.Polygon.fromExtent([v.southwest.lng, v.southwest.lat, v.northeast.lng, v.northeast.lat]);
            };
            var result = response.results.map(function (result) {
                var returnValue = {
                    extent: asExtent(result),
                    title: result.formatted_address,
                    lat: result.geometry.location.lat,
                    lon: result.geometry.location.lng,
                    address: {},
                    original: result
                };
                _this.parseComponents(result.address_components, returnValue);
                return returnValue;
            });
            return result;
        };
        GoogleGeocode.prototype.parseComponents = function (address_components, result) {
            address_components.forEach(function (addressComponent) {
                addressComponent.types.forEach(function (googleType) {
                    GoogleMappingKeys.forEach(function (typeKey) {
                        if (-1 < GoogleMappingTable[typeKey].indexOf(googleType)) {
                            result.address[typeKey] = addressComponent.long_name;
                        }
                    });
                });
            });
        };
        GoogleGeocode.DEFAULT_OPTIONS = {
            url: '//maps.googleapis.com/maps/api/geocode/json',
            dataType: 'json',
            method: 'GET',
            params: {
                address: '',
                key: '',
                language: 'en-US',
                country: 'US'
            }
        };
        return GoogleGeocode;
    }());
    exports.GoogleGeocode = GoogleGeocode;
});
define("examples/google-search", ["require", "exports", "ol3-search/providers/google", "node_modules/ol3-fun/index", "examples/mapmaker", "examples/formmaker"], function (require, exports, google_1, index_9, mapmaker_2, formmaker_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        index_9.cssin("examples/google-search", "\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n.ol-search table {\n    width: 100%;\n}\n\n.ol-search .input {\n    width: 100%;\n}\n\n.ol-search input[type=\"checkbox\"] {\n    width: auto;\n}\n    ");
        var _a = mapmaker_2.create(), map = _a.map, source = _a.source;
        var searchProvider = new google_1.GoogleGeocode({
            map: map,
            count: 1
        });
        formmaker_2.create({
            map: map,
            searchProvider: searchProvider,
            source: source
        });
    }
    exports.run = run;
});
define("ol3-search/providers/layer", ["require", "exports", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, ol, index_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayerGeocode = (function () {
        function LayerGeocode(options) {
            this.options = index_10.defaults(options || {}, LayerGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(LayerGeocode.prototype, "fields", {
            get: function () {
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
            },
            enumerable: true,
            configurable: true
        });
        LayerGeocode.prototype.execute = function (options) {
            options = this.getParameters(options, this.options.map);
            var d = $.Deferred();
            var searchText = options.params.query;
            var results = [];
            options.params.layers.forEach(function (l) {
                var features = l.getSource().getFeatures();
                results = results.concat(features.filter(function (f) {
                    return options.params.propertyNames.some(function (propertyName) {
                        var value = f.get(propertyName);
                        return -1 < value.indexOf(searchText);
                    });
                }));
            });
            if (0 < options.count && options.count < results.length) {
            }
            results = results.map(function (f) { return f.clone(); });
            results.forEach(function (f) { return f.getGeometry().transform(options.map.getView().getProjection(), "EPSG:4326"); });
            d.resolve(this.handleResponse({ features: results }));
            return d;
        };
        LayerGeocode.prototype.getParameters = function (options, map) {
            index_10.defaults(options, this.options);
            index_10.defaults(options.params, this.options.params);
            return options;
        };
        LayerGeocode.prototype.handleResponse = function (response) {
            var _this = this;
            var asExtent = function (r) { return ol.geom.Polygon.fromExtent(r.getGeometry().getExtent()); };
            return response.features.map(function (f) {
                var _a = ol.extent.getCenter(f.getGeometry().getExtent()), lon = _a[0], lat = _a[1];
                return {
                    placeId: "" + f.getId(),
                    title: f.get(_this.options.params.propertyNames[0]),
                    lat: lat,
                    lon: lon,
                    extent: asExtent(f),
                    address: _this.options.params.propertyNames.map(function (n) { return f.get(n); }),
                    original: f
                };
            });
        };
        LayerGeocode.DEFAULT_OPTIONS = {};
        return LayerGeocode;
    }());
    exports.LayerGeocode = LayerGeocode;
});
define("examples/layer-search", ["require", "exports", "openlayers", "index", "ol3-search/providers/layer", "node_modules/ol3-fun/index", "examples/mapmaker"], function (require, exports, ol, index_11, layer_1, index_12, mapmaker_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        index_12.cssin("examples/ol3-search", "\n\n.ol-grid.statecode .ol-grid-container {\n    background-color: white;\n    width: 10em;\n}\n\n.ol-grid .ol-grid-container.ol-hidden {\n}\n\n.ol-grid .ol-grid-container {\n    width: 15em;\n}\n\n.ol-grid-table {\n    width: 100%;\n}\n\ntable.ol-grid-table {\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntable.ol-grid-table > td {\n    padding: 8px;\n    text-align: left;\n    border-bottom: 1px solid #ddd;\n}\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n    ");
        var _a = mapmaker_3.create(), map = _a.map, source = _a.source;
        var searchProvider = new layer_1.LayerGeocode({
            count: 1,
            map: map,
            params: {
                query: '',
                layers: [],
                searchNames: ["STATE_ABBR", "STATE_NAME", "SUB_REGION"],
                propertyNames: ["STATE_NAME", "STATE_ABBR", "SUB_REGION"]
            }
        });
        var form = index_11.SearchForm.create({
            className: 'ol-search',
            position: 'top right',
            expanded: true,
            title: "Layer Search",
            showLabels: false,
            autoClear: true,
            autoCollapse: true,
            canCollapse: true,
            fields: searchProvider.fields
        });
        var search = function (params, bounded) {
            var layers = map.getLayers().getArray().filter(function (l) { return l instanceof ol.layer.Vector; }).map(function (l) { return l; });
            searchProvider.options.params.layers = layers.filter(function (l) { return l.getSource() !== source; });
            searchProvider.execute({ params: params }).then(function (results) {
                return results.some(function (r) {
                    console.log(r);
                    if (r.address) {
                        var _a = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857"), lon = _a[0], lat = _a[1];
                        var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.title);
                        source.addFeature(feature);
                    }
                    if (r.extent) {
                        var feature = new ol.Feature(r.extent.transform("EPSG:4326", "EPSG:3857"));
                        index_12.navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                    }
                    return true;
                });
            });
        };
        form.on("change", function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            search(args.value, args.value.bounded);
        });
        map.addControl(form);
    }
    exports.run = run;
});
define("ol3-search/providers/mapquest", ["require", "exports", "jquery", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, $, ol, index_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SampleResponse = [{
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
    var MapQuestGeocode = (function () {
        function MapQuestGeocode(options) {
            this.options = index_13.defaults(options || {}, MapQuestGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(MapQuestGeocode.prototype, "fields", {
            get: function () {
                return [{
                        name: "q",
                        alias: "Location",
                        length: 50
                    },
                    {
                        name: "bounded",
                        alias: "Current Extent?",
                        default: true
                    }
                ];
            },
            enumerable: true,
            configurable: true
        });
        MapQuestGeocode.prototype.execute = function (options) {
            var _this = this;
            options = this.getParameters(options, this.options.map);
            var d = $.Deferred();
            delete options.params.query;
            $.ajax({
                url: options.url,
                method: options.method,
                data: options.params,
                dataType: options.dataType,
                jsonp: options.callbackName
            })
                .then(function (json) { return d.resolve(_this.handleResponse(json)); })
                .fail(function () { return d.reject("geocoder failed"); });
            return d;
        };
        MapQuestGeocode.prototype.getParameters = function (options, map) {
            index_13.defaults(options.params, this.options.params);
            index_13.defaults(options, this.options);
            if (map && options.bounded && !options.params.viewbox) {
                var extent = map.getView().calculateExtent(map.getSize());
                var p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
                {
                    var b = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent().map(function (v) { return v.toFixed(6); });
                    options.params.viewbox = b[0] + "," + b[3] + "," + b[2] + "," + b[1];
                    options.params.bounded = 0;
                }
            }
            return options;
        };
        MapQuestGeocode.prototype.handleResponse = function (response) {
            var asExtent = function (r) {
                var _a = r.boundingbox.map(function (v) { return parseFloat(v); }), lat1 = _a[0], lat2 = _a[1], lon1 = _a[2], lon2 = _a[3];
                return ol.geom.Polygon.fromExtent([lon1, lat1, lon2, lat2]);
            };
            return response.map(function (result) { return ({
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
            }); });
        };
        MapQuestGeocode.DEFAULT_OPTIONS = {
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
        return MapQuestGeocode;
    }());
    exports.MapQuestGeocode = MapQuestGeocode;
});
define("examples/mapquest-search", ["require", "exports", "ol3-search/providers/mapquest", "node_modules/ol3-fun/index", "examples/mapmaker", "examples/formmaker"], function (require, exports, mapquest_1, index_14, mapmaker_4, formmaker_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        index_14.cssin("examples/mapquest-search", "\n\n.ol-grid.statecode .ol-grid-container {\n    background-color: white;\n    width: 10em;\n}\n\n.ol-grid .ol-grid-container.ol-hidden {\n}\n\n.ol-grid .ol-grid-container {\n    width: 15em;\n}\n\n.ol-grid-table {\n    width: 100%;\n}\n\ntable.ol-grid-table {\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntable.ol-grid-table > td {\n    padding: 8px;\n    text-align: left;\n    border-bottom: 1px solid #ddd;\n}\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n    ");
        var _a = mapmaker_4.create(), map = _a.map, source = _a.source;
        var searchProvider = new mapquest_1.MapQuestGeocode({
            map: map,
            count: 1,
        });
        formmaker_3.create({
            map: map,
            searchProvider: searchProvider,
            source: source
        });
    }
    exports.run = run;
});
define("ol3-search/providers/osm", ["require", "exports", "jquery", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, $, ol, index_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OpenStreetGeocode = (function () {
        function OpenStreetGeocode(options) {
            this.options = index_15.defaults(options || {}, OpenStreetGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(OpenStreetGeocode.prototype, "fields", {
            get: function () {
                return [
                    {
                        name: "q",
                        alias: "*",
                        default: "LAX",
                        length: 50
                    },
                    {
                        name: "bounded",
                        alias: "Current Extent?",
                        type: "boolean",
                        default: true
                    }
                ];
            },
            enumerable: true,
            configurable: true
        });
        OpenStreetGeocode.prototype.execute = function (options) {
            var _this = this;
            options = this.getParameters(options, this.options.map);
            delete options.params.query;
            var d = $.Deferred();
            $.ajax({
                url: options.url,
                method: options.method,
                data: options.params,
                dataType: options.dataType,
                jsonp: options.callbackName
            })
                .then(function (json) { return d.resolve(_this.handleResponse(json)); })
                .fail(function () { return d.reject("geocoder failed"); });
            return d;
        };
        OpenStreetGeocode.prototype.getParameters = function (options, map) {
            var _a, _b;
            index_15.defaults(options, this.options);
            index_15.defaults(options.params, {
                q: options.params.query,
                limit: options.count,
            }, this.options.params);
            if (!options.params.viewbox && map) {
                var extent = map.getView().calculateExtent(map.getSize());
                var _c = ol.extent.getBottomLeft(extent), left = _c[0], bottom = _c[1];
                var _d = ol.extent.getTopRight(extent), right = _d[0], top_1 = _d[1];
                var inSrs = map.getView().getProjection();
                _a = ol.proj.transform([left, top_1], inSrs, "EPSG:4326"), left = _a[0], top_1 = _a[1];
                _b = ol.proj.transform([right, bottom], inSrs, "EPSG:4326"), right = _b[0], bottom = _b[1];
                options.params.viewbox = {
                    bottom: bottom,
                    top: top_1,
                    left: left,
                    right: right
                };
            }
            if (options.params.countrycodes) {
                options.params.countrycodes = options.params.countrycodes.join(",");
            }
            if (options.params.viewbox) {
                var x = options.params.viewbox;
                options.params.viewbox = [x.left, x.top, x.right, x.bottom].map(function (v) { return v.toFixed(5); }).join(",");
            }
            Object.keys(options.params).filter(function (k) { return typeof options.params[k] === "boolean"; }).forEach(function (k) {
                options.params[k] = options.params[k] ? "1" : "0";
            });
            return options;
        };
        OpenStreetGeocode.prototype.handleResponse = function (response) {
            var asExtent = function (r) {
                var _a = r.boundingbox.map(function (v) { return parseFloat(v); }), lat1 = _a[0], lat2 = _a[1], lon1 = _a[2], lon2 = _a[3];
                return ol.geom.Polygon.fromExtent([lon1, lat1, lon2, lat2]);
            };
            return response.sort(function (v) { return v.importance || 1; }).map(function (result) { return ({
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
            }); });
        };
        OpenStreetGeocode.DEFAULT_OPTIONS = {
            url: '//nominatim.openstreetmap.org/search/',
            dataType: 'json',
            method: 'GET',
            params: {
                format: 'json',
                addressdetails: true,
                limit: 10,
                countrycodes: ['US'],
                'accept-language': 'en-US'
            }
        };
        return OpenStreetGeocode;
    }());
    exports.OpenStreetGeocode = OpenStreetGeocode;
});
define("examples/osm-search", ["require", "exports", "ol3-search/providers/osm", "node_modules/ol3-fun/index", "examples/mapmaker", "examples/formmaker"], function (require, exports, osm_1, index_16, mapmaker_5, formmaker_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        index_16.cssin("examples/osm-search", "\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n.ol-search form {\n    max-width: 12em;\n}\n    ");
        var _a = mapmaker_5.create(), map = _a.map, source = _a.source;
        var searchProvider = new osm_1.OpenStreetGeocode({
            count: 1,
            map: map
        });
        formmaker_4.create({
            map: map,
            searchProvider: searchProvider,
            source: source
        });
    }
    exports.run = run;
});
define("ol3-search/providers/wfs", ["require", "exports", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, ol, index_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var olFormatFilter = ol.format["filter"];
    var WfsGeocode = (function () {
        function WfsGeocode(options) {
            this.options = index_17.defaults(options || {}, WfsGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(WfsGeocode.prototype, "fields", {
            get: function () {
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
            },
            enumerable: true,
            configurable: true
        });
        WfsGeocode.prototype.execute = function (options) {
            var _this = this;
            options = this.getParameters(options, this.options.map);
            var d = $.Deferred();
            $.ajax({
                url: options.url,
                method: options.method,
                contentType: options.contentType,
                data: options.data || options.params,
                dataType: options.dataType,
                jsonp: options.callbackName
            })
                .then(function (json) { return d.resolve(_this.handleResponse(json)); })
                .fail(function () { return d.reject("geocoder failed"); });
            return d;
        };
        WfsGeocode.prototype.getParameters = function (options, map) {
            index_17.defaults(options, this.options);
            index_17.defaults(options.params, this.options.params);
            var format = new ol.format.WFS();
            if (options.params.query) {
                var searchText_1 = options.params.query.replace(/ /g, "*");
                var filters = options.params.searchNames.map(function (searchName) { return olFormatFilter.like(searchName, "*" + searchText_1 + "*"); });
                var filter = (filters.length > 1) ? olFormatFilter.or.apply(olFormatFilter.or, filters) : filters[0];
                options.filter = filter;
            }
            if (map && options.bounded && !options.extent) {
                var extent = map.getView().calculateExtent(map.getSize());
                var p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
                options.extent = p.transform(map.getView().getProjection(), options.internalSrs).getExtent();
            }
            var getFeatureRequest = format.writeGetFeature({
                featureNS: options.params.featureNS,
                featurePrefix: options.params.featurePrefix,
                featureTypes: options.params.featureTypes,
                srsName: options.internalSrs,
                outputFormat: 'GML3',
                maxFeatures: options.count,
                geometryName: 'geom',
                propertyNames: options.params.propertyNames,
                bbox: options.extent,
                filter: options.filter
            });
            options.data = getFeatureRequest.outerHTML;
            return options;
        };
        WfsGeocode.prototype.handleResponse = function (response) {
            var _this = this;
            var format = new ol.format.WFS();
            var result = format.readFeatures(response);
            var asExtent = function (r) {
                var extent = r.getGeometry().getExtent();
                return ol.geom.Polygon.fromExtent(extent);
            };
            return result.map(function (f) {
                var extent = asExtent(f);
                var _a = extent.getInteriorPoint().getCoordinates(), lon = _a[0], lat = _a[1];
                var title = _this.options.params.propertyNames.map(function (n) { return f.get(n); }).filter(function (v) { return !!v && typeof v !== "object"; }).join(" - ");
                if (!title)
                    title = f.getProperties().map(function (n) { return f.get(n); }).filter(function (v) { return !!v && typeof v === "string"; }).join(" - ");
                if (!title)
                    title = "" + f.getId();
                return {
                    placeId: "" + f.getId(),
                    title: title,
                    lat: lat,
                    lon: lon,
                    extent: extent,
                    address: _this.options.params.propertyNames.map(function (n) { return f.get(n); }),
                    original: f
                };
            });
        };
        WfsGeocode.DEFAULT_OPTIONS = {
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
        };
        return WfsGeocode;
    }());
    exports.WfsGeocode = WfsGeocode;
});
define("examples/wfs-search", ["require", "exports", "openlayers", "index", "ol3-search/providers/wfs", "node_modules/ol3-fun/index", "examples/mapmaker"], function (require, exports, ol, index_18, wfs_1, index_19, mapmaker_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var internalSrs = "EPSG:3857";
    function buffer(_a, map, pixels) {
        var x = _a[0], y = _a[1];
        if (pixels === void 0) { pixels = 4; }
        var sw = new ol.geom.Point(map.getCoordinateFromPixel([x - pixels, y + pixels]));
        var ne = new ol.geom.Point(map.getCoordinateFromPixel([x + pixels, y - pixels]));
        var extent = ol.extent.createEmpty();
        ol.extent.extend(extent, sw.getExtent());
        ol.extent.extend(extent, ne.getExtent());
        return ol.geom.Polygon
            .fromExtent(extent)
            .transform(map.getView().getProjection(), internalSrs);
    }
    function run() {
        index_19.cssin("examples/wfs-search", "\n\n.ol-grid.statecode .ol-grid-container {\n    background-color: white;\n    width: 10em;\n}\n\n.ol-grid .ol-grid-container.ol-hidden {\n}\n\n.ol-grid .ol-grid-container {\n    width: 15em;\n}\n\n.ol-grid-table {\n    width: 100%;\n}\n\ntable.ol-grid-table {\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntable.ol-grid-table > td {\n    padding: 8px;\n    text-align: left;\n    border-bottom: 1px solid #ddd;\n}\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n    ");
        var _a = mapmaker_6.create(), map = _a.map, source = _a.source;
        var searchProvider = new wfs_1.WfsGeocode({
            url: 'http://localhost:8080/geoserver/cite/wfs',
            count: 1,
            map: map,
            internalSrs: internalSrs,
            params: {
                featureNS: 'http://www.opengeospatial.net/cite',
                featurePrefix: 'cite',
                featureTypes: ['lines', 'points'],
                searchNames: 'name'.split(','),
                propertyNames: ['name', 'highway', 'geom']
            }
        });
        var form = index_18.SearchForm.create({
            className: 'ol-search',
            position: 'top right',
            expanded: true,
            title: "IPS Address Search",
            showLabels: false,
            autoClear: true,
            autoCollapse: true,
            canCollapse: true,
            fields: searchProvider.fields
        });
        var search = function (value) {
            var toSrs = map.getView().getProjection();
            searchProvider.execute(value)
                .then(function (results) {
                if (!results.length) {
                    if (value.bounded) {
                        value.bounded = false;
                        value.extent = null;
                        search(value);
                    }
                }
                results.some(function (r) {
                    console.log(r);
                    if (r.original instanceof ol.Feature) {
                        var geom = (r.original.clone()).getGeometry().transform(internalSrs, toSrs);
                        var feature = new ol.Feature(geom);
                        feature.set("text", r.title);
                        source.addFeature(feature);
                    }
                    else if (r.address) {
                        var _a = ol.proj.transform([r.lon, r.lat], internalSrs, toSrs), lon = _a[0], lat = _a[1];
                        var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.title);
                        source.addFeature(feature);
                    }
                    if (r.extent) {
                        var feature = new ol.Feature(r.extent.transform(internalSrs, toSrs));
                        index_19.navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                    }
                    return true;
                });
            }).fail(function () {
                console.error("geocoder failed");
            });
        };
        form.on("change", function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            search({
                bounded: args.value.bounded || false,
                params: args.value
            });
        });
        map.addControl(form);
        map.on("click", function (args) {
            var geom = buffer(args.pixel, map, 12);
            var filter = new ol.format.filter.Intersects("geom", geom, internalSrs);
            search({
                bounded: false,
                filter: filter
            });
        });
    }
    exports.run = run;
});
define("examples/ol3-search", ["require", "exports", "openlayers", "ol3-search/ol3-search", "ol3-search/providers/bing", "ol3-search/providers/google", "ol3-search/providers/mapquest", "ol3-search/providers/osm", "ol3-search/providers/wfs", "node_modules/ol3-fun/index", "examples/mapmaker"], function (require, exports, ol, ol3_search_1, bing_2, google_2, mapquest_2, osm_2, wfs_2, index_20, mapmaker_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }
    function run() {
        index_20.cssin("examples/ol3-search", "\n\n.ol-grid.statecode .ol-grid-container {\n    background-color: white;\n    width: 10em;\n}\n\n.ol-grid .ol-grid-container.ol-hidden {\n}\n\n.ol-grid .ol-grid-container {\n    width: 15em;\n}\n\n.ol-grid-table {\n    width: 100%;\n}\n\ntable.ol-grid-table {\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntable.ol-grid-table > td {\n    padding: 8px;\n    text-align: left;\n    border-bottom: 1px solid #ddd;\n}\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n    ");
        var _a = mapmaker_7.create(), map = _a.map, source = _a.source;
        var providers = [
            new bing_2.BingGeocode({
                count: 1,
                map: map,
                key: 'As7mdqzf-iBHBqrSHonXJQHrytZ_SL9Z2ojSyOAYoWTceHYYLKUy0C8X8R5IABRg'
            }),
            new google_2.GoogleGeocode({
                count: 1,
                map: map
            }),
            new mapquest_2.MapQuestGeocode({
                count: 1,
                map: map
            }),
            new osm_2.OpenStreetGeocode({
                count: 1,
                map: map
            }),
            new wfs_2.WfsGeocode({
                count: 1,
                map: map,
                url: 'http://localhost:8080/geoserver/ips/wfs',
                params: {
                    featureNS: 'http://inforpublicsector.com/geoserver',
                    featurePrefix: 'ips',
                    featureTypes: ['ADDRESS'],
                    searchNames: 'CITY,STNAME,STATE'.split(','),
                    propertyNames: ['STNAME', 'GEOM']
                }
            }),
        ];
        var form = ol3_search_1.SearchForm.create({
            className: 'ol-search',
            position: 'top right',
            expanded: true,
            title: "LAX Search",
            showLabels: false,
            autoClear: true,
            autoCollapse: true,
            canCollapse: true,
            fields: [{
                    name: "query",
                    alias: "Location",
                    default: "LAX",
                    length: 50
                }]
        });
        var search = function (value, bounded) {
            providers[0].execute({ params: clone(value) }).then(function (results) {
                if (results.length) {
                    process(results);
                    providers.push(providers.shift());
                }
                else {
                    providers.filter(function (v, i) { return i > 0; }).forEach(function (provider) {
                        provider.execute({ params: clone(value) }).then(function (results) {
                            process(results);
                        });
                    });
                }
            }).fail(function () {
                providers.push(providers.shift());
                search(value, bounded);
            });
        };
        var process = function (results) {
            return results.some(function (r) {
                console.log(r);
                if (r.address) {
                    var _a = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857"), lon = _a[0], lat = _a[1];
                    var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.title);
                    source.addFeature(feature);
                }
                if (r.extent) {
                    var feature = new ol.Feature(r.extent.transform("EPSG:4326", "EPSG:3857"));
                    index_20.navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                }
                return true;
            });
        };
        form.on("change", function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            search(args.value, args.value.bounded);
        });
        map.addControl(form);
    }
    exports.run = run;
});
define("examples/index", ["require", "exports", "examples/form-options", "examples/bing-search", "examples/google-search", "examples/layer-search", "examples/mapquest-search", "examples/osm-search", "examples/wfs-search", "examples/ol3-search"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=examples/";
        var labs = "\n    form-options\n    bing-search\n    google-search\n    layer-search\n    mapquest-search\n    osm-search\n    wfs-search\n    ol3-search\n    index\n    ";
        var styles = document.createElement("style");
        document.head.appendChild(styles);
        styles.innerText += "\n    #map {\n        display: none;\n    }\n    .test {\n        margin: 20px;\n    }\n    ";
        var html = labs
            .split(/ /)
            .map(function (v) { return v.trim(); })
            .filter(function (v) { return !!v; })
            .map(function (lab) { return "<div class='test'><a href='" + path + lab + "&debug=0'>" + lab + "</a></div>"; })
            .join("\n");
        html += "<a href='" + l.origin + l.pathname + "?run=ol3-search/tests/index'>tests</a>";
        document.write(html);
    }
    exports.run = run;
    ;
});
//# sourceMappingURL=examples.max.js.map