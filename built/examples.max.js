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
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    /**
     * Converts a GetElementsBy* to a classic array
     * @param list HTML collection to be converted to standard array
     * @returns The @param list represented as a native array of elements
     */
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
    function toggle(e, className, force) {
        var exists = e.classList.contains(className);
        if (exists && force !== true) {
            e.classList.remove(className);
            return false;
        }
        if (!exists && force !== false) {
            e.classList.add(className);
            return true;
        }
        return exists;
    }
    exports.toggle = toggle;
    /**
     * Converts a string representation of a value to it's desired type (e.g. parse("1", 0) returns 1)
     * @param v string representation of desired return value
     * @param type desired type
     * @returns @param v converted to a @param type
     */
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return v.split(",").map(function (v) { return parse(v, type[0]); });
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    /**
     * Replaces the options elements with the actual query string parameter values (e.g. {a: 0, "?a=10"} becomes {a: 10})
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
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
    /**
     * Returns individual query string value from a url
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     * @returns parameter value
     */
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    /**
     * Only execute callback when @param v is truthy
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    /**
     * shallow copies b into a, replacing any existing values in a
     * @param a target
     * @param b values to shallow copy into target
     */
    function mixin(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).forEach(function (k) { return (a[k] = b[k]); });
        });
        return a;
    }
    exports.mixin = mixin;
    /**
     * shallow copies b into a, preserving any existing values in a
     * @param a target
     * @param b values to copy into target if they are not already present
     */
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b)
                .filter(function (k) { return a[k] === undefined; })
                .forEach(function (k) { return (a[k] = b[k]); });
        });
        return a;
    }
    exports.defaults = defaults;
    /**
     * delay execution of a method
     * @param func invoked after @param wait milliseconds
     * @param immediate true to invoke @param func before waiting
     */
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
                timeout = NaN;
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
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    /**
     * returns all combinations of a1 with a2 (a1 X a2 pairs)
     * @param a1 1xN matrix of first elements
     * @param a2 1xN matrix of second elements
     * @returns 2xN^2 matrix of a1 x a2 combinations
     */
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return (result[i++] = [v1, v2]); }); });
        return result;
    }
    exports.pair = pair;
    /**
     * Returns an array [0..n)
     * @param n number of elements
     */
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    /**
     * in-place shuffling of an array
     * @see http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param array array to randomize
     */
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("node_modules/ol3-fun/ol3-fun/css", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    function loadCss(options) {
        if (!options.name)
            throw "must provide a name to prevent css duplication";
        if (options.url && options.css)
            throw "cannot provide both a url and a css";
        if (options.css)
            return cssin(options.name, options.css);
        if (!options.url)
            throw "must provide either a url or css option";
        var id = "style-" + options.name;
        var head = document.getElementsByTagName("head")[0];
        var link = document.getElementById(id);
        if (!link) {
            link = document.createElement("link");
            link.id = id;
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = options.url;
            head.appendChild(link);
        }
        var dataset = link.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                link.remove();
            }
        };
    }
    exports.loadCss = loadCss;
});
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     * @param map The openlayers map
     * @param feature The feature to zoom to
     * @param options Animation constraints
     */
    function zoomToFeature(map, feature, ops) {
        var promise = $.Deferred();
        var options = common_1.defaults(ops || {}, {
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
                callback: function () { return promise.resolve(); }
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            // new extent is contained within current extent, pan and zoom in
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            // new extent is contained within current extent, pan and zoom out
            doit(options.duration);
        }
        else {
            // zoom out until target extent is in view
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
/**
 * Converts DMS to lonlat
 * ported from https://github.com/gmaclennan/parse-dms/blob/master/index.js
 * and https://stackoverflow.com/questions/37893131/how-to-convert-lat-long-from-decimal-degrees-to-dms-format
 */
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            N: 1,
            S: -1,
            E: 1,
            W: -1
        };
        var latLonIndex = {
            "-": "",
            N: "lat",
            S: "lat",
            E: "lon",
            W: "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw "Degrees out of range";
        if (!inRange(minutes, 0, 60))
            throw "Minutes out of range";
        if (!inRange(seconds, 0, 60))
            throw "Seconds out of range";
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function toDegreesMinutesAndSeconds(coordinate) {
        var absolute = Math.abs(coordinate);
        var degrees = Math.floor(absolute);
        var minutesNotTruncated = (absolute - degrees) * 60;
        var minutes = Math.floor(minutesNotTruncated);
        var seconds = Math.floor((minutesNotTruncated - minutes) * 60);
        return degrees + " " + minutes + " " + seconds;
    }
    function fromLonLatToDms(lon, lat) {
        var latitude = toDegreesMinutesAndSeconds(lat);
        var latitudeCardinal = lat >= 0 ? "N" : "S";
        var longitude = toDegreesMinutesAndSeconds(lon);
        var longitudeCardinal = lon >= 0 ? "E" : "W";
        return latitude + " " + latitudeCardinal + " " + longitude + " " + longitudeCardinal;
    }
    function fromDmsToLonLat(dmsString) {
        var _a;
        dmsString = dmsString.trim();
        // Inspired by https://gist.github.com/JeffJacobson/2955437
        // See https://regex101.com/r/kS2zR1/3
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw "Could not parse string";
        // If dmsString starts with a hemisphere letter, then the regex can also capture the
        // hemisphere letter for the second coordinate pair if also in the string
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
        if (typeof decDeg1.latLon === "undefined") {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                // If we only have one coordinate but we have no hemisphere value,
                // just return the decDeg number
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                // If no hemisphere letter but we have two coordinates,
                // infer that the first is lat, the second lon
                decDeg1.latLon = "lat";
                decDeg2.latLon = "lon";
            }
            else {
                throw "Could not parse string";
            }
        }
        // If we parsed the first coordinate as lat or lon, then assume the second is the other
        if (typeof decDeg2.latLon === "undefined") {
            decDeg2.latLon = decDeg1.latLon === "lat" ? "lon" : "lat";
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
    }
    function parse(value) {
        if (typeof value === "string")
            return fromDmsToLonLat(value);
        return fromLonLatToDms(value.lon, value.lat);
    }
    exports.parse = parse;
});
define("node_modules/ol3-fun/ol3-fun/slowloop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Executes a series of functions in a delayed manner
     * @param functions one function executes per interval
     * @param interval length of the interval in milliseconds
     * @param cycles number of types to run each function
     * @returns promise indicating the process is complete
     */
    function slowloop(functions, interval, cycles) {
        if (interval === void 0) { interval = 1000; }
        if (cycles === void 0) { cycles = 1; }
        var d = $.Deferred();
        var index = 0;
        var cycle = 0;
        if (!functions || 0 >= cycles) {
            d.resolve();
            return d;
        }
        var h = setInterval(function () {
            if (index === functions.length) {
                index = 0;
                if (++cycle === cycles) {
                    d.resolve();
                    clearInterval(h);
                    return;
                }
            }
            try {
                d.notify({ index: index, cycle: cycle });
                functions[index++]();
            }
            catch (ex) {
                clearInterval(h);
                d.reject(ex);
            }
        }, interval);
        return d;
    }
    exports.slowloop = slowloop;
});
define("node_modules/ol3-fun/ol3-fun/is-primitive", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isPrimitive(a) {
        switch (typeof a) {
            case "boolean":
                return true;
            case "number":
                return true;
            case "object":
                return null === a;
            case "string":
                return true;
            case "symbol":
                return true;
            case "undefined":
                return true;
            default:
                throw "unknown type: " + typeof a;
        }
    }
    exports.isPrimitive = isPrimitive;
});
define("node_modules/ol3-fun/ol3-fun/is-cyclic", ["require", "exports", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, is_primitive_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Determine if an object refers back to itself
     */
    function isCyclic(a) {
        if (is_primitive_1.isPrimitive(a))
            return false;
        var test = function (o, history) {
            if (is_primitive_1.isPrimitive(o))
                return false;
            if (0 <= history.indexOf(o)) {
                return true;
            }
            return Object.keys(o).some(function (k) { return test(o[k], [o].concat(history)); });
        };
        return Object.keys(a).some(function (k) { return test(a[k], [a]); });
    }
    exports.isCyclic = isCyclic;
});
// from https://github.com/unclechu/node-deep-extend/blob/master/lib/deep-extend.js
define("node_modules/ol3-fun/ol3-fun/deep-extend", ["require", "exports", "node_modules/ol3-fun/ol3-fun/is-cyclic", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, is_cyclic_1, is_primitive_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isArrayLike(o) {
        var keys = Object.keys(o);
        return keys.every(function (k) { return k === parseInt(k, 10).toString(); });
    }
    /**
     * deep mixin, replacing items in a with items in b
     * array items with an "id" are used to identify pairs, otherwise b overwrites a
     * @param a object to extend
     * @param b data to inject into the object
     * @param trace optional change tracking
     * @param history object added here are not visited
     */
    function extend(a, b, trace, history) {
        if (history === void 0) { history = []; }
        if (!b) {
            b = a;
            a = {};
        }
        var merger = new Merger(trace, history);
        return merger.deepExtend(a, b, []);
    }
    exports.extend = extend;
    function isUndefined(a) {
        return typeof a === "undefined";
    }
    function isArray(val) {
        return Array.isArray(val);
    }
    function isHash(val) {
        return !is_primitive_2.isPrimitive(val) && !canClone(val) && !isArray(val);
    }
    function canClone(val) {
        if (val instanceof Date)
            return true;
        if (val instanceof RegExp)
            return true;
        return false;
    }
    function clone(val) {
        if (val instanceof Date)
            return new Date(val.getTime());
        if (val instanceof RegExp)
            return new RegExp(val.source);
        throw "unclonable type encounted: " + typeof val;
    }
    /**
     * Hepler class for managing the trace
     */
    var Merger = /** @class */ (function () {
        function Merger(traceItems, history) {
            this.traceItems = traceItems;
            this.history = history;
        }
        Merger.prototype.trace = function (item) {
            if (this.traceItems) {
                this.traceItems.push(item);
            }
        };
        /**
         * @param target Object to be extended
         * @param source Object with values to be copied into target
         * @returns extended object
         */
        Merger.prototype.deepExtend = function (target, source, path) {
            var _this = this;
            if (target === source)
                return target; // nothing left to merge
            if (!target || (!isHash(target) && !isArray(target))) {
                throw "first argument must be an object";
            }
            if (!source || (!isHash(source) && !isArray(source))) {
                throw "second argument must be an object";
            }
            /**
             * ignore functions
             */
            if (typeof source === "function") {
                return target;
            }
            /**
             * only track objects that trigger a recursion
             */
            this.push(source);
            /**
             * copy arrays into array
             */
            if (isArray(source)) {
                if (!isArray(target)) {
                    throw "attempting to merge an array into a non-array";
                }
                this.mergeArray("id", target, source, path);
                return target;
            }
            else if (isArray(target)) {
                if (!isArrayLike(source)) {
                    throw "attempting to merge a non-array into an array";
                }
            }
            /**
             * copy the values from source into the target
             */
            Object.keys(source).forEach(function (k) { return _this.mergeChild(k, target, source[k], path.slice()); });
            return target;
        };
        Merger.prototype.cloneArray = function (val, path) {
            var _this = this;
            this.push(val);
            return val.map(function (v) {
                if (is_primitive_2.isPrimitive(v))
                    return v;
                if (isHash(v))
                    return _this.deepExtend({}, v, path);
                if (isArray(v))
                    return _this.cloneArray(v, path);
                if (canClone(v))
                    return clone(v);
                throw "unknown type encountered: " + typeof v;
            });
        };
        Merger.prototype.push = function (a) {
            if (is_primitive_2.isPrimitive(a))
                return;
            if (-1 < this.history.indexOf(a)) {
                if (is_cyclic_1.isCyclic(a)) {
                    throw "circular reference detected";
                }
            }
            else
                this.history.push(a);
        };
        Merger.prototype.mergeChild = function (key, target, sourceValue, path) {
            var targetValue = target[key];
            /**
             * nothing to do for this key
             */
            if (sourceValue === targetValue)
                return;
            /**
             * if new value is primitive create/update the target value
             */
            if (is_primitive_2.isPrimitive(sourceValue)) {
                // record change
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * Maybe it's a pseudo-primitive that we can clone (Date or RegEx)
             */
            if (canClone(sourceValue)) {
                sourceValue = clone(sourceValue);
                // record change
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * if new value is an array, merge with existing array or create a new property
             */
            if (isArray(sourceValue)) {
                /**
                 * we're dealing with objects (two arrays) that deepExtend understands
                 */
                if (isArray(targetValue)) {
                    this.deepExtendWithKey(targetValue, sourceValue, path, key);
                    return;
                }
                /**
                 * create/update the target with the source array
                 */
                sourceValue = this.cloneArray(sourceValue, path);
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * source is not primitive, not a clonable primitive and not an array
             * so it must be an object with keys
             */
            if (!isHash(sourceValue)) {
                throw "unexpected source type: " + typeof sourceValue;
            }
            /**
             * if the target is not a hash object then create/update it
             */
            if (!isHash(targetValue)) {
                // clone the source
                var merger = new Merger(null, this.history);
                sourceValue = merger.deepExtend({}, sourceValue, path);
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            /**
             * Both source and target are known by deepExtend...
             */
            this.deepExtendWithKey(targetValue, sourceValue, path, key);
            return;
        };
        Merger.prototype.deepExtendWithKey = function (targetValue, sourceValue, path, key) {
            var index = path.push(key);
            this.deepExtend(targetValue, sourceValue, path);
            // no changes, remove key from path
            if (index === path.length)
                path.pop();
        };
        Merger.prototype.mergeArray = function (key, target, source, path) {
            var _this = this;
            // skip trivial arrays
            if (!isArray(target))
                throw "target must be an array";
            if (!isArray(source))
                throw "input must be an array";
            if (!source.length)
                return target;
            // quickly find keyed targets
            var hash = {};
            target.forEach(function (item, i) {
                if (!item[key])
                    return;
                hash[item[key]] = i;
            });
            source.forEach(function (sourceItem, i) {
                var sourceKey = sourceItem[key];
                var targetIndex = hash[sourceKey];
                /**
                 * No "id" so perform a naive update/create on the target
                 */
                if (isUndefined(sourceKey)) {
                    if (isHash(target[i]) && !!target[i][key]) {
                        throw "cannot replace an identified array item with a non-identified array item";
                    }
                    _this.mergeChild(i, target, sourceItem, path.slice());
                    return;
                }
                /**
                 * not target so add it to the end of the array
                 */
                if (isUndefined(targetIndex)) {
                    _this.mergeChild(target.length, target, sourceItem, path.slice());
                    return;
                }
                /**
                 * The target item exists so need to merge the source item
                 */
                _this.mergeChild(targetIndex, target, sourceItem, path.slice());
                return;
            });
            return target;
        };
        return Merger;
    }());
});
define("node_modules/ol3-fun/ol3-fun/extensions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Stores associated data in an in-memory repository using a WeakMap
     */
    var Extensions = /** @class */ (function () {
        function Extensions() {
            this.hash = new WeakMap(null);
        }
        Extensions.prototype.isExtended = function (o) {
            return this.hash.has(o);
        };
        /**
        Forces the existence of an extension container for an object
        @param o the object of interest
        @param [ext] sets these value on the extension object
        @returns the extension object
        */
        Extensions.prototype.extend = function (o, ext) {
            var hashData = this.hash.get(o);
            if (!hashData) {
                hashData = {};
                this.hash.set(o, hashData);
            }
            // update the extension values
            ext && Object.keys(ext).forEach(function (k) { return (hashData[k] = ext[k]); });
            return hashData;
        };
        /**
        Ensures extensions are shared across objects
        */
        Extensions.prototype.bind = function (o1, o2) {
            if (this.isExtended(o1)) {
                if (this.isExtended(o2)) {
                    if (this.hash.get(o1) === this.hash.get(o2))
                        return;
                    throw "both objects already bound";
                }
                else {
                    this.hash.set(o2, this.extend(o1));
                }
            }
            else {
                this.hash.set(o1, this.extend(o2));
            }
        };
        return Extensions;
    }());
    exports.Extensions = Extensions;
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/css", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms", "node_modules/ol3-fun/ol3-fun/slowloop", "node_modules/ol3-fun/ol3-fun/deep-extend", "node_modules/ol3-fun/ol3-fun/extensions"], function (require, exports, common_2, css_1, navigation_1, parse_dms_1, slowloop_1, deep_extend_1, extensions_1) {
    "use strict";
    var index = {
        asArray: common_2.asArray,
        cssin: css_1.cssin,
        loadCss: css_1.loadCss,
        debounce: common_2.debounce,
        defaults: common_2.defaults,
        doif: common_2.doif,
        deepExtend: deep_extend_1.extend,
        getParameterByName: common_2.getParameterByName,
        getQueryParameters: common_2.getQueryParameters,
        html: common_2.html,
        mixin: common_2.mixin,
        pair: common_2.pair,
        parse: common_2.parse,
        range: common_2.range,
        shuffle: common_2.shuffle,
        toggle: common_2.toggle,
        uuid: common_2.uuid,
        slowloop: slowloop_1.slowloop,
        dms: {
            parse: parse_dms_1.parse,
            fromDms: function (dms) { return parse_dms_1.parse(dms); },
            fromLonLat: function (o) { return parse_dms_1.parse(o); }
        },
        navigation: {
            zoomToFeature: navigation_1.zoomToFeature
        },
        Extensions: extensions_1.Extensions
    };
    return index;
});
define("ol3-search/ol3-search", ["require", "exports", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, ol, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var olcss = {
        CLASS_CONTROL: "ol-control",
        CLASS_UNSELECTABLE: "ol-unselectable",
        CLASS_UNSUPPORTED: "ol-unsupported",
        CLASS_HIDDEN: "ol-hidden"
    };
    var expando = {
        right: "»",
        left: "«"
    };
    var defaults = {
        className: "ol-search",
        position: "bottom left",
        expanded: false,
        autoChange: false,
        autoClear: false,
        autoCollapse: true,
        canCollapse: true,
        hideButton: false,
        closedText: expando.right,
        openedText: expando.left,
        title: "Search",
        showLabels: false
    };
    var SearchForm = /** @class */ (function (_super) {
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
            var button = (_this.button = document.createElement("button"));
            button.setAttribute("type", "button");
            button.title = options.title;
            options.element.appendChild(button);
            if (options.hideButton) {
                button.style.display = "none";
            }
            var form = (_this.form = index_1.html(("\n        <form>\n            " + (options.title ? "<label class=\"title\">" + options.title + "</label>" : "") + "\n            <section class=\"header\"></section>\n            <section class=\"body\">\n            <table class=\"fields\">\n            " + (options.showLabels ? "<thead><tr><td>Field</td><td>Value</td></tr></thead>" : "") + "\n                <tbody>\n                    <tr><td>Field</td><td>Value</td></tr>\n                </tbody>\n            </table>\n            </section>\n            <section class=\"footer\"></section>\n        </form>\n        ").trim()));
            options.element.appendChild(form);
            {
                var body_1 = form.getElementsByTagName("tbody")[0];
                body_1.innerHTML = "";
                options.fields &&
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
                                    input = (index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"checkbox\" " + (field.default ? "checked" : "") + " />"));
                                    break;
                                case "integer":
                                    input = (index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"number\" min=\"0\" step=\"1\" " + (field.default ? "value=\"" + field.default + "\"" : "") + " />"));
                                    break;
                                case "number":
                                    input = (index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"number\" min=\"0\" max=\"" + Array(field.length || 3).join("9") + "\" />"));
                                    break;
                                case "string":
                                default:
                                    input = (index_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"text\" " + (field.default ? "value=\"" + field.default + "\"" : "") + " />"));
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
                    var searchButton_1 = (index_1.html("<input type=\"button\" class=\"ol-search-button\" value=\"Search\"/>"));
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
                            _this.options.fields &&
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
            // provide computed defaults
            options = index_1.mixin({
                openedText: options && options.className && -1 < options.className.indexOf("left")
                    ? expando.left
                    : expando.right,
                closedText: options && options.className && -1 < options.className.indexOf("left")
                    ? expando.right
                    : expando.left
            }, options || {});
            // provide static defaults
            options = index_1.mixin(index_1.mixin({}, defaults), options);
            var element = document.createElement("div");
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
            index_1.doif(this.options.element, function (e) {
                _this.options.position && _this.options.position.split(" ").forEach(function (k) { return e.classList.remove(k); });
                position.split(" ").forEach(function (k) { return e.classList.add(k); });
            });
            this.options.position = position;
        };
        SearchForm.prototype.cssin = function () {
            var className = this.options.className;
            var positions = index_1.pair("top left right bottom".split(" "), index_1.range(24)).map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || "")) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(index_1.cssin(className, "\n." + className + " {\n    position: absolute;\n}\n\n." + className + " button {\n    min-height: 1.375em;\n    min-width: 1.375em;\n    width: auto;\n    display: inline;\n}\n\n." + className + ".left button {\n    float:right;\n}\n\n." + className + ".right button {\n    float:left;\n}\n\n." + className + " form {\n    width: 16em;\n    border: none;\n    padding: 0;\n    margin: 0;\n    margin-left: 2px;\n    margin-top: 2px;\n    vertical-align: top;\n}\n." + className + " form.ol-hidden {\n    display: none;\n}\n" + positions.join("\n")));
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
                this.options.fields &&
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
        document.body.appendChild(metaForm.options.element); //  map.addControl(metaForm);
    }
    exports.run = run;
});
define("ol3-search/providers/bing", ["require", "exports", "jquery", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, $, ol, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SampleError = {
        authenticationResultCode: "NoCredentials",
        brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
        copyright: "Copyright © 2017 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
        errorDetails: [
            "Access was denied. You may have entered your credentials incorrectly, or you might not have access to the requested resource or operation."
        ],
        resourceSets: [],
        statusCode: 401,
        statusDescription: "Unauthorized",
        traceId: "4c1f421581304d2db0de98984d325333|BN20130523|7.7.0.0|"
    };
    var SampleResponse = {
        authenticationResultCode: "ValidCredentials",
        brandLogoUri: "http://dev.virtualearth.net/Branding/logo_powered_by.png",
        copyright: "Copyright © 2017 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
        resourceSets: [
            {
                estimatedTotal: 1,
                resources: [
                    {
                        __type: "Location:http://schemas.microsoft.com/search/local/ws/rest/v1",
                        bbox: [33.8865585327148, -118.485336303711, 34.004810333252, -118.296867370605],
                        name: "Los Angeles International Airport, CA",
                        point: {
                            type: "Point",
                            coordinates: [33.9457054138184, -118.391105651855]
                        },
                        address: {
                            adminDistrict: "CA",
                            adminDistrict2: "Los Angeles County",
                            countryRegion: "United States",
                            formattedAddress: "Los Angeles International Airport, CA",
                            locality: "Los Angeles"
                        },
                        confidence: "High",
                        entityType: "Airport",
                        geocodePoints: [
                            {
                                type: "Point",
                                coordinates: [33.9457054138184, -118.391105651855],
                                calculationMethod: "Rooftop",
                                usageTypes: ["Display"]
                            }
                        ],
                        matchCodes: ["Good"]
                    }
                ]
            }
        ],
        statusCode: 200,
        statusDescription: "OK",
        traceId: "a7eba6ba242b4ffe93e28046a127dd23|BN20130442|7.7.0.0|"
    };
    var BingGeocode = /** @class */ (function () {
        function BingGeocode(options) {
            this.options = index_4.defaults(options || {}, BingGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(BingGeocode.prototype, "fields", {
            get: function () {
                return [
                    {
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
                jsonp: options.callbackName
            })
                .then(function (json) { return d.resolve(_this.handleResponse(json)); })
                .fail(function () { return d.reject("geocoder failed"); });
            return d;
        };
        BingGeocode.prototype.getParameters = function (options, map) {
            index_4.defaults(options, this.options);
            index_4.defaults(options.params, {
                key: options.key,
                maxResults: options.count
            }, this.options.params);
            if (map && options.bounded) {
                var extent = map.getView().calculateExtent(map.getSize());
                var p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
                {
                    var b = p
                        .transform(map.getView().getProjection(), "EPSG:4326")
                        .getExtent()
                        .map(function (v) { return v.toFixed(6); });
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
                        country: result.address.countryRegion
                    },
                    original: result
                }); });
                results = results.concat(resultSet);
            });
            return results;
        };
        BingGeocode.DEFAULT_OPTIONS = {
            url: "//dev.virtualearth.net/REST/v1/Locations",
            callbackName: "jsonp",
            dataType: "jsonp",
            method: "GET",
            params: {
                includeNeighborhood: 0,
                maxResults: 5,
                userRegion: "US"
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
        var center = ol.proj.transform([-120, 35], "EPSG:4326", "EPSG:3857");
        var mapContainer = document.getElementsByClassName("map")[0];
        var map = new ol.Map({
            loadTilesWhileAnimating: true,
            target: mapContainer,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.TileDebug({
                        projection: "EPSG:3857",
                        tileGrid: ol.tilegrid.createXYZ({ tileSize: 1024 })
                    }),
                    opacity: 0.8
                })
            ],
            view: new ol.View({
                center: center,
                projection: "EPSG:3857",
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
        name: ["point_of_interest", "establishment", "natural_feature", "airport"],
        road: ["street_address", "route", "sublocality_level_5", "intersection"],
        postcode: ["postal_code"],
        city: ["locality"],
        state: ["administrative_area_level_1"],
        country: ["country"]
    };
    var GoogleMappingKeys = Object.keys(GoogleMappingTable);
    var GoogleGeocode = /** @class */ (function () {
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
            // cleanup request before sending
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
            // apply default options
            index_8.defaults(options, this.options);
            // tweak provider-specific settings
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
                    var b = p
                        .transform(map.getView().getProjection(), "EPSG:4326")
                        .getExtent()
                        .map(function (v) { return v.toFixed(6); });
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
            url: "//maps.googleapis.com/maps/api/geocode/json",
            dataType: "json",
            method: "GET",
            params: {
                address: "",
                key: "",
                language: "en-US",
                country: "US"
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
/**
 * Searches features in a layer
 */
define("ol3-search/providers/layer", ["require", "exports", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, ol, index_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayerGeocode = /** @class */ (function () {
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
        /**
         * Performs the actual search
         */
        LayerGeocode.prototype.execute = function (options) {
            options = this.getParameters(options, this.options.map);
            if (!options.params.layers)
                throw "params.layers required";
            if (!options.params.propertyNames)
                throw "params.propertyNames required";
            if (!options.map)
                throw "map required";
            var d = $.Deferred();
            var searchText = options.params.query;
            var results = [];
            var layers = options.params.layers;
            var propertyNames = options.params.propertyNames;
            var map = options.map;
            layers.forEach(function (l) {
                var features = l.getSource().getFeatures();
                results = results.concat(features.filter(function (f) {
                    return propertyNames.some(function (propertyName) {
                        var value = f.get(propertyName);
                        return -1 < value.indexOf(searchText);
                    });
                }));
            });
            if (options.count && (0 < options.count && options.count < results.length)) {
                // TODO: remove all but the best matches
            }
            results = results.map(function (f) { return f.clone(); });
            results.forEach(function (f) { return f.getGeometry().transform(map.getView().getProjection(), "EPSG:4326"); });
            d.resolve(this.handleResponse({ features: results }));
            return d;
        };
        LayerGeocode.prototype.getParameters = function (options, map) {
            index_10.defaults(options, this.options);
            index_10.defaults(options.params, this.options.params);
            return options;
        };
        LayerGeocode.prototype.handleResponse = function (response) {
            var asExtent = function (r) { return ol.geom.Polygon.fromExtent(r.getGeometry().getExtent()); };
            if (!this.options.params.propertyNames)
                throw "";
            var propertyNames = this.options.params.propertyNames;
            return response.features.map(function (f) {
                var _a = ol.extent.getCenter(f.getGeometry().getExtent()), lon = _a[0], lat = _a[1];
                return {
                    placeId: "" + f.getId(),
                    title: f.get(propertyNames[0]),
                    lat: lat,
                    lon: lon,
                    extent: asExtent(f),
                    address: propertyNames.map(function (n) { return f.get(n); }),
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
    var SampleResponse = [
        {
            place_id: "96646138",
            licence: "Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright",
            osm_type: "way",
            osm_id: "131190417",
            boundingbox: ["33.9311771", "33.9530757", "-118.4387216", "-118.3701912"],
            lat: "33.94203285",
            lon: "-118.410103847565",
            display_name: "Los Angeles International Airport, Service road S, Westchester, Playa del Rey, Los Angeles, Los Angeles County, California, 90245, United States of America",
            class: "aeroway",
            type: "aerodrome",
            importance: 0.50388163735627,
            icon: "http://ip-10-98-174-147.mq-us-east-1.ec2.aolcloud.net:8000/nominatim/v1/images/mapicons/transport_airport2.p.20.png",
            address: {
                aerodrome: "Los Angeles International Airport",
                road: "Service road S",
                neighbourhood: "Westchester",
                suburb: "Playa del Rey",
                city: "Los Angeles",
                county: "Los Angeles County",
                state: "California",
                postcode: "90245",
                country: "United States of America",
                country_code: "us"
            }
        }
    ];
    var MapQuestGeocode = /** @class */ (function () {
        function MapQuestGeocode(options) {
            this.options = index_13.defaults(options || {}, MapQuestGeocode.DEFAULT_OPTIONS);
        }
        Object.defineProperty(MapQuestGeocode.prototype, "fields", {
            get: function () {
                return [
                    {
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
            // cleanup
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
            // compute viewbox
            if (map && options.bounded && !options.params.viewbox) {
                var extent = map.getView().calculateExtent(map.getSize());
                var p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
                {
                    var b = p
                        .transform(map.getView().getProjection(), "EPSG:4326")
                        .getExtent()
                        .map(function (v) { return v.toFixed(6); });
                    options.params.viewbox = b[0] + "," + b[3] + "," + b[2] + "," + b[1];
                    options.params.bounded = 0; // viewbox is just a suggestion
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
                    name: result.address.neighbourhood || "",
                    road: result.address.road || "",
                    postcode: result.address.postcode,
                    city: result.address.city || result.address.town,
                    state: result.address.state,
                    country: result.address.country
                },
                original: result
            }); });
        };
        MapQuestGeocode.DEFAULT_OPTIONS = {
            url: "//open.mapquestapi.com/nominatim/v1/search.php",
            params: {
                q: "",
                key: "X2CL1j8ekBW6g0U80tP0OogXILAQWkG4",
                format: "json",
                addressdetails: 1,
                limit: 1,
                countrycodes: "US",
                "accept-language": "en-US"
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
    var OpenStreetGeocode = /** @class */ (function () {
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
                limit: options.count
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
            if (options.params) {
                var params_1 = options.params;
                Object.keys(params_1)
                    .filter(function (k) { return typeof params_1[k] === "boolean"; })
                    .forEach(function (k) {
                    params_1[k] = params_1[k] ? "1" : "0";
                });
            }
            return options;
        };
        OpenStreetGeocode.prototype.handleResponse = function (response) {
            var asExtent = function (r) {
                var _a = r.boundingbox.map(function (v) { return parseFloat(v); }), lat1 = _a[0], lat2 = _a[1], lon1 = _a[2], lon2 = _a[3];
                return ol.geom.Polygon.fromExtent([lon1, lat1, lon2, lat2]);
            };
            return response.sort(function (v) { return v.importance || 1; }).map(function (result) {
                return ({
                    title: result.display_name,
                    lon: parseFloat(result.lon),
                    lat: parseFloat(result.lat),
                    extent: asExtent(result),
                    address: {
                        name: result.address.neighbourhood || "",
                        road: result.address.road || "",
                        postcode: result.address.postcode,
                        city: result.address.city || result.address.town,
                        state: result.address.state,
                        country: result.address.country
                    },
                    original: result
                });
            });
        };
        OpenStreetGeocode.DEFAULT_OPTIONS = {
            url: "//nominatim.openstreetmap.org/search/",
            dataType: "json",
            method: "GET",
            params: {
                format: "json",
                addressdetails: true,
                limit: 10,
                countrycodes: ["US"],
                "accept-language": "en-US"
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
define("ol3-search/providers/wfs", ["require", "exports", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, ol, index_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var olFormatFilter = ol.format["filter"];
    var WfsGeocode = /** @class */ (function () {
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
            if (options.params.query && options.params.searchNames) {
                var searchText_1 = options.params.query.replace(/ /g, "*");
                var filters = options.params.searchNames.map(function (searchName) {
                    return olFormatFilter.like(searchName, "*" + searchText_1 + "*");
                });
                var filter = filters.length > 1 ? olFormatFilter.or.apply(olFormatFilter.or, filters) : filters[0];
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
                outputFormat: "GML3",
                maxFeatures: options.count,
                geometryName: "geom",
                propertyNames: options.params.propertyNames,
                bbox: options.extent,
                filter: options.filter
            });
            options.data = getFeatureRequest.outerHTML;
            return options;
        };
        WfsGeocode.prototype.handleResponse = function (response) {
            if (!this.options.params.propertyNames)
                throw "params.propertyNames required";
            var propertyNames = this.options.params.propertyNames;
            var format = new ol.format.WFS();
            var result = format.readFeatures(response);
            var asExtent = function (r) {
                var extent = r.getGeometry().getExtent();
                return ol.geom.Polygon.fromExtent(extent);
            };
            return result.map(function (f) {
                var extent = asExtent(f);
                var _a = extent.getInteriorPoint().getCoordinates(), lon = _a[0], lat = _a[1];
                var title = propertyNames
                    .map(function (n) { return f.get(n); })
                    .filter(function (v) { return !!v && typeof v !== "object"; })
                    .join(" - ");
                if (!title)
                    title = f
                        .getProperties()
                        .map(function (n) { return f.get(n); })
                        .filter(function (v) { return !!v && typeof v === "string"; })
                        .join(" - ");
                if (!title)
                    title = "" + f.getId();
                return {
                    placeId: "" + f.getId(),
                    title: title,
                    lat: lat,
                    lon: lon,
                    extent: extent,
                    address: propertyNames.map(function (n) { return f.get(n); }),
                    original: f
                };
            });
        };
        WfsGeocode.DEFAULT_OPTIONS = {
            url: "http://localhost:8080/geoserver/cite/wfs",
            dataType: "xml",
            contentType: "application/xml",
            method: "POST",
            params: {
                query: "",
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
                    // try again without extent limitation
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
            // clone value before passing to provider so each gets pristine arguments
            providers[0].execute({ params: clone(value) }).then(function (results) {
                if (results.length) {
                    process(results);
                    // switch primary provider
                    providers.push(providers.shift());
                }
                else {
                    // run all the remaining providers at once
                    providers.filter(function (v, i) { return i > 0; }).forEach(function (provider) {
                        provider.execute({ params: clone(value) }).then(function (results) {
                            process(results);
                        });
                    });
                }
            }).fail(function () {
                // switch primary provider
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
            //.sort()
            .map(function (lab) { return "<div class='test'><a href='" + path + lab + "&debug=0'>" + lab + "</a></div>"; })
            .join("\n");
        html += "<a href='" + l.origin + l.pathname + "?run=ol3-search/tests/index'>tests</a>";
        document.write(html);
    }
    exports.run = run;
    ;
});
//# sourceMappingURL=examples.max.js.map