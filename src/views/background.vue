<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBackgroundStore } from '../store/backgroundStore';
import { getImaUrl2 } from '../utils/index';

const router = useRouter();
const backgroundStore = useBackgroundStore();
const profileSummary = ref<any[]>([]);
const championMastery = ref<any[]>([]);

const jumpTo = (path: string) => {
    router.push(path);
};

onMounted(async () => {
    const background = await backgroundStore.getCurrentSummoner();
    ipcRenderer
        .invoke('get_profile_summary', {
            puuid: background.puuid
        })
        .then(res => {
            profileSummary.value = res;
        });

    ipcRenderer
        .invoke('get_champion_mastery', {
            summonerId: background.summonerId
        })
        .then(res => {
            championMastery.value = res.slice(0, 15);
            console.log('championMastery.value', championMastery.value);
        });
});
</script>

<template>
    <div class="background">
        <n-card>
            <n-space :size="24">
                <n-avatar
                    round
                    :size="68"
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
                <n-space vertical justify="center">
                    <n-space>
                        <n-tag :bordered="false" type="success" round>烟熏三文鱼</n-tag>
                        <n-tag :bordered="false" type="warning" round>lv 504</n-tag>
                    </n-space>
                    <div>升级还差 12025 点经验值</div>
                    <n-progress
                        processing
                        style="width: 590px"
                        type="line"
                        color="#f0a020"
                        :percentage="50"
                    />
                </n-space>
            </n-space>
        </n-card>
        <div class="other-info">
            <n-card>
                <div class="mb20">英雄熟悉度</div>
                <n-scrollbar style="max-height: 215px">
                    <n-list>
                        <n-list-item
                            style="padding-bottom: 7px; padding-top: 7px"
                            v-for="(chapm, index) in championMastery"
                        >
                            <n-space align="center">
                                <n-avatar
                                    round
                                    style="margin-right: 0px"
                                    :bordered="false"
                                    :size="50"
                                    :src="chapm.champImgUrl"
                                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                                />
                                <n-tag :bordered="false" type="success">
                                    英雄等级 {{ chapm.championLevel }}
                                </n-tag>
                                <n-tag :bordered="false" type="warning">
                                    熟练度 {{ chapm.championPoints }}
                                </n-tag>
                            </n-space>
                        </n-list-item>
                    </n-list>
                </n-scrollbar>
            </n-card>
            <n-card>
                <div class="mb20">永恒星碑</div>
                <n-space vertical>
                    <n-list>
                        <n-list-item
                            style="padding-bottom: 7px; padding-top: 7px"
                            v-for="statstones in profileSummary"
                        >
                            <n-space align="center">
                                <n-avatar
                                    round
                                    style="margin-right: 0px"
                                    :color="'#eaeaea'"
                                    :bordered="false"
                                    :src="getImaUrl2(statstones.imgUrl)"
                                    :size="50"
                                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                                />

                                <n-tag :bordered="false" type="success">
                                    {{ statstones.championId }}
                                </n-tag>
                                <n-tag :bordered="false" type="warning">
                                    {{ statstones.name }} {{ statstones.value }}
                                </n-tag>
                            </n-space>
                        </n-list-item>
                    </n-list>
                    <!-- <p style="color: #9aa4af; margin-left: 10px; margin-top: -5px">
                                英雄数据页面点击头像可查看此英雄的永恒星碑
                            </p> -->
                    <n-tag
                        v-if="profileSummary.length === 0"
                        :bordered="false"
                        type="error"
                        style="width: 100%; justify-content: center"
                    >
                        当前召唤师暂无永恒星碑
                    </n-tag>
                </n-space>
            </n-card>
        </div>
    </div>
</template>

<style lang="less" scoped>
.background {
    .base-info {
        flex: 1;
        margin-right: 24px;
    }
    .next-info {
        flex-shrink: 0;
        width: 300px;
        .n-button {
            width: 100%;
            line-height: 1px;
        }
    }
    .other-info {
        display: flex;
        margin-top: 12px;
        .n-card {
            flex: 1;
            &:first-child {
                margin-right: 6px;
            }
            &:last-child {
                margin-left: 6px;
            }
        }
    }
}
</style>
