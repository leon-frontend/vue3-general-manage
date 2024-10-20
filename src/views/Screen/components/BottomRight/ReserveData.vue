<script setup lang="ts" name="ReserveData">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// radarChartRef 用于获取"雷达图"的 DOM 元素
const radarChartRef = ref<HTMLDivElement | null>()

// 组件挂载到页面中后，初始化 echarts 实例
onMounted(() => {
  // 初始化 radarChart 实例
  const radarChart = echarts.init(radarChartRef.value)

  // radarChartOption 是雷达图图表的配置项
  const radarChartOption = {
    title: {
      text: '雷达图',
      textStyle: {
        color: 'white',
      },
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending',
          },
        ],
      },
    ],
  }

  // 设置 radarChart 实例的配置项，即绘制图表
  radarChart.setOption(radarChartOption)
})
</script>

<template>
  <div class="reserve-data-main">
    <!-- 顶部"标题"区域 -->
    <div class="title">
      <p>预约数据统计</p>
      <img src="@/assets/screenImgs/dataScreen-title.png" />
    </div>
    <!-- echarts 雷达图的容器 -->
    <div ref="radarChartRef" class="radar-chart"></div>
  </div>
</template>

<style lang="scss" scoped>
.reserve-data-main {
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

// echarts 雷达图形的容器
.radar-chart {
  height: calc(100% - 80px); // 必须有高度
  margin-top: 20px;
}
</style>
