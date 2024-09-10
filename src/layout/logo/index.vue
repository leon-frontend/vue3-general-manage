<script setup lang="ts" name="Logo">
import setting from '@/setting'
</script>

<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  width: 260px;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 12px;

  img {
    width: 40px;
    height: 40px;
    margin-right: 20px;
  }

  p {
    font-size: $base-logo-title-fontsize;
  }
}
</style>
