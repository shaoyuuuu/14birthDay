<template>
  <el-empty :description="description" v-bind="$attrs">
    <slot name="icon">
      <el-icon :size="iconSize" :color="iconColor">
        <component :is="icon" />
      </el-icon>
    </slot>
    <template #description>
      <slot name="description">
        <p>{{ description }}</p>
      </slot>
    </template>
    <slot name="extra" />
  </el-empty>
</template>

<script setup lang="ts">
interface Props {
  description?: string
  icon?: any
  iconSize?: number
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: '暂无数据',
  iconSize: 60,
  iconColor: '#c0c4cc',
})
</script>
