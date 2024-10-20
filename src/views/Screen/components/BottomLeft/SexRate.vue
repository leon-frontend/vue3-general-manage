<script setup lang="ts" name="SexRate">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// barChartRef 用于获取"柱状图"的容器 DOM 元素
const barChartRef = ref<HTMLDivElement | null>(null)

// 组件挂载到页面中后，初始化 echarts 实例
onMounted(() => {
  // 初始化 barChart 实例
  const barChart = echarts.init(barChartRef.value)

  // 设置 barChart 实例的配置项，即绘制图表
  barChart.setOption({
    // X 轴配置
    xAxis: { show: false, min: 0, max: 100 },
    // Y 轴配置
    yAxis: { show: false, type: 'category' },
    // 系列配置，决定图表的类型
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100, // 将"男士柱条"盖在"女士柱条"上面
        itemStyle: {
          color: '#007AFE',
          borderRadius: 50,
        },
      },
      {
        type: 'bar',
        data: [100], // 将"女士柱条"设置为 100%，然后将"男士柱条"盖在"女士柱条"上面
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: '#FF4B7A',
          borderRadius: 50,
        },
      },
    ],
    // 布局
    grid: {
      left: 70,
      right: 70,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<template>
  <div class="sex-main">
    <!-- 顶部"标题"区域 -->
    <div class="title">
      <p>男女比例</p>
      <img src="@/assets/screenImgs/dataScreen-title.png" />
    </div>
    <!-- 男女图片展示区域 -->
    <div class="sex-imgs">
      <div class="male">
        <img src="@/assets/screenImgs/man.png" alt="" />
      </div>
      <div class="female">
        <img src="@/assets/screenImgs/woman.png" alt="" />
      </div>
    </div>
    <!-- "男女比例"的文本展示区域 -->
    <div class="rate-text">
      <p class="male-text">男士 58%</p>
      <p class="female-text">女士 42%</p>
    </div>
    <!-- "男女比例"的 echarts 图表展示区域 -->
    <div ref="barChartRef" class="rate-echarts"></div>
  </div>
</template>

<style lang="scss" scoped>
.sex-main {
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

// 男女图片展示区域
.sex-imgs {
  display: flex;
  justify-content: center;
  margin-top: 10px;

  .male {
    margin: 10px 40px;
    width: 111px;
    height: 115px;
    background: url('@/assets/screenImgs/man-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .female {
    margin: 10px 40px;
    width: 111px;
    height: 115px;
    background: url('@/assets/screenImgs/woman-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// "男女比例"的文本展示区域的样式
.rate-text {
  display: flex;
  justify-content: space-between;
  font-size: 15px;

  .male-text {
    margin-left: 70px;
  }

  .female-text {
    margin-right: 70px;
  }
}

//"男女比例"的 echarts 图表展示区域的样式
.rate-echarts {
  height: 60px;
}
</style>
