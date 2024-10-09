// 统一定义"SKU 管理"模块的 TS 类型
// 定义全部接口返回数据的公共 TS 类型
export interface CommonResData {
  code: number
  message: string
  ok: boolean
}

// 定义返回的 data 值为 null 的数据类型，响应成功返回 null；响应失败返回错误信息
export interface ResponseNullData extends CommonResData {
  data: null | string
}

// 某个 SKU 平台属性值的 TS 类型
export type skuAttrValue = {
  id?: number
  valueName?: string
  attrId: number | string // 属性值所属的平台属性的 id
  valueId: number | string // 属性值的 id
}

// 某个 SKU 销售属性值的 TS 类型
export type skuSaleAttrValue = {
  id?: number
  saleAttrName?: string
  saleAttrId: number | string // 销售属性值所属的销售属性的 id
  saleAttrValueId: number | string // 销售属性值的 id
}

// skuImage 表示某个 SKU 商品详情的图片信息
export type skuImage = {
  id: string
  imgName: string
  imgUrl: string
  isDefault: string
  skuId: number
  spuImgId: number
}

// 某个 SKU 完整数据的 TS 类型
export interface SingleSkuData {
  category3Id: number | string // 三级分类 id
  spuId: number | string // 所属 SPU 的 id
  tmId: number | string // 所属 SPU 的品牌 id
  skuName: string // SKU 的名称
  price: number | string // SKU 的价格
  weight: string // SKU 的重量
  skuDesc: string // SKU 的描述
  skuAttrValueList: skuAttrValue[] // 平台属性值
  skuSaleAttrValueList: skuSaleAttrValue[] // 销售属性值
  skuDefaultImg: string // sku 的默认图片地址
  isSale?: number // 表示 SKU 商品是否上架，1 表示已上架；0 表示没有上架
  id?: number
  skuImageList?: skuImage[]
}

// 获取所有 SKU 数据列表的接口的 TS 类型
export interface GetSkuListResData extends CommonResData {
  data: {
    records: SingleSkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取某个 SKU 商品的详细信息的 TS 类型
export interface GetSkuDetailResData extends CommonResData {
  data: SingleSkuData
}
