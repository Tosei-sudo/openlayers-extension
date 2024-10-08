
ol.coordinate.toStringShortHDMS = function (coordinate) {
    return ol.coordinate.toStringHDMS(coordinate).replaceAll("°", "").replaceAll("″", "").replaceAll("′", "").replaceAll(" ", "");
};

class _Map_Control_JumpTo_ extends ol.control.Control {
    constructor(options = {}) {
        const c = (t) => document.createElement(t);
        const cc = (t, n) => { let e = c(t); e.className = n; return e; };

        const style = c('style');
        style.innerHTML = `
.ol-jump-to {position: absolute; top: .5em; left: 48px; padding: 5px; background-color: rgba(255, 255, 255, 0.5); border-radius: 5px; cursor: pointer;}
.ol-jump-to-input {display: flex;}
#ol-jump-to-button {margin-left: 5px; width: 36px; outline: none;}
#ol-jump-to-position:focus-visible {outline: none;}
`;

        const element = cc('div', 'ol-control ol-jump-to');
        const inputWrapper = cc('form', 'ol-jump-to-input');

        const input = c('input');
        input.type = 'text';
        input.placeholder = 'Position';
        input.id = 'ol-jump-to-position';
        input.required = true;

        const button = c('button');
        button.type = 'submit';
        button.id = 'ol-jump-to-button';
        button.innerHTML = 'Go';

        inputWrapper.append(input, button, style);

        element.appendChild(inputWrapper);

        options.element = element;

        super(options);

        inputWrapper.onsubmit = (e) => {
            e.preventDefault();
            this.jumpTo();
        }

        this.positionInput = input;

        this.feature = new ol.Feature();

        this.markerLayer = null;
    }

    jumpTo() {
        if (this.markerLayer === null) {
            this.markerLayer = new ol.layer.Vector({
                source: _Map_Vector_.createVectorSource([this.feature]),
                style: new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: 'red'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'black',
                            width: 2
                        }),
                        points: 4,
                        radius: 6,
                    })
                }),
                zIndex: 999
            });

            this.getMap().addLayer(this.markerLayer);
        }

        let cord = convert(this.positionInput.value);
        let point = ol.proj.fromLonLat([cord.decimalLongitude, cord.decimalLatitude]);

        this.getMap().getView().animate({
            center: point,
            zoom: 9,
            duration: 500
        });

        this.feature.setGeometry(new ol.geom.Point(point));
    }
}

export class LatestSearchEvent extends ol.events.Event {
    constructor() {
        super('search');
    }
}

class _Map_Popup_Addon_ {
    constructor(target) {
        this.container = document.getElementById(target);
        this.content = document.getElementById(target + '-content');
        this.closer = document.getElementById(target + '-closer');

        this.eventTarget = new EventTarget();

        this.overlay = new ol.Overlay({
            element: this.container,
            autoPan: {
                animation: {
                    duration: 250
                }
            }
        });

        this.closer.onclick = () => {
            this.hide();
            return false;
        };
    }

    show(coord, content) {
        this.content.innerHTML = content;
        this.overlay.setPosition(coord);

        this.eventTarget.dispatchEvent(new Event('show'));
    }

    // サブクラス用オーバーライド可能なメソッド
    open(coord, content) {
        this.show(coord, content);
    }

    hide() {
        this.overlay.setPosition(undefined);
        this.closer.blur();

        this.eventTarget.dispatchEvent(new Event('hide'));
    }

    on(type, listener) {
        this.eventTarget.addEventListener(type, listener);
    }
}

class _Map_Raster_ {
    static createTileLayer(source) {
        return new ol.layer.Tile({
            source: source
        });
    }

    static getOSMLayer() {
        const source = new ol.source.OSM();

        return _Map_Raster_.createTileLayer(source);
    }
}

class _Map_Vector_ {
    static createVectorLayer(source) {
        return new ol.layer.Vector({
            source: source
        });
    }

    static createVectorSource(features = []) {
        return new ol.source.Vector({
            features: features
        });
    }

    static readFeaturesFromGeoJSON(geojson) {
        return new ol.format.GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
    }

    static async getFeaturesFromGeoJSONUrl(url) {
        const response = await axios.get(url);

        return _Map_Vector_.readFeaturesFromGeoJSON(response.data);
    }

    static async getLayerFromGeoJSONUrl(url) {
        const features = await _Map_Vector_.getFeaturesFromGeoJSONUrl(url);

        return new ol.layer.Vector({
            source: _Map_Vector_.createVectorSource(features),
        });
    }

    static createSelectInteraction() {
        return new ol.interaction.Select({
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 2
                })
            })
        });
    }
}

class olex {
    static getDefaultView() {
        return new ol.View({
            projection: 'EPSG:3857',
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 2
        });
    }

    static createMap(target, layers = [], view = null, controls = null, interactions = null, overlays = []) {

        if (view === null) {
            view = olex.getDefaultView();
        }

        if (controls === null) {
            controls = ol.control.defaults.defaults();
            controls.push(new ol.control.ScaleLine());
            controls.push(new _Map_Control_JumpTo_());
        }

        if (interactions === null) {
            interactions = ol.interaction.defaults.defaults();
        }

        return new ol.Map({
            target: target,
            layers: layers,
            view: view,
            controls: controls,
            interactions: interactions,
            overlays: overlays
        });
    }

    static Raster = _Map_Raster_;
    static Vector = _Map_Vector_;

    static Addon = {
        Popup: _Map_Popup_Addon_,
        control: {
            JumpTo: _Map_Control_JumpTo_
        },
    }
}

export default olex;