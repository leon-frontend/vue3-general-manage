<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="">
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts" name="index">
import setting from '@/setting' // 引入设置标题与logo配置文件
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 20px;
  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  p {
    font-size: $base-logo-title-fontsize;
  }
}
</style>