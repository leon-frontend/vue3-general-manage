<script setup lang="ts" name="BreadCrumb">
import { useSettingStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// 使用 useSettingStore 方法获取 Setting 仓库, 并对 Pinia 仓库中的数据进行响应式解构
const settingStore = useSettingStore()
const { fold } = storeToRefs(settingStore)

// changeIcon 用于切换菜单栏"折叠"和"展开"的图标
const changeIcon = () => {
  fold.value = !fold.value
}

// 使用 useRoute 获取 route，使用 route.matched 获取当前匹配的路由
const route = useRoute()
</script>

<template>
  <!-- 左侧的图标 -->
  <el-icon style="margin-right: 15px; cursor: pointer" @click="changeIcon">
    <!-- 使用 component 组件动态加载"展开"和"折叠"图标 -->
    <component :is="fold ? 'Fold' : 'Expand'" />
  </el-icon>
  <!-- 左侧的面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="item in route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 面包屑展示匹配路由的图标，并检查图标是否存在 -->
      <template v-if="item.meta.icon">
        <el-icon style="margin-right: 5px">
          <component :is="item.meta.icon" />
        </el-icon>
      </template>
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped></style>
