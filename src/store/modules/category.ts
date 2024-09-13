// 与 Category 组件相关的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  reqFirstCategory,
  reqSecondCategory,
  reqThirdCategory,
} from '@/api/product/attr'
import type {
  SingleCategoryData,
  CategoryResponseData,
} from '@/api/product/attr/type'

// 使用 defineStore 方法定义 useCategoryStore 小仓库
export const useCategoryStore = defineStore('Category', () => {
  //#region ---------------- "一级分类"相关的业务逻辑 --------------------
  // allFirstCategory 响应式数据用于保存所有的"一级分类"的数据
  const allFirstCategory = ref<SingleCategoryData[]>([])

  // fisrtCategoryId 用于收集"一级分类"选择框选中的值，即"一级分类"的 id 值
  const fisrtCategoryId = ref<number | string>('')

  // 封装获取"一级分类"数据的方法，并修改 allFirstCategory 响应式数据
  const getFirstCategory = async () => {
    // 发送请求获取"一级分类"数据
    const result: CategoryResponseData = await reqFirstCategory()

    // 当返回的响应码为 200 时，表示响应成功
    if (result.code === 200) {
      allFirstCategory.value = result.data
    }
  }
  //#endregion -------------- "一级分类"相关的业务逻辑 --------------------

  //#region ---------------- "二级分类"相关的业务逻辑 --------------------
  // allSecondCategory 响应式数据用于保存所有的"二级分类"的数据
  const allSecondCategory = ref<SingleCategoryData[]>([])

  // secondCategoryId 用于收集"二级分类"选择框选中的值，即"二级分类"的 id 值
  const secondCategoryId = ref<number | string>('')

  // 封装获取"二级分类"数据的方法，并修改 allSecondCategory 响应式数据
  const getSecondCategory = async () => {
    // 使用"一级分类"的 id 值发送获取"二级分类"数据的请求
    const result: CategoryResponseData = await reqSecondCategory(
      fisrtCategoryId.value,
    )

    // 当返回的响应码为 200 时，表示响应成功
    if (result.code === 200) {
      allSecondCategory.value = result.data
    }
  }
  //#endregion -------------- "二级分类"相关的业务逻辑 --------------------

  //#region ---------------- "三级分类"相关的业务逻辑 --------------------
  // allThirdCategory 响应式数据用于保存所有的"三级分类"的数据
  const allThirdCategory = ref<SingleCategoryData[]>([])

  // thirdCategoryId 用于收集"二级分类"选择框选中的值，即"二级分类"的 id 值
  const thirdCategoryId = ref<number | string>('')

  // 封装获取"三级分类"数据的方法，并修改 allThirdCategory 响应式数据
  const getThirdCategory = async () => {
    // 使用"一级分类"的 id 值发送获取"二级分类"数据的请求
    const result: CategoryResponseData = await reqThirdCategory(
      secondCategoryId.value,
    )

    // 当返回的响应码为 200 时，表示响应成功
    if (result.code === 200) {
      allThirdCategory.value = result.data
    }
  }
  //#endregion -------------- "三级分类"相关的业务逻辑 --------------------

  return {
    allFirstCategory,
    fisrtCategoryId,
    getFirstCategory,
    allSecondCategory,
    secondCategoryId,
    getSecondCategory,
    allThirdCategory,
    thirdCategoryId,
    getThirdCategory,
  }
})
