
import router from './router.js';

const App = Vue.createApp({});

App.use(router);

App.component('popup-container', {
    props: {
        id: {
            type: String,
            default: 'popup'
        }
    },
    template: `
        <div :id="id" class="ol-popup">
            <a href="#" :id="id + '-closer'" class="ol-popup-closer"></a>
            <div :id="id + '-content'"></div>
        </div>
    `,
});

App.component('map-container', {
    props: {
        id: {
            type: String,
            default: 'map'
        }
    },
    template: `
        <div :id="id"></div>
        <popup-container id="contextmenu"></popup-container>
    `,
});

App.component('line-chart', {
    props: {
        data: {
            type: Array,
            default: [],
        },
        xAxisLabelFunction: {
            type: Function,
            // default: (d) => {
            //     let unix = d * 1000 + new Date().getTime();
            //     let dT = new Date(unix)
            //     return d3.time.format('%Y-%m-%d %H:%M:%S')(dT);
            // }
            default: (d) => {
                return d;
            }
        },
    },
    template: `
        <div :id="id">
            <svg width="960" height="300"></svg>
        </div>
    `,
    data() {
        return {
            id: "line-chart-" + crypto.randomUUID(),
            chart: null,
            d3Element: null
        }
    },
    methods: {
        createChart() {
            this.d3Element = d3.select('#' + this.id + ' svg');

            nv.addGraph(() => {
                this.chart = nv.models.lineChart().useInteractiveGuideline(true);
                // this.chart = nv.models.discreteBarChart()

                this.chart.forceY([-110, 110]);
                this.chart.xAxis.tickFormat(this.xAxisLabelFunction);
                this.chart.yAxis.tickFormat(d3.format(',.2f'));

                this.d3Element
                    .datum(this.data)
                    .call(this.chart);

                nv.utils.windowResize(this.chart.update);

                return this.chart;
            });
        },
        updateData() {
            if (this.chart === null) {
                return;
            }
            this.d3Element
                .datum(this.data)
                .call(this.chart);
        }
    },
    watch: {
        data: {
            handler() {
                this.updateData();
            },
            deep: true
        }
    },
    mounted() {
        this.createChart();
    }
});

// use vuetify

const vuetify = Vuetify.createVuetify({
});

App.use(vuetify);


App.mount('#app');