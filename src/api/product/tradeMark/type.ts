// 定义全部接口返回数据的公共 TS 类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 单个品牌数据的 TS 类型
export interface SingleTradeMarkData {
  id?: string // 新增的品牌数据没有 id ，因为 id 是在后端生成的
  tmName: string
  logoUrl: string
}

// 获取所有品牌数据的接口的 TS 类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: SingleTradeMarkData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
