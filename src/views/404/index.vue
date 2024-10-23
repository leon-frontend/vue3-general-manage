<script setup lang="ts" name="404">
import { useRouter } from 'vue-router'

const $router = useRouter()
</script>

<template>
  <div class="error-container">
    <img src="@/assets/images/error_images/404.png" />
    <button @click="$router.push('/home')">首页</button>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    width: 70px;
    height: 50px;
    background-color: skyblue;
  }
}
</style>
