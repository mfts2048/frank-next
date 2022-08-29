import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/GameRecords'
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
        path: '/software',
        component: () => import('../layouts/gameLayout1.vue'),
        children: [
            {
                path: 'GameSetting',
                component: () => import('../views/gameSetting.vue')
            },
            {
                path: 'GameRecords',
                component: () => import('../views/gameRecords.vue')
            }
        ]
    }
];

const router = createRouter({
    routes,
    history: createWebHashHistory('/')
});

export default router;
