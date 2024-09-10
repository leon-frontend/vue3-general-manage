// 统一管理用户相关的接口
import request from '@/utils/request'
import type {
  LoginFormData,
  LoginResponseData,
  userInfoResponseData,
  LogoutResponseData,
} from './type'

// 定义和用户相关的 API 地址
enum API {
  LOGIN_URL = '/admin/acl/index/login', // 用户登录
  LOGOUT_URL = '/admin/acl/index/logout', // 退出登录
  USERINFO_URL = '/admin/acl/index/info', // 获取用户信息
}

/**
 * 用户登录接口
 * @method request.post<T,R> 是一个泛型方法，其中 T 是请求体的类型，R 是响应体的类型
 */
export const reqLogin = (data: LoginFormData) =>
  request.post<LoginFormData, LoginResponseData>(API.LOGIN_URL, data)

// 获取用户信息的接口
export const reqUserInfo = () =>
  request.get<null, userInfoResponseData>(API.USERINFO_URL)

// 退出登录接口
export const reqLogout = () =>
  request.post<null, LogoutResponseData>(API.LOGOUT_URL)
