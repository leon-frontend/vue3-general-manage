<template>
  <div>
    <template v-for="item in menuList" :key="item.path">
      <!-- 没有子路由的情况 -->
      <!-- 使用item.meta.hidden属性判断该路由信息是否显示在导航栏中 -->
      <el-menu-item v-if="!item.children && !item.meta.hidden" :index="item.path">
        <template #title>
          <span>图标&nbsp</span>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
      <!-- 如果只有一个子路由，就只展示子路由，不需要使用折叠菜单 -->
      <el-menu-item v-if="item.children && item.children.length === 1 && !item.children[0].meta.hidden" :index="item.children[0].path">
        <template #title>{{ item.children[0].meta.title }}</template>
      </el-menu-item>
      <!-- 存在子路由并且子路由的数量大于 1 个 -->      
      <!-- <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1"> -->
      <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1 && !item.meta.hidden">
        <template #title>{{ item.meta.title }}</template>
        <!-- 使用递归组件处理多级路由的场景 -->
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>

<!-- 递归组件必须设置 name 属性 -->
<script setup lang="ts" name="Menu">
defineProps(['menuList']) // 接受父组件传递过来的路由信息
</script>

<style lang="css" scoped></style>