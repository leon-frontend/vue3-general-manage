<script setup lang="ts" name="AddOrUpdateSpu">
import { ref } from 'vue'
import {
  reqSpuBrands,
  reqSpuImgs,
  reqSpuSaleAttrs,
  reqSpuSaleAttrNames,
} from '@/api/product/spu'
import type { UploadUserFile, UploadFile } from 'element-plus'
import type {
  SingleSpuData,
  SingleSpuBrand,
  SingleSaleAttr,
  SingleSaleAttrName,
} from '@/api/product/spu/type'

// 定义父组件给子组件绑定的自定义事件函数的回调函数的形参类型
type EmitEvents = {
  'change-scene': [sceneStr: 'SpuTable' | 'AddOrUpdateSpu' | 'ViewSkuList']
}

// 使用 defineEmits 获取父组件给子组件绑定的自定义事件
const $emit = defineEmits<EmitEvents>()

// 点击"取消"按钮时会触发该函数
const handleCancelBtn = () => {
  // 切换为"展示表格界面"的场景
  $emit('change-scene', 'SpuTable')
}

// completeSpuParams 用于保存"完整的 SPU"数据，并作为 reqAddOrUpdateSpu 请求的参数
// "完整的 SPU"数据：由表格中的一行数据和其他数据拼接而成
const completeSpuParams = ref<SingleSpuData>({
  spuName: '',
  description: '', // 表示 SPU 的描述数据
  category3Id: '', // 表示收集的"三级分类"的 id
  tmId: '', // 表示 SPU 中某个品牌的 id 数据
  spuImageList: [], // 表示 SPU 的"图片"数据
  spuSaleAttrList: [], // 表示 SPU 的"销售属性"数据
})

//#region ----------------- 实现"编辑"操作的数据回显 --------------------
const allBransData = ref<SingleSpuBrand[]>([]) // 用于存储所有"品牌"数据
const allUploadImgs = ref<UploadUserFile[]>([]) // 存储所有格式化后的"图片"数据，用于 Upload 组件
const allSaleAttrs = ref<SingleSaleAttr[]>([]) // 用于存储所有"销售属性"数据
const allSaleAttrNames = ref<SingleSaleAttrName[]>([]) // 用于存储所有"销售属性的属性名"数据

/**
 * editSpuDataRecall 方法会在父组件(表格)中点击某一行的"编辑 SPU"按钮时调用，实现数据回显。
 * @param rowSpuData 是父组件传递的数据，表示表格中某一行的数据，要根据它发送请求，实现数据回显。
 */
const editSpuDataRecall = async (rowSpuData: SingleSpuData) => {
  // 使用"表格"中的某一行 SPU 数据更新 completeSpuParams 数据
  completeSpuParams.value = rowSpuData

  try {
    // 根据 rowSpuData 数据发送请求，实现数据回显
    const brandsRes = await reqSpuBrands() // 获取某个 SPU 下的所有"品牌数据"
    const imgsRes = await reqSpuImgs(rowSpuData.id as number) // 获取某个 SPU 下的所有"商品图片"
    const saleAttrsRes = await reqSpuSaleAttrs(rowSpuData.id as number) // 获取某个 SPU 下的所有"销售属性"
    const saleAttrNamesRes = await reqSpuSaleAttrNames() // 获取某个 SPU 下的所有"销售属性的属性名"

    // 响应成功后，保存请求回来的数据

    allBransData.value = brandsRes.data
    allSaleAttrs.value = saleAttrsRes.data
    allSaleAttrNames.value = saleAttrNamesRes.data

    // 处理请求返回的图片数据，让其符合 Upload 组件中的图片数据格式
    allUploadImgs.value = imgsRes.data.map((item) => ({
      name: item.imgName,
      url: item.imgUrl,
    }))
  } catch (error) {
    console.log(error)
  }
}

// 使用 defineExpose 方法将子组件中的数据暴露给父组件使用
defineExpose({ editSpuDataRecall })
//#endregion -------------- 实现"编辑"操作的数据回显 --------------------

//#region ----------------- "图片预览"相关的业务逻辑 --------------------
// picDialogShow 响应式数据用于控制"图片预览"的模态框的显示与隐藏
const picDialogShow = ref<boolean>(false)

// dialogImgUrl 用于控制"图片预览"模态框中展示的图片
const dialogImgUrl = ref<string>('')
/**
 * handlePicPreview 函数会在点击"照片墙"中的"预览"按钮时触发
 * @param imgFile on-preview 方法会向其回调函数注入一个参数，表示一个图片文件信息
 */
const handlePicPreview = (imgFile: UploadFile) => {
  // 显示"图片预览"的模态框
  picDialogShow.value = true

  // 使用 imgFile 数据中的图片地址更新 dialogImgUrl 数据，从而实现模态框的图片展示
  dialogImgUrl.value = imgFile.url as string
}
//#endregion -------------- "图片预览"相关的业务逻辑 --------------------
</script>

<template>
  <el-form label-width="115">
    <el-form-item label="SPU 名称：">
      <el-input
        v-model="completeSpuParams.spuName"
        placeholder="请输入 SPU 名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU 品牌：">
      <el-select
        v-model="completeSpuParams.tmId"
        placeholder="请选择 SPU 品牌"
        style="width: 240px"
      >
        <el-option
          v-for="brand in allBransData"
          :key="brand.id"
          :label="brand.tmName"
          :value="brand.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU 描述：">
      <el-input
        v-model="completeSpuParams.description"
        type="textarea"
        placeholder="请输入 SPU 描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU 照片：">
      <!-- v-model:file-list 属性用于展示默认图片 -->
      <el-upload
        v-model:file-list="allUploadImgs"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePicPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <!-- "图片预览"的模态框 -->
      <el-dialog v-model="picDialogShow">
        <el-image
          :src="dialogImgUrl"
          alt="Preview Image"
          style="width: 80%; height: 80%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU 销售属性：">
      <!-- 展示"销售属性"的下拉菜单 -->
      <el-select
        placeholder="请选择 SPU 销售属性"
        style="width: 240px; margin-right: 20px"
      >
        <el-option label="华为" />
        <el-option label="oppo" />
        <el-option label="vivo" />
      </el-select>
      <!-- "添加销售属性"的按钮 -->
      <el-button type="primary" icon="Plus">添加销售属性</el-button>
      <!-- 展示销售属性和属性值的表格 -->
      <el-table border style="margin-top: 13px">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="属性名" width="150" />
        <el-table-column label="属性值" />
        <el-table-column label="操作" />
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Select">保存</el-button>
      <el-button type="info" plain icon="CloseBold" @click="handleCancelBtn">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
