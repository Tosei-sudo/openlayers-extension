
import map from './page/map/map.js';
import map_edit from './page/map/map-edit.js';
// import pages from './page.js';

// const map = await import(pages.map.map);
import mapOverlay from './page/map/map-overlay.js';
import mapPrint from './page/map/map-print.js';
import heatmap from './page/map/heatmap.js';
import graph from './page/graph.js';
import sender from './page/video-sender.js';
import receiver from './page/video-receiver.js';
import network from './page/network.js';

const router = VueRouter.createRouter({
    mode: 'hash',
    history: VueRouter.createWebHashHistory(),
    routes: [
        map,
        map_edit,
        heatmap,
        graph,
        mapOverlay,
        mapPrint,
        sender,
        receiver,
        network,
    ],
});

router.beforeEach((to, from, next) => {
    document.getElementById("page-style").textContent = "";
    next();
});

export default router;