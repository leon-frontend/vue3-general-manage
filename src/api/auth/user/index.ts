// 统一管理"权限管理"中的"用户管理"相关的接口
import request from '@/utils/request'
import type {
  AssignRoleParam,
  GetAllRolesResData,
  GetAllUserAuthInfo,
  ResNullData,
  SingleUserAuthInfo,
} from './type'

// 定义相关的 API 地址
enum API {
  ALL_USER_URL = '/admin/acl/user/', // 获取全部已有用户信息的 API 地址
  ADD_USER_URL = '/admin/acl/user/save', // 新增用户信息的 API 地址
  UPDATE_USER_URL = '/admin/acl/user/update', // 更新已有用户信息的 API 地址
  ALL_ROLES_URL = '/admin/acl/user/toAssign/', // 根据用户获取"角色"数据的 API 地址
  ASSIGN_ROLE_URL = '/admin/acl/user/doAssignRole', // 根据用户分配"角色"数据的 API 地址
  DELETE_SINGLE_URL = '/admin/acl/user/remove/', // 根据 id 列表删除某个用户数据的 API 地址
  DELETE_BATCH_URL = '/admin/acl/user/batchRemove', // 根据 id 列表批量删除用户数据的 API 地址
}

// 获取全部已有用户信息的接口
export const reqAllUserAuthInfo = (
  pageNo: number,
  pageSize: number,
  username: string, // username 用于"搜索"功能，默认是空字符串
) =>
  request.get<null, GetAllUserAuthInfo>(
    API.ALL_USER_URL + `${pageNo}/${pageSize}?username=${username}`,
  )

// "新增"和"更新"用户信息的接口
export const reqAddOrUpdateUser = (userAuthInfo: SingleUserAuthInfo) => {
  // 如果 userAuthInfo 数据中存在 id 字段，则执行"修改用户信息"的操作
  if (userAuthInfo.id) {
    return request.put<SingleUserAuthInfo, ResNullData>(
      API.UPDATE_USER_URL,
      userAuthInfo,
    )
  } else {
    return request.post<SingleUserAuthInfo, ResNullData>(
      API.ADD_USER_URL,
      userAuthInfo,
    )
  }
}

// 根据用户获取"角色"数据的接口
export const reqGetAllRoles = (adminId: number) =>
  request.get<null, GetAllRolesResData>(API.ALL_ROLES_URL + adminId)

// 根据用户分配"角色"数据的接口
export const reqAssignRole = (assignRoleParam: AssignRoleParam) =>
  request.post<AssignRoleParam, ResNullData>(
    API.ASSIGN_ROLE_URL,
    assignRoleParam,
  )

// 根据 id 列表删除某个用户数据的接口
export const reqDeleteSingle = (userId: number) =>
  request.delete<null, ResNullData>(API.DELETE_SINGLE_URL + userId)

// 根据 id 列表批量删除用户数据的接口
export const reqDeleteBatch = (idList: number[]) =>
  request.delete<number[], ResNullData>(API.DELETE_BATCH_URL, { data: idList })
