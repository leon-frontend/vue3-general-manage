<script setup lang="ts" name="TouristContrast">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// scatterChartRef 用于获取"散点图"的 DOM 元素
const scatterChartRef = ref<HTMLDivElement | null>()

// 组件挂载到页面中后，初始化 echarts 实例，实现一个容器展示多个 echarts 图表
onMounted(() => {
  // 初始化 scatterChart 实例
  const scatterChart = echarts.init(scatterChartRef.value)

  // 设置 scatterChart 实例的配置项，即绘制图表
  scatterChart.setOption({
    // 标题配置
    title: {
      text: '散点图', // 主标题
      left: '42%', // 调整标题的位置
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
    yAxis: {
      // 展示 Y 轴
      axisLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    // eCharts 的图表配置
    series: [
      // 柱状图
      {
        type: 'scatter',
        data: [33, 88, 21, 29, 88, 123, 56, 172, 123, 478, 345, 526],
        // 标记图形设置
        symbol: 'diamond',
        // 标记图形中的文本
        label: {
          show: true,
          position: 'top',
          color: 'white',
          fontSize: '14px',
        },
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
  <div class="tourist-contrast-main">
    <!-- 顶部"标题"区域 -->
    <div class="title">
      <p>年度游客量对比</p>
      <img src="@/assets/screenImgs/dataScreen-title.png" />
    </div>
    <!-- echarts 散点图的容器 -->
    <div ref="scatterChartRef" class="scatter-chart"></div>
  </div>
</template>

<style lang="scss" scoped>
.tourist-contrast-main {
  width: 100%;
  height: 100%;
  background: url('@/assets/screenImgs/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  color: white;
}

// 顶部"标题"区域
.title {
  margin-left: 10px;

  p {
    font-size: 25px;
  }
}

// echarts 散点图形的容器
.scatter-chart {
  height: calc(100% - 90px); // 必须有高度
  margin-top: 20px;
}
</style>
