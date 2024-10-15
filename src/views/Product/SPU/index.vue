<script setup lang="ts" name="SPU">
import { onBeforeUnmount, ref, watch } from 'vue'
import AddOrUpdateSpu from './components/AddOrUpdateSpu.vue'
import AddSku from './components/AddSku.vue'
import { reqDeleteSpu, reqGetSku, reqSpuData } from '@/api/product/spu'
import { useCategoryStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import type {
  SingleSpuData,
  GetSpuResData,
  SingleSkuData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 获取 categoryStore 小仓库
const categoryStore = useCategoryStore()

//#region ------------------------ "场景切换"相关业务逻辑 ----------------------
// 定义 sceneShift 数据(场景切换)的 TS 类型
export type SceneShiftType = 'SpuTable' | 'AddOrUpdateSpu' | 'AddSku'

/**
 * sceneShift 响应式数据用于控制"场景"切换：
 *    1. 值为 SpuTable 时，表示展示表格界面
 *    2. 值为 AddOrUpdateSpu 时，表示展示"新增"和"编辑" SPU 时的界面
 *    3. 值为 AddSku 时，展示 "添加 SKU " 的界面
 */
const sceneShift = ref<SceneShiftType>('SpuTable')

/**
 * changeScene 方法用于更新 sceneShift 的值，该方法给子组件使用
 * @param sceneStr 用于切换场景
 * @param tablePage 当切换场景是"表格界面"时，如果是"编辑"操作返回"表格界面"，则要显示离开"表格界面"时的数据；如果是"新增"操作，则展示第一页的数据。
 */
const changeScene = (
  sceneStr: SceneShiftType,
  tablePage: 'currentPage' | 'firstPage',
) => {
  // 切换场景
  sceneShift.value = sceneStr

  // 当切换场景是"表格界面"时，重新获取 SPU 数据。
  // 如果是"编辑"操作返回"表格界面"，则要显示离开"表格界面"时的数据；"新增"操作展示第一页的数据
  sceneStr === 'SpuTable' &&
    (tablePage === 'currentPage'
      ? getAllSpuData(pageNo.value)
      : getAllSpuData())
}
//#endregion --------------------- "场景切换"相关业务逻辑 ----------------------

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

// 从 categoryStore 小仓库中响应式解构出"三级分类"的 id
const { thirdCategoryId } = storeToRefs(categoryStore)

/**
 * getAllSpuData 函数用于获取"某个三级分类"下所有的 SPU 数据
 * @param pager 触发分页器的 current-change 事件时，会向其回调函数自动注入 pager 参数，表示更新后的当前页数，用于跳转到指定页数
 * @description 触发分页器的 size-change 事件时，会向其回调函数自动注入更新后的 pageSize 数据(更新后的页面展示数据的数量)，
 *              但是不会注入更新后的 pageNo 数据，所以给其设置一个默认值，让 pageSize 更新后，页面跳转到第一页
 */
const getAllSpuData = async (pager = 1) => {
  // 使用更新后的当前页数更新 pageNo 的值
  pageNo.value = pager

  try {
    // 发送请求，获取"某个三级分类"下所有的 SPU 数据
    const result: GetSpuResData = await reqSpuData(
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

//#region ------------------ "新增 SPU"按钮和"编辑 SPU"按钮的业务逻辑 ----------------------
// AddOrUpdateSpuRef 用于获取 AddOrUpdateSpu 组件实例
const AddOrUpdateSpuRef = ref<InstanceType<typeof AddOrUpdateSpu> | null>(null)

// addSpuBtn 函数会在点击 "新增 SPU" 按钮时触发
const addSpuBtn = () => {
  // 切换为"展示"新增"和"编辑" SPU 时的界面"的场景
  sceneShift.value = 'AddOrUpdateSpu'

  // 子组件的 addSpuInitData 方法用于实现 AddOrUpdateSpu 组件中的"新增"数据初始化
  AddOrUpdateSpuRef.value?.addSpuInitData(thirdCategoryId.value)
}

// editSpuBtn 函数会在点击"编辑 SPU"按钮时触发
const editSpuBtn = (rowSpuData: SingleSpuData) => {
  // 切换为"展示"新增"和"编辑" SPU 时的界面"的场景
  sceneShift.value = 'AddOrUpdateSpu'

  // 子组件的 editSpuDataRecall 方法用于实现 AddOrUpdateSpu 组件中的"编辑"数据回显
  AddOrUpdateSpuRef.value?.editSpuDataRecall(rowSpuData)
}
//#endregion ------------- "新增 SPU"按钮和"编辑 SPU"按钮的业务逻辑 ----------------------

//#region ---------------- "添加 SKU"按钮和"查看 SKU 列表"按钮的业务逻辑 --------------------
// AddSkuRef 用于获取 AddSku 组件实例
const AddSkuRef = ref<InstanceType<typeof AddSku> | null>(null)

// 从 categoryStore 小仓库中响应式解构出"一级分类"和"二级分类"的 id
const { fisrtCategoryId, secondCategoryId } = storeToRefs(categoryStore)

// addSkuBtn 函数会在点击"添加 SKU"按钮时触发
const addSkuBtn = (rowSpuData: SingleSpuData) => {
  // 切换为 "添加 SKU " 的界面的场景
  sceneShift.value = 'AddSku'

  // 子组件的 addSkuInitData 方法用于实现 AddSku 组件中的数据初始化
  AddSkuRef.value?.addSkuInitData(
    fisrtCategoryId.value, // "一级分类"的 id，用于获取"平台属性"相关的数据
    secondCategoryId.value, // "二级分类"的 id，用于获取"平台属性"相关的数据
    rowSpuData, // rowSpuData 表示表格的一行数据，其中包含"三级分类"的 id
  )
}

// allSkuData 用于保存某个 SPU 下的所有 SKU 数据
const allSkuData = ref<SingleSkuData[]>([])

// isDialogShow 用于控制对话框的显示与隐藏
const isDialogShow = ref<boolean>(false)

// viewSkuBtn 函数会在点击"查看 SKU 列表"按钮时触发
const viewSkuBtn = async (rowSpuData: SingleSpuData) => {
  try {
    // 发送 reqGetSku 请求，获取某个 SPU 下的所有 SKU 数据的接口
    const { data } = await reqGetSku(rowSpuData.id as number)

    // 请求响应成功后，保存请求返回的数据
    allSkuData.value = data

    // 显示 dialog 对话框
    isDialogShow.value = true
  } catch (error) {
    console.log(error)
  }
}
//#endregion ------------- "添加 SKU"按钮和"查看 SKU 列表"按钮的业务逻辑 --------------------

//#region ------------------ "删除 SPU"按钮的业务逻辑 ----------------------
// confirmDelBtn 函数会在点击"二次确认"弹框的"确认按钮"时触发
const confirmDelBtn = async (rowSpuData: SingleSpuData) => {
  try {
    // 发送 reqDeleteSpu 请求，删除某个 SPU 数据
    await reqDeleteSpu(rowSpuData.id as number)

    // 删除 SPU 数据成功，弹出提示信息
    ElMessage.success(`'${rowSpuData.spuName}'删除成功`)

    // 重新获取剩余的 SPU 数据，用于表格展示
    getAllSpuData(allSpuData.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } catch (error) {
    // 删除 SPU 数据失败，弹出提示信息
    ElMessage.error(`'${rowSpuData.spuName}'删除失败`)
    console.log(error)
  }
}
//#endregion --------------- "删除 SPU"按钮的业务逻辑 ----------------------

// SPU 路由组件销毁之前，清空本次添加的"分类"级别的相关数据，避免下次进入组件时还展示上次填写的数据
// 即清空 categoryStore 小仓库中的"分类级别"相关的数据
onBeforeUnmount(() => categoryStore.$reset())
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
          @click="addSpuBtn"
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
                <el-button type="primary" icon="Plus" @click="addSkuBtn(row)">
                  添加 SKU
                </el-button>
                <el-button type="warning" icon="Edit" @click="editSpuBtn(row)">
                  编辑 SPU
                </el-button>
                <el-button type="info" icon="View" @click="viewSkuBtn(row)">
                  查看 SKU 列表
                </el-button>
                <el-popconfirm
                  :title="`确定删除'${row.spuName}'吗?`"
                  width="220"
                  @confirm="confirmDelBtn(row)"
                >
                  <template #reference>
                    <el-button type="danger" icon="Delete">删除 SPU</el-button>
                  </template>
                </el-popconfirm>
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

        <!-- dialog 对话框，展示某个 SPU 下的所有 SKU 数据 -->
        <el-dialog v-model="isDialogShow" title="SKU 列表">
          <el-table :data="allSkuData" border>
            <el-table-column label="SKU 名称" prop="skuName" />
            <el-table-column label="SKU 价格" prop="price" />
            <el-table-column label="SKU 重量" prop="weight" />
            <el-table-column label="SKU 图片">
              <template #default="{ row }">
                <el-image
                  :src="row.skuDefaultImg"
                  style="width: 100px; height: 100px"
                  fit="contain"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>

      <!-- 场景 2：展示"新增"和"编辑" SPU 时的界面 -->
      <AddOrUpdateSpu
        ref="AddOrUpdateSpuRef"
        v-show="sceneShift === 'AddOrUpdateSpu'"
        @change-scene="changeScene"
      />

      <!-- 场景 3：展示 "添加 SKU " 的界面 -->
      <AddSku
        ref="AddSkuRef"
        v-show="sceneShift === 'AddSku'"
        @change-scene="changeScene"
      />
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
