<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 展示路由菜单 -->
      <!-- 使用滚动组件，防止路由菜单太多超出范围 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单Menu组件，设置可折叠的路由菜单 -->
        <el-menu style="--el-menu-bg-color: #001529; --el-menu-text-color: white">
          <!-- 根据路由信息动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>          
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">456</div>
    <!-- 内容展示区 -->
    <div class="layout_main">
      <p style="height: 2000px; background-color: red;">我是一个段落</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="Layout">
import Logo from './logo/index.vue' // 引入Logo组件
import Menu from './menu/index.vue' // 引入菜单组件
import { useUserStore } from '@/store/modules/user' // 获取小仓库，仓库中有常量路由数据
const userStore = useUserStore()
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  color: white;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-backgound-color;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      
      // el-menu标签默认右边框是1px，需要清除这个样式
      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background-color: cyan;
    left: $base-menu-width;
    top: 0px;
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: yellow;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto; // 加滚动条，其样式写在index.scss文件中，作为全局样式
  }
}
</style>