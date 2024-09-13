import { App } from 'vue'
// 引入需要注册为全局组件的组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 声明一个包含所有全局组件的对象，使用Record给对象的键值对添加类型
const allGlobalComponents: Record<string, any> = {
  SvgIcon,
  Pagination,
  Category,
}

// 封装一个自定义插件，作用是用于将组件注册为全局组件
// 暴露一个包含 install 方法的插件对象
export default {
  // install方法的参数是app实例
  install(app: App) {
    // 将allGlobalComponents中的所有组件注册为全局组件
    // Object.keys(allGlobalComponents)的值为['SvgIcon', 'Pagination']
    Object.keys(allGlobalComponents).forEach((item) =>
      app.component(item, allGlobalComponents[item]),
    )

    // 将 element-plus 提供的所有图表注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
