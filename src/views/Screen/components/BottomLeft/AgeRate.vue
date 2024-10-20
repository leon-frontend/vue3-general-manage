<script setup lang="ts" name="AgeRate">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// pieChartRef 用于获取"饼图"的容器 DOM 元素
const pieChartRef = ref<HTMLDivElement | null>(null)

// 组件挂载到页面中后，初始化 echarts 实例
onMounted(() => {
  // 初始化 pieChart 实例
  const pieChart = echarts.init(pieChartRef.value)

  // 设置 pieChart 实例的配置项，即绘制图表
  pieChart.setOption({
    tooltip: {
      trigger: 'item',
    },
    // 图例列表配置
    legend: {
      top: 40,
      right: 75,
      orient: 'vertical', // 图例组件的方向设置
      textStyle: {
        color: 'white',
        fontSize: 20,
      },
    },
    // "饼图"配置
    series: [
      {
        name: '年龄比例',
        type: 'pie',
        radius: ['40%', '90%'], // 可以设置扇形的宽度
        right: 100, // pie chart组件离容器右侧的距离
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 15,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '娱乐' },
          { value: 484, name: '直播' },
          { value: 300, name: '财经' },
        ],
      },
    ],
  })
})
</script>

<template>
  <div class="age-main">
    <!-- 顶部"标题"区域 -->
    <div class="title">
      <p>年龄比例</p>
      <img src="@/assets/screenImgs/dataScreen-title.png" />
    </div>
    <!-- echarts 饼图容器 -->
    <div ref="pieChartRef" class="pie-echarts"></div>
  </div>
</template>

<style lang="scss" scoped>
.age-main {
  width: 100%;
  height: 100%;
  background: url('@/assets/screenImgs/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  color: white;
}

// 顶部"标题"区域
.title {
  margin-left: 5px;

  p {
    font-size: 25px;
  }
}

// echarts 饼图容器
.pie-echarts {
  height: 235px;
}
</style>
