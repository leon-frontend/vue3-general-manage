<script setup lang="ts" name="TradeMarkTable">
import { ElMessage } from 'element-plus'
import { reqDeleteTradeMark } from '@/api/product/tradeMark'
import type {
  SingleTradeMarkData,
  TradeMarkResponseNullData,
} from '@/api/product/tradeMark/type'

// 定义父组件传递过来的数据的 TS 类型
interface Props {
  AllTradeMarkData: SingleTradeMarkData[]
  pageNo: number
  getHasTradeMark: () => Promise<void>
  updatePageNo: (newPageNo: number) => number
}

// 使用 defineProps 接收父组件传递过来的数据
const props = defineProps<Props>()

// 使用 defineEmits 接收父组件给子组件绑定的自定义事件
const emits = defineEmits(['edit-trademark'])

// 点击表格中的"编辑"按钮会触发 handleEdit 函数
const handleEdit = (tradeMarkData: SingleTradeMarkData) => {
  emits('edit-trademark', tradeMarkData)
}

// 点击表格中的气泡确认框的"二次删除"按钮时，会触发 handleDelete 回调函数
const handleDelete = async (id: number, tmName: string) => {
  // 发送删除某个品牌数据的请求
  const result: TradeMarkResponseNullData = await reqDeleteTradeMark(
    id as number,
  )

  // 如果返回的响应码是 200，表示响应成功
  if (result.code === 200) {
    // 删除成功的提示信息
    ElMessage.success(`"${tmName}" 品牌删除成功`)

    // 删除某个数据之后，判断当前页是否还存在数据，如果没有则显示上一页数据
    props.AllTradeMarkData.length <= 1 && props.updatePageNo(props.pageNo - 1)

    // 重新发送请求，获取删除某个数据之后的最新数据
    props.getHasTradeMark()
  } else {
    ElMessage.error(`"${tmName}" 品牌删除失败`)
  }
}
</script>

<template>
  <el-table :data="props.AllTradeMarkData" border style="margin: 20px 0">
    <!-- "序号"列 -->
    <el-table-column
      label="序号"
      width="80"
      align="center"
      type="index"
    ></el-table-column>
    <!-- "品牌名称"列 -->
    <el-table-column
      label="品牌名称"
      prop="tmName"
      align="center"
    ></el-table-column>
    <!-- "品牌 LOGO"列，使用默认插槽自定义渲染图片结构 -->
    <el-table-column label="品牌 LOGO" align="center">
      <template #default="{ row }">
        <el-image
          :src="row.logoUrl"
          fit="contain"
          style="width: 100px; height: 100px"
        />
      </template>
    </el-table-column>
    <!-- "品牌操作"列，使用默认插槽自定义渲染按钮结构 -->
    <el-table-column label="品牌操作" align="center">
      <template #default="{ row }">
        <el-space size="large">
          <el-button type="warning" icon="Edit" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定删除 &quot;${row.tmName}&quot; 品牌吗?`"
            icon="Delete"
            confirm-button-type="danger"
            cancel-button-type="success"
            width="250px"
            @confirm="handleDelete(row.id, row.tmName)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped></style>
