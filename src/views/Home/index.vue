<script setup lang="ts" name="Home">
import { useUserStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { getTime } from '@/utils/time'

const userStore = useUserStore() // 获取 userStore 小仓库
const { userAvatar, userName } = storeToRefs(userStore) // 响应式解构仓库中的数据
</script>

<template>
  <div>
    <el-card>
      <div class="box">
        <el-image :src="userAvatar" class="avatar" />
        <div class="title-container">
          <h1 class="title">{{ getTime() }}好！{{ userName }}</h1>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="svgImg">
      <svgIcon name="welcome" width="600" height="500" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .title-container {
    margin-left: 30px;

    .title {
      font-size: 30px;
      font-weight: bolder;
      margin: 10px 0 15px 0;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.svgImg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
