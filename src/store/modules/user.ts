// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import { reactive, ref } from 'vue'
import type { LoginForm, LoginResponseData } from '@/api/user/type' // 引入ts数据类型
// @/utils/token.ts文件封装本地存储数据与读取数据的方法
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
// 引入常量路由，将路由规则放入仓库中，方便组件根据路由动态生成数据
import { constantRoutes } from '@/router/routes'

export const useUserStore = defineStore('User', () => {
  //#region ---------- 和 token & 发请求相关的业务处理 -------------  
  /**
   * 1. 使用 ref/reactive 定义的响应式数据就是 state 中的数据。
   * token 是用户的唯一标识，并且实现localStorage的持久化。
   * localStorage.getItem('TOKEN') 的默认值是 null。
   * <string | null> 对 localStorage.getItem('TOKEN') 的类型进行限制。
   */
  const token = ref<string | null>(GET_TOKEN())

  // 2. 定义的函数就是actions中的方法
  // userLogin是用户登陆时调用的方法
  const userLogin = async (data: LoginForm) => {
    const result: LoginResponseData = await reqLogin(data)

    // 登录成功，则返回成功的Promise，并处理token
    if (result.code === 200) {
      // 将登陆成功后的 token 存到 pinia 中
      token.value = result.data.token as string

      // 将用户的token存在localStorage中实现持久化
      SET_TOKEN(result.data.token as string)

      // 保证返回成功状态的Promise对象
      return 'ok' 
    } else {
      // 2.请求失败，则返回失败的Promise，并且弹出失败信息
      return Promise.reject(new Error(result.data.message))
    }
  }
  //#endregion --------- 和token&发请求相关的业务处理 ---------------
  
  //#region ------------ 和路由相关的业务处理 ----------------
  const menuRoutes = reactive(constantRoutes) // 常量路由数据
  //#endregion --------- 和路由相关的业务处理 ----------------

  // 暴露数据给外界使用
  return { token, userLogin, menuRoutes }
})
