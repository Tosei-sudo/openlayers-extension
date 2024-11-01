
const page = {
    "path": "/network",
    "component": {
        "template": `
            <div class="network-map">
                <map-container />
            </div>
            <div class="map-timeline-container" id="network"></div>
            `,
        data() {
            return {
                map: null,
                wktLayer: null,
                selectInteraction: null,
                features: [],
                timeline: null,
                popupAddon: null,
            }
        },
        methods: {
            mapFeatureSelectCallback(event) {
                if (event.selected.length > 0) {
                    this.timeline.setSelection([event.selected[0].get('uuid')]);
                } else {
                    this.timeline.setSelection([]);
                }
            },
            mapMovedCallback(event) {
                const data = [
                    event.map.getView().getCenter(),
                    event.map.getView().getZoom(),
                ]

                localStorage.setItem('map', JSON.stringify(data));
            },
            timelineRangeChangedCallback(properties) {
                const source = this.wktLayer.getSource();

                source.clear();
                source.addFeatures(this.features.filter((feature) => {
                    const unix_time = feature.get('unix_time');
                    return properties.start.getTime() / 1000 <= unix_time && unix_time <= properties.end.getTime() / 1000;
                }));
            },
            timelineSelectCallback(properties) {
                const resource = properties.items[0];

                if (resource) {
                    const feature = this.features.find((feature) => feature.get('uuid') === resource);
                    this.selectInteraction.getFeatures().clear();
                    this.selectInteraction.getFeatures().push(feature);
                } else {
                    this.selectInteraction.getFeatures().clear();
                }
            },
            async createCalender() {
                this.popupAddon = new olex.Addon.Popup("contextmenu");

                const view = olex.getDefaultView();
                view.padding = [0, 0, 212, 0];

                const response = await fetch('./asset/sample.json');
                const sample = await response.json();

                const items = [];
                this.features = [];

                const format = new ol.format.WKT();
                sample.forEach((record) => {
                    const wkt = record.WKT;
                    const feature = format.readFeature(wkt, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857',
                    });

                    feature.setProperties(record);

                    this.features.push(feature);

                    const item = {
                        id: record.uuid,
                        start: new Date(record.unix_time * 1000),
                        className: 'timeline-item',
                    };

                    items.push(item);
                });

                this.wktLayer = new ol.layer.Vector({
                    title: 'WKT',
                    source: new ol.source.Vector({}),
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)',
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2,
                        }),
                    }),
                });

                this.map = olex.createMap('map', [
                    olex.Raster.getOSMLayer(),
                    this.wktLayer,
                ], view, null, null, [this.popupAddon.overlay]);

                this.map.on('moveend', this.mapMovedCallback);

                this.selectInteraction = olex.Vector.createSelectInteraction({
                    layers: [this.wktLayer],
                });

                this.selectInteraction.on('select', this.mapFeatureSelectCallback);

                this.map.addInteraction(this.selectInteraction);

                const container = document.getElementById('network');

                const options = {
                    height: '200px',
                };

                this.timeline = new vis.Timeline(container, new vis.DataSet(items), options);

                this.timeline.on('select', this.timelineSelectCallback);

                this.timeline.on('rangechanged', this.timelineRangeChangedCallback);

                // this.map.getView().fit(this.wktLayer.getSource().getExtent());
                const data = JSON.parse(localStorage.getItem('map') || 'null');
                if (data) {
                    this.map.getView().setCenter(data[0]);
                    this.map.getView().setZoom(data[1]);
                }
            },
        },
        mounted() {
            this.createCalender();
        }
    }
};

export default page;