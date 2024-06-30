<template>
  <div class="login_container">
    <!-- ElementPlus默认使用flex布局将一行分为24列。通过row和col组件就可以自由地组合布局。-->
    <!-- el-row组件的gutter属性来指定列之间的间距，其默认值为0 -->
    <el-row>
      <!-- :xs="0"表示当屏幕宽度小于768px时，不展示该组件 -->
      <el-col :span="13" :xs="0"></el-col>
      <!-- :xs="24"表示当屏幕宽度小于768px时，占满一行 -->
      <el-col :span="11" :xs="24">
        <!-- :model="loginForm"属性指将表单数据收集到loginForm对象中 -->
        <!-- :rules="rules"属性指表单的校验规则在rules对象中-->
        <!-- ref="form"属性用于获取el-form组件实例，调用该实例身上的validate方法校验表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="form">
          <h1>Hello</h1>
          <h2>WelCome to GuiGuZhenXuan</h2>
          <!-- 用户名输入框 -->
          <el-form-item prop="username">
            <!-- prop="username"属性表示需要进行校验的值,prop的值对应于rules对象中的属性名 -->
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <!-- prop="password"属性表示需要进行校验的值 -->
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <!-- loading属性用于控制按钮的加载效果 -->
            <el-button class="login_btn" type="primary" size="default" @click="login" :loading="loading">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="index">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/modules/user' // 引入用户相关的小仓库
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time' // 引入获取当前时间的函数

// 收集用户名输入框和密码框中的数据
const loginForm = reactive({ username: 'admin', password: '111111' })
const form = ref() // 获取el-form组件实例
// console.log(form.value)
// --------------- 点击登录按钮后,发送用户登录请求并跳转页面 --------------------
const $router = useRouter() // 获取路由器，用于编程式路由导航
const userStore = useUserStore() // 创建user小仓库的实例
let loading = ref(false) // 定义变量控制登录按钮的加载效果
const login = async () => {
  // validate方法校验成功时会返回成功的Promise对象，校验失败时会返回失败的Promise对象
  // 注意这里是在点击按钮的回调函数里获取子组件的方法，此时当前组件已经成功挂载，子组件必然已经挂载，所以能成功获取，不懂就看vue3/ref详解
  await form.value.validate() // 所有的表单校验通过了再发送请求
  // 只有当validate校验成功时，才会执行下面的代码
  loading.value = true // 点击按钮后，按钮立刻显示加载效果
  try {
    await userStore.userLogin(loginForm)
    // 下面的代码只会在用户登陆成功时执行
    // 请求成功则展示首页信息，利用编程式路由导航跳转页面
    $router.push('/')
    // 使用elementPlus中的组件展示 登陆成功 的提示信息
    ElNotification({
      type: 'success',
      title: `Hi,${getTime()}好`,
      message: '欢迎回来',
    })
    loading.value = false // 登录成功后，结束加载效果
  } catch (error) {
    loading.value = false // 登录失败时，结束加载效果
    // 请求失败则弹出失败信息
    // 使用elementPlus中的组件展示登陆失败的提示信息
    ElNotification({ type: 'error', message: (error as Error).message })
  }
}

// -------------------- 表单校验 ------------------------
// 自定义校验规则 => validateUsernames 函数是自定义校验规则的函数
// rule参数为校验规则对象, value参数为表单元素的文本内容
// callback参数是一个函数，如果校验通过就调用该函数放行;如果校验没通过则调用该函数时传入Error错误信息
const validateUsername =  (rule: any, value: any, callback: any) => {
  if (value.length >= 5 && value.length <= 10) callback()
  else callback(new Error('账号长度至少5位，至多10位'))
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 10) callback()
  else callback(new Error('密码长度至少6位，至多10位'))
}
// 配置表单校验规则
const rules = {
  // 1. -------- 默认校验规则配置 ---------
  // required属性表示该字段必须要校验
  // message属性表示校验失败时的提示信息
  // trigger属性表示触发校验的时机，blur表示失去焦点时触发校验，change表示文本发生变化时触发校验
  // username: [{ required: true, min: 5, max: 10, message: '用户名长度至少6位，至多10位', trigger: 'change' }],
  // password: [{ required: true, min: 6, max: 15, message: '用户名长度至少6位，至多15位', trigger: 'change' }],
  // 2. -------- 自定义校验规则 ---------
  // 配置validator属性和自定义校验函数
  username: [{ validator: validateUsername, trigger: 'change' }],
  password: [{ validator: validatePassword, trigger: 'change' }],
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    width: 70%;
    position: relative;
    top: 35vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
