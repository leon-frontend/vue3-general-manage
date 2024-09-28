// vite.config.ts
import { defineConfig, loadEnv } from "file:///F:/Users/Lee/Desktop/vue3-general-manage/node_modules/.pnpm/vite@5.2.13_@types+node@20.14.7_sass@1.77.5/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/Users/Lee/Desktop/vue3-general-manage/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.2.13_@types+node@20.14.7_sass@1.77.5__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { createSvgIconsPlugin } from "file:///F:/Users/Lee/Desktop/vue3-general-manage/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.2.13_@types+node@20.14.7_sass@1.77.5_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { viteMockServe } from "file:///F:/Users/Lee/Desktop/vue3-general-manage/node_modules/.pnpm/vite-plugin-mock@3.0.2_esbuild@0.20.2_mockjs@1.1.0_vite@5.2.13_@types+node@20.14.7_sass@1.77.5_/node_modules/vite-plugin-mock/dist/index.mjs";
import VueSetupExtend from "file:///F:/Users/Lee/Desktop/vue3-general-manage/node_modules/.pnpm/vite-plugin-vue-setup-extend@0.4.0_vite@5.2.13_@types+node@20.14.7_sass@1.77.5_/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 将 SVG 图标放在 src/assets/icons 文件夹下
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
        // Specify symbolId format
      }),
      viteMockServe({
        enable: command === "serve"
        //用于判断当前的环境，只用于开发环境
      }),
      VueSetupExtend()
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src")
        // 相对路径别名配置，使用 @ 代替 src
      }
    },
    // scss全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          // 指明全局变量的文件名
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    // 实现跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxVc2Vyc1xcXFxMZWVcXFxcRGVza3RvcFxcXFx2dWUzLWdlbmVyYWwtbWFuYWdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxVc2Vyc1xcXFxMZWVcXFxcRGVza3RvcFxcXFx2dWUzLWdlbmVyYWwtbWFuYWdlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9Vc2Vycy9MZWUvRGVza3RvcC92dWUzLWdlbmVyYWwtbWFuYWdlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xuaW1wb3J0IHsgdml0ZU1vY2tTZXJ2ZSB9IGZyb20gJ3ZpdGUtcGx1Z2luLW1vY2snXG5pbXBvcnQgVnVlU2V0dXBFeHRlbmQgZnJvbSAndml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgLy8gXHU1MkE4XHU2MDAxXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0XHU1QkY5XHU1RTk0XHU1M0Q4XHU5MUNGXHVGRjBDcHJvY2Vzcy5jd2QoKSBcdTc1MjhcdTRFOEVcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTc2ODRcdTY4MzlcdTc2RUVcdTVGNTVcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIC8vIFx1NUMwNiBTVkcgXHU1NkZFXHU2ODA3XHU2NTNFXHU1NzI4IHNyYy9hc3NldHMvaWNvbnMgXHU2NTg3XHU0RUY2XHU1OTM5XHU0RTBCXG4gICAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL2ljb25zJyldLFxuICAgICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJywgLy8gU3BlY2lmeSBzeW1ib2xJZCBmb3JtYXRcbiAgICAgIH0pLFxuICAgICAgdml0ZU1vY2tTZXJ2ZSh7XG4gICAgICAgIGVuYWJsZTogY29tbWFuZCA9PT0gJ3NlcnZlJywgLy9cdTc1MjhcdTRFOEVcdTUyMjRcdTY1QURcdTVGNTNcdTUyNERcdTc2ODRcdTczQUZcdTU4ODNcdUZGMENcdTUzRUFcdTc1MjhcdTRFOEVcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcbiAgICAgIH0pLFxuICAgICAgVnVlU2V0dXBFeHRlbmQoKSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKCcuL3NyYycpLCAvLyBcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcdTUyMkJcdTU0MERcdTkxNERcdTdGNkVcdUZGMENcdTRGN0ZcdTc1MjggQCBcdTRFRTNcdTY2RkYgc3JjXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NzY4NFx1OTE0RFx1N0Y2RVxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgLy8gXHU2MzA3XHU2NjBFXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHU3Njg0XHU2NTg3XHU0RUY2XHU1NDBEXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6ICdAaW1wb3J0IFwiLi9zcmMvc3R5bGVzL3ZhcmlhYmxlLnNjc3NcIjsnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIFx1NUI5RVx1NzNCMFx1OERFOFx1NTdERlxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgW2Vudi5WSVRFX0FQUF9CQVNFX0FQSV06IHtcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1NFUlZFLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVCxTQUFTLGNBQWMsZUFBZTtBQUMxVixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sb0JBQW9CO0FBRzNCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFFakQsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUV2QyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixxQkFBcUI7QUFBQTtBQUFBLFFBRW5CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQSxRQUMxRCxVQUFVO0FBQUE7QUFBQSxNQUNaLENBQUM7QUFBQSxNQUNELGNBQWM7QUFBQSxRQUNaLFFBQVEsWUFBWTtBQUFBO0FBQUEsTUFDdEIsQ0FBQztBQUFBLE1BQ0QsZUFBZTtBQUFBLElBQ2pCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxPQUFPO0FBQUE7QUFBQSxNQUMzQjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUE7QUFBQSxVQUVuQixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLENBQUMsSUFBSSxpQkFBaUIsR0FBRztBQUFBLFVBQ3ZCLFFBQVEsSUFBSTtBQUFBLFVBQ1osY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
