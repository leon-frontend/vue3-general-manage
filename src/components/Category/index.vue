<script setup lang="ts" name="Category">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import type { SceneShiftType as AttrSceneType } from '@/views/Product/Attr/index.vue'
import type { SceneShiftType as SpuSceneType } from '@/views/Product/SPU/index.vue'

// 定义父组件传递过来的值的 TS 类型
type Props = {
  sceneShift: AttrSceneType | SpuSceneType
}

// 使用 defineProps 接收父组件传递过来的值
defineProps<Props>()

// 引入 categoryStore 小仓库，使用和"分类"相关的共享数据，并进行响应式解构
const categoryStore = useCategoryStore()

// 响应式解构 categoryStore 小仓库中的数据
const {
  allFirstCategory,
  fisrtCategoryId,
  allSecondCategory,
  secondCategoryId,
  allThirdCategory,
  thirdCategoryId,
} = storeToRefs(categoryStore)

// 普通解构 categoryStore 小仓库中的方法
const { getFirstCategory, getSecondCategory, getThirdCategory } = categoryStore

// 组件挂载到页面中时，触发其回调函数
onMounted(() => {
  // 使用 categoryStore 仓库中的 getFirstCategory 方法，发送请求获取"一级分类"数据
  getFirstCategory()
})

/**
 * changeCategoryItem 函数会在"分类"选择框中的值发生变化时触发
 * @param categoryLevel 的值表示触发该函数的是"几级分类"
 */
const changeCategoryItem = (categoryLevel: 1 | 2) => {
  if (categoryLevel === 1) {
    // 当"一级分类"的值发生变化时，清空"二级分类"和"三级分类"选择框中展示的数据，以及"三级分类"的数据
    secondCategoryId.value = ''
    thirdCategoryId.value = ''
    allThirdCategory.value = []

    // 当"一级分类"的值发生变化时，发送请求获取"二级分类"的数据
    getSecondCategory()
  } else {
    // 当"二级分类"的值发生变化时，清空"三级分类"选择框中展示的数据
    thirdCategoryId.value = ''

    // 当"二级分类"的值发生变化时，发送请求获取"三级分类"的数据。
    getThirdCategory()
  }
}
</script>

<template>
  <el-card>
    <el-form inline class="attr-form">
      <!-- 一级分类 -->
      <el-form-item label="一级分类：">
        <!-- 当页面展示的是"添加属性"和"修改属性"的 HTML 结构时，禁用选择框 -->
        <el-select
          :disabled="sceneShift !== 'AttrTable' && sceneShift !== 'SpuTable'"
          v-model="fisrtCategoryId"
          @change="changeCategoryItem(1)"
        >
          <!-- 使用 v-for 对 el-option 组件进行列表渲染，并收集每个 option 的值 -->
          <el-option
            v-for="firstCategory in allFirstCategory"
            :key="firstCategory.id"
            :label="firstCategory.name"
            :value="firstCategory.id"
          />
        </el-select>
      </el-form-item>
      <!-- 二级分类 -->
      <el-form-item label="二级分类：">
        <el-select
          :disabled="sceneShift !== 'AttrTable' && sceneShift !== 'SpuTable'"
          v-model="secondCategoryId"
          @change="changeCategoryItem(2)"
        >
          <!-- 使用 v-for 对 el-option 组件进行列表渲染，并收集每个 option 的值 -->
          <el-option
            v-for="secondCategory in allSecondCategory"
            :key="secondCategory.id"
            :label="secondCategory.name"
            :value="secondCategory.id"
          />
        </el-select>
      </el-form-item>
      <!-- 三级分类 -->
      <el-form-item label="三级分类：">
        <el-select
          :disabled="sceneShift !== 'AttrTable' && sceneShift !== 'SpuTable'"
          v-model="thirdCategoryId"
        >
          <el-option
            v-for="thirdCategory in allThirdCategory"
            :key="thirdCategory.id"
            :label="thirdCategory.name"
            :value="thirdCategory.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
.attr-form .el-select {
  --el-select-width: 250px;
}
</style>
