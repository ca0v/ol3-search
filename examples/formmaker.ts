import ol = require("openlayers");
import { navigation } from "ol3-fun/index";
import { SearchForm } from "../index";
import { Geocoder } from "../ol3-search/providers/index";

export function create(options: {
    map: ol.Map,
    source: ol.source.Vector,
    searchProvider: Geocoder<any, any>
}) {

    let map = options.map;
    let searchProvider = options.searchProvider;

    let form = SearchForm.create({
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


    form.on("change", (args: {
        value: { [name: string]: any }
    }) => {

        if (!args.value) return;
        console.log("search", args.value);

        searchProvider.execute({ params: args.value }).then(results => {

            let toSrs = map.getView().getProjection();

            results.some(r => {
                console.log(r);
                if (r.address) {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", toSrs);
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.title);
                    options.source.addFeature(feature);
                }
                if (r.extent) {
                    let feature = new ol.Feature(r.extent.transform("EPSG:4326", toSrs));
                    navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 50 });
                }
                return true;
            });

        });

    });

    map.addControl(form);
}
