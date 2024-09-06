// 统一管理用户相关的接口
import request from '@/utils/request'
import type { LoginForm, LoginResponseData, UserResponseData } from './type'

enum API {
  LOGIN_URL = '/user/login ', // 用户登录
  USERINFO_URL = 'user/info', // 获取用户信息
}

// 1. 向外暴露用户登录的请求函数
// request.post<T, R> 是一个泛型方法，其中 T 是请求体的类型，R 是响应体的类型
export const reqLogin = (data: LoginForm) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data)

// 2. 向外暴露获取用户信息的请求函数
// request.get<T, R> 是一个泛型方法，其中 T 是请求体的类型，R 是响应体的类型
export const reqUserInfo = () =>
  request.get<any, UserResponseData>(API.USERINFO_URL)
