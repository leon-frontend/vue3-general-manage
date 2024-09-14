// 统一管理 SPU管理 模块的接口
import request from '@/utils/request'
import type {
  SingleSpuData,
  GetSpuResponseData,
  spuBrandsResponseData,
  spuImgsResponseData,
  spuSaleAttrsResponseData,
  spuSaleAttrNamesResponseData,
  ResponseNullData,
} from './type'

// 定义和 SPU管理 相关的 API 地址
enum API {
  SPU_URL = '/admin/product/', // 获取 SPU 数据的 API 地址
  SPU_BRANDS_URL = '/admin/product/baseTrademark/getTrademarkList', // 获取某个 SPU 下的所有"品牌数据"(选择框中展示)
  SPU_IMGS_URL = '/admin/product/spuImageList/', // 获取某个 SPU 下的所有"商品图片数据"的 API 地址
  SPU_SALE_ATTRS = '/admin/product/spuSaleAttrList/', // 获取某个 SPU 下的所有"销售属性"的 API 地址
  SPU_SALE_ATTRNAMES = '/admin/product/baseSaleAttrList', // 获取某个 SPU 下的"所有销售属性的属性名"的 API 地址
  ADD_SPU_URL = '/admin/product/saveSpuInfo', // 新增 SPU 数据的 API 地址
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo', // 更新已有的 SPU 数据的 API 地址
}

// 获取"某个三级分类"下的 SPU 数据的接口
export const reqSpuData = (
  pageNo: number,
  pageSize: number,
  category3Id: number | string,
) =>
  request.get<null, GetSpuResponseData>(
    API.SPU_URL + `${pageNo}/${pageSize}?category3Id=${category3Id}`,
  )

// 获取某个 SPU 下的所有"品牌数据"(选择框中展示)的接口
export const reqSpuBrands = () =>
  request.get<null, spuBrandsResponseData>(API.SPU_BRANDS_URL)

// 获取某个 SPU 下的所有"商品图片"的接口
export const reqSpuImgs = (spuId: number) =>
  request.get<null, spuImgsResponseData>(API.SPU_IMGS_URL + spuId)

// 获取某个 SPU 下的所有"销售属性"的接口
export const reqSpuSaleAttrs = (spuId: number) =>
  request.get<null, spuSaleAttrsResponseData>(API.SPU_SALE_ATTRS + spuId)

// 获取某个 SPU 下的所有"销售属性的属性名"的接口
export const reqSpuSaleAttrNames = () =>
  request.get<null, spuSaleAttrNamesResponseData>(API.SPU_SALE_ATTRNAMES)

// "新增"或"编辑" SPU 数据的接口
export const reqAddOrUpdateSpu = (completeSpuData: SingleSpuData) => {
  // 如果 newSpuData 数据中存在 id 信息，则发送"更新 SPU 数据"的请求；反之，发送"新增 SPU 数据"的请求
  completeSpuData.id
    ? request.post<SingleSpuData, ResponseNullData>(
        API.ADD_SPU_URL,
        completeSpuData,
      )
    : request.post<SingleSpuData, ResponseNullData>(
        API.UPDATE_SPU_URL,
        completeSpuData,
      )
}
