// 通过vue-router配置路由规则
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'

export default createRouter({
  history: createWebHashHistory(), // 使用hash模式
  routes: constantRoutes,
  // 添加切换路由时的滚动行为
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
