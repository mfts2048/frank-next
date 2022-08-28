import { createApp } from 'vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index';
import './style.less';
// import './samples/node-api'

async function bootstrap() {
    const app = createApp(App);

    app.use(router);
    app.use(naive);
    app.use(createPinia());

    app.mount('#app').$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*');
    });
}

bootstrap();
