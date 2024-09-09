// 1.1 用户登录请求需要携带参数的ts类型
export interface LoginForm {
  username: string
  password: string
}
// 1.2 用户登录请求返回的数据类型
interface DataType {
  token?: string // token只会在用户登录成功时出现
  message?: string // message只会在用户登录失败时出现
}
export interface LoginResponseData {
  code: number
  data: DataType
}

// 2. 定义服务器返回用户信息的数据类型
export interface CheckUser {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}

export interface UserResponseData {
  code: number
  data: { checkUser: CheckUser }
}
