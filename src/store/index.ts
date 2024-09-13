// 创建整个项目的pinia大仓库
import { createPinia } from 'pinia'

// 创建 Pinia 实例
const pinia = createPinia()

// 解决使用 setup 方式实现 Pinia 仓库时， $reset 方法失效问题
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  store.$reset = () => {
    store.$patch(initialState)
  }
})

export default pinia
