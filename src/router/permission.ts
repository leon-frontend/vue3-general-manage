// 路由鉴权：某一个路由什么条件下可以访问，什么条件下不能被访问
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css' // 一定要引入进度条的样式
import pinia from '@/store'
import { useUserStore } from '@/store/modules'

// 不展示右侧的旋转器
nprogress.configure({ showSpinner: false })

/**
 * 在组件以外的地方使用 Pinia 中的小仓库时，需要根据 Pinia 大仓库来创建小仓库
 * 使用 userStore 小仓库中的 token 来实现路由鉴权
 */
const userStore = useUserStore(pinia)

//#region ------------ 1. 全局守卫：任意路由切换都会触发的钩子 ---------------
/**
 * 需要在全局守卫中实现的业务逻辑：
 * 1. 路由切换时，展示进度条。
 * 2. 使用 token 实现路由鉴权，即路由组件的访问权限设置：
 *    2.1 全部路由组件：login|404|Home|Screen|Auth(三个子路由)|Product(四个子路由)
 *    2.1 用户未登录时，只能访问 Login 页面。
 *    2.2 用户登录成功之后，不能访问 Login 页面，会直接重定向至首页。其他路由组件正常访问。
 */
/**
 * 1.1 全局前置守卫：访问任意路由之前会触发的钩子
 * @param to 指将要访问的路由
 * @param from 指从哪个路由而来
 * @param next 指路由的放行函数
 */
router.beforeEach(async (to, _, next) => {
  // 访问某一个路由页面时，动态切换标签页的标题
  document.title = '硅谷甄选 - ' + to.meta.title

  // 在前置守卫中开启进度条
  nprogress.start()

  // 从 userStore 小仓库中获取 token、用户姓名和用户头像
  const { token, userName, getUserInfo, userLogout } = userStore

  // token 若存在，则表示用户已登录；token 若不存在，则表示用户未登录
  if (token) {
    /**
     * 用户登录成功的情况:
     * 1. 访问 login 页面时，重定向至 Home 页面。
     * 2. 访问其他页面时，直接放行。
     * 3. 用户登陆成功后，访问除了 Login 以外的组件时，都需要获取"用户姓名和用户头像"信息供顶部展示区域使用。
     *    3.1 若用户信息存在，则直接放行；
     *    3.2 若用户信息不存在（如刷新页面会清除仓库中的 token 数据），则发送获取用户信息的请求。
     *        3.2.1 当请求成功获取用户信息时，放行；
     *        3.2.2 若请求失败（如 token 失效），则首先需要退出登录，然后将路由重定向至 Login 页面。
     */
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 若用户信息存在，则直接放行；若用户信息不存在，则发送获取用户信息的请求之后，再放行
      if (userName) {
        next() // 用户信息存在，直接放行
      } else {
        // 用户信息不存在的情况
        try {
          await getUserInfo() // 发请求获取用户信息
          next() // 获取用户信息成功之后，放行
        } catch (error) {
          /**
           * 发请求获取用户信息失败时（如 token 过期），会执行下面的代码
           * 1. 首先退出登录：清空用户的相关数据
           * 2. 将路由重定向至 Login 页面，并使用 query 参数携带想要访问的路由
           */
          await userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    /**
     * 用户未登录的情况:
     * 1. 访问 login 页面时，正常放行。
     * 2. 访问其他页面时，重定向至 login 页面，并将想要访问的页面作为 query 参数携带在路由中，用于用户登录成功后，直接跳转到指定页面。
     */
    if (to.path === '/login') next()
    else next({ path: '/login', query: { redirect: to.path } })
  }
})

// 1.2 全局后置守卫
router.afterEach(() => {
  // 在后置守卫中实现进度条"终止"
  nprogress.done()
})

//#endregion --------- 1. 全局守卫：任意路由切换都会触发的钩子 ---------------
