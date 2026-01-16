<template>
  <div class="loading-state" v-bind="$attrs">
    <el-icon class="is-loading" :size="size" :color="color">
      <Loading />
    </el-icon>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

interface Props {
  text?: string
  size?: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  size: 40,
  color: '#409EFF',
})
</script>

<style scoped lang="scss">
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4vw 2vw;
  gap: 1vw;

  .loading-text {
    margin: 0;
    font-size: 1vw;
    color: #909399;
  }
}

@media (max-width: 768px) {
  .loading-state {
    padding: 8vw 4vw;
    gap: 2vw;

    .loading-text {
      font-size: 2vw;
    }
  }
}
</style>
