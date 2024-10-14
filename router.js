
import map from './page/map.js';
import heatmap from './page/heatmap.js';
import graph from './page/graph.js';

const router = VueRouter.createRouter({
    mode: 'hash',
    history: VueRouter.createWebHashHistory(),
    routes: [
        map,
        heatmap,
        graph,
    ],
});

export default router;