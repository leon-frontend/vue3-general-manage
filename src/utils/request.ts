// axios 二次封装，并配置请求拦截器和响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules'
import { storeToRefs } from 'pinia'

// 1. 利用create方法创建axios实例，create方法的好处是可以配置基础路径、超时时间等。
const request = axios.create({
  // baseURL表示基础路径，VITE_APP_BASE_API = '/api'是开发环境的全局变量
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径上会携带/api
  timeout: 5000, // 超时时间
})

// 2. 请求拦截器
request.interceptors.request.use((config) => {
  // 获取 userStore 仓库，并响应式解构出该仓库中的 token 响应式数据
  const userStore = useUserStore()
  const { token } = storeToRefs(userStore)

  // config 对象中的 headers 属性表示请求头，常用于携带公共参数（比如携带 token）
  if (token.value) config.headers.token = token.value

  return config // 必须返回配置对象
})

// 3. 响应拦截器
request.interceptors.response.use(
  // 响应成功时，对返回的数据先进行一次解构
  (response) => response.data,
  // 响应失败时，处理错误
  (error) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)

export default request
