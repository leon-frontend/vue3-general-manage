// 统一管理"权限管理"中的"角色管理"相关的 TS 类型
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

// 单个"角色"数据的 TS 类型
export interface SingleRoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}

// 获取全部"角色"数据的接口的 TS 类型
export interface GetAllRolesResData extends CommonResData {
  data: {
    records: SingleRoleData[]
    total: number
    size: number
    current: number
    pages: number
  }
}

// 单个菜单权限的 TS 类型
export interface SingleMenuPermission {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number // 标志当前"菜单权限"的所属层级
  children?: SingleMenuPermission[] // 子元素的类型（递归）
  select: boolean
}

// 根据角色 id 获取菜单权限的接口的 TS 类型
export interface GetAllPermissionResData extends CommonResData {
  data: SingleMenuPermission[]
}
