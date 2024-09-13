// 统一管理 品牌管理 模块的接口
import request from '@/utils/request'
import type {
  TradeMarkResponseData,
  SingleTradeMarkData,
  TradeMarkResponseNullData,
} from './type'

// 定义和品牌管理相关的 API 地址
enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/', // 获取已有品牌数据
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save', // 添加一个新的品牌数据
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update', // 更新一个已有品牌数据
  DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove/', // 删除某个已有品牌数据
}

/**
 * 获取已有品牌数据的接口（取决于当前页和每页展示的数据数量）
 * @param pageNo 表示想要获取的页数
 * @param pageSize 表示每页展示的数据数量
 */
export const reqHasTradeMark = (pageNo: number, pageSize: number) =>
  request.get<null, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${pageNo}/${pageSize}`,
  )

/**
 * "添加新的品牌数据"与"修改已有品牌数据"的接口
 * @param tradeMarkData 单个 trademark 数据
 * @description 若 tradeMarkData 存在 id 数据，则是"添加新的品牌数据"；反之，则是"修改已有品牌数据"。
 */
export const reqAddOrUpdateTradeMark = (tradeMarkData: SingleTradeMarkData) => {
  // 判断 tradeMarkData 中是否存在 id 数据
  if (tradeMarkData.id) {
    return request.put<SingleTradeMarkData, TradeMarkResponseNullData>(
      API.UPDATE_TRADEMARK_URL,
      tradeMarkData,
    )
  } else {
    return request.post<SingleTradeMarkData, TradeMarkResponseNullData>(
      API.ADD_TRADEMARK_URL,
      tradeMarkData,
    )
  }
}

// 删除某个已有品牌数据的接口
export const reqDeleteTradeMark = (id: number) =>
  request.delete<null, TradeMarkResponseNullData>(API.DELETE_TRADEMARK_URL + id)
