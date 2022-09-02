import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/background'
    },
    {
        path: '/welcome',
        component: () => import('../views/welcome.vue')
    },
    {
        path: '/background',
        component: () => import('../views/background.vue')
    },
    {
        path: '/GameSetting',
        component: () => import('../views/gameSetting.vue')
    },
    {
        path: '/GameRecords',
        component: () => import('../views/gameRecords.vue')
    },
    {
        path: '/software',
        component: () => import('../layouts/gameLayout1.vue'),
        children: []
    }
];

const router = createRouter({
    routes,
    history: createWebHashHistory('/')
});

export default router;
