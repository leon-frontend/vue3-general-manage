// 统一定义 属性管理 模块的 TS 类型
// 定义全部接口返回数据的公共 TS 类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 单个 "一级分类" | "二级分类" | "三级分类" 数据的 TS 类型
export type SingleCategoryData = {
  id: number
  name: string
  category1Id?: number // "二级分类"数据才会有该属性
  category2Id?: number // "三级分类"数据才会有该属性
}

// 获取"一级分类" | "二级分类" | "三级分类" 数据的接口的 TS 类型
export interface CategoryResponseData extends ResponseData {
  data: SingleCategoryData[]
}

// 定义单个"属性值"的 TS 类型
export type SingleAttrValue = {
  id?: number // 用于新增属性 API 时，是不带 id 数据的
  valueName: string
  attrId?: number // 用于新增属性 API 时，是不带 id 数据的
  isEditMode?: boolean // isEditMode 用于控制"属性值名称"列中的"编辑"模式和"查看"模式的切换
}

// 定义单个"属性名"和"属性值"的 TS 类型
export type SingleAttrData = {
  id?: number // 用于新增属性 API 时，是不带 id 数据的
  attrName: string
  categoryId: number | string // 起始值为空字符串
  categoryLevel: number
  attrValueList: SingleAttrValue[]
}

// 基于"一级分类"、"二级分类"和"三级分类"获取已有的属性名和属性值的接口的 TS 类型
export interface AttrResponseData extends ResponseData {
  data: SingleAttrData[]
}

// 定义返回的 data 值为 null 的数据类型，响应成功返回 null；响应失败返回错误信息
export interface ResponseNullData extends ResponseData {
  data: null | string
}
