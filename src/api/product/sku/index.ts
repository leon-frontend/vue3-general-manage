// 统一管理"SKU 管理"模块的接口
import request from '@/utils/request'
import type {
  GetSkuDetailResData,
  GetSkuListResData,
  ResponseNullData,
} from './type'

// 定义和"SKU 管理"相关的 API 地址
enum API {
  SKU_LIST_URL = '/admin/product/list/', // 获取 SKU 数据列表的 API 地址
  SKU_CANCEL_URL = '/admin/product/cancelSale/', // 下架某个 SKU 商品的 API 地址
  SKU_ONSALE_URL = '/admin/product/onSale/', // 上架某个 SKU 商品的 API 地址
  GET_SKU_DETAIL_URL = '/admin/product/getSkuInfo/', // 获取某个 SKU 商品的详细信息的 API 地址
  DELETE_SKU_URL = '/admin/product/deleteSku/', // 删除某个 SKU 商品的 API 地址
}

// 获取 SKU 数据列表的接口
export const reqGetSkuList = (pageNo: number, pageSize: number) =>
  request.get<null, GetSkuListResData>(
    API.SKU_LIST_URL + `${pageNo}/${pageSize}`,
  )

// 上架某个 SKU 商品的接口
export const reqOnSaleSku = (skuId: number) =>
  request.get<null, ResponseNullData>(API.SKU_ONSALE_URL + skuId)

// 下架某个 SKU 商品的接口
export const reqCancelSku = (skuId: number) =>
  request.get<null, ResponseNullData>(API.SKU_CANCEL_URL + skuId)

// 获取某个 SKU 商品的详细信息的接口
export const reqGetSkuDetail = (skuId: number) =>
  request.get<null, GetSkuDetailResData>(API.GET_SKU_DETAIL_URL + skuId)

// 删除某个 SKU 商品的接口
export const reqDeleteSku = (skuId: number) =>
  request.delete<null, ResponseNullData>(API.DELETE_SKU_URL + skuId)
