
import map from './page/map.js';

const router = VueRouter.createRouter({
    mode: 'hash',
    history: VueRouter.createWebHashHistory(),
    routes: [
        map,
    ],
});

export default router;