<script setup lang="ts" name="LineChart">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// lineChartRef 用于获取"折线图"的容器 DOM 元素
const lineChartRef = ref<HTMLDivElement | null>(null)

// 组件挂载到页面中后，初始化 echarts 实例
onMounted(() => {
  // 初始化 lineChart 实例
  const lineChart = echarts.init(lineChartRef.value)

  // 设置 lineChart 实例的配置项，即绘制图表
  lineChart.setOption({
    // 标题配置
    title: {
      text: '访问量',
      textStyle: {
        color: 'white',
        fontSize: '14px',
      },
    },
    // X 轴配置
    xAxis: {
      type: 'category',
      boundaryGap: false, // X 轴两侧不留白
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    // Y 轴配置
    yAxis: {
      // Y 轴的轴线配置
      axisLine: {
        show: true,
      },
      // Y 轴的轴线上的刻度配置
      axisTick: {
        show: true,
      },
      // Y 轴分割线配置
      splitLine: {
        show: false, // 隐藏 Y 轴分割线
      },
    },
    // 折线图配置
    series: [
      {
        type: 'line',
        smooth: true, // 设置为平滑曲线
        data: [0, 120, 1240, 66, 2299, 890, 1200],
        // 区域填充样式。设置后显示成区域面积图。
        areaStyle: {
          color: {
            // 区域填充颜色为 线性渐变
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'red', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
    // 布局
    grid: {
      top: 35,
      bottom: 20,
      left: 45,
      right: 20,
    },
  })
})
</script>

<template>
  <div class="line-chart-main">
    <!-- 顶部"标题"区域 -->
    <div class="title">
      <p>未来 7 天游客星趋势图</p>
      <img src="@/assets/screenImgs/dataScreen-title.png" />
    </div>
    <!-- echarts 折线图容器 -->
    <div ref="lineChartRef" class="line-chart"></div>
  </div>
</template>

<style lang="scss" scoped>
.line-chart-main {
  width: 100%;
  height: 100%;
  background: url('@/assets/screenImgs/dataScreen-main-cb.png') no-repeat;
  background-origin: content-box;
  background-size: 100% 100%;
  padding: 0 25px;
  color: white;
}

// 顶部"标题"区域
.title {
  margin: 0 0 5px 7px;

  p {
    font-size: 20px;
  }
}

// echarts 折线图容器
.line-chart {
  height: calc(100% - 60px);
}
</style>
