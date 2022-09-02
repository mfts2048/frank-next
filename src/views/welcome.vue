<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NTabs, NTab, useMessage, NMessageProvider } from 'naive-ui';

const props = defineProps<{
    show: boolean;
}>();

const router = useRouter();
const message = useMessage();
const iptRef = ref<HTMLInputElement>(null);
const setting = reactive({
    startDir: 'C://Emueikow/siwy/Client.exe'
});

const startLeagueClient = () => {
    if (!setting.startDir) {
        message.error('请先设置游戏启动目录');

        if (iptRef.value) {
            iptRef.value.onchange = (e: any) => {
                console.log(e.target.files[0].path);
                iptRef.value.value = null;
                console.log(iptRef.value.value);
            };
            iptRef.value.click();
        }
    } else {
        ipcRenderer.invoke('start_client').then(res => {
            if (res) {
                message.success('游戏启动成功');
            } else {
                message.error('游戏启动失败，请检查游戏环境是否正确');
            }
        });
    }
};

const jumpTo = (path: string) => {
    router.push(path);
};

const showModal = computed(() => props.show);
</script>

<template>
    <n-modal v-model:show="showModal" :mask-closable="false">
        <n-card
            style="width: 400px; height: 130px"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <div class="welcome-center">
                <n-space vertical :size="22" align="center" justify="center">
                    <input ref="iptRef" type="file" style="display: none" accept=".exe" />
                    <n-button type="primary" @click="startLeagueClient">
                        启动英雄联盟客户端
                    </n-button>
                    <!-- <n-space justify="center">
                        <n-button text>查看符文配置</n-button>
                        <n-button text>开发日志</n-button>
                        <n-button text>Github</n-button>
                        <n-button text @click="jumpTo('/software/gameSetting')">软件设置</n-button>
                    </n-space> -->
                </n-space>
            </div>
        </n-card>
    </n-modal>
</template>
