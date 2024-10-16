// 统一管理"权限管理"中的"角色管理"相关的接口
import request from '@/utils/request'
import type {
  GetAllPermissionResData,
  GetAllRolesResData,
  ResNullData,
  SingleRoleData,
} from './type'

// 定义相关的 API 地址
enum API {
  All_ROLES_URL = '/admin/acl/role/', // 获取全部已有角色数据的 API 地址
  ADD_ROLE_URL = '/admin/acl/role/save', // 新增"角色"数据的 API 地址
  UPDATE_ROLE_URL = '/admin/acl/role/update', // 更新已有"角色"数据的 API 地址
  ALL_PERMISSION_URL = '/admin/acl/permission/toAssign/', // 根据角色获取菜单权限的 API 地址
  ASSIGN_PERMISSION_URL = '/admin/acl/permission/doAssign', // 给角色分配权限的 API 地址
  DELETE_ROLE_URL = '/admin/acl/role/remove/', // 删除"角色"数据的 API 地址
}

// 获取全部已有角色数据的接口
export const reqAllRolesData = (
  pageNo: number,
  pageSize: number,
  roleName: string, // 该字段用于"搜索"功能
) =>
  request.get<null, GetAllRolesResData>(
    API.All_ROLES_URL + `${pageNo}/${pageSize}?roleName=${roleName}`,
  )

// "新增"和"更新"角色数据的接口
export const reqAddOrUpdateRole = (roleData: SingleRoleData) => {
  // 如果 roleData 数据中存在 id 字段，则执行"修改角色数据"的操作
  if (roleData.id) {
    return request.put<SingleRoleData, ResNullData>(
      API.UPDATE_ROLE_URL,
      roleData,
    )
  } else {
    return request.post<SingleRoleData, ResNullData>(API.ADD_ROLE_URL, roleData)
  }
}

// 根据角色 id 获取菜单权限的接口
export const reqAllPermissionData = (roleId: number) =>
  request.get<null, GetAllPermissionResData>(API.ALL_PERMISSION_URL + roleId)

// 给角色分配权限的接口
export const reqAssignPermission = (roleId: number, permissionId: number[]) =>
  request.post<null, ResNullData>(
    API.ASSIGN_PERMISSION_URL +
      `?roleId=${roleId}&permissionId=${permissionId}`,
  )

// 删除"角色"数据的接口
export const reqDeleteRole = (roleId: number) =>
  request.delete<null, ResNullData>(API.DELETE_ROLE_URL + roleId)
