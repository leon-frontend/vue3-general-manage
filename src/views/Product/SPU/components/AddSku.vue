<script setup lang="ts" name="AddSku">
import { reactive, ref } from 'vue'
import { reqAttrData } from '@/api/product/attr'
import { reqAddSku, reqSpuImgs, reqSpuSaleAttrs } from '@/api/product/spu'
import { ElMessage, type ElTable } from 'element-plus'
import type { SingleAttrData } from '@/api/product/attr/type'
import type {
  SingleSaleAttr,
  SingleSkuData,
  SingleSpuData,
  SingleSpuImg,
  skuAttrValue,
  skuSaleAttrValue,
} from '@/api/product/spu/type'

// completeSkuParams 用于保存"完整的 SKU"数据，并作为 reqAddSku 请求的参数
const completeSkuParams = reactive<SingleSkuData>({
  // 下面三个数据在 addSkuInitData 函数中收集
  category3Id: '', // 三级分类 id
  spuId: '', // 所属 SPU 的 id
  tmId: '', // 所属 SPU 的品牌 id

  // 下面的数据通过 v-model 收集
  skuName: '', // SKU 的名称
  price: '', // SKU 的价格
  weight: '', // SKU 的重量
  skuDesc: '', // SKU 的描述
  skuAttrValueList: [], // 平台属性值
  skuSaleAttrValueList: [], // 销售属性值
  skuDefaultImg: '', // sku 的默认图片地址
})

//#region ----------------------- AddSku 组件的数据初始化 ----------------------------
// AddSku 组件在数据初始化时需要使用到的状态
const allPlatformAttrs = ref<SingleAttrData[]>([]) // 用于存储"已有的属性名和属性值"
const allSaleAttrs = ref<SingleSaleAttr[]>([]) // 用于存储所有已有的"销售属性"数据
const allImgsData = ref<SingleSpuImg[]>([]) // 存储所有的"图片"数据

// addSkuInitData 函数用于初始化 AddSku 组件的数据，并暴露给父组件的"添加 SKU "按钮使用
const addSkuInitData = async (
  category1Id: number | string, // "一级分类"的 id，用于获取"平台属性"相关的数据
  category2Id: number | string, // "二级分类"的 id，用于获取"平台属性"相关的数据
  rowSpuData: SingleSpuData, // rowSpuData 表示表格的一行数据，其中包含"三级分类"的 id
) => {
  // 收集完整的 SKU 需要的数据
  completeSkuParams.category3Id = rowSpuData.category3Id
  completeSkuParams.spuId = rowSpuData.id as number
  completeSkuParams.tmId = rowSpuData.tmId

  try {
    const attrsRes = await reqAttrData(
      category1Id,
      category2Id,
      rowSpuData.category3Id,
    ) // 获取已有的属性名和属性值的接口
    const spuImgsRes = await reqSpuImgs(rowSpuData.id as number) // 获取某个 SPU 下的所有"商品图片"的接口
    const saleAttrsRes = await reqSpuSaleAttrs(rowSpuData.id as number) // 获取某个 SPU 下的所有"销售属性"的接口

    // 响应成功后，保存请求回来的数据
    allPlatformAttrs.value = attrsRes.data
    allSaleAttrs.value = saleAttrsRes.data
    allImgsData.value = spuImgsRes.data
  } catch (error) {
    console.log(error)
  }
}

// 将 AddSku 组件的方法，暴露给父组件使用
defineExpose({ addSkuInitData })
//#endregion -------------------- AddSku 组件的数据初始化 ----------------------------

//#region ------------------ 表格相关的业务逻辑与收集数据相关的业务逻辑 --------------------
// tableRef 用于获取 el-table 的组件实例
const tableRef = ref<InstanceType<typeof ElTable> | null>(null)

// setDefaultBtn 函数会在点击"表格"中的"设置默认"按钮时触发
const setDefaultBtn = (rowImgData: SingleSpuImg) => {
  // 先取消勾选表格中的所有行，然后选中当前行的复选框
  allImgsData.value.forEach((img: SingleSpuImg) =>
    tableRef.value?.toggleRowSelection(img, false),
  )

  // 选中当前行的复选框
  tableRef.value?.toggleRowSelection(rowImgData, true)

  // 收集设置的"默认图片"的图片路径数据
  completeSkuParams.skuDefaultImg = rowImgData.imgUrl
}
//#endregion --------------- 表格相关的业务逻辑与收集数据相关的业务逻辑 --------------------

//#region -------------------------- "保存"按钮和"取消"按钮的业务逻辑 -----------------------
// 定义父组件给子组件绑定的自定义事件函数的回调函数的形参类型
type EmitEvents = {
  'change-scene': [
    sceneStr: 'SpuTable' | 'AddOrUpdateSpu' | 'AddSku',
    tablePage: 'currentPage' | 'firstPage',
  ]
}

// 使用 defineEmits 获取父组件给子组件绑定的自定义事件
const $emit = defineEmits<EmitEvents>()

// handleCancelBtn 函数会在点击"取消"按钮时触发
const handleCancelBtn = () => $emit('change-scene', 'SpuTable', 'currentPage')

// handleSaveBtn 函数会在点击"保存"按钮时触发
const handleSaveBtn = async () => {
  // 整理"平台属性"的数据，并更新 completeSkuParams 中的 skuAttrValueList 值
  completeSkuParams.skuAttrValueList = allPlatformAttrs.value.reduce(
    (prev: skuAttrValue[], cur: SingleAttrData) => {
      if (cur.attrIdAndValueId) {
        // 从 attrIdAndValueId 属性中的分解出需要的数据，并更新 prev 数组
        const [attrId, valueId] = cur.attrIdAndValueId.split(':')
        prev.push({ attrId, valueId })
      }

      return prev
    },
    [],
  )

  // 整理"销售属性"的数据，并更新 completeSkuParams 中的 skuSaleAttrValueList 值
  completeSkuParams.skuSaleAttrValueList = allSaleAttrs.value.reduce(
    (prev: skuSaleAttrValue[], cur: SingleSaleAttr) => {
      if (cur.saleIdAndValueId) {
        // 从 saleIdAndValueId 属性中的分解出需要的数据，并更新 prev 数组
        const [saleAttrId, saleAttrValueId] = cur.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }

      return prev
    },
    [],
  )

  try {
    // 发送"添加 SKU"的请求
    await reqAddSku(completeSkuParams)

    // 请求响应成功后，弹出提示信息
    ElMessage.success('添加 SKU 成功')

    // 请求响应成功后，切换为"表格界面"场景
    $emit('change-scene', 'SpuTable', 'currentPage')
  } catch (error) {
    // 请求响应失败后，弹出提示信息
    ElMessage.error('添加 SKU 失败')
    console.log(error)
  }
}
//#endregion ----------------------- "保存"按钮和"取消"按钮的业务逻辑 -----------------------
</script>

<template>
  <el-form label-width="110">
    <el-form-item label="SKU 名称：">
      <el-input
        v-model="completeSkuParams.skuName"
        placeholder="请输入 SKU 名称"
      />
    </el-form-item>
    <el-form-item label="价格(元)：">
      <el-input
        v-model="completeSkuParams.price"
        type="number"
        placeholder="请输入价格(元)"
      />
    </el-form-item>
    <el-form-item label="重量(克)：">
      <el-input
        v-model="completeSkuParams.weight"
        type="number"
        placeholder="请输入重量(克)"
      />
    </el-form-item>
    <el-form-item label="SKU 描述：">
      <el-input
        v-model="completeSkuParams.skuDesc"
        type="textarea"
        placeholder="请输入SKU 描述"
      />
    </el-form-item>
    <el-form-item label="平台属性：">
      <el-form inline>
        <el-form-item
          v-for="attr in allPlatformAttrs"
          :key="attr.id"
          :label="attr.attrName + '：'"
        >
          <el-select
            v-model="attr.attrIdAndValueId"
            placeholder="请选择属性值"
            style="width: 240px"
          >
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性：">
      <el-form inline>
        <el-form-item
          v-for="saleAttr in allSaleAttrs"
          :key="saleAttr.id"
          :label="saleAttr.saleAttrName + '：'"
        >
          <el-select
            v-model="saleAttr.saleIdAndValueId"
            placeholder="请选择属性值"
            style="width: 240px"
          >
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称：">
      <el-table ref="tableRef" border :data="allImgsData">
        <el-table-column type="selection" align="center" />
        <el-table-column label="图片" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.imgUrl"
              fit="contain"
              style="width: 130px; height: 130px"
            />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="setDefaultBtn(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Select" @click="handleSaveBtn">
        保存
      </el-button>
      <el-button type="info" plain icon="CloseBold" @click="handleCancelBtn">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
