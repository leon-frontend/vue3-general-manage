// 创建用户相关的小仓库
import { ref } from 'vue'
import router from '@/router'
import { defineStore } from 'pinia'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
import { constantRoutes, asyncRoutes, anyRoutes } from '@/router/routes'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import cloneDeep from 'lodash/cloneDeep'
import type { RouteRecordRaw } from 'vue-router'
import type { LoginFormData } from '@/api/user/type'

/**
 * 使用组合式 API 创建 userStore 仓库：
 * 1. 使用 ref/reactive 定义的响应式数据就是 state 中的数据。
 * 2. 定义的函数就是 actions 中的方法。
 */
export const useUserStore = defineStore('User', () => {
  //#region ------------ token 和用户登录相关的业务处理 ---------
  /**
   * token 是用户的唯一标识，并且实现localStorage的持久化。
   * localStorage.getItem('TOKEN') 的默认值是 null。
   * <string | null> 对 localStorage.getItem('TOKEN') 的类型进行限制。
   */
  const token = ref<string | null>(GET_TOKEN())

  // userLogin 函数是用户登陆时调用的方法
  const userLogin = async (userData: LoginFormData) => {
    try {
      const result = await reqLogin(userData)

      // 登录成功，则返回成功的 Promise，并处理token
      if (result.code === 200) {
        token.value = result.data // 将登陆成功后的 token 存到 pinia 中
        SET_TOKEN(result.data) // 将用户的token存在localStorage中实现持久化
        return 'ok' // 保证返回成功状态的Promise对象
      } else {
        // 请求失败，则返回失败的Promise，并且弹出失败信息
        return Promise.reject(new Error(result.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // userLogout 函数是用户退出登录时调用的方法
  const userLogout = async () => {
    try {
      const result = await reqLogout() // 发送退出登录的请求

      // 当返回的状态是 200 时，表示退出登录成功
      if (result.code === 200) {
        // 清空仓库当中与当前用户想关的数据
        token.value = ''
        username.value = ''
        userAvatar.value = ''

        localStorage.removeItem('TOKEN') // 清空 localStorage 中的 token 信息

        /**
         * "退出登录"时移除动态添加的"异步路由"：在用户退出登录后，应该移除与该用户权限相关的路由，防止未授权的用户访问受限页面。
         * 移除动态添加的"异步路由"，可以确保路由表与当前用户的权限匹配，避免出现无权限的路由出现在导航菜单或被用户访问。
         * 防止路由冲突：如果不移除动态添加的路由，可能会在下次登录时发生路由重复添加的错误，或者导致权限紊乱，影响应用的正常运行。
         */
        asyncRouteNames.value.forEach((routeName) =>
          router.removeRoute(routeName),
        )
        asyncRouteNames.value = [] // 清空记录的路由名称数组

        return 'ok' // 返回成功的 Promise ，表示退出成功
      } else {
        // 退出登录失败，则返回失败的 Promise 对象
        return Promise.reject(new Error(result.message))
      }
    } catch (error) {
      console.log(error)
    }
  }
  //#endregion ---------- token 和用户登录相关的业务处理 ---------------

  //#region ------------------ 路由、菜单权限相关的业务处理 ---------------------
  // menuRoutes 用于存储当前用户"可以访问"的"总路由"，即需要渲染的"菜单路由"
  const menuRoutes = ref<RouteRecordRaw[]>(constantRoutes)

  // 存储动态添加的"异步路由"名称，在"退出登录"时需要删除添加的"异步路由"
  const asyncRouteNames = ref<string[]>([])

  /**
   * 该函数用于从 asyncRoutes 异步路由中筛选出当前用户可以访问的异步路由。
   * 该函数会在 getUserInfo 函数中调用，并且在获取用户数据之后调用。
   * @param allAsyncRoutes 所有的异步路由数组
   * @param userAsyncRoutes 当前用户能访问的异步路由数组，由字符串标识组成
   */
  const getUserAsyncRoutes = (
    allAsyncRoutes: RouteRecordRaw[],
    userAsyncRoutesStr: string[],
  ) => {
    // 对 allAsyncRoutes 所有的异步路由进行筛选
    return allAsyncRoutes.filter((curRoute) => {
      // 在 userAsyncRoutes 用户能访问的路由中查找是否存在当前遍历的路由
      if (userAsyncRoutesStr.includes(curRoute.name as string)) {
        // 若存在，则继续查找 children 属性的孩子节点
        if (curRoute.children && curRoute.children.length > 0) {
          // 更新当前节点的孩子节点值为过滤后的数组
          curRoute.children = getUserAsyncRoutes(
            curRoute.children,
            userAsyncRoutesStr,
          )
        }

        return true // allAsyncRoutes.filter 函数的返回值
      }
    })
  }
  //#endregion --------------- 路由、菜单权限相关的业务处理 ---------------------

  //#region ------------------ 按钮权限相关的业务逻辑 -----------------------
  const btnsAuth = ref<string[]>([]) // btnsAuth 用于存储"当前用户的按钮权限"
  //#endregion --------------- 按钮权限相关的业务逻辑 -----------------------

  //#region ------------------ 获取用户数据、更新路由数据和按钮权限数据 --------------------
  // username 响应式数据指用户姓名；userAvatar 响应式数据指用户头像
  const username = ref<string>('')
  const userAvatar = ref<string>('')

  // getUserInfo 函数用于获取用户数据的方法
  const getUserInfo = async () => {
    try {
      // 获取用户信息（用户头像、姓名等信息）并存储在仓库当中
      const { code, data, message } = await reqUserInfo()

      // 如果用户信息获取成功，则存储用户的姓名和头像信息
      if (code === 200) {
        username.value = data.name
        userAvatar.value = data.avatar
        btnsAuth.value = data.buttons // 更新"当前用户的按钮权限"

        // 获取当前用户"可以访问"的"异步路由"
        const userAsyncRoutes = getUserAsyncRoutes(
          cloneDeep(asyncRoutes), // 使用深拷贝，防止修改 asyncRoutes 源数据
          data.routes,
        )

        // 更新当前用户"可以访问"的"总路由"，即需要渲染的"菜单路由"
        menuRoutes.value = [...constantRoutes, ...userAsyncRoutes, ...anyRoutes]

        // 由于 router/index.ts 中只注册了常量路由，因此这里需要动态追加"异步路由"和"任意路由"
        // 以数组字面量开头的代码前面一定要加 ; 符号
        ;[...userAsyncRoutes, ...anyRoutes].forEach((route) => {
          router.addRoute(route) // 动态添加"异步路由"和"任意路由"
          asyncRouteNames.value.push(route.name as string) // 记录当前用户的"异步路由"名称
        })

        return 'ok' // 获取用户信息成功，返回"成功"的 Promise 对象
      } else {
        // 请求失败，则返回失败的 Promise 对象
        return Promise.reject(new Error(message))
      }
    } catch (error) {
      console.log(error)
    }
  }
  //#endregion --------------- 获取用户数据、更新路由数据和按钮权限数据 ------------------

  // 暴露数据给外界使用
  return {
    token,
    userLogin,
    userLogout,
    username,
    userAvatar,
    getUserInfo,
    menuRoutes,
    btnsAuth,
  }
})
