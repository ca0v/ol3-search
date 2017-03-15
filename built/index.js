var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("bower_components/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result.push(list[i]);
        }
        return result;
    }
    exports.asArray = asArray;
    // ie11 compatible
    function toggle(e, className, toggle) {
        if (toggle === void 0) { toggle = false; }
        !toggle ? e.classList.remove(className) : e.classList.add(className);
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
    function debounce(func, wait, immediate) {
        var _this = this;
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
                    func.apply(_this, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.call(_this, args);
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
    function pair(a1, a2) {
        var result = [];
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return result.push([v1, v2]); }); });
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
    // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
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
define("ol3-search/ol3-search", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_1) {
    "use strict";
    var css = (function (I) { return "\n    ." + I.name + " {\n        position:absolute;\n    }\n    ." + I.name + ".top {\n        top: 0.5em;\n    }\n    ." + I.name + ".top-1 {\n        top: 1.5em;\n    }\n    ." + I.name + ".top-2 {\n        top: 2.5em;\n    }\n    ." + I.name + ".top-3 {\n        top: 3.5em;\n    }\n    ." + I.name + ".top-4 {\n        top: 4.5em;\n    }\n    ." + I.name + ".left {\n        left: 0.5em;\n    }\n    ." + I.name + ".left-1 {\n        left: 1.5em;\n    }\n    ." + I.name + ".left-2 {\n        left: 2.5em;\n    }\n    ." + I.name + ".left-3 {\n        left: 3.5em;\n    }\n    ." + I.name + ".left-4 {\n        left: 4.5em;\n    }\n    ." + I.name + ".bottom {\n        bottom: 0.5em;\n    }\n    ." + I.name + ".bottom-1 {\n        bottom: 1.5em;\n    }\n    ." + I.name + ".bottom-2 {\n        bottom: 2.5em;\n    }\n    ." + I.name + ".bottom-3 {\n        bottom: 3.5em;\n    }\n    ." + I.name + ".bottom-4 {\n        bottom: 4.5em;\n    }\n    ." + I.name + ".right {\n        right: 0.5em;\n    }\n    ." + I.name + ".right-1 {\n        right: 1.5em;\n    }\n    ." + I.name + ".right-2 {\n        right: 2.5em;\n    }\n    ." + I.name + ".right-3 {\n        right: 3.5em;\n    }\n    ." + I.name + ".right-4 {\n        right: 4.5em;\n    }\n    ." + I.name + " button {\n        min-height: 1.375em;\n        min-width: 1.375em;\n        width: auto;\n        display: inline;\n    }\n    ." + I.name + ".left button {\n        float:right;\n    }\n    ." + I.name + ".right button {\n        float:left;\n    }\n    ." + I.name + " form {\n        width: 16em;\n        border: none;\n        padding: 0;\n        margin: 0;\n        margin-left: 2px;\n        margin-top: 2px;\n        vertical-align: top;\n    }\n    ." + I.name + " form.ol-hidden {\n        display: none;\n    }\n"; })({ name: 'ol-search' });
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
        className: 'ol-search bottom left',
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
            var button = _this.button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.title = options.title;
            options.element.appendChild(button);
            if (options.hideButton) {
                button.style.display = "none";
            }
            var form = _this.form = common_1.html(("\n        <form>\n            " + (options.title ? "<label class=\"title\">" + options.title + "</label>" : "") + "\n            <section class=\"header\"></section>\n            <section class=\"body\">\n            <table class=\"fields\">\n            " + (options.showLabels ? "<thead><tr><td>Field</td><td>Value</td></tr></thead>" : "") + "\n                <tbody>\n                    <tr><td>Field</td><td>Value</td></tr>\n                </tbody>\n            </table>\n            </section>\n            <section class=\"footer\"></section>\n        </form>\n        ").trim());
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
                    switch (field.type) {
                        case "boolean":
                            input = common_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"checkbox\" " + (field.default ? "checked" : "") + " />");
                            break;
                        case "integer":
                            input = common_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"number\" min=\"0\" step=\"1\" " + (field.default ? "value=\"" + field.default + "\"" : "") + " />");
                            break;
                        case "number":
                            input = common_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"number\" min=\"0\" max=\"" + Array(field.length || 3).join("9") + "\" />");
                            break;
                        case "string":
                        default:
                            input = common_1.html("<input class=\"input " + field.name + "\" name=\"" + field.name + "\" type=\"text\" " + (field.default ? "value=\"" + field.default + "\"" : "") + " />");
                            input.maxLength = field.length || 20;
                            break;
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
                var searchButton_1 = common_1.html("<input type=\"button\" class=\"ol-search-button\" value=\"Search\"/>");
                footer.appendChild(searchButton_1);
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
                });
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
                form.addEventListener("keypress", common_1.debounce(function () {
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
            common_1.cssin('ol-search', css);
            // provide computed defaults        
            options = common_1.mixin({
                openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
                closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
            }, options || {});
            // provide static defaults        
            options = common_1.mixin(common_1.mixin({}, defaults), options);
            var element = document.createElement('div');
            element.className = options.className + " " + olcss.CLASS_UNSELECTABLE + " " + olcss.CLASS_CONTROL;
            var geocoderOptions = common_1.mixin({
                element: element,
                target: options.target,
                expanded: false
            }, options);
            return new SearchForm(geocoderOptions);
        };
        SearchForm.prototype.collapse = function (options) {
            if (!options.canCollapse)
                return;
            options.expanded = false;
            this.form.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.innerHTML = options.closedText;
        };
        SearchForm.prototype.expand = function (options) {
            options.expanded = true;
            this.form.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.innerHTML = options.openedText;
            this.form.focus();
        };
        SearchForm.prototype.on = function (type, cb) {
            _super.prototype.on.call(this, type, cb);
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
        return SearchForm;
    }(ol.control.Control));
    exports.SearchForm = SearchForm;
});
define("index", ["require", "exports", "ol3-search/ol3-search"], function (require, exports, Input) {
    "use strict";
    return Input;
});
define("bower_components/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_2) {
    "use strict";
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    function zoomToFeature(map, feature, options) {
        options = common_2.defaults(options || {}, {
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
                duration: duration
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
    }
    exports.zoomToFeature = zoomToFeature;
});
// ported from https://github.com/gmaclennan/parse-dms/blob/master/index.js
define("bower_components/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
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
        dmsString = dmsString.trim();
        // Inspired by https://gist.github.com/JeffJacobson/2955437
        // See https://regex101.com/r/kS2zR1/3
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw 'Could not parse string';
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
        if (typeof decDeg1.latLon === 'undefined') {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                // If we only have one coordinate but we have no hemisphere value,
                // just return the decDeg number
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                // If no hemisphere letter but we have two coordinates,
                // infer that the first is lat, the second lon
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            }
            else {
                throw 'Could not parse string';
            }
        }
        // If we parsed the first coordinate as lat or lon, then assume the second is the other
        if (typeof decDeg2.latLon === 'undefined') {
            decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
        var _a;
    }
    exports.parse = parse;
});
define("bower_components/ol3-fun/index", ["require", "exports", "bower_components/ol3-fun/ol3-fun/common", "bower_components/ol3-fun/ol3-fun/navigation", "bower_components/ol3-fun/ol3-fun/parse-dms"], function (require, exports, common, navigation, dms) {
    "use strict";
    var index = common.defaults(common, {
        dms: dms,
        navigation: navigation
    });
    return index;
});
define("bower_components/ol3-fun/ol3-fun/snapshot", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function getStyle(feature) {
        var style = feature.getStyle();
        if (!style) {
            var styleFn = feature.getStyleFunction();
            if (styleFn) {
                style = styleFn(0);
            }
        }
        if (!style) {
            style = new ol.style.Style({
                text: new ol.style.Text({
                    text: "?"
                })
            });
        }
        if (!Array.isArray(style))
            style = [style];
        return style;
    }
    var Snapshot = (function () {
        function Snapshot() {
        }
        Snapshot.render = function (canvas, feature) {
            feature = feature.clone();
            var geom = feature.getGeometry();
            var extent = geom.getExtent();
            var isPoint = extent[0] === extent[2];
            var _a = ol.extent.getCenter(extent), dx = _a[0], dy = _a[1];
            var scale = isPoint ? 1 : Math.min(canvas.width / ol.extent.getWidth(extent), canvas.height / ol.extent.getHeight(extent));
            geom.translate(-dx, -dy);
            geom.scale(scale, -scale);
            geom.translate(canvas.width / 2, canvas.height / 2);
            var vtx = ol.render.toContext(canvas.getContext("2d"));
            var styles = getStyle(feature);
            if (!Array.isArray(styles))
                styles = [styles];
            styles.forEach(function (style) { return vtx.drawFeature(feature, style); });
        };
        /**
         * convert features into data:image/png;base64;
         */
        Snapshot.snapshot = function (feature) {
            var canvas = document.createElement("canvas");
            var geom = feature.getGeometry();
            this.render(canvas, feature);
            return canvas.toDataURL();
        };
        return Snapshot;
    }());
    return Snapshot;
});
define("bower_components/ol3-grid/ol3-grid/ol3-grid", ["require", "exports", "openlayers", "bower_components/ol3-fun/index", "bower_components/ol3-fun/ol3-fun/snapshot", "bower_components/ol3-fun/ol3-fun/navigation"], function (require, exports, ol, ol3_fun_1, Snapshot, navigation_1) {
    "use strict";
    var grid_html = "\n<div class='ol-grid-container'>\n    <table class='ol-grid-table'>\n        <tbody><tr><td/></tr></tbody>\n    </table>\n</div>\n";
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
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(options) {
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
            _this.features = new ol.source.Vector();
            _this.featureMap = [];
            _this.handlers = [];
            _this.cssin();
            var button = _this.button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.title = options.placeholderText;
            options.element.appendChild(button);
            if (options.hideButton) {
                button.style.display = "none";
            }
            var grid = ol3_fun_1.html(grid_html.trim());
            _this.grid = grid.getElementsByClassName("ol-grid-table")[0];
            options.element.appendChild(grid);
            if (_this.options.autoCollapse) {
                button.addEventListener("mouseover", function () {
                    !options.expanded && _this.expand();
                });
                button.addEventListener("focus", function () {
                    !options.expanded && _this.expand();
                });
                button.addEventListener("blur", function () {
                    options.expanded && _this.collapse();
                });
            }
            button.addEventListener("click", function () {
                options.expanded ? _this.collapse() : _this.expand();
            });
            options.expanded ? _this.expand() : _this.collapse();
            // render
            _this.features.on(["addfeature", "addfeatures"], ol3_fun_1.debounce(function () { return _this.redraw(); }));
            if (_this.options.currentExtent) {
                _this.options.map.getView().on(["change:center", "change:resolution"], ol3_fun_1.debounce(function () { return _this.redraw(); }));
            }
            if (_this.options.layers) {
                _this.options.layers.forEach(function (l) {
                    var source = l.getSource();
                    source.on("addfeature", function (args) {
                        _this.add(args.feature, l);
                    });
                    source.on("removefeature", function (args) {
                        _this.remove(args.feature, l);
                    });
                });
            }
            return _this;
        }
        Grid.create = function (options) {
            // provide computed and static defaults
            options = ol3_fun_1.defaults(ol3_fun_1.mixin({
                openedText: options.position && -1 < options.position.indexOf("left") ? expando.left : expando.right,
                closedText: options.position && -1 < options.position.indexOf("left") ? expando.right : expando.left,
            }, options), Grid.DEFAULT_OPTIONS);
            var element = document.createElement('div');
            element.className = options.className + " " + options.position + " " + olcss.CLASS_UNSELECTABLE + " " + olcss.CLASS_CONTROL;
            var gridOptions = ol3_fun_1.mixin({
                map: options.map,
                element: element,
                expanded: false
            }, options);
            var grid = new Grid(gridOptions);
            if (options.map) {
                options.map.addControl(grid);
            }
            grid.handlers.push(function () { return element.remove(); });
            return grid;
        };
        Grid.prototype.destroy = function () {
            this.handlers.forEach(function (h) { return h(); });
            this.setTarget(null);
        };
        Grid.prototype.setPosition = function (position) {
            var _this = this;
            this.options.position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.remove(k); });
            position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.add(k); });
            this.options.position = position;
        };
        Grid.prototype.cssin = function () {
            var className = this.options.className;
            var positions = ol3_fun_1.pair("top left right bottom".split(" "), ol3_fun_1.range(24))
                .map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || '')) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(ol3_fun_1.cssin(className, "\n." + className + " ." + className + "-container {\n    max-height: 16em;\n    overflow-y: auto;\n}\n." + className + " ." + className + "-container.ol-hidden {\n    display: none;\n}\n." + className + " .feature-row {\n    cursor: pointer;\n}\n." + className + " .feature-row:hover {\n    background: black;\n    color: white;\n}\n." + className + " .feature-row:focus {\n    background: #ccc;\n    color: black;\n}\n" + positions.join('\n') + "\n"));
        };
        Grid.prototype.redraw = function () {
            var _this = this;
            var options = this.options;
            var map = options.map;
            var extent = map.getView().calculateExtent(map.getSize());
            var tbody = this.grid.tBodies[0];
            tbody.innerHTML = "";
            var features = [];
            if (this.options.currentExtent) {
                this.features.forEachFeatureInExtent(extent, function (f) { return void features.push(f); });
            }
            else {
                this.features.forEachFeature(function (f) { return void features.push(f); });
            }
            features.forEach(function (feature) {
                var tr = document.createElement("tr");
                tr.tabIndex = 0;
                tr.className = "feature-row";
                if (_this.options.showIcon) {
                    var td = document.createElement("td");
                    var canvas = document.createElement("canvas");
                    td.appendChild(canvas);
                    canvas.className = "icon";
                    canvas.width = 160;
                    canvas.height = 64;
                    tr.appendChild(td);
                    Snapshot.render(canvas, feature);
                }
                if (_this.options.labelAttributeName) {
                    var td = document.createElement("td");
                    var label = ol3_fun_1.html("<label class=\"label\">" + feature.get(_this.options.labelAttributeName) + "</label>");
                    td.appendChild(label);
                    tr.appendChild(td);
                }
                ["click", "keypress"].forEach(function (k) {
                    return tr.addEventListener(k, function () {
                        if (_this.options.autoCollapse) {
                            _this.collapse();
                        }
                        _this.dispatchEvent({
                            type: "feature-click",
                            feature: feature,
                            row: tr[0]
                        });
                        if (_this.options.autoPan) {
                            navigation_1.zoomToFeature(map, feature, {
                                duration: options.zoomDuration,
                                padding: options.zoomPadding,
                                minResolution: options.zoomMinResolution
                            });
                        }
                    });
                });
                tbody.appendChild(tr);
            });
        };
        Grid.prototype.add = function (feature, layer) {
            var _this = this;
            var style = feature.getStyle();
            if (!style && layer && this.options.showIcon) {
                style = layer.getStyleFunction()(feature, 0);
                // need to capture style but don't want to effect original feature
                var originalFeature_1 = feature;
                feature = originalFeature_1.clone();
                feature.setStyle(style);
                // how to keep geometry in sync?
                originalFeature_1.on("change", ol3_fun_1.debounce(function () {
                    feature.setGeometry(originalFeature_1.getGeometry());
                    _this.redraw();
                }));
                this.featureMap.push({ f1: originalFeature_1, f2: feature });
            }
            this.features.addFeature(feature);
        };
        Grid.prototype.remove = function (feature, layer) {
            var _this = this;
            this.featureMap.filter(function (map) { return map.f1 === feature; }).forEach(function (m) { return _this.features.removeFeature(m.f2); });
            this.redraw();
        };
        Grid.prototype.clear = function () {
            var tbody = this.grid.tBodies[0];
            tbody.innerHTML = "";
        };
        Grid.prototype.collapse = function () {
            var options = this.options;
            if (!options.canCollapse)
                return;
            options.expanded = false;
            this.grid.parentElement.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.innerHTML = options.closedText;
        };
        Grid.prototype.expand = function () {
            var options = this.options;
            options.expanded = true;
            this.grid.parentElement.classList.toggle(olcss.CLASS_HIDDEN, false);
            this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
            this.button.innerHTML = options.openedText;
        };
        Grid.prototype.on = function (type, cb) {
            return _super.prototype.on.call(this, type, cb);
        };
        return Grid;
    }(ol.control.Control));
    Grid.DEFAULT_OPTIONS = {
        className: 'ol-grid',
        position: 'top right',
        expanded: false,
        autoCollapse: true,
        autoPan: true,
        canCollapse: true,
        currentExtent: true,
        hideButton: false,
        showIcon: false,
        labelAttributeName: "",
        closedText: expando.right,
        openedText: expando.left,
        // what to show on the tooltip
        placeholderText: 'Features',
        // zoom-to-feature options
        zoomDuration: 2000,
        zoomPadding: 256,
        zoomMinResolution: 1 / Math.pow(2, 22)
    };
    exports.Grid = Grid;
});
define("bower_components/ol3-grid/index", ["require", "exports", "bower_components/ol3-grid/ol3-grid/ol3-grid"], function (require, exports, Grid) {
    "use strict";
    return Grid;
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/format/base", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    var StyleConverter = (function () {
        function StyleConverter() {
        }
        StyleConverter.prototype.fromJson = function (json) {
            return this.deserializeStyle(json);
        };
        StyleConverter.prototype.toJson = function (style) {
            return this.serializeStyle(style);
        };
        /**
         * uses the interior point of a polygon when rendering a 'point' style
         */
        StyleConverter.prototype.setGeometry = function (feature) {
            var geom = feature.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
                geom = geom.getInteriorPoint();
            }
            return geom;
        };
        StyleConverter.prototype.assign = function (obj, prop, value) {
            //let getter = prop[0].toUpperCase() + prop.substring(1);
            if (value === null)
                return;
            if (value === undefined)
                return;
            if (typeof value === "object") {
                if (Object.keys(value).length === 0)
                    return;
            }
            if (prop === "image") {
                if (value.hasOwnProperty("radius")) {
                    prop = "circle";
                }
                if (value.hasOwnProperty("points")) {
                    prop = "star";
                }
            }
            obj[prop] = value;
        };
        StyleConverter.prototype.serializeStyle = function (style) {
            var _this = this;
            var s = {};
            if (!style)
                return null;
            if (typeof style === "string")
                return style;
            if (typeof style === "number")
                return style;
            if (style.getColor)
                mixin(s, this.serializeColor(style.getColor()));
            if (style.getImage)
                this.assign(s, "image", this.serializeStyle(style.getImage()));
            if (style.getFill)
                this.assign(s, "fill", this.serializeFill(style.getFill()));
            if (style.getOpacity)
                this.assign(s, "opacity", style.getOpacity());
            if (style.getStroke)
                this.assign(s, "stroke", this.serializeStyle(style.getStroke()));
            if (style.getText)
                this.assign(s, "text", this.serializeStyle(style.getText()));
            if (style.getWidth)
                this.assign(s, "width", style.getWidth());
            if (style.getOffsetX)
                this.assign(s, "offset-x", style.getOffsetX());
            if (style.getOffsetY)
                this.assign(s, "offset-y", style.getOffsetY());
            if (style.getWidth)
                this.assign(s, "width", style.getWidth());
            if (style.getFont)
                this.assign(s, "font", style.getFont());
            if (style.getRadius)
                this.assign(s, "radius", style.getRadius());
            if (style.getRadius2)
                this.assign(s, "radius2", style.getRadius2());
            if (style.getPoints)
                this.assign(s, "points", style.getPoints());
            if (style.getAngle)
                this.assign(s, "angle", style.getAngle());
            if (style.getRotation)
                this.assign(s, "rotation", style.getRotation());
            if (style.getOrigin)
                this.assign(s, "origin", style.getOrigin());
            if (style.getScale)
                this.assign(s, "scale", style.getScale());
            if (style.getSize)
                this.assign(s, "size", style.getSize());
            if (style.getAnchor) {
                this.assign(s, "anchor", style.getAnchor());
                "anchorXUnits,anchorYUnits,anchorOrigin".split(",").forEach(function (k) {
                    _this.assign(s, k, style[k + "_"]);
                });
            }
            // "svg"
            if (style.path) {
                if (style.path)
                    this.assign(s, "path", style.path);
                if (style.getImageSize)
                    this.assign(s, "imgSize", style.getImageSize());
                if (style.stroke)
                    this.assign(s, "stroke", style.stroke);
                if (style.fill)
                    this.assign(s, "fill", style.fill);
                if (style.scale)
                    this.assign(s, "scale", style.scale); // getScale and getImgSize are modified in deserializer               
                if (style.imgSize)
                    this.assign(s, "imgSize", style.imgSize);
            }
            // "icon"
            if (style.getSrc)
                this.assign(s, "src", style.getSrc());
            if (s.points && s.radius !== s.radius2)
                s.points /= 2; // ol3 defect doubles point count when r1 <> r2  
            return s;
        };
        StyleConverter.prototype.serializeColor = function (color) {
            if (color instanceof Array) {
                return {
                    color: ol.color.asString(color)
                };
            }
            else if (color instanceof CanvasGradient) {
                return {
                    gradient: color
                };
            }
            else if (color instanceof CanvasPattern) {
                return {
                    pattern: color
                };
            }
            else if (typeof color === "string") {
                return {
                    color: color
                };
            }
            throw "unknown color type";
        };
        StyleConverter.prototype.serializeFill = function (fill) {
            return this.serializeStyle(fill);
        };
        StyleConverter.prototype.deserializeStyle = function (json) {
            var _this = this;
            var image;
            var text;
            var fill;
            var stroke;
            if (json.circle)
                image = this.deserializeCircle(json.circle);
            else if (json.star)
                image = this.deserializeStar(json.star);
            else if (json.icon)
                image = this.deserializeIcon(json.icon);
            else if (json.svg)
                image = this.deserializeSvg(json.svg);
            else if (json.image && (json.image.img || json.image.path))
                image = this.deserializeSvg(json.image);
            else if (json.image && json.image.src)
                image = this.deserializeIcon(json.image);
            else if (json.image)
                throw "unknown image type";
            if (json.text)
                text = this.deserializeText(json.text);
            if (json.fill)
                fill = this.deserializeFill(json.fill);
            if (json.stroke)
                stroke = this.deserializeStroke(json.stroke);
            var s = new ol.style.Style({
                image: image,
                text: text,
                fill: fill,
                stroke: stroke
            });
            image && s.setGeometry(function (feature) { return _this.setGeometry(feature); });
            return s;
        };
        StyleConverter.prototype.deserializeText = function (json) {
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            var _a = [json["offset-x"] || 0, json["offset-y"] || 0], x = _a[0], y = _a[1];
            {
                var p = new ol.geom.Point([x, y]);
                p.rotate(json.rotation, [0, 0]);
                p.scale(json.scale, json.scale);
                _b = p.getCoordinates(), x = _b[0], y = _b[1];
            }
            return new ol.style.Text({
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke),
                text: json.text,
                font: json.font,
                offsetX: x,
                offsetY: y,
                rotation: json.rotation,
                scale: json.scale
            });
            var _b;
        };
        StyleConverter.prototype.deserializeCircle = function (json) {
            var image = new ol.style.Circle({
                radius: json.radius,
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke)
            });
            image.setOpacity(json.opacity);
            return image;
        };
        StyleConverter.prototype.deserializeStar = function (json) {
            var image = new ol.style.RegularShape({
                radius: json.radius,
                radius2: json.radius2,
                points: json.points,
                angle: json.angle,
                fill: json.fill && this.deserializeFill(json.fill),
                stroke: json.stroke && this.deserializeStroke(json.stroke)
            });
            doif(json.rotation, function (v) { return image.setRotation(v); });
            doif(json.opacity, function (v) { return image.setOpacity(v); });
            return image;
        };
        StyleConverter.prototype.deserializeIcon = function (json) {
            if (!json.anchor) {
                json.anchor = [json["anchor-x"] || 0.5, json["anchor-y"] || 0.5];
            }
            var image = new ol.style.Icon({
                anchor: json.anchor || [0.5, 0.5],
                anchorOrigin: json.anchorOrigin || "top-left",
                anchorXUnits: json.anchorXUnits || "fraction",
                anchorYUnits: json.anchorYUnits || "fraction",
                //crossOrigin?: string;
                img: undefined,
                imgSize: undefined,
                offset: json.offset,
                offsetOrigin: json.offsetOrigin,
                opacity: json.opacity,
                scale: json.scale,
                snapToPixel: json.snapToPixel,
                rotateWithView: json.rotateWithView,
                rotation: json.rotation,
                size: json.size,
                src: json.src,
                color: json.color
            });
            image.load();
            return image;
        };
        StyleConverter.prototype.deserializeSvg = function (json) {
            json.rotation = json.rotation || 0;
            json.scale = json.scale || 1;
            if (json.img) {
                var symbol = document.getElementById(json.img);
                if (!symbol) {
                    throw "unable to find svg element: " + json.img;
                }
                if (symbol) {
                    // but just grab the path is probably good enough
                    var path = (symbol.getElementsByTagName("path")[0]);
                    if (path) {
                        if (symbol.viewBox) {
                            if (!json.imgSize) {
                                json.imgSize = [symbol.viewBox.baseVal.width, symbol.viewBox.baseVal.height];
                            }
                        }
                        json.path = (json.path || "") + path.getAttribute('d');
                    }
                }
            }
            var canvas = document.createElement("canvas");
            if (json.path) {
                {
                    // rotate a rectangle and get the resulting extent
                    _a = json.imgSize.map(function (v) { return v * json.scale; }), canvas.width = _a[0], canvas.height = _a[1];
                    if (json.stroke && json.stroke.width) {
                        var dx = 2 * json.stroke.width * json.scale;
                        canvas.width += dx;
                        canvas.height += dx;
                    }
                }
                var ctx = canvas.getContext('2d');
                var path2d = new Path2D(json.path);
                // rotate  before it is in the canvas (avoids pixelation)
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(json.scale, json.scale);
                ctx.translate(-json.imgSize[0] / 2, -json.imgSize[1] / 2);
                if (json.fill) {
                    ctx.fillStyle = json.fill.color;
                    ctx.fill(path2d);
                }
                if (json.stroke) {
                    ctx.strokeStyle = json.stroke.color;
                    ctx.lineWidth = json.stroke.width;
                    ctx.stroke(path2d);
                }
            }
            var icon = new ol.style.Icon({
                img: canvas,
                imgSize: [canvas.width, canvas.height],
                rotation: json.rotation,
                scale: 1,
                anchor: json.anchor || [canvas.width / 2, canvas.height],
                anchorOrigin: json.anchorOrigin,
                anchorXUnits: json.anchorXUnits || "pixels",
                anchorYUnits: json.anchorYUnits || "pixels",
                //crossOrigin?: string;
                offset: json.offset,
                offsetOrigin: json.offsetOrigin,
                opacity: json.opacity,
                snapToPixel: json.snapToPixel,
                rotateWithView: json.rotateWithView,
                size: [canvas.width, canvas.height],
                src: undefined
            });
            return mixin(icon, {
                path: json.path,
                stroke: json.stroke,
                fill: json.fill,
                scale: json.scale,
                imgSize: json.imgSize
            });
            var _a;
        };
        StyleConverter.prototype.deserializeFill = function (json) {
            var fill = new ol.style.Fill({
                color: json && this.deserializeColor(json)
            });
            return fill;
        };
        StyleConverter.prototype.deserializeStroke = function (json) {
            var stroke = new ol.style.Stroke();
            doif(json.color, function (v) { return stroke.setColor(v); });
            doif(json.lineCap, function (v) { return stroke.setLineCap(v); });
            doif(json.lineDash, function (v) { return stroke.setLineDash(v); });
            doif(json.lineJoin, function (v) { return stroke.setLineJoin(v); });
            doif(json.miterLimit, function (v) { return stroke.setMiterLimit(v); });
            doif(json.width, function (v) { return stroke.setWidth(v); });
            return stroke;
        };
        StyleConverter.prototype.deserializeColor = function (fill) {
            if (fill.color) {
                return fill.color;
            }
            if (fill.gradient) {
                var type = fill.gradient.type;
                var gradient_1;
                if (0 === type.indexOf("linear(")) {
                    gradient_1 = this.deserializeLinearGradient(fill.gradient);
                }
                else if (0 === type.indexOf("radial(")) {
                    gradient_1 = this.deserializeRadialGradient(fill.gradient);
                }
                if (fill.gradient.stops) {
                    // preserve
                    mixin(gradient_1, {
                        stops: fill.gradient.stops
                    });
                    var stops = fill.gradient.stops.split(";");
                    stops = stops.map(function (v) { return v.trim(); });
                    stops.forEach(function (colorstop) {
                        var stop = colorstop.match(/ \d+%/m)[0];
                        var color = colorstop.substr(0, colorstop.length - stop.length);
                        gradient_1.addColorStop(parseInt(stop) / 100, color);
                    });
                }
                return gradient_1;
            }
            if (fill.pattern) {
                var repitition = fill.pattern.repitition;
                var canvas = document.createElement('canvas');
                var spacing = canvas.width = canvas.height = fill.pattern.spacing | 6;
                var context = canvas.getContext('2d');
                context.fillStyle = fill.pattern.color;
                switch (fill.pattern.orientation) {
                    case "horizontal":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, 0, 1, 1);
                        }
                        break;
                    case "vertical":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "cross":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, 0, 1, 1);
                            context.fillRect(0, i, 1, 1);
                        }
                        break;
                    case "forward":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, i, 1, 1);
                        }
                        break;
                    case "backward":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                    case "diagonal":
                        for (var i = 0; i < spacing; i++) {
                            context.fillRect(i, i, 1, 1);
                            context.fillRect(spacing - 1 - i, i, 1, 1);
                        }
                        break;
                }
                return mixin(context.createPattern(canvas, repitition), fill.pattern);
            }
            throw "invalid color configuration";
        };
        StyleConverter.prototype.deserializeLinearGradient = function (json) {
            var rx = /\w+\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], x1 = _a[2], y1 = _a[3];
            var canvas = document.createElement('canvas');
            // not correct, assumes points reside on edge
            canvas.width = Math.max(x0, x1);
            canvas.height = Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createLinearGradient(x0, y0, x1, y1);
            mixin(gradient, {
                type: "linear(" + [x0, y0, x1, y1].join(",") + ")"
            });
            return gradient;
        };
        StyleConverter.prototype.deserializeRadialGradient = function (json) {
            var rx = /radial\((.*)\)/m;
            var _a = JSON.parse(json.type.replace(rx, "[$1]")), x0 = _a[0], y0 = _a[1], r0 = _a[2], x1 = _a[3], y1 = _a[4], r1 = _a[5];
            var canvas = document.createElement('canvas');
            // not correct, assumes radial centered
            canvas.width = 2 * Math.max(x0, x1);
            canvas.height = 2 * Math.max(y0, y1);
            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(x0, y0, r0, x1, y1, r1);
            mixin(gradient, {
                type: "radial(" + [x0, y0, r0, x1, y1, r1].join(",") + ")"
            });
            return gradient;
        };
        return StyleConverter;
    }());
    exports.StyleConverter = StyleConverter;
});
define("bower_components/ol3-symbolizer/index", ["require", "exports", "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Symbolizer) {
    "use strict";
    return Symbolizer;
});
define("ol3-search/providers/google", ["require", "exports", "openlayers", "bower_components/ol3-fun/index"], function (require, exports, ol, ol3_fun_2) {
    "use strict";
    exports.GoogleMappingTable = {
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
    var GoogleMappingKeys = Object.keys(exports.GoogleMappingTable);
    var GoogleGeocode = (function () {
        function GoogleGeocode(options) {
            this.options = ol3_fun_2.defaults(options || {}, GoogleGeocode.DEFAULT_OPTIONS);
        }
        GoogleGeocode.prototype.getParameters = function (options, map) {
            var params = {
                url: this.options.url,
                params: {
                    address: options.query || this.options.params.address,
                    key: options.key || this.options.params.key,
                    language: options.lang || this.options.params.language
                }
            };
            if (map && options.bounded) {
                var extent = map.getView().calculateExtent(map.getSize());
                var p = new ol.geom.Polygon([[ol.extent.getBottomLeft(extent)], [ol.extent.getTopRight(extent)]]);
                {
                    var b = p.transform(map.getView().getProjection(), "EPSG:4326").getExtent().map(function (v) { return v.toFixed(6); });
                    params.params.bounds = b[1] + "," + b[0] + "|" + b[3] + "," + b[2];
                }
            }
            return params;
        };
        GoogleGeocode.prototype.handleResponse = function (response) {
            var _this = this;
            console.assert(response.status === "OK", "status OK");
            var result = response.results.map(function (result) {
                var returnValue = {
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
                        if (-1 < exports.GoogleMappingTable[typeKey].indexOf(googleType)) {
                            result.address[typeKey] = addressComponent.long_name;
                        }
                    });
                });
            });
        };
        return GoogleGeocode;
    }());
    GoogleGeocode.DEFAULT_OPTIONS = {
        url: '//maps.googleapis.com/maps/api/geocode/json',
        params: {
            address: '',
            key: '',
            language: 'en-US',
            country: 'US'
        }
    };
    exports.GoogleGeocode = GoogleGeocode;
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/common/ajax", ["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var Ajax = (function () {
        function Ajax(url) {
            this.url = url;
            this.options = {
                use_json: true,
                use_cors: true
            };
        }
        Ajax.prototype.jsonp = function (args, url) {
            if (url === void 0) { url = this.url; }
            var d = $.Deferred();
            args["callback"] = "define";
            var uri = url + "?" + Object.keys(args).map(function (k) { return k + "=" + args[k]; }).join('&');
            require([uri], function (data) { return d.resolve(data); });
            return d;
        };
        // http://www.html5rocks.com/en/tutorials/cors/    
        Ajax.prototype.ajax = function (method, args, url) {
            if (url === void 0) { url = this.url; }
            var isData = method === "POST" || method === "PUT";
            var isJson = this.options.use_json;
            var isCors = this.options.use_cors;
            var d = $.Deferred();
            var client = new XMLHttpRequest();
            if (isCors)
                client.withCredentials = true;
            var uri = url;
            var data = null;
            if (args) {
                if (isData) {
                    data = JSON.stringify(args);
                }
                else {
                    uri += '?';
                    var argcount = 0;
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&';
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                }
            }
            client.open(method, uri, true);
            if (isData && isJson)
                client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            client.send(data);
            client.onload = function () {
                console.log("content-type", client.getResponseHeader("Content-Type"));
                if (client.status >= 200 && client.status < 300) {
                    isJson = isJson || 0 === client.getResponseHeader("Content-Type").indexOf("application/json");
                    d.resolve(isJson ? JSON.parse(client.response) : client.response);
                }
                else {
                    d.reject(client.statusText);
                }
            };
            client.onerror = function () { return d.reject(client.statusText); };
            // Return the promise
            return d;
        };
        Ajax.prototype.get = function (args) {
            return this.ajax('GET', args);
        };
        Ajax.prototype.post = function (args) {
            return this.ajax('POST', args);
        };
        Ajax.prototype.put = function (args) {
            return this.ajax('PUT', args);
        };
        Ajax.prototype.delete = function (args) {
            return this.ajax('DELETE', args);
        };
        return Ajax;
    }());
    return Ajax;
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/ags/ags-catalog", ["require", "exports", "bower_components/ol3-symbolizer/ol3-symbolizer/common/ajax"], function (require, exports, Ajax) {
    "use strict";
    /**
     * assigns undefined values
     */
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.filter(function (b) { return !!b; }).forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    var Catalog = (function () {
        function Catalog(url) {
            this.ajax = new Ajax(url);
        }
        Catalog.prototype.about = function (data) {
            var req = defaults({
                f: "pjson"
            }, data);
            return this.ajax.jsonp(req);
        };
        Catalog.prototype.aboutFolder = function (folder) {
            var ajax = new Ajax(this.ajax.url + "/" + folder);
            var req = {
                f: "pjson"
            };
            return ajax.jsonp(req);
        };
        Catalog.prototype.aboutFeatureServer = function (name) {
            var ajax = new Ajax(this.ajax.url + "/" + name + "/FeatureServer");
            var req = {
                f: "pjson"
            };
            return defaults(ajax.jsonp(req), { url: ajax.url });
        };
        Catalog.prototype.aboutMapServer = function (name) {
            var ajax = new Ajax(this.ajax.url + "/" + name + "/MapServer");
            var req = {
                f: "pjson"
            };
            return defaults(ajax.jsonp(req), { url: ajax.url });
        };
        Catalog.prototype.aboutLayer = function (layer) {
            var ajax = new Ajax(this.ajax.url + "/" + layer);
            var req = {
                f: "pjson"
            };
            return ajax.jsonp(req);
        };
        return Catalog;
    }());
    exports.Catalog = Catalog;
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer", ["require", "exports", "bower_components/ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer"], function (require, exports, Symbolizer) {
    "use strict";
    var symbolizer = new Symbolizer.StyleConverter();
    // esri -> ol mappings
    var styleMap = {
        "esriSMSCircle": "circle",
        "esriSMSDiamond": "diamond",
        "esriSMSX": "x",
        "esriSMSCross": "cross",
        "esriSLSSolid": "solid",
        "esriSFSSolid": "solid",
        "esriSLSDot": "dot",
        "esriSLSDash": "dash",
        "esriSLSDashDot": "dashdot",
        "esriSLSDashDotDot": "dashdotdot",
        "esriSFSForwardDiagonal": "forward-diagonal",
    };
    // esri -> ol mappings
    var typeMap = {
        "esriSMS": "sms",
        "esriSLS": "sls",
        "esriSFS": "sfs",
        "esriPMS": "pms",
        "esriPFS": "pfs",
        "esriTS": "txt",
    };
    function range(a, b) {
        var result = new Array(b - a + 1);
        while (a <= b)
            result.push(a++);
        return result;
    }
    function clone(o) {
        return JSON.parse(JSON.stringify(o));
    }
    // convert from ags style to an internal format
    var StyleConverter = (function () {
        function StyleConverter() {
        }
        StyleConverter.prototype.asWidth = function (v) {
            return v * 4 / 3; // not sure why
        };
        // see ol.color.asString
        StyleConverter.prototype.asColor = function (color) {
            if (color.length === 4)
                return "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] / 255 + ")";
            if (color.length === 3)
                return "rgb(" + color[0] + "," + color[1] + "," + color[2] + "})";
            return "#" + color.map(function (v) { return ("0" + v.toString(16)).substr(0, 2); }).join("");
        };
        StyleConverter.prototype.fromSFSSolid = function (symbol, style) {
            style.fill = {
                color: this.asColor(symbol.color)
            };
            this.fromSLS(symbol.outline, style);
        };
        StyleConverter.prototype.fromSFS = function (symbol, style) {
            switch (symbol.style) {
                case "esriSFSSolid":
                    this.fromSFSSolid(symbol, style);
                    break;
                case "esriSFSForwardDiagonal":
                    this.fromSFSSolid(symbol, style);
                    break;
                default:
                    throw "invalid-style: " + symbol.style;
            }
        };
        StyleConverter.prototype.fromSMSCircle = function (symbol, style) {
            style.circle = {
                opacity: 1,
                radius: this.asWidth(symbol.size / 2),
                stroke: {
                    color: this.asColor(symbol.outline.color),
                },
                snapToPixel: true
            };
            this.fromSFSSolid(symbol, style.circle);
            this.fromSLS(symbol.outline, style.circle);
        };
        StyleConverter.prototype.fromSMSCross = function (symbol, style) {
            style.star = {
                points: 4,
                angle: 0,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: 0
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMSDiamond = function (symbol, style) {
            style.star = {
                points: 4,
                angle: 0,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: this.asWidth(symbol.size / Math.sqrt(2))
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMSPath = function (symbol, style) {
            var size = 2 * this.asWidth(symbol.size);
            style.svg = {
                imgSize: [size, size],
                path: symbol.path,
                rotation: symbol.angle
            };
            this.fromSLSSolid(symbol, style.svg);
            this.fromSLS(symbol.outline, style.svg);
        };
        StyleConverter.prototype.fromSMSSquare = function (symbol, style) {
            style.star = {
                points: 4,
                angle: Math.PI / 4,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: this.asWidth(symbol.size / Math.sqrt(2))
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMSX = function (symbol, style) {
            style.star = {
                points: 4,
                angle: Math.PI / 4,
                radius: this.asWidth(symbol.size / Math.sqrt(2)),
                radius2: 0
            };
            this.fromSFSSolid(symbol, style.star);
            this.fromSLS(symbol.outline, style.star);
        };
        StyleConverter.prototype.fromSMS = function (symbol, style) {
            switch (symbol.style) {
                case "esriSMSCircle":
                    this.fromSMSCircle(symbol, style);
                    break;
                case "esriSMSCross":
                    this.fromSMSCross(symbol, style);
                    break;
                case "esriSMSDiamond":
                    this.fromSMSDiamond(symbol, style);
                    break;
                case "esriSMSPath":
                    this.fromSMSPath(symbol, style);
                    break;
                case "esriSMSSquare":
                    this.fromSMSSquare(symbol, style);
                    break;
                case "esriSMSX":
                    this.fromSMSX(symbol, style);
                    break;
                default:
                    throw "invalid-style: " + symbol.style;
            }
        };
        StyleConverter.prototype.fromPMS = function (symbol, style) {
            style.image = {};
            style.image.src = symbol.url;
            if (symbol.imageData) {
                style.image.src = "data:image/png;base64," + symbol.imageData;
            }
            style.image["anchor-x"] = this.asWidth(symbol.xoffset);
            style.image["anchor-y"] = this.asWidth(symbol.yoffset);
            style.image.imgSize = [this.asWidth(symbol.width), this.asWidth(symbol.height)];
        };
        StyleConverter.prototype.fromSLSSolid = function (symbol, style) {
            style.stroke = {
                color: this.asColor(symbol.color),
                width: this.asWidth(symbol.width),
                lineDash: [],
                lineJoin: "",
                miterLimit: 4
            };
        };
        StyleConverter.prototype.fromSLS = function (symbol, style) {
            switch (symbol.style) {
                case "esriSLSSolid":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDot":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDash":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDashDot":
                    this.fromSLSSolid(symbol, style);
                    break;
                case "esriSLSDashDotDot":
                    this.fromSLSSolid(symbol, style);
                    break;
                default:
                    this.fromSLSSolid(symbol, style);
                    console.warn("invalid-style: " + symbol.style);
                    break;
            }
        };
        StyleConverter.prototype.fromPFS = function (symbol, style) {
            throw "not-implemented";
        };
        StyleConverter.prototype.fromTS = function (symbol, style) {
            throw "not-implemented";
        };
        StyleConverter.prototype.fromJson = function (symbol) {
            var style = {};
            this.fromSymbol(symbol, style);
            return symbolizer.fromJson(style);
        };
        StyleConverter.prototype.fromSymbol = function (symbol, style) {
            switch (symbol.type) {
                case "esriSFS":
                    this.fromSFS(symbol, style);
                    break;
                case "esriSLS":
                    this.fromSLS(symbol, style);
                    break;
                case "esriPMS":
                    this.fromPMS(symbol, style);
                    break;
                case "esriPFS":
                    this.fromPFS(symbol, style);
                    break;
                case "esriSMS":
                    this.fromSMS(symbol, style);
                    break;
                case "esriTS":
                    this.fromTS(symbol, style);
                    break;
                default:
                    throw "invalid-symbol-type: " + symbol.type;
            }
        };
        // convert drawing info into a symbology rule
        StyleConverter.prototype.fromRenderer = function (renderer, args) {
            var _this = this;
            switch (renderer.type) {
                case "simple":
                    {
                        return this.fromJson(renderer.symbol);
                    }
                case "uniqueValue":
                    {
                        var styles_1 = {};
                        var defaultStyle_1 = (renderer.defaultSymbol) && this.fromJson(renderer.defaultSymbol);
                        if (renderer.uniqueValueInfos) {
                            renderer.uniqueValueInfos.forEach(function (info) {
                                styles_1[info.value] = _this.fromJson(info.symbol);
                            });
                        }
                        return function (feature) { return styles_1[feature.get(renderer.field1)] || defaultStyle_1; };
                    }
                case "classBreaks": {
                    var styles_2 = {};
                    var classBreakRenderer_1 = renderer;
                    if (classBreakRenderer_1.classBreakInfos) {
                        console.log("processing classBreakInfos");
                        if (classBreakRenderer_1.visualVariables) {
                            classBreakRenderer_1.visualVariables.forEach(function (vars) {
                                switch (vars.type) {
                                    /**
                                     * This renderer adjusts the size of the symbol to between [minSize..maxSize]
                                     * based on the range of values [minDataValue, maxDataValue]
                                     */
                                    case "sizeInfo": {
                                        var steps_1 = range(classBreakRenderer_1.authoringInfo.visualVariables[0].minSliderValue, classBreakRenderer_1.authoringInfo.visualVariables[0].maxSliderValue);
                                        var dx_1 = (vars.maxSize - vars.minSize) / steps_1.length;
                                        var dataValue_1 = (vars.maxDataValue - vars.minDataValue) / steps_1.length;
                                        classBreakRenderer_1.classBreakInfos.forEach(function (classBreakInfo) {
                                            var icons = steps_1.map(function (step) {
                                                var json = $.extend({}, classBreakInfo.symbol);
                                                json.size = vars.minSize + dx_1 * (dataValue_1 - vars.minDataValue);
                                                var style = _this.fromJson(json);
                                                styles_2[dataValue_1] = style;
                                            });
                                        });
                                        debugger;
                                        break;
                                    }
                                    default:
                                        debugger;
                                        break;
                                }
                            });
                        }
                    }
                    return function (feature) {
                        debugger;
                        var value = feature.get(renderer.field1);
                        for (var key in styles_2) {
                            // TODO: scan until key > value, return prior style
                            return styles_2[key];
                        }
                    };
                }
                default:
                    {
                        debugger;
                        console.error("unsupported renderer type: ", renderer.type);
                        break;
                    }
            }
        };
        return StyleConverter;
    }());
    exports.StyleConverter = StyleConverter;
});
define("bower_components/ol3-symbolizer/ol3-symbolizer/common/common", ["require", "exports"], function (require, exports) {
    "use strict";
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
    function defaults(a, b) {
        Object.keys(b).filter(function (k) { return a[k] == undefined; }).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.defaults = defaults;
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.innerText = css;
            document.head.appendChild(styleTag);
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
});
/**
 * See https://openlayers.org/en/latest/examples/vector-esri.html
 * Ultimately this will only query for features it does not already have
 * It will make use the map SRS and the resulttype="tile" and exceededTransferLimit
 * See https://github.com/ca0v/ol3-lab/issues/4
 */
define("bower_components/ol3-symbolizer/ol3-symbolizer/ags/ags-source", ["require", "exports", "jquery", "openlayers", "bower_components/ol3-symbolizer/ol3-symbolizer/ags/ags-catalog", "bower_components/ol3-symbolizer/ol3-symbolizer/format/ags-symbolizer", "bower_components/ol3-symbolizer/ol3-symbolizer/common/common"], function (require, exports, $, ol, AgsCatalog, Symbolizer, common_3) {
    "use strict";
    var esrijsonFormat = new ol.format.EsriJSON();
    function asParam(options) {
        return Object
            .keys(options)
            .map(function (k) { return k + "=" + options[k]; })
            .join("&");
    }
    ;
    var DEFAULT_OPTIONS = {
        tileSize: 512,
        where: "1=1"
    };
    var ArcGisVectorSourceFactory = (function () {
        function ArcGisVectorSourceFactory() {
        }
        ArcGisVectorSourceFactory.create = function (options) {
            var d = $.Deferred();
            options = common_3.defaults(options, DEFAULT_OPTIONS);
            var srs = options.map.getView()
                .getProjection()
                .getCode()
                .split(":")
                .pop();
            var all = options.layers.map(function (layerId) {
                var d = $.Deferred();
                var tileGrid = ol.tilegrid.createXYZ({
                    tileSize: options.tileSize
                });
                var strategy = ol.loadingstrategy.tile(tileGrid);
                var loader = function (extent, resolution, projection) {
                    var box = {
                        xmin: extent[0],
                        ymin: extent[1],
                        xmax: extent[2],
                        ymax: extent[3]
                    };
                    var params = {
                        f: "json",
                        returnGeometry: true,
                        spatialRel: "esriSpatialRelIntersects",
                        geometry: encodeURIComponent(JSON.stringify(box)),
                        geometryType: "esriGeometryEnvelope",
                        resultType: "tile",
                        where: encodeURIComponent(options.where),
                        inSR: srs,
                        outSR: srs,
                        outFields: "*",
                    };
                    var query = options.services + "/" + options.serviceName + "/FeatureServer/" + layerId + "/query?" + asParam(params);
                    $.ajax({
                        url: query,
                        dataType: 'jsonp',
                        success: function (response) {
                            if (response.error) {
                                alert(response.error.message + '\n' +
                                    response.error.details.join('\n'));
                            }
                            else {
                                // dataProjection will be read from document
                                var features = esrijsonFormat.readFeatures(response, {
                                    featureProjection: projection,
                                    dataProjection: projection
                                });
                                if (features.length > 0) {
                                    source.addFeatures(features);
                                }
                            }
                        }
                    });
                };
                var source = new ol.source.Vector({
                    strategy: strategy,
                    loader: loader
                });
                var catalog = new AgsCatalog.Catalog(options.services + "/" + options.serviceName + "/FeatureServer");
                var converter = new Symbolizer.StyleConverter();
                catalog.aboutLayer(layerId).then(function (layerInfo) {
                    var layer = new ol.layer.Vector({
                        title: layerInfo.name,
                        source: source
                    });
                    var styleMap = converter.fromRenderer(layerInfo.drawingInfo.renderer, { url: "for icons?" });
                    layer.setStyle(function (feature, resolution) {
                        if (styleMap instanceof ol.style.Style) {
                            return styleMap;
                        }
                        else {
                            return styleMap(feature);
                        }
                    });
                    d.resolve(layer);
                });
                return d;
            });
            $.when.apply($, all).then(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return d.resolve(args);
            });
            return d;
        };
        return ArcGisVectorSourceFactory;
    }());
    exports.ArcGisVectorSourceFactory = ArcGisVectorSourceFactory;
});
define("ol3-search/examples/google-search", ["require", "exports", "openlayers", "jquery", "bower_components/ol3-symbolizer/index", "ol3-search/ol3-search", "ol3-search/providers/google", "bower_components/ol3-fun/index"], function (require, exports, ol, $, ol3_symbolizer_1, ol3_search_1, google_1, ol3_fun_3) {
    "use strict";
    function run() {
        ol3_fun_3.cssin("examples/googl-search", "\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n.ol-search table {\n    width: 100%;\n}\n\n.ol-search .input {\n    width: 100%;\n}\n\n.ol-search input[type=\"checkbox\"] {\n    width: auto;\n}\n    ");
        var searchProvider = new google_1.GoogleGeocode();
        var center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');
        var mapContainer = document.getElementsByClassName("map")[0];
        var map = new ol.Map({
            loadTilesWhileAnimating: true,
            target: mapContainer,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM({ opaque: true }),
                    visible: true
                })
            ],
            view: new ol.View({
                center: center,
                projection: 'EPSG:3857',
                zoom: 6
            })
        });
        var source = new ol.source.Vector();
        var symbolizer = new ol3_symbolizer_1.StyleConverter();
        var vector = new ol.layer.Vector({
            source: source,
            style: function (feature, resolution) {
                var style = feature.getStyle();
                if (!style) {
                    var styleJson = [{
                            circle: {
                                radius: 4,
                                fill: {
                                    color: "rgba(33, 33, 33, 0.2)"
                                },
                                stroke: {
                                    color: "#F00"
                                }
                            },
                            text: {
                                text: feature.get("text"),
                                "offset-y": -15
                            }
                        }];
                    if (feature.get("airport")) {
                        styleJson.push({
                            text: {
                                text: "AIRPORT",
                                "offset-y": 15
                            }
                        });
                    }
                    style = styleJson.map(function (s) { return symbolizer.fromJson(s); });
                    feature.setStyle(style);
                }
                return style;
            }
        });
        map.addLayer(vector);
        var form = ol3_search_1.SearchForm.create({
            className: 'ol-search top right',
            expanded: true,
            title: "Google Search Form",
            fields: [
                {
                    name: "query",
                    alias: "Location",
                    default: "LAX",
                    length: 50
                },
                {
                    name: "bounded",
                    alias: "Current Extent?",
                    default: true
                }
            ]
        });
        form.on("change", function (args) {
            if (!args.value)
                return;
            var searchArgs = searchProvider.getParameters(args.value, map);
            $.ajax({
                url: searchArgs.url,
                method: 'GET',
                data: searchArgs.params,
                dataType: 'json'
            }).then(function (json) {
                var results = searchProvider.handleResponse(json);
                results.some(function (r) {
                    console.log(r);
                    if (r.address) {
                        var geom = new ol.geom.Point([r.lon, r.lat]).transform("EPSG:4326", map.getView().getProjection());
                        var feature_1 = new ol.Feature(geom);
                        feature_1.set("text", r.original.formatted_address);
                        r.original.types.forEach(function (t) { return feature_1.set(t, true); });
                        source.addFeature(feature_1);
                    }
                    if (r.original.geometry.viewport) {
                        var v = r.original.geometry.viewport;
                        var geom = new ol.geom.Polygon([[
                                [v.southwest.lng, v.southwest.lat],
                                [v.northeast.lng, v.northeast.lat]
                            ]]).transform("EPSG:4326", map.getView().getProjection());
                        var feature = new ol.Feature(geom);
                        //source.addFeature(feature);
                        ol3_fun_3.navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                    }
                    return true;
                });
            }).fail(function () {
                console.error("geocoder failed");
            });
        });
        map.addControl(form);
    }
    exports.run = run;
});
define("ol3-search/examples/index", ["require", "exports"], function (require, exports) {
    "use strict";
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=ol3-search/examples/";
        var labs = "\n    index\n    google-search\n    osm-search\n    ol3-search\n    ";
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
define("ol3-search/providers/osm", ["require", "exports", "openlayers", "bower_components/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_4) {
    "use strict";
    var DEFAULTS = {
        url: '//nominatim.openstreetmap.org/search/',
        params: {
            q: '',
            format: 'json',
            addressdetails: true,
            limit: 10,
            countrycodes: ['us'],
            'accept-language': 'en-US'
        }
    };
    var OpenStreet = (function () {
        function OpenStreet() {
            this.dataType = 'json';
            this.method = 'GET';
        }
        OpenStreet.prototype.getParameters = function (options, map) {
            var result = {
                url: DEFAULTS.url,
                params: common_4.mixin(common_4.mixin({}, DEFAULTS.params), options)
            };
            if (!result.params.viewbox && map) {
                var extent = map.getView().calculateExtent(map.getSize());
                var _a = ol.extent.getBottomLeft(extent), left = _a[0], bottom = _a[1];
                var _b = ol.extent.getTopRight(extent), right = _b[0], top_1 = _b[1];
                var inSrs = map.getView().getProjection();
                _c = ol.proj.transform([left, top_1], inSrs, "EPSG:4326"), left = _c[0], top_1 = _c[1];
                _d = ol.proj.transform([right, bottom], inSrs, "EPSG:4326"), right = _d[0], bottom = _d[1];
                result.params.viewbox = {
                    bottom: bottom,
                    top: top_1,
                    left: left,
                    right: right
                };
            }
            if (result.params.countrycodes) {
                result.params.countrycodes = result.params.countrycodes.join(",");
            }
            if (result.params.viewbox) {
                var x = result.params.viewbox;
                result.params.viewbox = [x.left, x.top, x.right, x.bottom].map(function (v) { return v.toFixed(5); }).join(",");
            }
            Object.keys(result.params).filter(function (k) { return typeof result.params[k] === "boolean"; }).forEach(function (k) {
                result.params[k] = result.params[k] ? "1" : "0";
            });
            return result;
            var _c, _d;
        };
        OpenStreet.prototype.handleResponse = function (args) {
            return args.sort(function (v) { return v.importance || 1; }).map(function (result) { return ({
                original: result,
                lon: parseFloat(result.lon),
                lat: parseFloat(result.lat),
                address: {
                    name: result.address.neighbourhood || '',
                    road: result.address.road || '',
                    postcode: result.address.postcode,
                    city: result.address.city || result.address.town,
                    state: result.address.state,
                    country: result.address.country
                }
            }); });
        };
        return OpenStreet;
    }());
    exports.OpenStreet = OpenStreet;
});
define("ol3-search/examples/ol3-search", ["require", "exports", "openlayers", "jquery", "bower_components/ol3-grid/index", "bower_components/ol3-symbolizer/index", "ol3-search/ol3-search", "ol3-search/providers/osm", "bower_components/ol3-fun/index", "bower_components/ol3-symbolizer/ol3-symbolizer/ags/ags-source"], function (require, exports, ol, $, ol3_grid_1, ol3_symbolizer_2, ol3_search_2, osm_1, ol3_fun_4, ags_source_1) {
    "use strict";
    function run() {
        ol3_fun_4.cssin("examples/ol3-search", "\n\n.ol-grid.statecode .ol-grid-container {\n    background-color: white;\n    width: 10em;\n}\n\n.ol-grid .ol-grid-container.ol-hidden {\n}\n\n.ol-grid .ol-grid-container {\n    width: 15em;\n}\n\n.ol-grid-table {\n    width: 100%;\n}\n\ntable.ol-grid-table {\n    border-collapse: collapse;\n    width: 100%;\n}\n\ntable.ol-grid-table > td {\n    padding: 8px;\n    text-align: left;\n    border-bottom: 1px solid #ddd;\n}\n\n.ol-search tr.focus {\n    background: white;\n}\n\n.ol-search:hover {\n    background: white;\n}\n\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n\n    ");
        var searchProvider = new osm_1.OpenStreet();
        var center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');
        var mapContainer = document.getElementsByClassName("map")[0];
        var map = new ol.Map({
            loadTilesWhileAnimating: true,
            target: mapContainer,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: center,
                projection: 'EPSG:3857',
                zoom: 6
            })
        });
        var source = new ol.source.Vector();
        var symbolizer = new ol3_symbolizer_2.StyleConverter();
        var vector = new ol.layer.Vector({
            source: source,
            style: function (feature, resolution) {
                var style = feature.getStyle();
                if (!style) {
                    style = symbolizer.fromJson({
                        circle: {
                            radius: 4,
                            fill: {
                                color: "rgba(33, 33, 33, 0.2)"
                            },
                            stroke: {
                                color: "#F00"
                            }
                        },
                        text: {
                            text: feature.get("text")
                        }
                    });
                    feature.setStyle(style);
                }
                return style;
            }
        });
        ags_source_1.ArcGisVectorSourceFactory.create({
            map: map,
            services: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services',
            serviceName: 'USA_States_Generalized',
            layers: [0]
        }).then(function (layers) {
            layers.forEach(function (layer) {
                layer.setStyle(function (feature, resolution) {
                    var style = feature.getStyle();
                    if (!style) {
                        style = symbolizer.fromJson({
                            fill: {
                                color: "rgba(200,200,200,0.5)"
                            },
                            stroke: {
                                color: "rgba(33,33,33,0.8)",
                                width: 3
                            },
                            text: {
                                text: feature.get("STATE_ABBR")
                            }
                        });
                        feature.setStyle(style);
                    }
                    return style;
                });
                map.addLayer(layer);
                var grid = ol3_grid_1.Grid.create({
                    map: map,
                    className: "ol-grid statecode top left-2",
                    expanded: true,
                    currentExtent: true,
                    autoCollapse: true,
                    // we do it ourselves
                    autoPan: false,
                    showIcon: true,
                    layers: [layer]
                });
                grid.on("feature-click", function (args) {
                    ol3_fun_4.navigation.zoomToFeature(map, args.feature);
                });
                grid.on("feature-hover", function (args) {
                    // TODO: highlight args.feature
                });
            });
        }).then(function () {
            map.addLayer(vector);
        });
        var form = ol3_search_2.SearchForm.create({
            className: 'ol-search top right',
            expanded: true,
            title: "Nominatim Search Form",
            fields: [
                {
                    name: "q",
                    alias: "*"
                },
                {
                    name: "postalcode",
                    alias: "Postal Code"
                },
                {
                    name: "housenumber",
                    alias: "House Number",
                    length: 10,
                    type: "integer"
                },
                {
                    name: "streetname",
                    alias: "Street Name"
                },
                {
                    name: "city",
                    alias: "City"
                },
                {
                    name: "county",
                    alias: "County"
                },
                {
                    name: "country",
                    alias: "Country",
                    domain: {
                        type: "",
                        name: "",
                        codedValues: [
                            {
                                name: "us", code: "us"
                            }
                        ]
                    }
                },
                {
                    name: "bounded",
                    alias: "Current Extent?",
                    type: "boolean"
                }
            ]
        });
        form.on("change", function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            var searchArgs = searchProvider.getParameters(args.value, map);
            $.ajax({
                url: searchArgs.url,
                method: searchProvider.method || 'GET',
                data: searchArgs.params,
                dataType: searchProvider.dataType || 'json'
            }).then(function (json) {
                var results = searchProvider.handleResponse(json);
                results.some(function (r) {
                    console.log(r);
                    if (r.original.boundingbox) {
                        var _a = r.original.boundingbox.map(function (v) { return parseFloat(v); }), lat1 = _a[0], lat2 = _a[1], lon1 = _a[2], lon2 = _a[3];
                        _b = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:3857"), lon1 = _b[0], lat1 = _b[1];
                        _c = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:3857"), lon2 = _c[0], lat2 = _c[1];
                        var extent = [lon1, lat1, lon2, lat2];
                        var feature = new ol.Feature(new ol.geom.Polygon([[
                                ol.extent.getBottomLeft(extent),
                                ol.extent.getTopLeft(extent),
                                ol.extent.getTopRight(extent),
                                ol.extent.getBottomRight(extent),
                                ol.extent.getBottomLeft(extent)
                            ]]));
                        feature.set("text", r.original.display_name);
                        source.addFeature(feature);
                        ol3_fun_4.navigation.zoomToFeature(map, feature);
                    }
                    else {
                        var _d = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857"), lon = _d[0], lat = _d[1];
                        var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.original.display_name);
                        source.addFeature(feature);
                        ol3_fun_4.navigation.zoomToFeature(map, feature);
                    }
                    return true;
                    var _b, _c;
                });
            }).fail(function () {
                console.error("geocoder failed");
            });
        });
        map.addControl(form);
    }
    exports.run = run;
});
define("ol3-search/examples/osm-search", ["require", "exports", "openlayers", "jquery", "bower_components/ol3-symbolizer/index", "ol3-search/ol3-search", "ol3-search/providers/osm", "bower_components/ol3-fun/index"], function (require, exports, ol, $, ol3_symbolizer_3, ol3_search_3, osm_2, ol3_fun_5) {
    "use strict";
    function run() {
        ol3_fun_5.cssin("examples/osm-search", "\n.ol-search label.ol-search-label {\n    white-space: nowrap;\n}\n.ol-search form {\n    max-width: 12em;\n}\n    ");
        var searchProvider = new osm_2.OpenStreet();
        var center = ol.proj.transform([-120, 35], 'EPSG:4326', 'EPSG:3857');
        var mapContainer = document.getElementsByClassName("map")[0];
        var map = new ol.Map({
            loadTilesWhileAnimating: true,
            target: mapContainer,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: center,
                projection: 'EPSG:3857',
                zoom: 6
            })
        });
        var source = new ol.source.Vector();
        var symbolizer = new ol3_symbolizer_3.StyleConverter();
        var vector = new ol.layer.Vector({
            source: source,
            style: function (feature, resolution) {
                var style = feature.getStyle();
                if (!style) {
                    style = symbolizer.fromJson({
                        circle: {
                            radius: 4,
                            fill: {
                                color: "rgba(33, 33, 33, 0.2)"
                            },
                            stroke: {
                                color: "#F00"
                            }
                        },
                        text: {
                            text: feature.get("text")
                        }
                    });
                    feature.setStyle(style);
                }
                return style;
            }
        });
        map.addLayer(vector);
        var form = ol3_search_3.SearchForm.create({
            className: 'ol-search top right',
            expanded: true,
            title: "Nominatim Search Form",
            fields: [
                {
                    name: "q",
                    alias: "*"
                },
                {
                    name: "postalcode",
                    alias: "Postal Code"
                },
                {
                    name: "housenumber",
                    alias: "House Number",
                    length: 10,
                    type: "integer"
                },
                {
                    name: "streetname",
                    alias: "Street Name"
                },
                {
                    name: "city",
                    alias: "City"
                },
                {
                    name: "county",
                    alias: "County"
                },
                {
                    name: "country",
                    alias: "Country",
                    domain: {
                        type: "",
                        name: "",
                        codedValues: [
                            {
                                name: "us", code: "us"
                            }
                        ]
                    }
                },
                {
                    name: "bounded",
                    alias: "Current Extent?",
                    type: "boolean"
                }
            ]
        });
        form.on("change", function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            var searchArgs = searchProvider.getParameters(args.value, map);
            $.ajax({
                url: searchArgs.url,
                method: searchProvider.method || 'GET',
                data: searchArgs.params,
                dataType: searchProvider.dataType || 'json'
            }).then(function (json) {
                var results = searchProvider.handleResponse(json);
                results.some(function (r) {
                    console.log(r);
                    if (r.original.boundingbox) {
                        var _a = r.original.boundingbox.map(function (v) { return parseFloat(v); }), lat1 = _a[0], lat2 = _a[1], lon1 = _a[2], lon2 = _a[3];
                        _b = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:3857"), lon1 = _b[0], lat1 = _b[1];
                        _c = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:3857"), lon2 = _c[0], lat2 = _c[1];
                        var extent = [lon1, lat1, lon2, lat2];
                        var feature = new ol.Feature(new ol.geom.Polygon([[
                                ol.extent.getBottomLeft(extent),
                                ol.extent.getTopLeft(extent),
                                ol.extent.getTopRight(extent),
                                ol.extent.getBottomRight(extent),
                                ol.extent.getBottomLeft(extent)
                            ]]));
                        feature.set("text", r.original.display_name);
                        source.addFeature(feature);
                        ol3_fun_5.navigation.zoomToFeature(map, feature);
                    }
                    else {
                        var _d = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857"), lon = _d[0], lat = _d[1];
                        var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.original.display_name);
                        source.addFeature(feature);
                        ol3_fun_5.navigation.zoomToFeature(map, feature);
                    }
                    return true;
                    var _b, _c;
                });
            }).fail(function () {
                console.error("geocoder failed");
            });
        });
        map.addControl(form);
    }
    exports.run = run;
});
define("ol3-search/tests/index", ["require", "exports"], function (require, exports) {
    "use strict";
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=ol3-search/tests/";
        var labs = "\n    index\n    ";
        document.writeln("\n    <p>\n    Watch the console output for failed assertions (blank is good).\n    </p>\n    ");
        document.writeln(labs
            .split(/ /)
            .map(function (v) { return v.trim(); })
            .filter(function (v) { return !!v; })
            .sort()
            .map(function (lab) { return "<a href=\"" + path + lab + "&debug=0\">" + lab + "</a>"; })
            .join("<br/>"));
    }
    exports.run = run;
    ;
});
//# sourceMappingURL=index.js.map