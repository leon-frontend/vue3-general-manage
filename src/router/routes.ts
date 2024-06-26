// 该文件存放常量路由规则
export const constantRoutes = [
  // 用于登录页面的路由
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
  },
  // 用户登陆成功，用于展示数据的路由
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
  },
  // 当上面的路由都没有匹配上时，使用重定向匹配下面的任意路由
  { name: 'Any', path: '/:pathMatch(.*)*', redirect: '/404' },
]
