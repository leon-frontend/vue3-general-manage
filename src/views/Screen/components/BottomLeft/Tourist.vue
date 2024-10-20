<script setup lang="ts" name="Tourist">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

// touristNums 用于收集"游客人数"的数据
const touristNums = ref<string>('215908人')

//#region ------------------------- "水球图"相关的业务逻辑 -----------------------------
// liquidfillRef 用于获取"水球图"的 DOM 元素
const liquidfillRef = ref<HTMLDivElement | null>()

// 组件挂载到页面中后，初始化 echarts 实例
onMounted(() => {
  // 初始化 liquidfillChart 实例
  const liquidfillChart = echarts.init(liquidfillRef.value)

  // 设置 liquidfillChart 实例的配置项，即绘制图表
  liquidfillChart.setOption({
    // 标题配置
    title: {
      text: '水球图',
      textStyle: {
        color: 'skyblue',
      },
    },
    // X 轴配置
    // xAxis: {},
    // Y 轴配置
    // yAxis: {},
    // 系列配置，决定图表的类型
    series: [
      {
        type: 'liquidFill',
        data: [0.6, 0.4],
        radius: '80%',
        color: ['#23BACB', '#23BACB'],
        outline: {
          show: true,
          borderDistance: 10,
          itemStyle: {
            color: 'none',
            borderColor: '#294D99',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
          },
        },
        backgroundStyle: {
          color: 'none',
        },
      },
    ],
    // 布局
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
//#endregion ---------------------- "水球图"相关的业务逻辑 -----------------------------
</script>

<template>
  <div class="tourist-main">
    <!-- 顶部"标题"区域 -->
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="title-img"></p>
      <p class="subtitle">
        可预约总量
        <span>999</span>
        人
      </p>
    </div>
    <!-- "游客人数"展示区 -->
    <div class="tourist-nums">
      <!-- 遍历 touristNums 字符串中的每一个字符 -->
      <span v-for="(num, index) in touristNums" :key="index" class="num">
        {{ num }}
      </span>
    </div>
    <!-- echarts 水球图展示区 -->
    <div ref="liquidfillRef" class="liquidfill-charts"></div>
  </div>
</template>

<style lang="scss" scoped>
.tourist-main {
  background: url('@/assets/screenImgs/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
}

// 顶部"标题"区域的相关样式
.top {
  color: white;
  margin-left: 5px;

  // 主标题样式
  .title {
    margin: 5px 0 10px 0;
    font-size: 25px;
  }

  // 标题下的图片样式
  .title-img {
    width: 68px;
    height: 7px;
    background: url('@/assets/screenImgs/dataScreen-title.png') no-repeat;
    background-size: 100% 100%;
  }

  // 副标题样式
  .subtitle {
    float: right;
    font-size: 20px;
    margin-right: 15px;

    // "数字文本"的样式
    span {
      color: yellow;
    }
  }
}

// 显示"游客人数"的盒子样式
.tourist-nums {
  margin-top: 40px;
  padding: 15px;
  display: flex;

  // "游客人数"中的每个"数字"的样式
  .num {
    flex: 1;
    height: 60px;
    text-align: center;
    line-height: 60px;
    background: url('@/assets/screenImgs/total.png') no-repeat;
    background-size: 100% 100%;
    color: #29fcff;
    font-size: 30px;
  }
}

// echarts 水球图展示区
.liquidfill-charts {
  width: 100%;
  height: 245px;
}
</style>
