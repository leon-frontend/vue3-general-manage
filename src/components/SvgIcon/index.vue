<template>
  <!-- svg标签是svg图标的外层容器节点，内部需要与use标签结合使用 -->
  <svg :style="{ width, height }">
    <!-- 可以通过style属性调整svg图片的宽高 -->
    <!-- 通过use标签的xlink:href="#icon-xxx"属性指定使用的SVG图标,xxx指svg图标的文件名 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts" name="index">
// 使用defineProps接受父组件传递过来的参数，使用withDefaults设置默认值
// prefix 表示表示SVG图标名的前缀，这个值是可传值且值是固定的，即#icon-
// name 表示svg文件名，这个值是必传值，且不固定
withDefaults(
  defineProps<{
    prefix?: string
    name: string
    color?: string
    width?: string
    height?: string
  }>(),
  {
    prefix: () => '#icon-',
    color: () => '', // color 表示颜色，用于use标签的fill属性值
    width: () => '16px', // width和height表示图标的宽高
    height: () => '16px',
  },
)
</script>

<style lang="css" scoped></style>
