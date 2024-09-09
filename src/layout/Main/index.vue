<script setup lang="ts" name="Main">
import { useSettingStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { watch, ref, nextTick } from 'vue'

// 获取 setttingStore 仓库，并响应式解构出仓库中的 refresh 响应式数据
const setttingStore = useSettingStore()
const { refresh } = storeToRefs(setttingStore)

// isShow 响应式数据用于控制当前组件是否销毁重建（即是否展示在页面上）
const isShow = ref(true)

// 监听 refresh 响应式数据的变化，只要它发生变化，就重新渲染匹配的路由组件
watch(
  refresh,
  () => {
    // 点击"刷新"按钮会触发 refresh 的变化，则会触发该回调函数
    // 1. 先销毁组件，即设置其值为 false
    isShow.value = false

    // 2. 组件销毁完毕并页面重新渲染之后(nextTick 钩子)，再重新挂载一次组件，即"重新渲染"组件
    nextTick(() => {
      isShow.value = true
    })
  },
  { deep: true },
)
</script>

<template>
  <!-- 路由组件的出口位置 -->
  <router-view v-slot="{ Component }">
    <!-- 在切换路由组件时, 实现过渡动效 -->
    <transition name="fade">
      <component :is="Component" v-if="isShow" />
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.7s;
}

.fade-enter-to {
  opacity: 1;
}
</style>
