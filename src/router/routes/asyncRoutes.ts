import type { RouteRecordRaw } from 'vue-router'

// 异步路由：需要根据"用户身份"才可以访问的路由，即该路由只能被部分用户访问。
export const asyncRoutes: RouteRecordRaw[] = [
  {
    name: 'Acl',
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
        component: () => import('@/views/Auth/Menu/index.vue'),
        meta: {
          title: '菜单管理', // 动态生成路由时展示的标题
          icon: 'MenuIcon',
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
        name: 'Trademark',
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
        name: 'Spu',
        path: '/product/spu',
        component: () => import('@/views/Product/SPU/index.vue'),
        meta: {
          title: 'SPU 管理', // 动态生成路由时展示的标题
          icon: 'Tickets',
        },
      },
      {
        name: 'Sku',
        path: '/product/sku',
        component: () => import('@/views/Product/SKU/index.vue'),
        meta: {
          title: 'SKU 管理', // 动态生成路由时展示的标题
          icon: 'DataLine',
        },
      },
    ],
  },
]
