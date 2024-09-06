<script setup lang="ts" name="BreadCrumb">
import { ref } from 'vue'

// fold 响应式数据用于控制"折叠"和"展开"的图标, 默认是显示"展开"图标
const fold = ref(false)

// changeIcon 用于切换菜单栏"折叠"和"展开"的图标
const changeIcon = () => {
  fold.value = !fold.value
}
</script>

<template>
  <!-- 左侧的图标 -->
  <el-icon style="margin-right: 15px" @click="changeIcon">
    <!-- 使用 component 组件动态加载"展开"和"折叠"图标 -->
    <component :is="fold ? 'Fold' : 'Expand'" />
  </el-icon>
  <!-- 左侧的面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped></style>
