// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
import { constantRoutes } from '@/router/routes'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { LoginFormData, userInfoResponseData } from '@/api/user/type'

/**
 * 使用组合式 API 创建 userStore 仓库：
 * 1. 使用 ref/reactive 定义的响应式数据就是 state 中的数据。
 * 2. 定义的函数就是 actions 中的方法。
 */
export const useUserStore = defineStore('User', () => {
  //#region ------------ 1. token 和用户登录相关的业务处理 ---------
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
    // 发送退出登录的请求
    const result = await reqLogout()

    // 当返回的状态是 200 时，表示退出登录成功
    if (result.code === 200) {
      // 清空仓库当中与当前用户想关的数据
      token.value = ''
      userName.value = ''
      userAvatar.value = ''

      localStorage.removeItem('TOKEN') // 清空 localStorage 中的 token 信息
      return 'ok' // 返回成功的 Promise ，表示退出成功
    } else {
      // 退出登录失败，则返回失败的 Promise 对象
      return Promise.reject(new Error(result.message))
    }
  }
  //#endregion ---------- 1. token 和用户登录相关的业务处理 ---------------

  //#region ------------- 2. 用户信息相关的业务处理 ---------------
  // userName 响应式数据指用户姓名；userAvatar 响应式数据指用户头像
  const userName = ref<string>('')
  const userAvatar = ref<string>('')

  // useInfo 函数用于获取用户信息的方法
  const getUserInfo = async () => {
    // 获取用户信息（用户头像、姓名等信息）并存储在仓库当中
    const result: userInfoResponseData = await reqUserInfo()

    // 如果用户信息获取成功，则存储用户的姓名和头像信息
    if (result.code === 200) {
      userName.value = result.data.name
      userAvatar.value = result.data.avatar

      return 'ok' // 获取用户信息成功，返回"成功"的 Promise 对象
    } else {
      // 请求失败，则返回失败的 Promise 对象
      return Promise.reject(new Error(result.message))
    }
  }
  //#endregion ---------- 2. 用户信息相关的业务处理 -------------

  //#region ------------- 3. 和路由相关的业务处理 ----------------
  const menuRoutes = reactive(constantRoutes) // 常量路由数据
  //#endregion --------- 3. 和路由相关的业务处理 ----------------

  // 暴露数据给外界使用
  return {
    token,
    userLogin,
    userLogout,
    userName,
    userAvatar,
    getUserInfo,
    menuRoutes,
  }
})
