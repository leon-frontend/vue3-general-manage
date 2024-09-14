<script setup lang="ts" name="Attr">
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import AttrTable from './components/AttrTable.vue'
import AddOrUpdateAttr from './components/AddOrUpdateAttr.vue'
import { useCategoryStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { reqAttrData } from '@/api/product/attr'
import type { AttrResponseData, SingleAttrData } from '@/api/product/attr/type'

// 定义 sceneShift 数据(场景切换)的 TS 类型
export type SceneShiftType = 'AttrTable' | 'AddOrUpdateAttr'

/**
 * sceneShift 响应式数据用于控制"场景"切换：
 *    1. 值为 AttrTable 时，表示展示表格界面
 *    2. 值为 AddOrUpdateAttr 时，表示展示"新增"和"编辑"属性时的界面
 */
const sceneShift = ref<SceneShiftType>('AttrTable')

// updateSceneShift 方法用于更新 sceneShift 的值，该方法给子组件使用
const changeScene = (sceneStr: SceneShiftType) => {
  sceneShift.value = sceneStr
}

//#region ------------------- 表格"数据展示"的相关业务逻辑 ---------------------
// 引入 categoryStore 小仓库，使用和"分类"相关的共享数据，并进行响应式解构
const categoryStore = useCategoryStore()

// 响应式解构 categoryStore 小仓库中的数据
const { fisrtCategoryId, secondCategoryId, thirdCategoryId } =
  storeToRefs(categoryStore)

// Attr 路由组件销毁之前，清空本次添加的"分类"级别的相关数据，避免下次进入组件时还展示上次填写的数据
// 即清空 categoryStore 小仓库中的"分类级别"相关的数据
onBeforeUnmount(() => categoryStore.$reset())

// allAttrData 响应式数据用于存储所有的"属性名和属性值"数据
const allAttrData = ref<SingleAttrData[]>([])

// getAttrData 函数用于获取所有的"属性名和属性值"数据
const getAllAttrData = async () => {
  try {
    // 使用所有级别的 id 数据，发送获取所有"属性名和属性值"的请求
    const result: AttrResponseData = await reqAttrData(
      fisrtCategoryId.value,
      secondCategoryId.value,
      thirdCategoryId.value,
    )

    // 更新 allAttrData 响应式数据
    allAttrData.value = result.data
  } catch (error) {
    console.log(error)
  }
}

// 使用 watch 监听"三级分类" 的 id 数据的变化
watch(thirdCategoryId, (newValue) => {
  // "三级分类"的 id 发生变化后，清空表格展示的数据
  allAttrData.value = []

  // 调用 getAllAttrData 函数发送请求，获取"某个三级分类"下所有的"属性名和属性值"数据
  // thirdCategoryId 的值可能为 ''，因此进行条件判断，值为非空时才发送请求
  newValue && getAllAttrData()
})
//#endregion ---------------- 表格"数据展示"的相关业务逻辑 -------------------

// handleAddBtn 函数会在点击表格中的"添加属性"按钮时触发
const handleAddBtn = () => {
  // 显示"新增数据"的 HTML 结构之前，清空之前填写的数据（数据初始化），并且设置"三级分类"的 id 数据
  Object.assign(attrParams, {
    attrName: '', // 新增属性的名字
    attrValueList: [], // 属性值数组
    categoryId: thirdCategoryId.value, // 所属分类的 id
    categoryLevel: 3, // 所属分类的等级
  })

  // 切换为显示""新增"和"编辑"属性时的界面"的场景
  sceneShift.value = 'AddOrUpdateAttr'
}

//#region ----------------- "添加属性"和"修改属性"相关的业务逻辑 ------------------
// attrParams 用于收集"添加属性"或"修改属性"的新数据，作为 reqAddOrUpdateAttr 请求的参数
const attrParams = reactive<SingleAttrData>({
  attrName: '', // 新增属性的名字
  attrValueList: [], // 属性值数组
  categoryId: '', // 所属分类的 id
  categoryLevel: 3, // 所属分类的等级
})
//#endregion -------------- "添加属性"和"修改属性"相关的业务逻辑 ------------------
</script>

<template>
  <div>
    <!-- 上方"选择分类"的三个选择框，Category 可以直接使用，因为进行了全局注册 -->
    <Category :sceneShift="sceneShift" />

    <!-- 下方展示区域 -->
    <el-card style="margin-top: 20px">
      <!-- 表格展示数据的 HTML 代码 -->
      <div v-show="sceneShift === 'AttrTable'">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!thirdCategoryId"
          @click="handleAddBtn"
        >
          添加属性
        </el-button>

        <!-- 表格组件 -->
        <AttrTable
          :allAttrData="allAttrData"
          :attrParams="attrParams"
          :getAllAttrData="getAllAttrData"
          @change-scene="changeScene"
        />
      </div>

      <!-- "添加属性"和"修改属性"的 HTML 代码 -->
      <div v-show="sceneShift === 'AddOrUpdateAttr'">
        <AddOrUpdateAttr
          :attrParams="attrParams"
          :getAllAttrData="getAllAttrData"
          @change-scene="changeScene"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
