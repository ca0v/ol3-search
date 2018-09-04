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
define("node_modules/ol3-fun/tests/base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function should(result, msg) {
        if (!result)
            throw msg || "oops";
    }
    exports.should = should;
    function shouldEqual(a, b, msg) {
        if (a !== b)
            console.warn(a + " <> " + b);
        should(a === b, msg);
    }
    exports.shouldEqual = shouldEqual;
    function stringify(o) {
        return JSON.stringify(o, null, '\t');
    }
    exports.stringify = stringify;
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
define("tests/spec/search", ["require", "exports", "node_modules/ol3-fun/tests/base", "mocha", "index"], function (require, exports, base_1, mocha_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    mocha_1.describe("SearchForm Tests", function () {
        mocha_1.it("SearchForm", function () {
            base_1.should(!!index_2.SearchForm, "SearchForm");
        });
        mocha_1.it("DEFAULT_OPTIONS", function () {
            var options = index_2.SearchForm.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        mocha_1.it("options of an Input instance", function () {
            var input = index_2.SearchForm.create();
            checkDefaultInputOptions(input.options);
        });
    });
    function checkDefaultInputOptions(options) {
        base_1.should(!!options, "options");
        base_1.shouldEqual(options.autoChange, false, "autoChange");
        base_1.shouldEqual(options.autoClear, false, "autoClear");
        base_1.shouldEqual(options.autoCollapse, true, "autoCollapse");
        base_1.shouldEqual(options.canCollapse, true, "canCollapse");
        base_1.shouldEqual(options.className, "ol-input", "className");
        base_1.should(options.closedText.length > 0, "closedText");
        base_1.shouldEqual(options.expanded, false, "expanded");
        base_1.shouldEqual(options.hideButton, false, "hideButton");
        base_1.shouldEqual(!!options.openedText, true, "openedText");
        base_1.shouldEqual(options.position, "bottom left", "position");
        base_1.shouldEqual(options.render, undefined, "render");
        base_1.shouldEqual(options.source, undefined, "source");
        base_1.shouldEqual(options.target, undefined, "target");
    }
});
define("tests/index", ["require", "exports", "tests/spec/search"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=index.js.map