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
    name: 'Auth',
    path: '/auth',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '权限管理', // 动态生成路由时展示的标题
      icon: 'Lock',
    },
    redirect: '/auth/user',
    children: [
      {
        name: 'User',
        path: '/auth/user',
        component: () => import('@/views/Auth/User/index.vue'),
        meta: {
          title: '用户管理', // 动态生成路由时展示的标题
          icon: 'User',
        },
      },
      {
        name: 'Role',
        path: '/auth/role',
        component: () => import('@/views/Auth/Role/index.vue'),
        meta: {
          title: '角色管理', // 动态生成路由时展示的标题
          icon: 'UserFilled',
        },
      },
      {
        name: 'Permission',
        path: '/auth/permission',
        component: () => import('@/views/Auth/Permission/index.vue'),
        meta: {
          title: '权限管理', // 动态生成路由时展示的标题
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    name: 'Product',
    path: '/product',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '商品管理', // 动态生成路由时展示的标题
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [
      {
        name: 'TradeMark',
        path: '/product/trademark',
        component: () => import('@/views/Product/TradeMark/index.vue'),
        meta: {
          title: '品牌管理', // 动态生成路由时展示的标题
          icon: 'ShoppingCartFull',
        },
      },
      {
        name: 'Attr',
        path: '/product/attr',
        component: () => import('@/views/Product/Attr/index.vue'),
        meta: {
          title: '属性管理', // 动态生成路由时展示的标题
          icon: 'List',
        },
      },
      {
        name: 'SPU',
        path: '/product/spu',
        component: () => import('@/views/Product/SPU/index.vue'),
        meta: {
          title: 'SPU 管理', // 动态生成路由时展示的标题
          icon: 'Tickets',
        },
      },
      {
        name: 'SKU',
        path: '/product/sku',
        component: () => import('@/views/Product/SKU/index.vue'),
        meta: {
          title: 'SKU 管理', // 动态生成路由时展示的标题
          icon: 'DataLine',
        },
      },
    ],
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
  // 当上面的路由都没有匹配上时，使用重定向匹配下面的任意路由
  {
    name: 'Any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      title: '任意路由', // 动态生成路由时展示的标题
      hidden: true, // 代表路由标题在导航栏中是否隐藏，ture表示隐藏，false表示不隐藏
      icon: 'DataLine',
    },
  },
]
