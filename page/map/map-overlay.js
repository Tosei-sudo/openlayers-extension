import olex, { LatestSearchEvent } from "/vue-lesson/src/olex.js";

const page = {
    "path": "/map",
    "component": {
        "template": `
            <div>
                <map-container />
                <div id="country-popup" class="ol-popup">
                    <a href="#" id="country-popup-closer" class="ol-popup-closer"></a>
                    <div id="country-popup-content"></div>
                </div>
            </div>
            `,
        data() {
            return {
                map: null,
                projection: null
            }
        },
        methods: {
            async buildMap() {
                this.popupAddon = new olex.Addon.Popup("contextmenu");

                this.map = olex.createMap('map', [
                    olex.Raster.getOSMLayer(),
                ], null, null, null, [this.popupAddon.overlay]);

                this.map.on("contextmenu", (event) => {
                    event.preventDefault();

                    const coods = event.coordinate;
                    let hdms = ol.coordinate.toStringShortHDMS(ol.proj.toLonLat(coods));

                    let html = `
                        <div>
                            <div>Coordinates: ${hdms}</div>
                            <div><a id="contextmenu-latest" href=".">Latest</a></div>
                        </div>
                    `;

                    this.popupAddon.show(event.coordinate, html);

                    document.getElementById("contextmenu-latest").onclick = (event) => {
                        event.preventDefault();
                        this.map.dispatchEvent(
                            new LatestSearchEvent()
                        );
                        this.popupAddon.hide();
                    };
                });

                this.map.on("singleclick", (event) => {
                    event.preventDefault();
                    this.popupAddon.hide();
                });

                this.map.on("search", (event) => {
                    event.preventDefault();
                    console.log("search");
                });

                let layer = await olex.Vector.getLayerFromGeoJSONUrl('./asset/world.geojson');
                this.map.addLayer(layer);

                this.select = olex.Vector.createSelectInteraction();

                this.countryPopup = new olex.Addon.Popup("country-popup");
                this.map.addOverlay(this.countryPopup.overlay);

                this.countryPopup.on("hide", () => {
                    this.select.getFeatures().clear();
                });

                this.countryPopup.on("show", () => {
                    this.popupAddon.hide();
                });

                this.popupAddon.on("show", () => {
                    this.countryPopup.hide();
                });

                this.select.on('select', (event) => {
                    event.preventDefault();

                    if (event.selected.length > 0) {
                        let feature = event.selected[0];
                        let country = feature.get("WB_A3");
                        this.countryPopup.show(event.mapBrowserEvent.coordinate, country);
                    } else {
                        this.countryPopup.hide();
                    }
                });

                this.map.addInteraction(this.select);

                this.map.getView().fit(layer.getSource().getExtent());
            }
        },
        async mounted() {
            this.buildMap();
        }
    }
};

export default page;