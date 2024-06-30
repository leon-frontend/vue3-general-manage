// 该文件存放常量路由规则
export const constantRoutes = [
  // 用于登录页面的路由
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录', // 动态生成路由时展示的标题
      hidden: true, // 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
    }
  },
  // 用户登陆成功，用于展示数据的路由
  {
    name: 'Layout',
    path: '/',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: 'Layout', // 动态生成路由时展示的标题
      hidden: false, // 代表路由标题在导航栏中是否隐藏，true表示隐藏，false表示不隐藏
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          title: '首页', // 动态生成路由时展示的标题
          hidden: false,// 代表路由标题在导航栏中是否隐藏，true表示隐藏，false表示不隐藏
        },
      },
      {
        path: '/test',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          title: '测试',
          hidden: false,// 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
        }
      }
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404', // 动态生成路由时展示的标题
      hidden: true, // 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
    },
  },
  // 当上面的路由都没有匹配上时，使用重定向匹配下面的任意路由
  {
    name: 'Any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      title: '任意路由', // 动态生成路由时展示的标题
      hidden: true, // 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
    },
  },
]
