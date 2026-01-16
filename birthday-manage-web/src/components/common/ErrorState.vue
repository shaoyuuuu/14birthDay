<template>
  <el-result :icon="icon" :title="title" :sub-title="subTitle" v-bind="$attrs">
    <template #extra>
      <slot name="extra">
        <el-button type="primary" @click="handleRetry" v-if="showRetry">重试</el-button>
      </slot>
    </template>
  </el-result>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subTitle?: string
  icon?: 'success' | 'warning' | 'error' | 'info'
  showRetry?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '出错了',
  subTitle: '请稍后重试',
  icon: 'error',
  showRetry: true,
})

const emit = defineEmits<{
  retry: []
}>()

const handleRetry = () => {
  emit('retry')
}
</script>
