<script lang="ts" setup>
import { ArrowBackOutline } from '@vicons/ionicons5';
import { useRouter } from 'vue-router';

const router = useRouter();

const back = () => {
    router.go(-1);
};
</script>

<template>
    <div class="game-layout">
        <div>
            <n-button strong secondary type="primary" @click="back">
                <template #icon>
                    <n-icon>
                        <ArrowBackOutline />
                    </n-icon>
                </template>
                返回
            </n-button>
        </div>
        <div class="layout-container">
            <RouterView />
        </div>
    </div>
</template>

<style lang="less" scoped>
.layout-container {
    margin-top: 24px;
}
</style>
