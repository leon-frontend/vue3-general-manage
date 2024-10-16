// 统一管理"权限管理"中的"菜单管理"相关的接口
import request from '@/utils/request'
import type {
  AddOrUpdateMenuParams,
  GetAllPermissionResData,
  ResNullData,
} from './type'

// 定义相关的 API 地址
enum API {
  ALL_MENU_PERMISSION_URL = '/admin/acl/permission', // 获取全部菜单权限的 API 地址
  ADD_MENU_PERMISSION_URL = '/admin/acl/permission/save', // 给某一级菜单"新增"子菜单的 API 地址
  UPDATE_MENU_PERMISSION_URL = '/admin/acl/permission/update', // "更新"某个菜单的 API 地址
  DELETE_MENU_PERMISSION_URL = '/admin/acl/permission/remove/', // 递归删除某个"菜单权限"数据的 API 地址
}

// 获取全部菜单权限的接口
export const reqAllMenuPermission = () =>
  request.get<null, GetAllPermissionResData>(API.ALL_MENU_PERMISSION_URL)

// 给某一级菜单"新增子菜单"或"更新"某个菜单的接口
export const reqAddOrUpdateMenu = (menuPermission: AddOrUpdateMenuParams) => {
  // 若 menuPermission.id 存在，则发送"更新"某个菜单的请求
  if (menuPermission.id)
    return request.put<null, ResNullData>(
      API.UPDATE_MENU_PERMISSION_URL,
      menuPermission,
    )
  else
    return request.post<null, ResNullData>(
      API.ADD_MENU_PERMISSION_URL,
      menuPermission,
    )
}

// 递归删除某个"菜单权限"数据的接口
export const reqDeleteMenuPermission = (menuId: number) =>
  request.delete<null, ResNullData>(API.DELETE_MENU_PERMISSION_URL + menuId)
