// 统一管理"权限管理"中的"用户管理"相关的 TS 类型
// 定义全部接口返回数据的公共 TS 类型
export interface CommonResData {
  code: number
  message: string
  ok: boolean
}

// 定义返回的 data 值为 null 的数据类型，响应成功返回 null；响应失败返回错误信息
export interface ResNullData extends CommonResData {
  data: null | string
}

// 单个用户信息的 TS 类型
export interface SingleUserAuthInfo {
  id?: number // 新增用户信息时，不需要 id 信息
  createTime?: string
  updateTime?: string
  username: string
  name: string
  password: string
  phone?: null
  roleName?: string
}

// 获取全部已有用户信息的接口的 TS 类型
export interface GetAllUserAuthInfo extends CommonResData {
  data: {
    records: SingleUserAuthInfo[]
    total: number
    size: number
    current: number
    pages: number
  }
}

// 单个"角色"数据的 TS 类型
export interface SingleRole {
  id: number
  createTime: string
  updateTime: string
  roleName: string
  remark: null
}

// 根据用户获取"角色"数据的接口的 TS 类型
export interface GetAllRolesResData extends CommonResData {
  data: {
    assignRoles: SingleRole[]
    allRolesList: SingleRole[]
  }
}

// 定义 reqAssignRole(分配角色) 请求的形参的 TS 的类型
export interface AssignRoleParam {
  roleIdList: number[]
  userId: number
}
