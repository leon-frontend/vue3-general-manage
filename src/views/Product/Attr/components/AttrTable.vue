<script setup lang="ts" name="AttrTable">
import { reqDeleteAttr } from '@/api/product/attr'
import type { SingleAttrData } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

// 定义父组件传递过来的数据的 TS 类型
type Props = {
  allAttrData: SingleAttrData[]
  attrParams: SingleAttrData
  updateIsShowTable: (isShow: boolean) => boolean
  getAllAttrData: () => Promise<void>
}

// 使用 defineProps 接收父组件传递过来的数据
const props = defineProps<Props>()

// handleEditBtn 函数会在点击表格中的"编辑"按钮时触发
const handleEditBtn = (rowAttrData: SingleAttrData) => {
  // 隐藏表格，显示"新增数据"的 HTML 结构
  props.updateIsShowTable(false)

  // 将当前行的属性数据赋值给 attrParams 对象，实现编辑时数据回显
  // 若使用浅拷贝，则编辑的数据和展示的数据是同一个引用地址，修改数据后，若点击取消按钮，则表格展示的数据是修改后的数据
  // 使用深拷贝解决上述问题
  Object.assign(props.attrParams, JSON.parse(JSON.stringify(rowAttrData)))
}

// deleteRowAttr 函数会在点击表格中的"删除"按钮的气泡框中的"删除"按钮时触发
const deleteRowAttr = async (attrId: number) => {
  try {
    // 发送删除某个属性的请求
    await reqDeleteAttr(attrId)

    // 请求响应成功之后，并再次获取所有已有的属性值数据
    ElMessage.success('属性删除成功')
    props.getAllAttrData()
  } catch (error) {
    ElMessage.error('属性删除失败')
    console.log(error)
  }
}
</script>

<template>
  <el-table :data="allAttrData" border style="margin: 20px 0">
    <!-- "序号"列 -->
    <el-table-column label="序号" width="80" type="index" align="center" />
    <!-- "属性名称"列 -->
    <el-table-column
      label="属性名称"
      width="200"
      align="center"
      prop="attrName"
    />
    <!-- "属性值名称"列，使用插槽自定义渲染内容 -->
    <el-table-column label="属性值名称" align="center">
      <template #default="{ row }">
        <el-tag
          v-for="attrValue in row.attrValueList"
          :key="attrValue.id"
          style="margin: 5px 8px"
        >
          {{ attrValue.valueName }}
        </el-tag>
      </template>
    </el-table-column>
    <!-- "操作"列 -->
    <el-table-column label="操作" width="250" align="center">
      <template #default="{ row }">
        <el-button type="warning" icon="Edit" @click="handleEditBtn(row)">
          编辑
        </el-button>
        <el-popconfirm
          :title="`确定删除 &quot;${row.attrName}&quot; 属性吗?`"
          icon="Delete"
          confirm-button-type="danger"
          cancel-button-type="success"
          width="250px"
          @confirm="deleteRowAttr(row.id)"
        >
          <template #reference>
            <el-button type="danger" icon="Delete">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped></style>
