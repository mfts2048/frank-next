<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { ref } from 'vue';
import { optionsChampion } from '../../core/constant/lolDataList';
import { useApplication } from '../store/application';

const options = optionsChampion;
const appStore = useApplication();
const iptRef = ref<HTMLInputElement>(null);
const selectChampion = ref(true);

const setSetting = (key: string, value: string | number | boolean) => {
    ipcRenderer.invoke('set_app_setting', { key, value }).then(res => {
        console.log(res);
    });
};
const chooseGameDir = () => {
    if (iptRef.value) {
        iptRef.value.onchange = (e: any) => {
            const path = e.target.files[0].path;
            appStore.setting.gameDirectory = path;
            setSetting('gameDirectory', path);

            iptRef.value.value = null;
        };
        iptRef.value.click();
    }
};
</script>

<template>
    <div class="game-setting">
        <n-space :size="20">
            <n-card>
                <n-space vertical :size="20">
                    <!-- <p class="subText">在禁用状态下，你所设置的秒选或秒禁用不会生效</p> -->
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">秒选英雄</n-tag>
                        </div>
                        <div class="w240 align-center">
                            <!-- <n-tag :bordered="false" type="success">
                                {{ appStore.setting.autoPickChampion.championId }}
                            </n-tag> -->
                            <n-select
                                v-model:value="appStore.setting.autoPickChampion.championId"
                                filterable
                                placeholder="选择歌曲"
                                :options="options"
                                :disabled="!appStore.setting.autoPickChampion.isAuto"
                                @update:value="(e: boolean) => setSetting('autoPickChampion.championId', e)"
                            />
                        </div>
                        <div class="w42 align-center ml40">
                            <n-switch
                                v-model:value="appStore.setting.autoPickChampion.isAuto"
                                @update:value="(e: boolean) => setSetting('autoPickChampion.isAuto', e)"
                            ></n-switch>
                        </div>
                    </n-space>
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">秒禁英雄</n-tag>
                        </div>
                        <div class="w240 align-center">
                            <n-select
                                v-model:value="appStore.setting.autoBanChampion.championId"
                                filterable
                                placeholder="选择歌曲"
                                :options="options"
                                :disabled="!appStore.setting.autoBanChampion.isAuto"
                                @update:value="(e: boolean) => setSetting('autoBanChampion.championId', e)"
                            />
                        </div>
                        <div class="w42 align-center ml40">
                            <n-switch
                                v-model:value="appStore.setting.autoBanChampion.isAuto"
                                @update:value="(e: boolean) => setSetting('autoBanChampion.isAuto', e)"
                            ></n-switch>
                        </div>
                    </n-space>
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">自动接收对局</n-tag>
                        </div>
                        <div class="w240 align-center">
                            <n-switch
                                v-model:value="appStore.setting.autoAccept"
                                @update:value="(e: boolean) => setSetting('autoAccept', e)"
                            ></n-switch>
                        </div>
                    </n-space>
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">游戏启动目录</n-tag>
                        </div>
                        <div class="w240 align-center">
                            <n-ellipsis style="max-width: 240px">
                                {{ appStore.setting.gameDirectory }}
                            </n-ellipsis>
                        </div>
                        <n-button class="ml20" type="primary" @click="chooseGameDir">
                            选择目录
                        </n-button>
                        <input ref="iptRef" type="file" style="display: none" accept=".exe" />
                    </n-space>
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>

<style lang="less" scoped>
.game-setting {
    .n-button {
        line-height: 1px;
    }
}
</style>
