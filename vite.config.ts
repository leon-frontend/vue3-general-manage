import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 动态获取当前环境下的对应变量，process.cwd() 用于获取文件的根目录
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 将 SVG 图标放在 src/assets/icons 文件夹下
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]', // Specify symbolId format
      }),
      viteMockServe({
        enable: command === 'serve', //用于判断当前的环境，只用于开发环境
      }),
      VueSetupExtend(),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // scss全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          // 指明全局变量的文件名
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 实现跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
