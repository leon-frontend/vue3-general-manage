<script setup lang="ts" name="ScreenTop">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

const $router = useRouter() // 用于编程式路由导航

//#region ------------------------ 每隔 1s 获取当前时间 --------------------------------
// getCurrentTime 函数中使用 moment 库获取当前时间
const getCurrentTime = () => moment().format('YYYY-MM-DD hh:mm:ss')

// currentTime 用于存储当前时间
const currentTime = ref<string>(getCurrentTime())

// timer 用于存储定时器的 id，便于销毁定时器
const timer = ref<ReturnType<typeof setInterval>>()

// 组件挂在完毕后，开启定时器，获取当前时间
onMounted(() => {
  timer.value = setInterval(() => {
    currentTime.value = getCurrentTime() // 每隔 1s 重新获取当前时间
  }, 1000)
})

// 组件销毁前，关闭定时器
onBeforeUnmount(() => clearInterval(timer.value))
//#endregion --------------------- 每隔 1s 获取当前时间 --------------------------------
</script>

<template>
  <div class="screen-top-main">
    <div class="top-left">
      <span class="home-btn" @click="$router.push('/home')">首页</span>
    </div>
    <div class="top-center">
      <div class="title">智慧旅游可视化大数据展示平台</div>
    </div>
    <div class="top-right">
      <span class="statistics-btn">统计报告</span>
      <span class="time-text">当前时间：{{ currentTime }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.screen-top-main {
  width: 100%;
  height: 40px;
  display: flex;
}

// 顶部的左侧区域
.top-left {
  flex: 1.5;
  background: url('@/assets/screenImgs/dataScreen-header-left-bg.png') no-repeat;
  background-size: cover;

  .home-btn {
    width: 150px;
    height: 40px;
    float: right;
    background: url('@/assets/screenImgs/dataScreen-header-btn-bg-l.png')
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 40px;
    color: #29fcff;
    font-size: 20px;
    cursor: pointer;
  }
}

// 顶部的中间区域
.top-center {
  flex: 2;

  .title {
    width: 100%;
    height: 74px;
    background: url('@/assets/screenImgs/dataScreen-header-center-bg.png')
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 74px;
    color: #29fcff;
    font-size: 35px;
    font-weight: bolder;
  }
}

// 顶部的底部区域
.top-right {
  flex: 1.5;
  background: url('@/assets/screenImgs/dataScreen-header-left-bg.png') no-repeat;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #29fcff;

  .statistics-btn {
    width: 150px;
    height: 40px;
    background: url('@/assets/screenImgs/dataScreen-header-btn-bg-r.png')
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
  }

  .time-text {
    margin-right: 20px;
    font-size: 20px;
  }
}
</style>
