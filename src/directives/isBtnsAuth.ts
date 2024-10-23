import pinia from '@/store'
import { useUserStore } from '@/store/modules'
import type { App, DirectiveBinding } from 'vue'

// 在组件以外的地方使用 Pinia 中的小仓库时，需要根据 Pinia 大仓库来创建小仓库。
const userStore = useUserStore(pinia)

// isBtnsAuth 函数用于自定义指令，用于判断当前页面的按钮权限有哪些
export const isBtnsAuth = (app: App) => {
  // 全局自定义指令：实现按钮权限
  app.directive('btns-auth', {
    // mounted 表示当指令绑定的元素被 挂载到页面中 时，会自动调用
    // el 表示指令绑定到的元素；binding 是一个对象，通过 binding.value 获取传递给指令的值。
    mounted: (el: HTMLElement, binding: DirectiveBinding<string>) => {
      // 判断服务器返回的"按钮权限"数据中是否包含自定义指令绑定的值(某个组件的按钮值)。
      if (!userStore.btnsAuth.includes(binding.value)) {
        // 若不包含，直接删除相关按钮的 DOM
        el.parentNode?.removeChild(el)
      }
    },
  })
}
