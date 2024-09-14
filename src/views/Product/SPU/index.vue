<script setup lang="ts" name="SPU">
import { ref, watch } from 'vue'
import AddOrUpdateSpu from './components/AddOrUpdateSpu.vue'
import ViewSkuList from './components/ViewSkuList.vue'
import { reqSpuData } from '@/api/product/spu'
import { useCategoryStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import type { SingleSpuData, GetSpuResponseData } from '@/api/product/spu/type'

// 定义 sceneShift 数据(场景切换)的 TS 类型
export type SceneShiftType = 'SpuTable' | 'AddOrUpdateSpu' | 'ViewSkuList'

/**
 * sceneShift 响应式数据用于控制"场景"切换：
 *    1. 值为 SpuTable 时，表示展示表格界面
 *    2. 值为 AddOrUpdateSpu 时，表示展示"新增"和"编辑" SPU 时的界面
 *    3. 值为 ViewSkuList 时，展示 "查看 SKU 列表" 的界面
 */
const sceneShift = ref<SceneShiftType>('SpuTable')

// changeScene 方法用于更新 sceneShift 的值，该方法给子组件使用
const changeScene = (sceneStr: SceneShiftType) => {
  sceneShift.value = sceneStr
}

//#region -------------------- "分页器"相关的业务逻辑 ----------------------
const pageNo = ref<number>(1) // pageNo 响应式数据表示当前展示页码数
const pageSize = ref<number>(3) // pageSize 响应式数据表示每页展示的数据数量
const total = ref<number>(0) // total 表示数据的总数，用于和分页器中的 total 属性绑定

// changePageSize 会在分页器的 pageSize 发生变化时触发
const changePageSize = () => getAllSpuData()
//#endregion -------- -------- "分页器"相关的业务逻辑 ----------------------

//#region -------------------- "表格数据展示"相关的业务逻辑 ----------------------
// allSpuData 响应式数据用于存储所有的 spu 数据
const allSpuData = ref<SingleSpuData[]>([])

// 获取 categoryStore 小仓库，并响应式解构需要的数据
const categoryStore = useCategoryStore()
const { thirdCategoryId } = storeToRefs(categoryStore)

/**
 * getAllSpuData 函数用于获取"某个三级分类"下所有的 SPU 数据
 * @param pager 触发分页器的 current-change 事件时，会向其回调函数自动注入 pager 参数，表示更新后的当前页数
 * @description 触发分页器的 size-change 事件时，会向其回调函数自动注入更新后的 pageSize 数据(更新后的页面展示数据的数量)，
 *              但是不会注入更新后的 pageNo 数据，所以给其设置一个默认值，让 pageSize 更新后，页面跳转到第一页
 */
const getAllSpuData = async (pager = 1) => {
  // 使用更新后的当前页数更新 pageNo 的值
  pageNo.value = pager

  try {
    // 发送请求，获取"某个三级分类"下所有的 SPU 数据
    const result: GetSpuResponseData = await reqSpuData(
      pageNo.value,
      pageSize.value,
      thirdCategoryId.value,
    )

    // 响应成功后，使用响应结果更新 allSpuData 和 total 响应式数据
    allSpuData.value = result.data.records
    total.value = result.data.total
  } catch (error) {
    console.log(error)
  }
}

// 使用 watch 监视 thirdCategoryId 的变化，发送请求获取 SPU 数据
watch(thirdCategoryId, (newValue) => {
  // "三级分类"的 id 发生变化后，清空表格展示的数据
  allSpuData.value = []

  // 调用 getAllSpuData 函数发送请求，获取"某个三级分类"下所有的 SPU 数据
  // thirdCategoryId 的值可能为 ''，因此进行条件判断，值为非空时才发送请求
  newValue && getAllSpuData()
})
//#endregion -------- -------- "表格数据展示"相关的业务逻辑 ----------------------

//#region ------------------ "表格操作"相关的业务逻辑 ----------------------
// AddOrUpdateSpuRef 用于获取
const AddOrUpdateSpuRef = ref<InstanceType<typeof AddOrUpdateSpu> | null>(null)

// handleAddSpuBtn 函数会在点击 "新增 SPU" 按钮时触发
const handleAddSpuBtn = () => {
  // 切换为"展示"新增"和"编辑" SPU 时的界面"的场景
  sceneShift.value = 'AddOrUpdateSpu'
}

// handleEditSpuBtn 函数会在点击"编辑 SPU"按钮时触发
const handleEditSpuBtn = (rowSpuData: SingleSpuData) => {
  // 切换为"展示"新增"和"编辑" SPU 时的界面"的场景
  sceneShift.value = 'AddOrUpdateSpu'

  // editSpuDataRecall 方法用于实现 AddOrUpdateSpu 组件中的数据回显
  AddOrUpdateSpuRef.value?.editSpuDataRecall(rowSpuData)
}
//#endregion --------------- "表格操作"相关的业务逻辑 ----------------------
</script>

<template>
  <div>
    <!-- 三级分类 -->
    <Category :sceneShift="sceneShift" />

    <!-- 下方展示区域 -->
    <el-card style="margin-top: 20px">
      <!-- 场景 1：展示表格界面 -->
      <div v-show="sceneShift === 'SpuTable'">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!thirdCategoryId"
          @click="handleAddSpuBtn"
        >
          添加 SPU
        </el-button>
        <el-table :data="allSpuData" border style="margin: 20px 0">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          />
          <el-table-column label="SPU 名称" prop="spuName" width="200" />
          <el-table-column
            show-overflow-tooltip
            label="SPU 描述"
            prop="description"
          />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-space size="large">
                <el-button type="primary" icon="Plus">添加 SKU</el-button>
                <el-button
                  type="warning"
                  icon="Edit"
                  @click="handleEditSpuBtn(row)"
                >
                  编辑 SPU
                </el-button>
                <el-button type="info" icon="View">查看 SKU 列表</el-button>
                <el-button type="danger" icon="Delete">删除 SPU</el-button>
              </el-space>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器组件 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          background
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getAllSpuData"
          @size-change="changePageSize"
        />
      </div>

      <!-- 场景 2：展示"新增"和"编辑" SPU 时的界面 -->
      <AddOrUpdateSpu
        ref="AddOrUpdateSpuRef"
        v-show="sceneShift === 'AddOrUpdateSpu'"
        @change-scene="changeScene"
      />

      <!-- 场景 3：展示 "查看 SKU 列表" 的界面 -->
      <ViewSkuList v-show="sceneShift === 'ViewSkuList'" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
