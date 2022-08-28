<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue';
import { champDict } from '../../core/constant/lolDataList';
import { request } from '../utils/request';

const showModal = ref(false);
const runeDataListFor = ref<any>([]);

const openModal = () => {
    showModal.value = true;
};

const getImaUrl = (imgId: string) => new URL(`../assets/runes/${imgId}.png`, import.meta.url).href;

// 获取图片地址
// const getImaUrl = (imgId: any) => {
//     return require(`../assets/runes/${imgId}.png`);
// };

// 获取位置信息
const getPosition = (pos: string) => {
    switch (pos) {
        case 'middle':
            return '中单';
        case 'top':
            return '上单';
        case 'support':
            return '辅助';
        case 'jungle':
            return '打野';
        case 'bottom':
            return '射手';
        case 'aram':
            return '极地';
        default:
            return '不知道';
    }
};

const requestChampionJson = (alias: string) => {
    request({
        url: `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/op.gg-aram/${alias}.json`,
        method: 'GET'
    })
        .then(res => res.data)
        .then(result => {
            console.log('res', result);
            runeDataListFor.value = result[0].runes;
        });
};

onMounted(() => {
    requestChampionJson('Annie');
    ipcRenderer.on('pick_champion_flow', async (event, res) => {
        console.log('选择英雄环节');
        console.log('选择了杀', res);
        const { championId } = res;
        requestChampionJson('Annie');
        mapChamp(championId);
        if (showModal.value === false) {
            showModal.value = true;
        }
    });
    ipcRenderer.on('break_pick_champion_flow', () => {
        showModal.value = false
    })
});

// 应用符文
const applyRune = async data => {
    //   let tempData = JSON.parse(JSON.stringify(data))
    //   tempData.name = mapNameFromUrl[data.alias].name + " By Frank"
    //   const isApplySuccess = await applyRunePage(credentials,JSON.parse(JSON.stringify(tempData)))
    //   if (isApplySuccess){
    //     message.success('符文配置成功')
    //   }else {
    //     message.error('符文配置失败, 按Ctrl+R 再试试')
    //   }
};

const currentChampionImgUrl = ref(
    'https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png'
);
const currentChampionName = ref('英雄名称');
const currentChampionAlias = ref('英雄别名');
// 通过英雄ID获取部分信息
const mapChamp = (champId: string) => {
    currentChampionImgUrl.value = `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`;
    currentChampionName.value = champDict[champId].label;
    currentChampionAlias.value = champDict[champId].alias;
};
</script>

<template>
    <div class="game-assistant">
        <n-button @click="openModal">展开</n-button>
        <n-modal v-model:show="showModal">
            <n-card
                style="width: 800px"
                title="英雄联盟助手"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
            >
                <n-space>
                    <n-space align="center">
                        <n-avatar
                            round
                            :size="68"
                            :src="currentChampionImgUrl"
                            fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                            :bordered="false"
                        />
                        <n-button strong secondary type="primary">
                            {{ currentChampionName }}
                        </n-button>
                        <n-button strong secondary type="primary">
                            {{ currentChampionAlias }}
                        </n-button>
                    </n-space>
                    <n-grid :cols="2" :x-gap="12" :y-gap="12">
                        <n-gi v-for="rune in runeDataListFor">
                            <n-card size="small">
                                <!-- <n-space :size="[-5]"> -->
                                <div class="space-line">
                                    <div>
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[0])"
                                            alt=""
                                            class="runImg"
                                        />
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[1])"
                                            alt=""
                                            class="runImg"
                                        />
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[2])"
                                            alt=""
                                            class="runImg"
                                        />
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[3])"
                                            alt=""
                                            class="runImg"
                                        />
                                    </div>
                                    <n-tag :bordered="false" type="error" size="medium">
                                        {{ getPosition(rune.position) }}
                                    </n-tag>
                                </div>
                                <div class="space-line">
                                    <div>
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[4])"
                                            alt=""
                                            class="runImg"
                                        />
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[5])"
                                            alt=""
                                            class="runImg"
                                        />
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[6])"
                                            alt=""
                                            class="runImgseSondary"
                                        />
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[7])"
                                            alt=""
                                            class="runImgseSondary"
                                        />
                                        <img
                                            :src="getImaUrl(rune.selectedPerkIds[8])"
                                            alt=""
                                            class="runImgseSondary"
                                        />
                                    </div>
                                    <n-tag
                                        :bordered="false"
                                        type="success"
                                        size="medium"
                                        @click="applyRune(rune)"
                                        class="apply"
                                    >
                                        应用
                                    </n-tag>
                                </div>
                                <!-- </n-space> -->
                            </n-card>
                        </n-gi>
                    </n-grid>
                </n-space>
                <template #footer>尾部</template>
            </n-card>
        </n-modal>
    </div>
</template>

<style lang="less">
.runImg {
    width: 30px;
    height: 30px;
    margin-right: 8px;
}

.runImgseSondary {
    width: 25px;
    height: 25px;
}

.space-line {
    width: 280px;
    display: flex;
    justify-content: space-between;
    & > div {
        display: flex;
        align-items: center;
    }
    &:first-child {
        margin-bottom: 6px;
    }
    .apply {
        cursor: pointer;
    }
}
</style>
