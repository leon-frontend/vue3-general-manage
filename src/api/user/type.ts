// 用户登录请求需要携带参数的ts类型
export interface LoginFormData {
  username: string
  password: string
}

// 定义全部接口返回数据的公共 TS 类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义登录接口返回的数据类型
export interface LoginResponseData extends ResponseData {
  data: string
}

// 定义退出登录接口返回的数据类型
export interface LogoutResponseData extends ResponseData {
  data: null
}

// 定义获取用户信息接口返回的数据类型
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
