import ol = require("openlayers");

export function create() {
	let center = ol.proj.transform([-120, 35], "EPSG:4326", "EPSG:3857");

	let mapContainer = document.getElementsByClassName("map")[0];

	let map = new ol.Map({
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

	let source = new ol.source.Vector();

	let vector = new ol.layer.Vector({
		source: source,
		style: (feature: ol.Feature, resolution: number) => {
			let style = feature.getStyle();
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
			return <ol.style.Style>style;
		}
	});

	return {
		map: map,
		source: source
	};
}
