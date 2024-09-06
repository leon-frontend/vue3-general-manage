<!-- 递归组件必须设置 name 属性 -->
<script setup lang="ts" name="Menu">
import { useRouter } from 'vue-router'

// 通过 useRouter hook 获取 router, 实现编程式路由导航
const router = useRouter()

// 接受父组件传递过来的路由信息
defineProps(['menuList'])

// 定义 handleRoute 函数形参的 TS 类型
interface MenuItemRegistered {
  index: string
  indexPath: string[]
  active: boolean
}

// 点击菜单项时,进行路由跳转
const handleRoute = (item: MenuItemRegistered): void => {
  // item 是一个对象, 其中包含一个 index 属性, 该属性值表示路由路径
  router.push(item.index)
}
</script>

<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 1. 没有子路由的情况 -->
    <!-- 使用 item.meta.hidden 属性判断该路由信息是否显示在导航栏中 -->
    <el-menu-item
      v-if="!item.children && !item.meta.hidden"
      :index="item.path"
      @click="handleRoute"
    >
      <!-- 根据 item.meta.icon 中的值渲染图标 -->
      <!-- 注意: 当菜单折叠之后, 只有将图标放在插槽的外面时才会展示图标 -->
      <el-icon>
        <!-- 如果 item.meta.icon 的值是 "HomeIcon"，那么 Vue 会渲染 <HomeIcon> 组件标签名。 -->
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>
        <!-- 标题名称 -->
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 2. 如果只有一个子路由，就只展示子路由，不需要使用折叠菜单 -->
    <el-menu-item
      v-if="
        item.children &&
        item.children.length === 1 &&
        !item.children[0].meta.hidden
      "
      :index="item.children[0].path"
      @click="handleRoute"
    >
      <!-- 根据 item.meta.icon 中的值渲染图标 -->
      <!-- 注意: 当菜单折叠之后, 只有将图标放在插槽的外面时才会展示图标 -->
      <el-icon>
        <!-- 如果 item.meta.icon 的值是 "HomeIcon"，那么 Vue 会渲染 <HomeIcon> 组件标签名。 -->
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 3. 存在子路由并且子路由的数量大于 1 个 -->
    <!-- <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1"> -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1 && !item.meta.hidden"
    >
      <template #title>
        <!-- 根据 item.meta.icon 中的值渲染图标 -->
        <el-icon>
          <!-- 如果 item.meta.icon 的值是 "HomeIcon"，那么 Vue 会渲染 <HomeIcon> 组件标签名。 -->
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 使用递归组件处理多级路由的场景 -->
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped></style>
