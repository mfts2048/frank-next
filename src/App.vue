<script setup lang="ts">
import { app, ipcRenderer } from 'electron';
import { onMounted, computed, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GameAssistantVue from './views/gameAssistant.vue';
import { GlobalThemeOverrides, darkTheme } from 'naive-ui';
import { RemoveOutline, StopOutline, CloseOutline } from '@vicons/ionicons5';
import { useApplication } from './store/application';
import WelcomeVue from './views/welcome.vue';
// import GameNoFoundVue from './views/gameNoFound.vue';

const router = useRouter();
const route = useRoute();
const leagueClientIsRunning = ref(false);
const appStore = useApplication();
const tabs = computed(() => route.path);

onBeforeMount(() => {
    ipcRenderer.invoke('check_league_client_is_running').then(res => {
        if (res) {
            leagueClientIsRunning.value = false;
        } else {
            leagueClientIsRunning.value = true;
        }
    });

    ipcRenderer.invoke('get_app_setting').then(res => {
        appStore.setting = res;
    });
});

const themeOverrides: GlobalThemeOverrides = {
    Tabs: {
        colorSegment: '#00000000'
    }
    // common: {
    //     // primaryColor: '#FF0000',
    //     // textColor2: '#e4f8f2'
    // },
    // Button: {
    //     textColor: '#e4f8f2'
    // },
    // Tag: {
    //     color: '#EEEEEE00'
    // },
    // Select: {
    //     peers: {
    //         InternalSelection: {
    //             // textColor: '#e4f8f2'
    //         }
    //     }
    // }
};

const jumpTo = (path: string) => {
    router.push(path);
    // tabs.value = path;
};
</script>

<template>
    <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
        <NMessageProvider placement="bottom-right">
            <n-layout>
                <n-layout-header>
                    <div class="header">
                        <div class="tabs-center">
                            <n-tabs type="segment" v-model:value="tabs">
                                <n-tab
                                    name="/background"
                                    tab="??????"
                                    @click="jumpTo('/background')"
                                ></n-tab>
                                <n-tab
                                    name="/GameRecords"
                                    tab="????????????"
                                    @click="jumpTo('/GameRecords')"
                                ></n-tab>
                                <n-tab
                                    name="/GameSetting"
                                    tab="??????"
                                    @click="jumpTo('/GameSetting')"
                                ></n-tab>
                            </n-tabs>
                        </div>
                        <div class="icon-box">
                            <div class="icon icon-close">
                                <n-icon color="#ffffff" :size="20">
                                    <CloseOutline />
                                </n-icon>
                            </div>
                        </div>
                    </div>
                </n-layout-header>
                <n-layout-content content-style="padding: 24px;height: 549px;">
                    <div class="container">
                        <n-scrollbar style="max-height: 501px">
                            <RouterView />
                        </n-scrollbar>
                    </div>
                </n-layout-content>
            </n-layout>
            <WelcomeVue :show="leagueClientIsRunning" />

            <!-- <h1>{{ route.fullPath }}</h1> -->
            <!-- <GameNoFoundVue v-if="!leagueClientIsRunning" /> -->
            <!-- <div class="container">
                <n-tabs type="line" animated v-model:value="tabs">
                    <n-tab name="background" @click="jumpTo('/background')">????????????</n-tab>
                    <n-tab name="GameRecords" @click="jumpTo('/GameRecords')">????????????</n-tab>
                    <n-tab name="AppSetting" @click="jumpTo('/AppSetting')">Hey Jude</n-tab>
                    <n-tab name="jay chou">?????????</n-tab>
                </n-tabs>
                <main>
                    <RouterView />
                    <GameAssistantVue />
                </main>
            </div> -->
        </NMessageProvider>
    </n-config-provider>
</template>
