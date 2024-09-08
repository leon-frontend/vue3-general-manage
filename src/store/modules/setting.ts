import { defineStore } from 'pinia'
import { ref } from 'vue'
// 与 Layout 组件配置相关的仓库

export const useSettingStore = defineStore('Setting', () => {
  // 1. 使用 ref/reactive 定义的响应式数据就是 state 中的数据。
  // fold 响应式数据，用于控制左侧菜单栏的"折叠"和"收起"
  const fold = ref<Boolean>(false)

  return { fold }
})
