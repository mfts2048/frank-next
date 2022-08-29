<script lang="ts" setup>
import { ArrowBackOutline } from '@vicons/ionicons5';
</script>

<template>
    <div class="game-layout">
        <div>
            <n-button strong secondary type="primary">
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
.game-layout {
    padding: 24px;
    box-sizing: border-box;
}
.layout-container {
    margin-top: 24px;
}
</style>
