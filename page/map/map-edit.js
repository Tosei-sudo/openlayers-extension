const page = {
    "path": "/map-edit",
    "component": {
        "template": `
            <div>
                <map-container />
            </div>
            <div id="subpanel" class="subpanel">
                <v-btn-toggle v-model="editModeIndex" color="primary">
                    <v-btn icon="mdi-vector-polygon" @click="setDrawInteraction('Polygon')"></v-btn>
                    <v-btn icon="mdi-vector-square" @click="setDrawInteraction('Box')"></v-btn>
                </v-btn-toggle>
            </div>
            `,
        data() {
            return {
                map: null,
                projection: null,
                drawLayer: null,
                selectInteraction: null,
                drawInteraction: null,
                snapInteraction: null,
                modifyInteraction: null,
                popupAddon: null,
                editModeIndex: undefined,
            }
        },
        methods: {
            async buildMap() {
                this.popupAddon = new olex.Addon.Popup("contextmenu");

                this.map = olex.createMap('map', [
                    olex.Raster.getOSMLayer(),
                ], null, null, null, [this.popupAddon.overlay]);

                this.map.on("contextmenu", this.rightClick);

                this.map.on("singleclick", (event) => {
                    event.preventDefault();
                    this.popupAddon.hide();
                });

                window.addEventListener("keydown", this.mapKeydown);

                this.drawLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [
                            new ol.Feature({
                                geometry: new ol.geom.Polygon([[
                                    [0, 0],
                                    [0, 10000000],
                                    [10000000, 10000000],
                                    [10000000, 0],
                                    [0, 0],
                                ]]),
                            }),
                        ],
                    }),
                });
                this.map.addLayer(this.drawLayer);

                this.snapInteraction = new ol.interaction.Snap({
                    source: this.drawLayer.getSource(),
                });

                this.map.addInteraction(this.snapInteraction);

                this.selectInteraction = new ol.interaction.Select({
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "blue",
                            width: 2,
                        }),
                    }),
                });

                this.map.addInteraction(this.selectInteraction);

                this.selectInteraction.on("select", (event) => {
                    if (event.selected.length > 0) {
                        this.setModifyInteraction();
                        this.snapInteraction.setActive(true);
                    } else {
                        this.map.removeInteraction(this.modifyInteraction);
                        this.snapInteraction.setActive(false);
                    }
                });
            },
            setModifyInteraction() {
                this.modifyInteraction = new ol.interaction.Modify({
                    features: this.selectInteraction.getFeatures(),
                });

                this.map.addInteraction(this.modifyInteraction);
            },
            setDrawInteraction(type = "Polygon") {
                this.selectInteraction.setActive(false);
                this.selectInteraction.getFeatures().clear();
                this.map.removeInteraction(this.modifyInteraction);
                this.map.removeInteraction(this.drawInteraction);
                this.snapInteraction.setActive(true);

                const options = {
                    source: this.drawLayer.getSource(),
                    type: type,
                };

                if (options.type === "Box") {
                    options.type = "Circle";
                    options.geometryFunction = ol.interaction.Draw.createBox();
                }

                this.drawInteraction = new ol.interaction.Draw(options);

                this.map.addInteraction(this.drawInteraction);
            },
            removeEditInteraction() {
                this.map.removeInteraction(this.drawInteraction);
                this.map.removeInteraction(this.snapInteraction);
                this.map.removeInteraction(this.modifyInteraction);
                this.snapInteraction.setActive(false);
            },
            mapKeydown(event) {
                if (event.key === "Escape") {
                    this.drawInteraction.abortDrawing();
                }
            },
            rightClick(event) {
                event.preventDefault();

                if (this.editModeIndex === undefined) {

                    const coods = event.coordinate;
                    let hdms = ol.coordinate.toStringShortHDMS(ol.proj.toLonLat(coods));

                    let html = `
                        <div>
                            <div>Coordinates: ${hdms}</div>
                        </div>
                    `;

                    this.popupAddon.show(event.coordinate, html);
                } else {
                    console.log(this.drawInteraction.getOverlay());
                    this.drawInteraction.removeLastPoint();
                    this.drawInteraction.removeLastPoint();
                }
            }
        },
        watch: {
            editModeIndex(value) {
                if (value === undefined) {
                    this.removeEditInteraction();
                    this.selectInteraction.setActive(true);
                }
            }
        },
        async mounted() {
            document.getElementById("page-style").textContent = `
                #map {
                    width: 100vw;
                    height: 100vh;
                }

                .subpanel{
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 300px;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    border-left: 1px solid #ccc;
                    z-index: 1000;
                    overflow: auto;
                }
            `;

            this.buildMap();
        }
    }
};

export default page;