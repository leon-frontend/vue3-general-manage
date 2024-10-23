import type { RouteRecordRaw } from 'vue-router'

// 任意路由
export const anyRoutes: RouteRecordRaw[] = [
  // 当其他路由都没有匹配上时，使用重定向匹配下面的任意路由
  {
    name: 'Others',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      title: '任意路由', // 动态生成路由时展示的标题
      hidden: true, // 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
      icon: 'DataLine',
    },
  },
]
