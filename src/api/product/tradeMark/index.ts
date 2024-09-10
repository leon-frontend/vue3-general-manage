// 统一管理 品牌管理 模块的接口
import request from '@/utils/request'
import type { TradeMarkResponseData } from './type'

// 定义和品牌管理相关的 API 地址
enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/', // 获取已有品牌数据
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
