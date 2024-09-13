// 统一管理 属性管理 模块的接口
import request from '@/utils/request'
import type {
  CategoryResponseData,
  AttrResponseData,
  SingleAttrData,
  ResponseNullData,
} from './type'

// 定义和 属性管理 相关的 API 地址
enum API {
  FIRST_CATEGORY_URL = '/admin/product/getCategory1', // 一级分类的 API 地址
  SECOND_CATEGORY_URL = '/admin/product/getCategory2/', // 二级分类的 API 地址
  THIRD_CATEGORY_URL = '/admin/product/getCategory3/', // 三级分类的 API 地址
  ATTRIBUTE_URL = '/admin/product/attrInfoList/', // 基于所有"分类"获取已有的属性名和属性值的 API 地址
  ADD_UPDATE_ATTRIBUTE_URL = '/admin/product/saveAttrInfo', // 新增或修改某个属性的 API 地址
  DELETE_ATTRIBUTE_URL = '/admin/product/deleteAttr/', // 删除某个属性的 API 地址
}

// 获取"一级分类"的接口
export const reqFirstCategory = () =>
  request.get<null, CategoryResponseData>(API.FIRST_CATEGORY_URL)

// 获取"二级分类"的接口
export const reqSecondCategory = (category1Id: number | string) =>
  request.get<null, CategoryResponseData>(API.SECOND_CATEGORY_URL + category1Id)

// 获取"三级分类"的接口
export const reqThirdCategory = (category2Id: number | string) =>
  request.get<null, CategoryResponseData>(API.THIRD_CATEGORY_URL + category2Id)

/**
 * 基于"一级分类"、"二级分类"和"三级分类"获取已有的属性名和属性值的接口
 * @param category1Id "一级分类"的 id 数据
 * @param category2Id "二级分类"的 id 数据
 * @param category3Id "三级分类"的 id 数据
 */
export const reqAttrData = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<null, AttrResponseData>(
    API.ATTRIBUTE_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

/**
 * 新增或修改某个属性的接口
 * @description 携带 id 相关数据时，表示修改某个已有属性；反之，表示新增属性
 */
export const reqAddOrUpdateAttr = (attrData: SingleAttrData) =>
  request.post<SingleAttrData, ResponseNullData>(
    API.ADD_UPDATE_ATTRIBUTE_URL,
    attrData,
  )

// 删除某个属性的接口
export const reqDeleteAttr = (attrId: number) =>
  request.delete<null, ResponseNullData>(API.DELETE_ATTRIBUTE_URL + attrId)
