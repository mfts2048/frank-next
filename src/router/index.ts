import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/GameRecords'
    },
    {
        path: '/GameRecords',
        component: () => import('../views/gameRecords.vue')
    }
];

const router = createRouter({
    routes,
    history: createWebHashHistory('/')
});

export default router;
