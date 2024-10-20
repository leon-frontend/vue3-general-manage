<script setup lang="ts" name="Screen">
import { onMounted, ref } from 'vue'
import {
  ScreenTop,
  Tourist,
  SexRate,
  AgeRate,
  Map,
  LineChart,
  SceneRank,
  TouristContrast,
  ReserveData,
} from './components'

//#region ------------------------- "智慧大屏"的响应式实现 ---------------------------------
// screenMainRef 获取"数据大屏的版心(内容展示区域)"的 DOM 元素
const screenMainRef = ref<HTMLDivElement | null>(null)

// getScaleRatio 函数用于根据当前屏幕大小动态获取缩放比例。默认屏幕大小是 1920 × 1080
const getScaleRatio = (width = 1920, height = 1080) => {
  const wRatio = window.innerWidth / width // 计算宽度的缩放比例，window.innerWidth 表示当前浏览器视口的宽度
  const hRatio = window.innerHeight / height // 计算高度的缩放比例，window.innerHeight 表示当前浏览器视口的高度
  return wRatio < hRatio ? wRatio : hRatio // 按照较小的缩放比例进行缩放，防止内容溢出或内容拉伸
}

// setScaleAndTranslate 用于动态设置缩放比例和位移大小
const setScaleAndTranslate = () => {
  if (screenMainRef.value)
    screenMainRef.value.style.transform = `scale(${getScaleRatio()}) translate(-50%,-50%)`
}

// 动态设置缩放比例和位移大小的时机
onMounted(() => setScaleAndTranslate()) // 组件初次挂载到页面上时，设置缩放比例和位移大小
window.onresize = () => setScaleAndTranslate() // 视口尺寸发生变化时，动态设置比例和位移大小
//#endregion ---------------------- "智慧大屏"的响应式实现 ---------------------------------
</script>

<template>
  <div class="screen-container">
    <!-- 数据大屏的版心：内容展示区域 -->
    <div ref="screenMainRef" class="screen-main">
      <!-- 数据大屏的顶部 -->
      <div class="screen-top-container">
        <ScreenTop />
      </div>
      <!-- 数据大屏的底部 -->
      <div class="screen-bottom-container">
        <!-- 底部的左侧区域 -->
        <div class="bottom-left-container">
          <Tourist class="tourist-main" />
          <SexRate class="sex-rate-main" />
          <AgeRate class="age-rate-main" />
        </div>
        <!-- 底部的中间区域 -->
        <div class="bottom-center-container">
          <Map class="map-main" />
          <LineChart class="line-chart-main" />
        </div>
        <!-- 底部的右侧区域 -->
        <div class="bottom-right-container">
          <SceneRank class="scene-rank-main" />
          <TouristContrast class="tourist-contrast-main" />
          <ReserveData class="reserve-data-main" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.screen-container {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/screenImgs/bg.png') no-repeat;
  background-size: cover;

  // 数据大屏的版心：内容展示区域
  .screen-main {
    position: fixed;
    width: 1920px;
    height: 1080px;
    top: 50%;
    left: 50%;
    transform-origin: left top; // 修改变换原点为左上角
  }
}

// 内容展示区域的顶部区域
.screen-top-container {
  width: 100%;
  height: 40px;
}

// 内容展示区域的底部区域
.screen-bottom-container {
  display: flex;

  // 底部的左侧区域
  .bottom-left-container {
    flex: 1;
    // 在默认 1902 × 1080 的视口中的默认高度，若视口发生变化，则该值也会由于父元素的 scale 属性而改变
    height: 1040px;
    display: flex;
    flex-direction: column;

    // "游客比例"组件
    .tourist-main {
      flex: 1.5;
      margin-top: 15px;
    }

    // "性别比例"组件
    .sex-rate-main {
      flex: 1;
      margin: 15px 0;
    }

    // "年龄比例"组件
    .age-rate-main {
      flex: 1;
    }
  }

  // 底部的中间区域
  .bottom-center-container {
    flex: 2;
    display: flex;
    flex-direction: column;

    // "地图"组件
    .map-main {
      flex: 3;
    }

    // 折线图组件
    .line-chart-main {
      flex: 1;
    }
  }

  // 底部的右侧区域
  .bottom-right-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    // "景区排行"组件
    .scene-rank-main {
      flex: 1.5;
      margin-top: 15px;
    }

    // "年度游客对比"组件
    .tourist-contrast-main {
      flex: 1;
      margin: 15px 0;
    }

    // "预约数据"组件
    .reserve-data-main {
      flex: 1;
    }
  }
}
</style>
