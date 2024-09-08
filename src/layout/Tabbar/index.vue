<script setup lang="ts" name="Tabbar">
import { BreadCrumb, Setting } from '@/layout'
</script>

<template>
  <div class="tabbar">
    <!-- 1. 顶部展示区的左侧内容 -->
    <div class="tabbar-left">
      <BreadCrumb />
    </div>
    <!-- 2. 顶部展示区的右侧内容 -->
    <div class="tabbar-right">
      <Setting />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgb(242, 239, 239),
    rgb(236, 211, 211),
    rgb(237, 184, 184)
  );

  .tabbar-left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .tabbar-right {
    display: flex;
    align-items: center;
  }
}
</style>
