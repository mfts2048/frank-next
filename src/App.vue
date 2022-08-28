<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NTabs, NTab } from 'naive-ui';
import gameAssistantVue from './views/gameAssistant.vue';

const router = useRouter();

const jumpTo = (path: string) => {
    tabs.value = path.slice(1);
    console.log(path.slice(1));
    router.push(path);
};

const tabs = ref('GameRecords');
</script>

<template>
    <div class="container">
        <n-tabs type="line" animated v-model:value="tabs">
            <n-tab name="background" @click="jumpTo('/background')">个人生涯</n-tab>
            <n-tab name="GameRecords" @click="jumpTo('/GameRecords')">对局记录</n-tab>
            <n-tab name="AppSetting" @click="jumpTo('/AppSetting')">Hey Jude</n-tab>
            <n-tab name="jay chou">七里香</n-tab>
        </n-tabs>
        <main>
            <RouterView />
            <gameAssistantVue />
        </main>
    </div>
</template>

<style></style>
