<script setup lang="ts" name="TradeMark">
import { onMounted, ref } from 'vue'
import { reqHasTradeMark } from '@/api/product/tradeMark'
import type { SingleTradeMarkData } from '@/api/product/tradeMark/type'

// tradeMarkData 响应式数据表示已有品牌的数据
const tradeMarkData = ref<SingleTradeMarkData[]>([])

// 与"分页器"相关的响应式数据
const pageNo = ref<number>(1) // 当前页码
const pageSize = ref<number>(3) // 每页展示多少条数据
const total = ref<number>(0) // 表格展示数据的总数

// 将获取已有品牌数据的方法封装成 getHasTradeMark 函数
const getHasTradeMark = async () => {
  // 发送获取已有品牌数据请求
  const result = await reqHasTradeMark(pageNo.value, pageSize.value)

  // 当返回的状态码为 200 时，表示请求响应成功
  if (result.code === 200) {
    // 更新表格展示数据的总数
    total.value = result.data.total

    // 更新已有品牌的数据
    tradeMarkData.value = result.data.records
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
</script>

<template>
  <el-card>
    <!-- 卡片顶部的添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
    <!-- 表格组件：用于展示已有的品牌数 -->
    <el-table :data="tradeMarkData" border stripe style="margin: 10px 0">
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
            fit="cover"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <!-- "品牌操作"列，使用默认插槽自定义渲染按钮结构 -->
      <el-table-column label="品牌操作" align="center">
        <template #default="{ row }">
          <el-space size="large">
            <el-button type="warning" size="default" icon="Edit">
              编辑
            </el-button>
            <el-button type="danger" size="default" icon="Delete">
              删除
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
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
</template>

<style lang="scss" scoped></style>
