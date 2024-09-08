# 01. 切换路由组件时，实现过渡动效

- 文件位置：**`src/layout/Main/index.vue`**

- 参考：https://router.vuejs.org/zh/guide/advanced/transitions.html

```html
<template>
  <!-- 路由组件的出口位置 -->
  <router-view v-slot="{ Component }">
    <!-- 在切换路由组件时, 实现过渡动效 -->
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<style lang="scss" scoped>
  .fade-enter-from {
    opacity: 0;
  }
  .fade-enter-active {
    transition: all 0.7s;
  }
  .fade-enter-to {
    opacity: 1;
  }
</style>
```

# 02. 实现面包屑

- **根据当前匹配的路由，动态生成"面包屑"的 HTML 结构**：使用 **`route.matched`** 属性获取当前匹配的所有路由，比如若当前路由是 **`/auth/user`** ，则该属性会返回一个**包含一级路由信息和二级路由信息的数组**，即**`[{path: '/auth', ...}, {path: '/auth/user', ...}]`**。然后使用 **v-for** 指令根据这个数组动态渲染 HTML 结构。
- **特殊处理"首页"的"面包屑"渲染**：首页匹配的路由是二级路由，但是由于其一级路由是 **`'/'`**，所以**不需要渲染一级路由的信息**。在配置 **`'/'`** 路由信息时，**不要配置 title 属性**，然后使用路由信息 **`v-show="item.meta.title"`** 进行条件渲染即可。
  - **这里不能使用 v-if**：因为在 Vue 3 中 **v-if 的优先级要高于 v-for** ，但是这里又需要使用到 v-for 中的 item 数据，所以**必须让 v-for 先执行**，因此选择使用 v-show 指令。

```html
<el-breadcrumb separator-icon="ArrowRight">
  <!-- 面包屑动态展示路由名字与标题 -->
  <el-breadcrumb-item v-for="item in route.matched" :key="item.path" v-show="item.meta.title">
    <!-- 面包屑展示匹配路由的图标 -->
    <el-icon style="margin-right: 5px">
      <component :is="item.meta.icon" />
    </el-icon>
    <!-- 面包屑展示匹配路由的标题 -->
    <span>{{ item.meta.title }}</span>
  </el-breadcrumb-item>
</el-breadcrumb>
```

