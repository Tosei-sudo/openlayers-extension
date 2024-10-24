
import map from './page/map.js';
import mapOverlay from './page/map-overlay.js';
import mapPrint from './page/map-print.js';
import heatmap from './page/heatmap.js';
import graph from './page/graph.js';
import sender from './page/video-sender.js';
import receiver from './page/video-receiver.js';

const router = VueRouter.createRouter({
    mode: 'hash',
    history: VueRouter.createWebHashHistory(),
    routes: [
        map,
        heatmap,
        graph,
        mapOverlay,
        mapPrint,
        sender,
        receiver,
    ],
});

export default router;