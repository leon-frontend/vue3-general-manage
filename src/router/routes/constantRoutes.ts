import type { RouteRecordRaw } from 'vue-router'

// 常量路由：所有用户都可以访问的路由。
export const constantRoutes: RouteRecordRaw[] = [
  // 用于登录页面的路由
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录', // 动态生成路由时展示的标题
      hidden: true, // 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
      icon: 'Promotion', // 菜单栏左侧的图表，支持 element-plus 的全部图标
    },
  },
  // 用户登陆成功，用于展示数据的路由
  {
    name: 'Layout',
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home', // 重定向到 home 页面
    meta: {
      title: '', // 动态生成路由时展示的标题
      hidden: false, // 代表路由标题在导航栏中是否隐藏，true表示隐藏，false 表示不隐藏(若省略该属性, 也表示不隐藏)
      icon: '',
    },
    children: [
      {
        name: 'Home',
        path: '/home',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          title: '首页', // 动态生成路由时展示的标题
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    name: 'Screen',
    path: '/screen',
    component: () => import('@/views/Screen/index.vue'),
    meta: {
      title: '数据大屏', // 动态生成路由时展示的标题
      icon: 'Platform',
    },
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404', // 动态生成路由时展示的标题
      hidden: true, // 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
      icon: 'DocumentDelete',
    },
  },
]
