import olex, { LatestSearchEvent } from "/vue-lesson/src/olex.js";

const page = {
    "path": "/heatmap",
    "component": {
        "template": `
            <div>
                <map-container />
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
                        </div>
                    `;

                    this.popupAddon.show(event.coordinate, html);
                });

                let features = await olex.Vector.getFeaturesFromGeoJSONUrl('./asset/postoffice.geojson');

                const source = olex.Vector.createVectorSource(features);

                const layer = new ol.layer.Heatmap({
                    source: source,
                    blur: 10,
                    radius: 3,
                });

                // const pointLayer = new ol.layer.Vector({
                //     source: source,
                //     style: new ol.style.Style({
                //         image: new ol.style.Circle({
                //             radius: 5,
                //             fill: new ol.style.Fill({
                //                 color: 'red'
                //             })
                //         })
                //     }),
                //     maxResolution: 200,
                // });

                this.map.addLayer(layer);
                // this.map.addLayer(pointLayer);
                this.map.getView().fit(layer.getSource().getExtent());
            }
        },
        async mounted() {
            this.buildMap();
        }
    }
};

export default page;