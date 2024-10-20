<script setup lang="ts" name="SceneRank">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// echartsRef 用于获取"echarts"的 DOM 元素
const echartsRef = ref<HTMLDivElement | null>()

// 组件挂载到页面中后，初始化 echarts 实例，实现一个容器展示多个 echarts 图表
onMounted(() => {
  // 初始化 charts 实例
  const charts = echarts.init(echartsRef.value)

  // 设置 charts 实例的配置项，即绘制图表
  charts.setOption({
    // 标题配置
    title: {
      text: '景区排行', // 主标题
      left: '41%', // 调整标题的位置
      textStyle: {
        color: 'white',
        fontSize: 20,
      },
    },
    // X 轴
    xAxis: {
      type: 'category', // 图表的 X 轴均匀分布
    },
    // Y 轴
    yAxis: {},
    // eCharts 的图表配置
    series: [
      // 柱状图
      {
        type: 'bar',
        data: [20, 30, 40, 50],
        // 配置图表上的文本
        label: {
          show: true,
          position: 'inside',
          fontSize: 18,
        },
        showBackground: true, // 是否显示背景颜色
        // 设置背景颜色
        backgroundStyle: {
          color: 'gray',
        },
        // 设置柱条的样式
        itemStyle: {
          borderRadius: [15, 15, 0, 0],
        },
      },
      // 折线图
      {
        type: 'line',
        data: [30, 100, 10, 60],
        smooth: true,
      },
    ],
    // 布局
    grid: {
      left: 40,
      right: 10,
      top: 30,
      bottom: 20,
    },
  })
})
</script>

<template>
  <div class="scene-rank-main">
    <!-- 顶部"标题"区域 -->
    <div class="title">
      <p>热门景区排行</p>
      <img src="@/assets/screenImgs/dataScreen-title.png" />
    </div>
    <!-- echarts 图形的容器 -->
    <div ref="echartsRef" class="echarts"></div>
  </div>
</template>

<style lang="scss" scoped>
.scene-rank-main {
  width: 100%;
  height: 100%;
  background: url('@/assets/screenImgs/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  color: white;
}

// 顶部"标题"区域
.title {
  margin: 10px 0;
  margin-left: 10px;

  p {
    font-size: 25px;
  }
}

// echarts 图形的容器
.echarts {
  height: calc(100% - 85px); // 必须有高度
  margin-top: 20px;
}
</style>
