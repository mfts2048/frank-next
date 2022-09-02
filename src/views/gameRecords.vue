<script lang="ts" setup>
import { ipcRenderer } from 'electron';
// import { NCard, NList, NListItem, NTag, NSpace, NAvatar, NIcon } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useBackgroundStore } from '../store/backgroundStore';
import { dealWithGameRecordsResponse, GameRecordsResponse } from './gameRecords';
import { ThumbUp, ThumbDown } from '@vicons/tabler';

const backgroundStore = useBackgroundStore();
const matchList = ref<any[]>([]);
const activeIndex = ref<number>(0);

console.log(123);

const init = async () => {
    const summoner = await backgroundStore.getCurrentSummoner();
    if (summoner) {
        ipcRenderer
            .invoke('get_match_history', {
                summonerId: summoner.summonerId,
                begIndex: 0,
                endIndex: 18,
                mode: ''
            })
            .then((res: GameRecordsResponse) => {
                console.log('res', res);
                matchList.value = dealWithGameRecordsResponse(res).games.games || [];
            });
    }
};
onMounted(init);
</script>

<template>
    <div class="game-records">
        <n-card>
            <n-list>
                <n-list-item v-for="match in matchList">
                    <n-space>
                        <n-avatar
                            :bordered="false"
                            :size="40"
                            :src="match.champImgUrl"
                            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                            style="display: block"
                        />
                        <n-space vertical :size="[2, 1.6]">
                            <n-space>
                                <n-tag
                                    size="small"
                                    :type="match.isWin ? 'success' : 'error'"
                                    style="width: 68px; justify-content: center"
                                    :bordered="false"
                                >
                                    {{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
                                </n-tag>

                                <n-tag
                                    size="small"
                                    style="width: 40px; justify-content: center"
                                    :bordered="false"
                                >
                                    {{ match.matchTime }}
                                </n-tag>
                            </n-space>
                            <p>
                                <span>{{ match.queueId }}</span>
                                <n-icon
                                    size="19"
                                    color="#18a058"
                                    v-if="((match.kills + match.assists) / match.deaths) * 3 >= 10"
                                >
                                    <ThumbUp />
                                </n-icon>
                                <n-icon size="19" color="#ff6666" v-else>
                                    <ThumbDown />
                                </n-icon>
                            </p>
                        </n-space>
                    </n-space>
                </n-list-item>
            </n-list>
        </n-card>
    </div>
</template>

<style lang="less">
.game-records {
    display: flex;

    .n-card {
        .n-list-item {
            cursor: pointer;
        }
    }

    P {
        margin: 0;
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #9aa4af;
        justify-content: space-between;
        margin-top: 3px;
    }
}
</style>
