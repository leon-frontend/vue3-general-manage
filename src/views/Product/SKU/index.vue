<script setup lang="ts" name="SKU">
import { onMounted, ref } from 'vue'
import {
  reqCancelSku,
  reqDeleteSku,
  reqGetSkuDetail,
  reqGetSkuList,
  reqOnSaleSku,
} from '@/api/product/sku'
import { SingleSkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

//#region ----------------------- "数据初始化与展示"相关的业务逻辑 ---------------------------
// 与"分页器"相关的响应式数据
const pageNo = ref<number>(1) // 控制分页器的当前页数
const pageSize = ref<number>(10) // 控制每页展示的数据大小
const total = ref<number>(0) // 展示数据总数

// allSkuData 用于保存 SKU 数据
const allSkuData = ref<SingleSkuData[]>([])

// getAllSkuData 函数用于发送请求，获取 SKU 数据列表，更新相关的响应式数据，用于表格展示
// 形参用于跳转到指定页数
const getSkuListData = async (pager = 1) => {
  // 给 getSkuListData 的形参传递想要获取数据的页数，默认是获取第一页的数据
  pageNo.value = pager

  try {
    const { data } = await reqGetSkuList(pageNo.value, pageSize.value)

    // 更新相关的响应式数据
    total.value = data.total
    allSkuData.value = data.records
  } catch (error) {
    console.log(error)
  }
}

// 组件挂载到页面中时，发送请求，获取 SKU 数据列表
onMounted(() => getSkuListData())

// changePageNo 函数会在"分页器"的"当前页"发生变化时触发，并且会自动注入"新的当前页"的值
const changePageNo = (newPageNo: number) => getSkuListData(newPageNo)

// changePageSize 函数会在"分页器"的"页面展示的数据大小"发生变化时触发，并且会自动注入"新的数据大小"的值
const changePageSize = () => getSkuListData() // 不带参数，切换大小后，展示第一页数据
//#endregion -------------------- "数据初始化与展示"相关的业务逻辑 ---------------------------

//#region -------------------- 与商品"上架"和"下架"相关的业务逻辑 ---------------------------
// updateSkuSaleInfo 函数会在点击表格每行的第一个按钮('Top / Bottom')时触发
const updateSkuSaleInfo = async (rowSkuData: SingleSkuData) => {
  try {
    // 若 rowSkuData.isSale 的值为 1 表示该 SKU 商品已上架；为 0 表示没有上架
    if (rowSkuData.isSale) {
      await reqCancelSku(rowSkuData.id as number) // 执行下架 SKU 商品的操作
      ElMessage.warning('下架成功') // 弹出提示信息
      getSkuListData(pageNo.value) // SKU 商品的"销售状态" 更新完毕后，重新获取一遍数据
    } else {
      await reqOnSaleSku(rowSkuData.id as number) // 执行上架 SKU 商品的操作
      ElMessage.success('上架成功') // 弹出提示信息
      getSkuListData(pageNo.value) // SKU 商品的"销售状态" 更新完毕后，重新获取一遍数据
    }
  } catch (error) {
    console.log(error)
  }
}
//#endregion ----------------- 与商品"上架"和"下架"相关的业务逻辑 ---------------------------

//#region -------------------- 和"抽屉组件"相关的业务逻辑 ---------------------------
// isDrawerOpen 用于控制"抽屉"组件的显示与隐藏
const isDrawerOpen = ref<boolean>(false)

// skuDetailInfo 用于存储某个 SKU 商品的详细信息
const skuDetailInfo = ref<SingleSkuData>({
  category3Id: '', // 三级分类 id
  spuId: '', // 所属 SPU 的 id
  tmId: '', // 所属 SPU 的品牌 id
  skuName: '', // SKU 的名称
  price: '', // SKU 的价格
  weight: '', // SKU 的重量
  skuDesc: '', // SKU 的描述
  skuAttrValueList: [], // 平台属性值
  skuSaleAttrValueList: [], // 销售属性值
  skuDefaultImg: '', // sku 的默认图片地址
  skuImageList: [], // 某个 SKU 商品详情的图片信息
})

// viewSkuDetail 函数会在点击表格中的"查看详情"按钮时触发
const viewSkuDetail = async (rowSkuData: SingleSkuData) => {
  // 显示"抽屉组件"之前，先清空之前展示的数据，使得展示效果更流畅
  skuDetailInfo.value = {
    category3Id: '', // 三级分类 id
    spuId: '', // 所属 SPU 的 id
    tmId: '', // 所属 SPU 的品牌 id
    skuName: '', // SKU 的名称
    price: '', // SKU 的价格
    weight: '', // SKU 的重量
    skuDesc: '', // SKU 的描述
    skuAttrValueList: [], // 平台属性值
    skuSaleAttrValueList: [], // 销售属性值
    skuDefaultImg: '', // sku 的默认图片地址
    skuImageList: [], // 某个 SKU 商品详情的图片信息
  }

  // 显示"抽屉"组件
  isDrawerOpen.value = true

  try {
    // 获取某个 SKU 商品的详细信息
    const { data } = await reqGetSkuDetail(rowSkuData.id as number)

    // 保存请求返回的数据，即更新 skuDetailInfo 的值
    skuDetailInfo.value = data
  } catch (error) {
    console.log(error)
  }
}
//#endregion ----------------- 和"抽屉组件"相关的业务逻辑 ---------------------------

//#region ------------------- 删除某个 SKU 商品的业务逻辑 --------------------------
// deleteSku 函数会在点击表格中的某一行的删除按钮时触发，用于删除某个 SKU 商品
const handleDeleteSku = async (rowSkuData: SingleSkuData) => {
  try {
    // 发送 reqDeleteSku 请求，删除某个 SKU 商品
    const { data, code } = await reqDeleteSku(rowSkuData.id as number)

    // 弹出提示信息
    code === 200
      ? ElMessage.success('删除成功')
      : ElMessage.warning(data as string)

    // 数据删除成功后，重新获取一遍数据。若当前页删除一个数据后没有数据了，则请求上一页的数据
    getSkuListData(
      allSkuData.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } catch (error) {
    console.log(error)
    ElMessage.error(error as string)
  }
}
//#endregion ---------------- 删除某个 SKU 商品的业务逻辑 --------------------------
</script>

<template>
  <el-card>
    <el-table :data="allSkuData" border style="width: 100%; margin: 20px 0">
      <el-table-column label="序号" type="index" align="center" width="80" />
      <el-table-column
        label="名称"
        prop="skuName"
        show-overflow-tooltip
        width="250"
      />
      <el-table-column
        label="描述"
        prop="skuDesc"
        show-overflow-tooltip
        width="400"
      />
      <el-table-column label="默认图片" width="250" align="center">
        <template #default="{ row }">
          <el-image
            :src="row.skuDefaultImg"
            fit="contain"
            style="width: 200px; height: 110px"
          />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" width="250" />
      <el-table-column label="价格(元)" prop="price" width="250" />
      <el-table-column label="操作" width="300" fixed="right" align="center">
        <template #default="{ row }">
          <!-- 'Top' 图标表当前商品还没有上架；'Bottom' 图标表示当前商品已经上架了 -->
          <el-button
            :type="row.isSale ? 'info' : 'success'"
            :icon="row.isSale ? 'Bottom' : 'Top'"
            :title="row.isSale ? '下架' : '上架'"
            @click="updateSkuSaleInfo(row)"
          />
          <el-button
            type="warning"
            icon="Edit"
            title="编辑"
            @click="() => ElMessage.success('程序员在努力的更新中...')"
          />
          <el-button
            type="primary"
            icon="InfoFilled"
            title="查看详情"
            @click="viewSkuDetail(row)"
          />
          <el-popconfirm
            :title="`确定删除?`"
            icon="DeleteFilled"
            width="200"
            @confirm="handleDeleteSku(row)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" title="删除" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="changePageNo"
      @size-change="changePageSize"
    />

    <!-- "抽屉"组件 -->
    <el-drawer v-model="isDrawerOpen" title="查看商品详情" direction="rtl">
      <template #default>
        <el-row>
          <el-col :span="6">名称：</el-col>
          <el-col :span="18">{{ skuDetailInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述：</el-col>
          <el-col :span="18">{{ skuDetailInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格：</el-col>
          <el-col :span="18">{{ skuDetailInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性：</el-col>
          <el-col :span="18">
            <el-tag
              v-for="skuAttr in skuDetailInfo.skuAttrValueList"
              :key="skuAttr.id"
              style="margin: 0 10px 10px 0"
            >
              {{ skuAttr.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性：</el-col>
          <el-col :span="18">
            <el-tag
              v-for="skuSaleAttr in skuDetailInfo.skuSaleAttrValueList"
              :key="skuSaleAttr.id"
              type="success"
              style="margin: 0 10px 10px 0"
            >
              {{ skuSaleAttr.saleAttrName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片：</el-col>
          <el-col :span="18">
            <el-carousel
              type="card"
              height="200px"
              :interval="3000"
              indicator-position="none"
            >
              <el-carousel-item
                v-for="skuImage in skuDetailInfo.skuImageList"
                :key="skuImage.id"
              >
                <el-image
                  :src="skuImage.imgUrl"
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
