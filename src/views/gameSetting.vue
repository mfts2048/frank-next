<script lang="ts" setup>
import { ref } from 'vue';

const selectChampion = ref(true);
</script>

<template>
    <div class="game-setting">
        <n-space :size="20">
            <n-card>
                <n-space vertical :size="20">
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">秒选英雄</n-tag>
                        </div>
                        <div class="w240 align-center">
                            <n-tag :bordered="false" type="success">疾风之刃</n-tag>
                        </div>
                        <div class="w42 align-center ml40">
                            <n-switch></n-switch>
                        </div>
                    </n-space>
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">秒禁英雄</n-tag>
                        </div>
                        <div class="w240 align-center">
                            <n-tag :bordered="false" type="success">猩红收割者</n-tag>
                        </div>
                        <div class="w42 align-center ml40">
                            <n-switch></n-switch>
                        </div>
                    </n-space>
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">自动接收对局</n-tag>
                        </div>
                        <div class="w240 align-center">
                            <n-switch></n-switch>
                        </div>
                    </n-space>
                    <n-space align="center">
                        <div class="w100 align-center t-right">
                            <n-tag :bordered="false">游戏启动目录</n-tag>
                        </div>
                        <div class="w262 align-center">
                            <n-ellipsis style="max-width: 262px">
                                C:\\pdqhiuwheiuqwe\qwehi22\22uClient.exe
                            </n-ellipsis>
                        </div>
                    </n-space>
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>
