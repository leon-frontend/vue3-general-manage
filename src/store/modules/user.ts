// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import { ref } from 'vue'
import type { LoginForm, LoginResponseData } from '@/api/user/type' // 引入ts数据类型
// @/utils/token.ts文件封装本地存储数据与读取数据的方法
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'

export const useUserStore = defineStore('User', () => {
  // 1. 使用 ref/reactive 定义的响应式数据就是 state 中的数据
  // token是用户的唯一标识，并且实现localStorage的持久化
  // localStorage.getItem('TOKEN')的默认值是null
  // <string | null>对localStorage.getItem('TOKEN')的类型进行限制
  let token = ref<string | null>(GET_TOKEN())

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
      return 'ok' // 保证返回成功状态的Promise对象
    } else {
      // 2.请求失败，则返回失败的Promise，并且弹出失败信息
      return Promise.reject(new Error(result.data.message))
    }
  }

  // 3. 定义的computed函数就是 getters 配置项

  return { token, userLogin }
})
