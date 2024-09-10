<script setup lang="ts" name="TradeMark">
import { ref } from 'vue'

// 与"分页器"相关的响应式数据
const pageNo = ref<number>(1) // 当前页码
const pageSize = ref<number>(3) // 每页展示多少条数据
</script>

<template>
  <el-card>
    <!-- 卡片顶部的添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
    <!-- 表格组件：用于展示已有的品牌数 -->
    <el-table border stripe style="margin: 10px 0">
      <el-table-column label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="品牌名称" align="center"></el-table-column>
      <el-table-column label="品牌LOGO" align="center"></el-table-column>
      <el-table-column label="品牌操作" align="center"></el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400"
    />
  </el-card>
</template>

<style lang="scss" scoped></style>
