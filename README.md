# 00. 项目简介

- **服务器域名**：<http://sph-api.atguigu.cn>
- **接口文档 1**：<http://139.198.104.58:8212/swagger-ui.html#/>
- **接口文档 2**：<http://39.98.123.211:8510/swagger-ui.html>

# 01. 路由切换 & 路由守卫

## 1.1 切换路由组件时，实现过渡动效

- 文件位置：**`src/layout/Main/index.vue`**

- 参考：<https://router.vuejs.org/zh/guide/advanced/transitions.html>

```html
<template>
  <!-- 路由组件的出口位置 -->
  <router-view v-slot="{ Component }">
    <!-- 在切换路由组件时, 实现过渡动效 -->
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<style lang="scss" scoped>
  .fade-enter-from {
    opacity: 0;
  }
  .fade-enter-active {
    transition: all 0.7s;
  }
  .fade-enter-to {
    opacity: 1;
  }
</style>
```

## 1.2 任意路由切换时展示进度条 & 全局路由守卫

- 使用 **nprogress 库**实现，该库是一个 JS 库，由于没有 TS 类型定义，所以还需要安装 **@types/nprogress 库**来给其提供 TS 类型，防止编译时报错。
- 在引入该库时，**一定要引入其 CSS 样式文件**，并且可以在该样式文件中自定义样式。
- **全局路由守卫**：任意路由切换都会触发的钩子。

```ts
// 1. ----------------- 安装 nprogress 库和 @types/nprogress 库 -----------------
pnpm add --save nprogress
pnpm add --save-dev @types/nprogress

// 2. ----------------- 利用全局路由守卫实现任意路由切换时展示进度条 -----------------
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css' // 一定要引入进度条的样式

nprogress.configure({ showSpinner: false }) // 不展示右侧的旋转器

// 全局前置守卫：访问任意路由之前会触发的钩子。to 指将要访问的路由；from 指从哪个路由而来；next 指路由的放行函数
router.beforeEach((to, from, next) => {
  nprogress.start() // 在前置守卫中开启进度条
  next()
})

// 全局后置守卫：在后置守卫中实现进度条"终止"
router.afterEach((to, from) => { nprogress.done() })
```

## 1.3 路由鉴权 & 全局路由守卫

- 使用 **token** 实现路由鉴权，即路由组件的访问权限设置。
- **全部路由组件**：**`login|404|Home|Screen|Auth(三个子路由)|Product(四个子路由)`**
- **用户未登录的情况**：用户未登录时，**只能访问 Login 页面**。访问其他页面时，重定向至 Login 页面，并**将想要访问的页面作为 query 参数携带在路由中**，用于用户登录成功后，直接跳转到指定页面（查看 **04.用户登录**）。
- **用户登录成功的情况**：用户登录成功之后，**不能访问 Login 页面**，会直接重定向至首页。其他路由组件正常访问。
- **获取用户信息**：用户登陆成功后，访问除了 Login 以外的组件时，都需要获取"用户姓名和用户头像"信息**供顶部展示区域使用**。
  - 若用户信息存在，则直接放行；
  - 若用户信息不存在（如刷新页面会清除仓库中的用户信息数据），则**发送获取用户信息的请求**。
    - 当请求成功获取用户信息时，放行；
    - 若请求失败（如 token 失效），则首先需要退出登录，然后将路由重定向至 Login 页面。
- 访问某一个路由页面时，**动态切换标签页的标题**。

```ts
// 实现路由鉴权
router.beforeEach(async (to, from, next) => {
  document.title = '硅谷甄选 - ' + to.meta.title // 访问某一个路由页面时，动态切换标签页的标题
  nprogress.start() // 在前置守卫中开启进度条

  // 从 userStore 小仓库中获取 token、用户姓名和用户头像
  const { token, username, getUserInfo, userLogout } = userStore

  // token 若存在，则表示用户已登录；token 若不存在，则表示用户未登录
  if (token) {
    // 用户登录成功的情况
    if (to.path === '/login') next({ path: '/' })
    else {
      // 若用户信息存在，则直接放行；若用户信息不存在，则发送获取用户信息的请求之后，再放行
      if (username)
        next() // 用户信息存在，直接放行
      else {
        // 用户信息不存在的情况
        try {
          await getUserInfo() // 发请求获取用户信息
          
          // 注意：若刷新的时候是异步路由，有可能获取到了用户信息，但是异步路由还没有加载完毕，则出现"白屏情况"
          // next({ ...to }) 的作用： 重新触发导航，确保新的路由配置或权限设置生效。
          // 另外，通过对象展开运算符 { ...to }，创建了一个新的路由对象，避免了使用 next(to) 可能引起的导航循环问题。
          next({ ...to }) // 获取用户信息成功之后，且异步路由组件加载完毕之后，再放行
        } catch (error) {
          // 发请求获取用户信息失败时（如 token 过期），会执行下面的代码
          userLogout() // 首先退出登录：清空用户的相关数据
          next({ path: '/login', query: { redirect: to.path } }) // 重定向至 Login 页面，并携带原本要访问的路由
        }
      }
    }
  } else {
    // 用户未登录的情况
    if (to.path === '/login') next()
    else next({ path: '/login', query: { redirect: to.path } })
  }
})
```

# 02. 顶部展示区域

## 2.1 实现面包屑

- **根据当前匹配的路由，动态生成"面包屑"的 HTML 结构**：使用 **`route.matched`** 属性获取当前匹配的所有路由，比如若当前路由是 **`/auth/user`** ，则该属性会返回一个**包含一级路由信息和二级路由信息的数组**，即**`[{path: '/auth', ...}, {path: '/auth/user', ...}]`**。然后使用 **v-for** 指令根据这个数组动态渲染 HTML 结构。
- **特殊处理"首页"的"面包屑"渲染**：首页匹配的路由是二级路由，但是由于其一级路由是 **`'/'`**，所以**不需要渲染一级路由的信息**。在配置 **`'/'`** 路由信息时，**不要配置 title 属性**，然后使用路由信息 **`v-show="item.meta.title"`** 进行条件渲染即可。
  - **这里不能使用 v-if**：因为在 Vue 3 中 **v-if 的优先级要高于 v-for** ，但是这里又需要使用到 v-for 中的 item 数据，所以**必须让 v-for 先执行**，因此选择使用 v-show 指令。

```html
<el-breadcrumb separator-icon="ArrowRight">
  <!-- 面包屑动态展示路由名字与标题 -->
  <el-breadcrumb-item
    v-for="item in route.matched"
    :key="item.path"
    v-show="item.meta.title"
  >
    <!-- 面包屑展示匹配路由的图标 -->
    <el-icon style="margin-right: 5px">
      <component :is="item.meta.icon" />
    </el-icon>
    <!-- 面包屑展示匹配路由的标题 -->
    <span>{{ item.meta.title }}</span>
  </el-breadcrumb-item>
</el-breadcrumb>
```

## 2.2 实现全屏模式

- **document.fullscreenElement** 属性是 DOM 对象的一个属性，可以判断当前是不是全屏模式。若是全屏模式，则返回 true；若不是全屏模式，则返回 false。
- **全屏模式的切换**：使用 **`document.documentElement.requestFullScreen()`** 方法实现全屏模式；使用 **`document.exitFullScreen()`** 方法退出全屏模式。

```ts
// handleFullScreen 作为"全屏"按钮的点击事件回调
const handleFullScreen = () => {
  // fullscreenElement 属性(DOM 对象的一个属性)可以判断当前是不是全屏模式。
  let fullScreen = document.fullscreenElement

  // 全屏模式的切换
  fullScreen
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen()
}
```

# 04. 用户登录 & 退出登录

- 用户退出登陆时，要记录当前展示的页面，当用户再次登录时，需要直接**重定向到用户退出登录前的页面**。可以使用**路由传参**实现。

```ts
// 用户退出登录，重定向到"登录页面"，此时可以使用路由传参的方式需要记录当前展示的页面
$router.push({ path: '/login', query: { redirect: $route.path } })

// ---------------------- Login.vue 组件 ----------------------
/**
 * 用户登录请求成功则利用编程式路由导航跳转页面。
 * 判断路由中是否存在 query 参数，若存在则跳转到 query 参数指定的路由
 * 注：query 参数中的 rediect 的属性值保存了上次退出登陆时展示的页面
 */
const redirect = $route.query.redirect
redirect
  ? $router.push({ path: redirect as string })
  : $router.push({ path: '/' })
```

# 05. 商品管理页面

## 5.1 品牌管理页面 & 分页器

- 分页器的 **layout** 属性中的 **`->`** 符号表示将 sizes, total 两个组件在页面中的布局是**向右对齐**。
- **分页器相关的请求**：**`/admin/product/baseTrademark/{page}/{limit}`** 根据**当前页**和**每页展示的数据数量**来获取当前页展示的数据。
- **事件处理 1**：**`@current-change`** 事件会在 `current-page` 改变时触发，**并且向回调函数的形参注入更新后的 current-page 的值**。当其发生变化时，就需要**重新发送请求**，获取对应分页展示的数据的。
  - 对于 **`@current-change`** 事件，由于该回调函数只需要重新发送请求获取数据，所以可直接将 getHasTradeMark 函数作为其回调函数。
- **事件处理 2**：**`@size-change`** 事件会在 `page-size` 改变时触发，**并且向回调函数的形参注入更新后的 page-size 的值**。
  - 对于 **`@size-change`** 事件，由于在其回调函数中**存在多个业务逻辑**，所以需要专门为其定义一个回调函数。
  - 额外的业务逻辑：当页面展示的数据数量发生变化时，**将"当前页"设置为第一页**。
- **注意**：尽管 `pageNo.value = 1` 的**更新是异步**的，但 Vue 的响应式系统保证了在任何事件回调（比如 `handlePageSizeChange`）或生命周期钩子（比如 `onMounted`）被触发前，**相关的响应式数据已经完成更新**。

```vue
<script setup lang="ts" name="TradeMark">
const pageNo = ref<number>(1) // 当前页码
const pageSize = ref<number>(3) // 每页展示多少条数据

// 将获取已有品牌数据的方法封装成 getHasTradeMark 函数
const getHasTradeMark = async () => {
  const result = await reqHasTradeMark(pageNo.value, pageSize.value) // 发送获取已有品牌数据请求

  // 当返回的状态码为 200 时，表示请求响应成功
  if (result.code === 200) {
    total.value = result.data.total // 更新表格展示数据的总数
    tradeMarkData.value = result.data.records // 更新已有品牌的数据
  }
}

// 当页面展示的数据数量发生变化时，会触发 handlePageSizeChange 回调函数
const handlePageSizeChange = () => {
  // 当页面展示的数据数量发生变化时，首先将"当前页"设置为第一页。
  // 当 pageNo.value 的值更新为 1 后，Vue 会在后续的事件处理函数代码执行之前完成这次更新。
  // 即 Vue 确保在事件处理函数执行之前，所有相关的响应式数据已经被更新到最新状态。
  pageNo.value = 1

  // 重新发送请求获取数据（使用更新后的 pageNo 的值）
  getHasTradeMark()
}
</script>

<!-- 分页器组件： -->
<el-pagination
  v-model:current-page="pageNo"
  v-model:page-size="pageSize"
  :page-sizes="[3, 5, 7, 9]"
  layout="prev, pager, next, jumper, ->, sizes, total"
  :total="400"
  @current-change="getHasTradeMark"
  @size-change="handlePageSizeChange"
/>
```

# 06. SPU 管理页面

## 6.1 切换场景

- 点击**"表格"场景**下的表格中的**某一行的"编辑 SPU"按钮**会跳转到**"添加或更新 SPU"的场景**，此时需要将这一行的 SPU 数据**拷贝**给 AddOrUpdateSpu 组件中的 **completeSpuParams** 响应式数据。
  - **必须使用 深拷贝 实现这个拷贝过程**：若使用浅拷贝，则编辑的数据和展示的数据是**同一个引用地址**，修改数据后，若点击取消按钮，则表格展示的数据是修改后的数据。
  - **completeSpuParams 响应式数据**：用于保存"完整的 SPU"数据（由表格中的一行数据和其他数据拼接而成），并作为 **reqAddOrUpdateSpu 请求**的参数。

## 6.2 "添加或更新 SPU" 的场景

- **Upload 组件实现照片墙**：需要处理 imgsRes 返回的图片数据，让其符合 **Upload 组件中的图片数据格式**。

```ts
import type { UploadUserFile } from 'element-plus'

const allUploadImgs = ref<UploadUserFile[]>([]) // 存储所有格式化后的"图片"数据，用于 Upload 组件
const imgsRes = await reqSpuImgs(rowSpuData.id as number) // 发送请求，获取某个 SPU 下的所有"商品图片"

// 处理请求返回的图片数据，让其符合 Upload 组件中的图片数据格式
allUploadImgs.value = imgsRes.data.map((item) => ({
  name: item.imgName,
  url: item.imgUrl,
}))
```

# 07. 用户管理模块 & 权限分配

- "添加"和"新增"功能**共用一个模板**时，通过判断数据中**是否存在 id 字段**来区分这两个功能。
- **用户管理模块**：实现**给角色分配权限**的功能后，需要**刷新页面**，因为页面需要根据"新的权限数据"重新加载**路由**等信息。

# 08. 智慧大屏

- **"智慧大屏"的响应式展示**：重点在于**元素大小的适配**问题，让**数据内容展示在视口的中间位置**。
  - 适配方案 1：**使用 vw 和 vh**。缺点是需要计算每个元素的大小相对于视口的百分比，并且**文本大小无法使用 vw 和 vh** 设置，只能使用 px 设置文本大小。
  - 适配方式 2：**使用 scale 缩放属性（建议）**。配合 transform-origin 修改**变换原点为左上角**，并通过 **window.innerWidth(获取视口宽度)** 和 **window.innerHeight(获取视口高度)** 计算放大缩小的比例，并按照**较小的缩放比例**进行缩放。。**缺点**是按照较小的缩放比例进行缩放时，**四周容易出现留白区域**。
- 动态获取当前时间：使用 moment 库 / dayjs 库。
- eCharts 组件的容器**一定要设置高度**，否则无法正常显示图表。

```html
<!--------------------------- 响应式适配方式 2：使用 scale 缩放属性（建议） ------------------------------>
<script setup lang="ts" name="Screen">
  // screenMainRef 获取"数据大屏的版心(内容展示区域)"的 DOM 元素
  const screenMainRef = ref<HTMLDivElement | null>(null)

  // getScaleRatio 函数用于根据当前屏幕大小动态获取缩放比例。默认屏幕大小是 1920 × 1080
  const getScaleRatio = (width = 1920, height = 1080) => {
    const wRatio = window.innerWidth / width // 计算宽度的缩放比例，window.innerWidth 表示当前浏览器视口的宽度
    const hRatio = window.innerHeight / height // 计算高度的缩放比例，window.innerHeight 表示当前浏览器视口的高度
    return wRatio < hRatio ? wRatio : hRatio // 按照较小的缩放比例进行缩放，防止内容溢出或内容拉伸
  }

  // setScaleAndTranslate 用于动态设置缩放比例和位移大小
  const setScaleAndTranslate = () => {
    if (screenMainRef.value)
      screenMainRef.value.style.transform = `scale(${getScaleRatio()}) translate(-50%,-50%)`
  }

  // 动态设置缩放比例和位移大小的时机
  onMounted(() => setScaleAndTranslate()) // 组件初次挂载到页面上时，设置缩放比例和位移大小
  window.onresize = () => setScaleAndTranslate() // 视口尺寸发生变化时，动态设置比例和位移大小
</script>

<template>
  <!-- 数据大屏的版心：内容展示区域 -->
  <div ref="screenMainRef" class="screen-main"></div>
</template>

<style lang="scss" scoped>
  .screen-container {
    width: 100vw;
    height: 100vh;
    background: url('@/assets/screenImgs/bg.png') no-repeat;
    background-size: cover;

    .screen-main {
      position: fixed;
      width: 1920px;
      height: 1080px;
      background-color: red;
      top: 50%;
      left: 50%;
      transform-origin: left top; /* 修改变换原点为左上角 */
    }
  }
</style>
```

# 09. 导航菜单（路由）和按钮权限控制

- **作用**：在同一个项目中，不同人的职位是不一样的，因此他能访问到的导航菜单（路由）和按钮的权限是不一样的。
- 超级管理员账号：admin，密码：111111。所有的菜单和按钮都可以使用。

- 飞行员账号（自己添加新"角色"）：pilot，密码：111111。不包含**权限管理菜单（路由）和按钮**的权限。

## 9.1 导航菜单权限

- **全部路由组件：**`login|404|Home|Screen|Auth(三个子路由)|Product(四个子路由)`
- **静态（常量）路由**：所有用户都可以访问的路由。包括 `login|404|Home|Screen` 。
- **异步路由**：需要根据"用户身份"才可以访问的路由，即该路由只能**被部分用户访问**。包括 `Auth(三个子路由)|Product(四个子路由)` 。
- 用户登录时，服务端会返回包含**当前用户的菜单路由权限数据和按钮权限数据**，通过这个权限数据可以知道当前用户拥有哪些"异步路由"的访问权限。因此菜单路由权限控制的业务逻辑可以在**用户登录之后的时间段**内发生（ `store/modules/user.ts` 文件）。
- **注意 1**：要保证路由规则中的 **name 属性值**和服务器返回的**路由字符串标识**一一对应。
- **注意 2**：若**刷新的时候是异步路由**，有可能获取到了用户信息（ `router/guard.ts` 文件），但是**异步路由还没有加载完毕**，则出现"白屏情况"。使用 `next({ ...to })` **重新触发导航**，确保新的路由配置或权限设置生效。另外，通过对象展开运算符 { ...to }，创建了一个新的路由对象，**避免**了使用 `next(to)` 可能引起的**导航循环问题**。
- **注意 3**：A 用户拥有所有页面的访问权限，比如"权限管理"模块中的"用户管理"页面；但是 **B 用户没有"用户管理"页面的访问权限**。问题如下：A 用户在"用户管理"页面中操作完之后退出登录，然后登录 B 用户，由于路由相关的设计是**再次登陆时会重定向到上次退出的页面**，所以此时 B 用户登录后会进入"用户管理"页面，但是由于 B 用户没有"用户管理"页面的访问权限，因此正确的操作**页面跳转到 404 页面**。
  - **"退出登录"时移除动态添加的"异步路由" ( store/modules/user.ts 文件)**：在用户退出登录后，应该**移除与该用户权限相关的路由**，防止未授权的用户访问受限页面。移除动态添加的"异步路由"，可以确保路由表与当前用户的权限匹配，避免出现无权限的路由出现在导航菜单或被用户访问。如果不移除动态添加的路由，可能会在下次登录时发生路由重复添加的错误，或者导致权限紊乱，影响应用的正常运行。


```ts
/**
 * 该函数用于从 asyncRoutes 异步路由中筛选出当前用户可以访问的异步路由。
 * 该函数会在 getUserInfo 函数中调用，并且在获取用户数据之后调用。
 * @param allAsyncRoutes 所有的异步路由数组
 * @param userAsyncRoutes 当前用户能访问的异步路由数组，由字符串标识组成
 */
const getUserAsyncRoutes = (allAsyncRoutes: RouteRecordRaw[], userAsyncRoutesStr: string[]) => {
  // 对 allAsyncRoutes 所有的异步路由进行筛选
  return allAsyncRoutes.filter((curRoute) => {
    // 在 userAsyncRoutes 用户能访问的路由中查找是否存在当前遍历的路由
    if (userAsyncRoutesStr.includes(curRoute.name as string)) {
      // 若存在，则继续查找 children 属性的孩子节点
      if (curRoute.children && curRoute.children.length > 0) {
        // 更新当前节点的孩子节点值为过滤后的数组
        curRoute.children = getUserAsyncRoutes(curRoute.children, userAsyncRoutesStr)
      }
      return true // allAsyncRoutes.filter 函数的返回值
    }
  })
}

// --------------------- getUserAsyncRoutes 函数在获取用户数据之后调用 ----------------------
// 获取当前用户"可以访问"的"异步路由"，注意使用深拷贝，防止修改 asyncRoutes 源数据
const userAsyncRoutes = getUserAsyncRoutes(cloneDeep(asyncRoutes), data.routes)

// 更新当前用户"可以访问"的"总路由"，即需要渲染的"菜单路由"
menuRoutes.value = [...constantRoutes, ...userAsyncRoutes, ...anyRoutes]

// 由于 router/index.ts 中只注册了常量路由，因此这里需要动态追加"异步路由"和"任意路由"
// 以数组字面量开头的代码前面一定要加 ; 符号
;[...userAsyncRoutes, ...anyRoutes].forEach((route) => router.addRoute(route))

// ----------------------------- 2. 避免出现无权限的路由被用户访问 -----------------------------
// 存储动态添加的"异步路由"名称，在"退出登录"时需要删除添加的"异步路由"
const routeNames = ref<string[]>([])

// userLogout 函数是用户退出登录时调用的方法
const userLogout = async () => {
  /**
   * "退出登录"时移除动态添加的"异步路由"：在用户退出登录后，应该移除与该用户权限相关的路由，防止未授权的用户访问受限页面。
   * 移除动态添加的"异步路由"，可以确保路由表与当前用户的权限匹配，避免出现无权限的路由出现在导航菜单或被用户访问。
   * 防止路由冲突：如果不移除动态添加的路由，可能会在下次登录时发生路由重复添加的错误，或者导致权限紊乱，影响应用的正常运行。
   */
  routeNames.value.forEach((routeName) => router.removeRoute(routeName))
  routeNames.value = [] // 清空记录的路由名称数组
}

// getUserInfo 函数用于获取用户数据的方法
const getUserInfo = async () => {
  // 由于 router/index.ts 中只注册了常量路由，因此这里需要动态追加"异步路由"和"任意路由"，动态添加路由时记录"异步路由"的名称
  ;[...userAsyncRoutes, ...anyRoutes].forEach((route) => {
    router.addRoute(route) // 动态添加"异步路由"和"任意路由"
    routeNames.value.push(route.name as string) // 记录当前用户的"异步路由"名称
  })
}
```

## 9.2 按钮权限（以"品牌管理"页面中的按钮为例）

- 用户登录时，服务端会返回包含**当前用户的按钮权限数据**，通过这个权限数据可以知道当前用户拥有哪些"按钮"的访问权限。在**用户登录之后的时间段**内（ `store/modules/user.ts` 文件）获取当前用户的按钮权限数据。
- 使用**自定义指令**封装判断当前用户是否拥有某个按钮权限的操作。
  - **注意**：在**组件以外**的地方使用 Pinia 中的小仓库时，需要根据 Pinia 大仓库来创建小仓库。

```ts
// ---------------------------- store/modules/user.ts 文件 -------------------------------
const btnsAuth = ref<string[]>([]) // btnsAuth 用于存储"当前用户的按钮权限"

// ---------------------------- 使用自定义指令判断当前用户是否拥有某个按钮权限 --------------------------
import pinia from '@/store'
import { useUserStore } from '@/store/modules'
import type { App, DirectiveBinding } from 'vue'

// 在组件以外的地方使用 Pinia 中的小仓库时，需要根据 Pinia 大仓库来创建小仓库。
const userStore = useUserStore(pinia)

// isBtnsAuth 函数用于自定义指令，用于判断当前页面的按钮权限有哪些
export const isBtnsAuth = (app: App) => {
  // 全局自定义指令：实现按钮权限
  app.directive('btns-auth', {
    // mounted 表示当指令绑定的元素被 挂载到页面中 时，会自动调用
    // el 表示指令绑定到的元素；binding 是一个对象，通过 binding.value 获取传递给指令的值。
    mounted: (el: HTMLElement, binding: DirectiveBinding<string>) => {
      // 判断服务器返回的"按钮权限"数据中是否包含自定义指令绑定的值(某个组件的按钮值)。
      if (!userStore.btnsAuth.includes(binding.value)) {
        // 若不包含，直接删除相关按钮的 DOM
        el.parentNode?.removeChild(el)
      }
    },
  })
}

// ---------------- 在组件中使用自定义指令，其中 'btn.Trademark.remove' 是服务器返回的数据 ----------------
<el-button type="danger" icon="Delete" v-btns-auth="'btn.Trademark.remove'">删除</el-button>
```

