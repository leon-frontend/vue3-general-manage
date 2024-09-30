// 统一定义 SPU管理 模块的 TS 类型
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

// 单个 SPU 数据的 TS 类型
export type SingleSpuData = {
  id?: number // 用于新增 SPU 的 API 时，是不带 id 数据的
  tmId: number | string // 表示 SPU 中某个品牌的 id 数据
  spuName: string
  description: string // 表示 SPU 的描述数据
  category3Id: number | string
  // 表示 SPU 的"图片"数据。其中，当在"表格"中展示数据时，是不需要"图片"数据的，所以可以为 null
  spuImageList: null | SingleSpuImg[]
  // 表示 SPU 的"销售属性"数据。其中，当在"表格"中展示数据时，是不需要"销售属性"数据的，所以可以为 null
  spuSaleAttrList: null | SingleSaleAttr[]
}

// 获取"某个三级分类"下的 SPU 数据接口的 TS 类型
export interface GetSpuResData extends CommonResData {
  data: {
    records: SingleSpuData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

//#region ------------------ 品牌数据 ------------------------
// 单个"新增"或"编辑" SPU 页面中的"品牌数据"的 TS 类型
export type SingleSpuBrand = {
  id: number
  tmName: string
  logoUrl: string
}

// 获取"新增"或"编辑" SPU 页面中的品牌数据(选择框中展示)的接口的 TS 类型
export interface spuBrandsResData extends CommonResData {
  data: SingleSpuBrand[]
}
//#endregion --------------- 品牌数据 ------------------------

//#region ------------------ 图片数据 ------------------------
// 某个 SPU 下的"单个图片"数据的 TS 类型
export type SingleSpuImg = {
  id?: number // 用于新增 SPU 的 API 时，是不带 id 数据的
  spuId?: number // 用于新增 SPU 的 API 时，是不带 id 数据的
  imgName: string
  imgUrl: string
}

// 获取某个 SPU 下的所有"商品图片"的接口的 TS 类型
export interface spuImgsResData extends CommonResData {
  data: SingleSpuImg[]
}
//#endregion --------------- 图片数据 ------------------------

//#region ------------------ 销售属性数据 ------------------------
// 某个 SPU 下的"单个销售属性值"数据的 TS 类型
export type SingleSaleAttrValue = {
  id?: number // 新增属性值是不用带 id 数据
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 某个 SPU 下的"单个销售属性和属性值"数据的 TS 类型
export type SingleSaleAttr = {
  id?: number // 新增属性值是不用带 id 数据
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SingleSaleAttrValue[]
  isEditMode?: boolean
  newSaleAttrValue?: string // 新添加的"销售属性值"
  saleIdAndValueId?: string // 在"SPU 管理"页面中的"新增 SKU"场景中，保存销售属性和属性值的 id
}

// 获取某个 SPU 下的所有"销售属性"的接口的 TS 类型
export interface spuSaleAttrsResData extends CommonResData {
  data: SingleSaleAttr[]
}
//#endregion ------------------ 销售属性数据 ------------------------

//#region ------------------ 所有销售属性的属性名 ------------------------
// 某个 SPU 下的"单个销售属性的属性名"数据的 TS 类型
export type SingleSaleAttrName = {
  id: number
  name: string
}

// 获取某个 SPU 下的"所有销售属性的属性名"的接口的 TS 类型
export interface spuSaleAttrNamesResData extends CommonResData {
  data: SingleSaleAttrName[]
}
//#endregion --------------- 所有销售属性的属性名 ------------------------

//#region ------------------ 新增 SKU 数据的接口 ------------------------
// 某个 SKU 平台属性值的 TS 类型
export type skuAttrValue = {
  attrId: number | string // 属性值所属的平台属性的 id
  valueId: number | string // 属性值的 id
}

// 某个 SKU 销售属性值的 TS 类型
export type skuSaleAttrValue = {
  saleAttrId: number | string // 销售属性值所属的销售属性的 id
  saleAttrValueId: number | string // 销售属性值的 id
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
}

// 获取某个 SPU 下的所有 SKU 数据的接口的 TS 类型
export interface GetSkuResData extends CommonResData {
  data: SingleSkuData[]
}
//#endregion --------------- 新增 SKU 数据的接口 ------------------------
