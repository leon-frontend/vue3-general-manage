<script setup lang="ts" name="TradeMark">
import { onMounted, ref, reactive, computed } from 'vue'
import TradeMarkTable from './components/TradeMarkTable.vue'
import TradeMarkModal from './components/TradeMarkModal.vue'
import { reqHasTradeMark } from '@/api/product/tradeMark'
import type { SingleTradeMarkData } from '@/api/product/tradeMark/type'

// AllTradeMarkData 响应式数据表示所有已有品牌的数据
const AllTradeMarkData = ref<SingleTradeMarkData[]>([])

//#region ----------------- "表格"和"分页器"相关的业务逻辑 ---------------------
// 与"分页器"相关的响应式数据
const pageNo = ref<number>(1) // 当前页码
const pageSize = ref<number>(3) // 每页展示多少条数据
const total = ref<number>(0) // 表格展示数据的总数

// TradeMarkTable 子组件需要使用 pageNo 响应式数据，给其提供操作数据的方法
const updatePageNo = (newPageNo: number) => (pageNo.value = newPageNo)

// 将获取已有品牌数据的方法封装成 getHasTradeMark 函数
const getHasTradeMark = async () => {
  // 发送获取已有品牌数据请求
  const result = await reqHasTradeMark(pageNo.value, pageSize.value)

  // 当返回的状态码为 200 时，表示请求响应成功
  if (result.code === 200) {
    // 更新表格展示数据的总数
    total.value = result.data.total

    // 更新已有品牌的数据
    AllTradeMarkData.value = result.data.records
  }
}

// 在 onMounted 生命周期钩子中调用 getHasTradeMark 函数，获取已有品牌数据
onMounted(() => getHasTradeMark())

// 当"页面展示的数据数量"发生变化时，会触发 handlePageSizeChange 回调函数
const handlePageSizeChange = () => {
  // 当页面展示的数据数量发生变化时，首先将"当前页"设置为第一页。
  // 当 pageNo.value 的值更新为 1 后，Vue 会在后续的事件处理函数代码执行之前完成这次更新。
  // 即 Vue 确保在事件处理函数执行之前，所有相关的响应式数据已经被更新到最新状态
  pageNo.value = 1

  // 重新发送请求获取数据（使用更新后的 pageNo 的值）
  getHasTradeMark()
}
//#endregion --------------- "表格"和"分页器"相关的业务逻辑 ---------------------

//#region ----------------- Modal 弹框相关的业务逻辑 --------------------
// isModalShow 响应式数据，用于控制 Modal 弹框的显示与隐藏
const isModalShow = ref<boolean>(false)

// modalTradeMarkData 响应式数据用于收集 modal 框中展示的品牌数据
const modalTradeMarkData = reactive<SingleTradeMarkData>({
  tmName: '',
  logoUrl: '',
})

// 获取子组件 TradeMarkModal 组件的组件实例
const modalRef = ref<InstanceType<typeof TradeMarkModal> | null>(null)

// 通过 TradeMarkModal 组件实例获取 Modal 弹框中 el-form 的表单组件实例
const modalFormRef = computed(() => modalRef.value?.modalFormRef)

// controlModalShow 函数用于控制 Modal 弹框的显示和隐藏
const controlModalShow = (isShow: boolean) => (isModalShow.value = isShow)

// clearValidateResults 函数用于清除之前的校验结果
const clearValidateResults = () => {
  // 每次显示 Modal 弹框时，都清除之前的校验结果
  // 初次显示 Modal 框时，无法获取到 modalFormRef，因为 Vue 是异步更新的
  modalFormRef.value?.clearValidate('tmName')
  modalFormRef.value?.clearValidate('logoUrl')
}

// handleAddTradeMark 函数会在点击"添加品牌"按钮时触发
const handleAddTradeMark = () => {
  // 先清空 modal 框中表单的所有字段
  modalTradeMarkData.tmName = ''
  modalTradeMarkData.logoUrl = ''
  modalTradeMarkData.id = 0 // 如果 id 不为 0，则点击新增按钮时，modal 的标题会展示"编辑品牌"

  // 点击"添加品牌"按钮，显示 Modal 弹框
  controlModalShow(true)

  // 每次显示 Modal 弹框时，都清除之前的校验结果
  clearValidateResults()
}

// handleTableEdit 函数会在点击表格的"编辑"按钮时触发（数据带 id）
const handleTableEdit = (row: SingleTradeMarkData) => {
  // 每次显示 Modal 弹框时，都先清除之前的校验结果
  clearValidateResults()

  // 点击"编辑"按钮，显示 Modal 弹框
  controlModalShow(true)

  // 主动收集并更新 modal 框中表单的展示数据（包括 id 数据）
  Object.assign(modalTradeMarkData, row)
}
//#endregion ----------------- 和 Modal 弹框相关的业务逻辑 --------------------
</script>

<template>
  <div>
    <el-card>
      <!-- 卡片顶部的添加品牌按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="handleAddTradeMark"
      >
        添加品牌
      </el-button>

      <!-- 表格组件：用于展示已有的品牌数 -->
      <TradeMarkTable
        :AllTradeMarkData="AllTradeMarkData"
        :pageNo="pageNo"
        :getHasTradeMark="getHasTradeMark"
        :updatePageNo="updatePageNo"
        @edit-trademark="handleTableEdit"
      />

      <!-- 分页器组件 -->
      <!-- 分页器组件：layout 属性中的 -> 符号表示将 sizes, total 两个组件向右对齐 -->
      <!-- @current-change 会在 current-page 改变时触发，直接将 getHasTradeMark 作为回调函数，重新发请求获取对应数据 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :total="total"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        @size-change="handlePageSizeChange"
        @current-change="getHasTradeMark"
      />
    </el-card>

    <!-- Modal 弹框组件 -->
    <TradeMarkModal
      ref="modalRef"
      :modalTradeMarkData="modalTradeMarkData"
      :isModalShow="isModalShow"
      :controlModalShow="controlModalShow"
      :getHasTradeMark="getHasTradeMark"
    />
  </div>
</template>

<style lang="scss" scoped></style>
