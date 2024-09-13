// 与 Layout 组件"顶部右侧的功能区域"相关的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('Setting', () => {
  // 1. 使用 ref/reactive 定义的响应式数据就是 state 中的数据。
  // fold 响应式数据，用于控制左侧菜单栏的"折叠"和"收起"
  const fold = ref<boolean>(false)

  // refresh 响应式数据用于控制顶部展示区域的"刷新功能"
  const refresh = ref<boolean>(false)

  return { fold, refresh }
})
