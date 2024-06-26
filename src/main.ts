import { createApp } from 'vue'
// 完整引入 => 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
// 配置 element-plus 国际化语言
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// svg插件需要的配置代码
import 'virtual:svg-icons-register'
// 引入用于注册全局组件的自定义插件
import globalComponent from '@/components'
// 引入模板的全局样式
import '@/styles/index.scss'
// 引入路由模块
import router from '@/router'
// 引入pinia
import pinia from '@/store'

const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // 将组件库中的语言设置成中文
})
app.use(globalComponent) // 使用use方法安装自定义插件
app.use(pinia) // 注册pinia
app.use(router) // 注册路由

app.mount('#app')
