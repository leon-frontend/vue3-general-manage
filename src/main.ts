import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 配置 element-plus 国际化语言
import 'virtual:svg-icons-register' // svg插件需要的配置代码
import globalComponent from '@/components' // 引入用于注册全局组件的自定义插件
import '@/styles/index.scss' // 引入模板的全局样式
import router from '@/router' // 引入路由模块
import pinia from '@/store' // 引入pinia

const app = createApp(App)

// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // 将组件库中的语言设置成中文
})

app.use(globalComponent) // 使用 use 方法安装自定义插件
app.use(pinia) // 注册 pinia
app.use(router) // 注册路由
import '@/router/permission' // 引入路由鉴权的文件
app.mount('#app')
