// 统一管理"权限管理"中的"菜单管理"相关的 TS 类型
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

// 单个菜单权限的 TS 类型
export interface SingleMenuPermission {
  id?: number
  createTime: string
  updateTime: string
  pid: number // 菜单的 id
  name: string
  code: string // 权限值
  toCode: string
  type: number
  status: null
  level: number // 标志当前"菜单权限"的层级
  children?: SingleMenuPermission[] // 子元素的类型（递归）
  select: boolean
}

// 获取全部菜单权限的接口的 TS 类型
export interface GetAllPermissionResData extends CommonResData {
  data: SingleMenuPermission[]
}

// 给某一级菜单"新增子菜单"或"更新"某个菜单的接口的形参的 TS 类型
export interface AddOrUpdateMenuParams {
  id?: number
  pid: number // 新增菜单所属父级菜单的 id
  name: string
  code: string // 权限值
  level: number // 标志当前"菜单权限"的层级
}
