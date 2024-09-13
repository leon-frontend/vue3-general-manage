<script setup lang="ts" name="Attr">
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import AttrTable from './components/AttrTable.vue'
import AddOrUpdateAttr from './components/AddOrUpdateAttr.vue'
import { useCategoryStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { reqAttrData } from '@/api/product/attr'
import type { AttrResponseData, SingleAttrData } from '@/api/product/attr/type'

// isShowTable 响应式数据用于控制表格的显示与隐藏
const isShowTable = ref<boolean>(true)

// updateIsShowTable 方法用于更新 isShowTable 的值，该方法给子组件使用
const updateIsShowTable = (isShow: boolean) => (isShowTable.value = isShow)

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

  // 调用 getAllAttrData 函数发送请求，获取所有的"属性名和属性值"数据
  // thirdCategoryId 的值可能为 ''，因为进行条件判断
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

  // 隐藏表格，显示"新增数据"的 HTML 结构
  isShowTable.value = false
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
    <Category :isShowTable="isShowTable" />

    <!-- 下方展示区域 -->
    <el-card style="margin-top: 20px">
      <!-- 表格展示数据的 HTML 代码 -->
      <div v-show="isShowTable">
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
          :updateIsShowTable="updateIsShowTable"
          :getAllAttrData="getAllAttrData"
        />
      </div>

      <!-- "添加属性"和"修改属性"的 HTML 代码 -->
      <div v-show="!isShowTable">
        <AddOrUpdateAttr
          :attrParams="attrParams"
          :updateIsShowTable="updateIsShowTable"
          :getAllAttrData="getAllAttrData"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
