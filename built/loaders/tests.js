"use strict";
function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
function getParameterByName(name, url) {
    url = url || window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var debug = getParameterByName("debug") === "1";
var localhost = false && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
loadCss(localhost ? "../node_modules/mocha/mocha.css" : "https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0/mocha.css");
loadCss(localhost ? "../node_modules/ol3-fun/static/ol/v5.1.3/ol.css" : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/css/ol.css");
// setup require js packaging system and load the "spec" before running mocha
requirejs.config({
    shim: {
        // no need to wrap ol in a define method when using a shim
        // build this using the "npm run build-legacy" (see ol package.json)
        "openlayers": {
            deps: [],
            exports: "ol"
        }
    },
    paths: {
        "openlayers": localhost ? "../../node_modules/ol3-fun/static/ol/v5.1.3/ol" : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/build/ol"
    },
    packages: [
        {
            name: 'jquery',
            location: localhost ? '../../node_modules/jquery' : "https://code.jquery.com",
            main: localhost ? 'dist/jquery.min' : "jquery-3.3.1.min"
        },
        {
            name: 'mocha',
            location: localhost ? '../../node_modules/mocha' : "https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0",
            main: localhost ? 'mocha' : "mocha.min"
        }
    ],
    deps: ["../spec/index"],
    callback: function () {
        requirejs(["mocha"], function (boo) {
            // window.Mocha is a 
            var Mocha = window["mocha"];
            var mocha = Mocha.setup({
                timeout: 6000,
                ui: 'bdd',
                bail: false
            });
            console.log(mocha);
            // mocha is putting out globals...hide them (should only be when running as CLI so not sure what's happening)
            define("mocha", [], function () { return ({ describe: describe, it: it }); });
            // execute "describe" and "it" methods before running mocha
            requirejs(["tests/index"], function () { return mocha.run(); });
        });
    }
});
