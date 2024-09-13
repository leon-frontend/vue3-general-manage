<script setup lang="ts" name="AddOrUpdateAttr">
import { nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqAddOrUpdateAttr } from '@/api/product/attr'
import type { SingleAttrData, SingleAttrValue } from '@/api/product/attr/type'

// 定义父组件传递过来的数据的 TS 类型
type Props = {
  attrParams: SingleAttrData // attrParams 用于收集"添加属性"或"修改属性"的新数据
  updateIsShowTable: (isShow: boolean) => boolean // 控制表格是否展示
  getAllAttrData: () => Promise<void> // 获取所有的属性数据
}

// 使用 defineProps 接收父组件传递过来的数据
const props = defineProps<Props>()

// inputRefs 用于保存多个 el-input 组件实例，用于输入框自动聚焦
const inputRefs = ref<HTMLInputElement[]>([])

// handleCancelBtn 函数会在点击"取消"按钮时触发
const handleCancelBtn = () => {
  // 隐藏"新增数据"的 HTML 结构，显示表格
  props.updateIsShowTable(true)
}

// handleAddAttrBtn 函数会在点击"添加新属性值"按钮时触发
const handleAddAttrBtn = () => {
  // 点击"添加新属性值"按钮时，向 attrValueList 数组中添加新的属性值
  // isEditMode 用于控制"属性值名称"列中的"编辑"模式和"查看"模式的切换
  props.attrParams.attrValueList.push({ valueName: '', isEditMode: true })

  // 让最新添加的 el-input 组件自动聚焦，即 attrValueList 数组中最后一条数据对应的 input 组件
  // 等输入框挂载到页面上后，再让对应的输入框获取焦点
  nextTick(() =>
    inputRefs.value[props.attrParams.attrValueList.length - 1].focus(),
  )
}

// blurEditInput 函数会在"属性值名称"列的"编辑"模式的输入框失去焦点时触发
const blurEditInput = (row: SingleAttrValue, $index: number) => {
  // 非法情况 1：切换成"查看"模式之前，一定要保证输入框中有值，否则"查看"模式显示的 div 的高度为 0，无法被点击
  if (row.valueName.trim() === '') {
    // 删除"属性值为空"的数据
    props.attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能为空！')
    return
  }

  // 非法情况 2：不能添加相同的"属性值名称"
  const repeatItem = props.attrParams.attrValueList.find((item) => {
    if (item !== row) return item.valueName === row.valueName
  })

  // 如果 repeatItem 存在，则不允许切换成"查看"模式，并弹出提示
  if (repeatItem) {
    // 删除"属性值重复"的数据
    props.attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能重复！')
    return
  }

  // 输入框失去焦点时，隐藏输入框，即切换成"查看"模式
  row.isEditMode = false
}

// lookModeClick 函数会在点击"属性值名称"列的"查看"模式的 div 时触发
const lookModeClick = (row: SingleAttrValue, $index: number) => {
  // 切换成"编辑"模式，即显示输入框
  row.isEditMode = true

  // 等输入框挂载到页面上后，再让对应的输入框获取焦点
  nextTick(() => inputRefs.value[$index].focus())
}

// handleSaveBtn 函数会在点击"保存"按钮时触发
const handleSaveBtn = async () => {
  try {
    // 发送 reqAddOrUpdateAttr 请求，新增属性数据或修改属性数据
    await reqAddOrUpdateAttr(props.attrParams)

    // 请求响应成功后，弹出提示信息
    ElMessage.success(props.attrParams.id ? '属性修改成功' : '属性添加成功')

    // 请求响应成功后，跳转到"表格"页面，并重新获取更新后的属性数据
    props.updateIsShowTable(true)
    props.getAllAttrData()
  } catch (error) {
    // 请求响应失败后，弹出提示信息
    ElMessage.error(props.attrParams.id ? '属性修改失败' : '属性添加失败')
    console.log(error)
  }
}
</script>

<template>
  <el-form inline>
    <el-form-item label="新属性名称：">
      <el-input
        v-model="attrParams.attrName"
        placeholder="请输入新属性名称"
      ></el-input>
    </el-form-item>
  </el-form>
  <el-button
    :disabled="!attrParams.attrName"
    type="primary"
    icon="Plus"
    @click="handleAddAttrBtn"
  >
    添加新属性值
  </el-button>
  <el-button type="info" plain icon="CloseBold" @click="handleCancelBtn">
    取消
  </el-button>
  <!-- 表格组件 -->
  <el-table :data="attrParams.attrValueList" border style="margin: 20px 0">
    <!-- "序号"列 -->
    <el-table-column label="序号" width="80" type="index" align="center" />
    <!-- "属性值名称"列 -->
    <el-table-column label="属性值名称" align="center">
      <!-- row 为当前的 attrValueList 中的属性值对象 -->
      <template #default="{ row, $index }">
        <!-- 编辑模式 -->
        <el-input
          v-if="row.isEditMode"
          :ref="(vc: HTMLInputElement) => (inputRefs[$index] = vc)"
          v-model="row.valueName"
          placeholder="请输入新的属性值名称"
          @blur="blurEditInput(row, $index)"
        ></el-input>

        <!-- 查看模式 -->
        <div v-else @click="lookModeClick(row, $index)">
          {{ row.valueName }}
        </div>
      </template>
    </el-table-column>
    <!-- "属性值操作"列 -->
    <el-table-column label="属性值操作" width="250" align="center">
      <template #default="{ row, $index }">
        <el-popconfirm
          :title="`确定删除 &quot;${row.valueName}&quot; 属性吗?`"
          icon="Delete"
          confirm-button-type="danger"
          cancel-button-type="success"
          width="250px"
          @confirm="attrParams.attrValueList.splice($index, 1)"
        >
          <template #reference>
            <el-button type="danger" icon="Delete">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 底部的"保存"和"取消"按钮 -->
  <el-button
    :disabled="!attrParams.attrValueList.length"
    type="primary"
    icon="Select"
    @click="handleSaveBtn"
  >
    保存
  </el-button>
  <el-button type="info" plain icon="CloseBold" @click="handleCancelBtn">
    取消
  </el-button>
</template>

<style lang="scss" scoped></style>
