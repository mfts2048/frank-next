<script setup lang="ts">
import { app, ipcRenderer } from 'electron';
import { onMounted, reactive, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GameAssistantVue from './views/gameAssistant.vue';
import { GlobalThemeOverrides } from 'naive-ui';
import { RemoveOutline, StopOutline, CloseOutline } from '@vicons/ionicons5';
import { useApplication } from './store/application';
// import GameNoFoundVue from './views/gameNoFound.vue';

const router = useRouter();
const route = useRoute();
const leagueClientIsRunning = ref(false);
const tabs = ref('GameRecords');
const appStore = useApplication();

onBeforeMount(() => {
    ipcRenderer.invoke('check_league_client_is_running').then(res => {
        if (res) {
            router.push('/background');
        } else {
            router.push('/welcome');
        }
    });

    ipcRenderer.invoke('get_app_setting').then(res => {
        appStore.setting = res;
    });
});

const themeOverrides: GlobalThemeOverrides = {
    common: {
        // primaryColor: '#FF0000',
        // textColor2: '#e4f8f2'
    },
    Button: {
        textColor: '#e4f8f2'
    },
    Tag: {
        color: '#EEEEEE00'
    },
    Select: {
        peers: {
            InternalSelection: {
                // textColor: '#e4f8f2'
            }
        }
    }
};

// const jumpTo = (path: string) => {
//     tabs.value = path.slice(1);
//     router.push(path);
// };
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <NMessageProvider placement="bottom-right">
            <div class="app-controls">
                <n-space :size="0">
                    <div class="icon">
                        <n-icon color="#ffffff">
                            <RemoveOutline />
                        </n-icon>
                    </div>
                    <div class="icon">
                        <n-icon color="#ffffff" :size="20">
                            <CloseOutline />
                        </n-icon>
                    </div>
                </n-space>
            </div>
            <!-- <h1>{{ route.fullPath }}</h1> -->
            <div class="container">
                <RouterView />
            </div>
            <!-- <GameNoFoundVue v-if="!leagueClientIsRunning" /> -->
            <!-- <div class="container">
                <n-tabs type="line" animated v-model:value="tabs">
                    <n-tab name="background" @click="jumpTo('/background')">个人生涯</n-tab>
                    <n-tab name="GameRecords" @click="jumpTo('/GameRecords')">对局记录</n-tab>
                    <n-tab name="AppSetting" @click="jumpTo('/AppSetting')">Hey Jude</n-tab>
                    <n-tab name="jay chou">七里香</n-tab>
                </n-tabs>
                <main>
                    <RouterView />
                    <GameAssistantVue />
                </main>
            </div> -->
        </NMessageProvider>
    </n-config-provider>
</template>
