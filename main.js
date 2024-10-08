
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

// use vuetify

const vuetify = Vuetify.createVuetify({
});

App.use(vuetify);

App.mount('#app');