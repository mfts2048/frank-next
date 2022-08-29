<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { onMounted, reactive, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GameAssistantVue from './views/gameAssistant.vue';
import { GlobalThemeOverrides } from 'naive-ui';
// import GameNoFoundVue from './views/gameNoFound.vue';

const router = useRouter();
const route = useRoute();
const leagueClientIsRunning = ref(false);
const tabs = ref('GameRecords');

onMounted(() => {
    ipcRenderer.invoke('check_league_client_is_running').then(res => {
        if (res) {
            router.push('/background');
        } else {
            router.push('/welcome');
        }
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
                textColor: '#e4f8f2'
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
