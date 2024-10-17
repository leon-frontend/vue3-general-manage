<script setup lang="ts" name="Setting">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettingStore, useUserStore } from '@/store/modules'
import { storeToRefs } from 'pinia'

const $router = useRouter()
const $route = useRoute()

// refresh 响应式数据用于实现刷新业务，具体实现代码在 Main 组件中。
const setttingStore = useSettingStore() // 获取 setttingStore 仓库
const { refresh } = storeToRefs(setttingStore) // 响应式解构出仓库中的数据

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

//#region ------------------------ "退出登录"相关的业务逻辑 ------------------------------
const userStore = useUserStore() // 获取 userStore 仓库
const { userName, userAvatar } = storeToRefs(userStore) // 响应式解构数据
const { userLogout } = userStore // 普通解构方法

/**
 * handleLogout 函数作为"退出登录"按钮的点击事件回调：
 * 1. 调用服务器的退出登录接口，删除 token 信息。
 * 2. 清空仓库当中与当前用户相关的数据和 LocalStorage 中的 token 信息。
 * 3. 跳转到登陆页面。
 */
const handleLogout = async () => {
  await userLogout() // 调用 userStore 仓库中的 userLogout 方法，用于用户退出登录操作

  // 跳转到登陆页面，并且携带"退出登录"时的路由路径（路由传参），当再次登录时直接重定向到"退出登陆"前的页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
//#endregion --------------------- "退出登录"相关的业务逻辑 ------------------------------

//#region ------------------ "主题颜色"、"暗黑模式"相关的业务逻辑 -------------------------
// 控制 popover 组件的显示与隐藏
const isPopoverShow = ref<boolean>(false)

// 收集"取色器"组件的数据，用于控制主题颜色
const themeColor = ref<string>('#409eff')

//changeThemeColor 函数会在"取色器"组件中的颜色发生变化时触发
const changeThemeColor = () => {
  // 使用 JS 修改 HTML 元素的 style 对象的属性与属性值
  const htmlDom = document.documentElement
  htmlDom.style.setProperty('--el-color-primary', themeColor.value)
  isPopoverShow.value = false // 隐藏 popover 组件
}

// 收集"Switch"组件的数据，用于控制是否显示"暗黑模式"
const isDarkMode = ref<boolean>(false)

// changeDarkMode 函数会在 switch 组件发生变化时触发
const changeDarkMode = () => {
  // 如果您只需要暗色模式，只需在 html 元素上添加一个名为 dark 的类 。
  const htmlDom = document.documentElement
  getComputedStyle(htmlDom).getPropertyValue(`--el-color-primary`)
  isDarkMode.value ? (htmlDom.className = 'dark') : (htmlDom.className = '')
  isPopoverShow.value = false // 隐藏 popover 组件
}
//#endregion --------------- "主题颜色"、"暗黑模式"相关的业务逻辑 -------------------------
</script>

<template>
  <el-button icon="Refresh" circle @click="refresh = !refresh" />
  <el-button icon="FullScreen" circle @click="handleFullScreen" />
  <el-popover
    :visible="isPopoverShow"
    placement="bottom"
    title="主题设置"
    :width="150"
    :persistent="false"
  >
    <!-- 触发 popover 的元素 -->
    <template #reference>
      <el-button
        icon="Setting"
        circle
        @click="isPopoverShow = !isPopoverShow"
      />
    </template>
    <!-- popover 组件中展示的内容：表单元素 -->
    <template #default>
      <el-form style="margin-top: 25px">
        <el-form-item label="主题颜色：">
          <el-color-picker v-model="themeColor" @change="changeThemeColor" />
        </el-form-item>
        <el-form-item label="暗黑模式：">
          <el-switch
            v-model="isDarkMode"
            inline-prompt
            active-icon="Moon"
            inactive-icon="Sunny"
            @change="changeDarkMode"
          />
        </el-form-item>
      </el-form>
    </template>
  </el-popover>
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
