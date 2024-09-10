<script setup lang="ts" name="Layout">
import { Logo, Menu, Main, Tabbar } from '@/layout'
import { useSettingStore, useUserStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// 获取 Pinia 中的 userStore 仓库和 settingStore 仓库
const userStore = useUserStore()
const settingStore = useSettingStore()

// 响应式解构出 settingStore 中的响应式数据
const { fold } = storeToRefs(settingStore)

// 使用 useRoute hook 获取路由, 通过 route 获取当前的路由路径
const route = useRoute()
</script>

<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: fold }">
      <Logo />
      <!-- 展示路由菜单 -->
      <!-- 使用滚动组件，防止路由菜单太多超出范围 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单Menu组件，设置可折叠的路由菜单 -->
        <!-- default-active 属性表示页面加载时默认激活菜单的 index, 在 menu-item 中将 index 的值设置为了路由路径 -->
        <el-menu
          style="--el-menu-bg-color: #001529; --el-menu-text-color: white"
          :default-active="route.path"
          :collapse="fold"
          :collapse-transition="false"
          unique-opened
        >
          <!-- 根据路由信息动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部展示区 -->
    <div class="layout_tabbar" :class="{ fold: fold }">
      <Tabbar />
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main" :class="{ fold: fold }">
      <Main />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-backgound-color;
    color: white;
    transition: all 0.3s;

    &.fold {
      width: $base-menu-min-width;
    }

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
    left: $base-menu-width;
    top: 0px;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto; // 加滚动条，其样式写在index.scss文件中，作为全局样式
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
