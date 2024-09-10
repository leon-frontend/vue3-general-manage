<script setup lang="ts" name="Setting">
import { useSettingStore, useUserStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// 获取 router 和 route 对象
const $router = useRouter()
const $route = useRoute()

// 获取 setttingStore 仓库，并响应式解构出仓库中的 refresh 响应式数据
const setttingStore = useSettingStore()
const { refresh } = storeToRefs(setttingStore)

// 获取 userStore 仓库，并响应式解构出仓库中表示"用户姓名和头像"的响应式数据
const userStore = useUserStore()
const { userName, userAvatar } = storeToRefs(userStore)
const { userLogout } = userStore

// handleRefresh 作为"刷新"按钮的点击事件回调，点击按钮，修改 refresh 的值
const handleRefresh = () => {
  refresh.value = !refresh.value
}

// handleFullScreen 作为"全屏"按钮的点击事件回调
const handleFullScreen = () => {
  /**
   * fullscreenElement 属性(DOM 对象的一个属性)可以判断当前是不是全屏模式
   * 若是全屏模式，则返回 true；若不是全屏模式，则返回
   */
  let fullScreen = document.fullscreenElement

  /**
   * 全屏模式的切换：
   *    1. 使用 document.documentElement.requestFullScreen 方法实现全屏模式
   *    2. 使用 document.exitFullScreen 方法退出全屏模式
   */
  fullScreen
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen()
}

/**
 * handleLogout 函数作为"退出登录"按钮的点击事件回调：
 * 1. 调用服务器的退出登录接口，删除 token 信息。
 * 2. 清空仓库当中与当前用户相关的数据和 LocalStorage 中的 token 信息。
 * 3. 跳转到登陆页面。
 */
const handleLogout = async () => {
  // 调用 userStore 仓库中的 userLogout 方法，用于用户退出登录操作
  await userLogout()

  // 跳转到登陆页面，并且携带"退出登录"时的路由路径（路由传参），当再次登录时直接重定向到"退出登陆"前的页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<template>
  <el-button icon="Refresh" circle @click="handleRefresh" />
  <el-button icon="FullScreen" circle @click="handleFullScreen" />
  <el-button icon="Setting" circle />
  <img :src="userAvatar" class="avatar" />
  <!-- 下拉菜单 -->
  <el-dropdown class="dropdown">
    <el-button type="primary" plain>
      {{ userName }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.avatar {
  width: 32px;
  height: 32px;
  margin: 0 10px 0 25px;
  border-radius: 50%;
}
</style>
