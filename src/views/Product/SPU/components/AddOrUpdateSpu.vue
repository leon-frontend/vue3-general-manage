<script setup lang="ts" name="AddOrUpdateSpu">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqSpuImgs,
  reqSpuBrands,
  reqSpuSaleAttrs,
  reqSpuSaleAttrNames,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import type { UploadUserFile, UploadFile, UploadProps } from 'element-plus'
import type {
  SingleSpuData,
  SingleSpuBrand,
  SingleSaleAttr,
  SingleSaleAttrName,
  SingleSaleAttrValue,
} from '@/api/product/spu/type'

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

// AddOrUpdateSpu 场景下所有需要使用到的状态
const allBransData = ref<SingleSpuBrand[]>([]) // 用于存储所有"品牌"数据
const allUploadImgs = ref<UploadUserFile[]>([]) // 存储所有格式化后的"图片"数据，用于 Upload 组件
const allSaleAttrs = ref<SingleSaleAttr[]>([]) // 用于存储所有已有的"销售属性"数据
const allSaleAttrNames = ref<SingleSaleAttrName[]>([]) // 用于存储所有"销售属性的属性名"数据

//#region ----------------- 实现"新增"操作的数据初始化 ------------------
// addSpuInitData 函数用于初始化"新增"操作的数据，会被父组件调用
const addSpuInitData = async (thirdCategoryId: number | string) => {
  // 清空 AddOrUpdateSpu 组件中，上一次编辑的数据
  Object.assign(completeSpuParams.value, {
    spuName: '',
    description: '', // 表示 SPU 的描述数据
    category3Id: '', // 表示收集的"三级分类"的 id
    tmId: '', // 表示 SPU 中某个品牌的 id 数据
    spuImageList: [], // 表示 SPU 的"图片"数据
    spuSaleAttrList: [], // 表示 SPU 的"销售属性"数据
  })
  allUploadImgs.value = [] // 清空"照片墙"数据
  allSaleAttrs.value = [] // 清空表格中的"销售属性"数据

  // 存储父组件传递过来的"三级分类"的 id
  completeSpuParams.value.category3Id = thirdCategoryId

  try {
    const brandsRes = await reqSpuBrands() // 获取某个 SPU 下的所有"品牌数据"
    const saleAttrNamesRes = await reqSpuSaleAttrNames() // 获取某个 SPU 下的所有"销售属性的属性名"

    // 响应成功后，保存请求回来的数据
    allBransData.value = brandsRes.data
    allSaleAttrNames.value = saleAttrNamesRes.data
  } catch (error) {
    console.log(error)
  }
}
//#endregion -------------- 实现"新增"操作的数据初始化 ------------------

//#region ----------------- 实现"编辑"操作的数据回显 --------------------
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
defineExpose({ addSpuInitData, editSpuDataRecall })
//#endregion -------------- 实现"编辑"操作的数据回显 --------------------

//#region ----------------- "图片预览和上传"相关的业务逻辑 --------------------
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

// hanleBeforeUpload 函数会在图片上传之前被触发，可以用于限定上传文件的类型和大小
const hanleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 限定上传文件的类型只能为图片类型，限定文件大小不能大于 4MB
  if (
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('文件上传类型必须是 PNG|JPG|GIF 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片文件不能超过 4MB!')
    return false
  }

  return true
}
//#endregion -------------- "图片预览和上传"相关的业务逻辑 --------------------

//#region ------------------- "销售属性"相关的业务逻辑 ----------------------
// unselectedSaleAttrNames 表示当前 SPU 未选择的销售属性名称
const unselectedSaleAttrNames = computed(() => {
  // 从所有"销售属性的属性名"数据中，找出还"没有使用的销售属性名称"
  return allSaleAttrNames.value.filter((attrName) =>
    allSaleAttrs.value.every(
      (selectedAttr) => attrName.name !== selectedAttr.saleAttrName,
    ),
  )
})

// collectUnselectedSaleAttr 用于"选择框"收集"未选择"的销售属性 id 和属性名称
// collectUnselectedSaleAttr 的格式为 "id: name"
const collectUnselectedSaleAttr = ref<string>('')

// addSaleAttrBtn 函数会在点击 "添加销售属性" 按钮时触发
const addSaleAttrBtn = () => {
  /**
   * "添加销售属性" 按钮时，添加新的销售属性，必须要有如下字段
   * baseSaleAttrId: number
   * saleAttrName: string
   * spuSaleAttrValueList: SingleSaleAttrValue[]
   */
  // 使用 split 方法将 collectUnselectedSaleAttr 中的字符串通过 : 切割成"销售属性 id 和属性名称"
  const [baseSaleAttrId, saleAttrName] =
    collectUnselectedSaleAttr.value.split(':')

  // 准备一个对象，用于保存"新添加"的"销售属性"的数据
  const newSaleAttr: SingleSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }

  // 将 newSaleAttr "新的销售属性"追加到 allSaleAttrs 数组中
  allSaleAttrs.value.push(newSaleAttr)

  // 清空 collectUnselectedSaleAttr 的值，即 Select 选择框展示的数据
  collectUnselectedSaleAttr.value = ''
}

// editModeInputRef 用于获取"编辑"模式下的 input 输入框的组件实例
const editModeInputRef = ref<HTMLInputElement | null>(null)

// lookModeBtnClick 函数会在点击"查看模式"下"表格"中显示的按钮时触发
const lookModeBtnClick = (rowSaleAttr: SingleSaleAttr) => {
  // 切换成"编辑"模式，即显示输入框
  rowSaleAttr.isEditMode = true

  // 添加一个字段，用于收集当前行的新添加的销售属性值，和输入框的值绑定
  rowSaleAttr.newSaleAttrValue = ''

  // 让"编辑"模式的输入框自动获取焦点
  // editModeInputRef.value?.focus()
}

// editModeInputBlur 函数会在"编辑模式"下"表格"中的"输入框"失去焦点时触发
const editModeInputBlur = (rowSaleAttr: SingleSaleAttr) => {
  // 从 SingleSaleAttr 中收集属性 id 和属性名字
  const { baseSaleAttrId, newSaleAttrValue } = rowSaleAttr

  // 将收集的数据转换成服务器需要的数据形式
  const newSaleAttrValueObj: SingleSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: newSaleAttrValue as string,
  }

  // 非法清空判断 1：新添加的属性值不能为空
  if (!newSaleAttrValue?.trim()) {
    ElMessage.error('新增属性值不能为空！')
    return
  }

  // 非法清空判断 2：新添加的属性值不能和之前的属性值重复
  const repeatValue = rowSaleAttr.spuSaleAttrValueList.find(
    (item) => item.saleAttrValueName === newSaleAttrValue,
  )
  if (repeatValue) {
    ElMessage.error('新增属性值不能重复！')
    return
  }

  // 往 spuSaleAttrValueList 数组中追加新添加的销售属性值
  rowSaleAttr.spuSaleAttrValueList.push(newSaleAttrValueObj)

  // 切换成"查看"模式，即显示按钮
  rowSaleAttr.isEditMode = false

  // 弹出消息提示
  ElMessage.success('添加属性成功')
}
//#endregion ---------------- "销售属性"相关的业务逻辑 ----------------------

//#region ----------------- "保存"按钮和"取消"按钮的相关业务逻辑 --------------------
// 定义父组件给子组件绑定的自定义事件函数的回调函数的形参类型
type EmitEvents = {
  'change-scene': [
    sceneStr: 'SpuTable' | 'AddOrUpdateSpu' | 'AddSku',
    tablePage: 'currentPage' | 'firstPage',
  ]
}

// 使用 defineEmits 获取父组件给子组件绑定的自定义事件
const $emit = defineEmits<EmitEvents>()

// 点击"取消"按钮时会触发该函数，切换为"展示表格界面"的场景，并且显示离开"表格界面"时的数据
const handleCancelBtn = () => $emit('change-scene', 'SpuTable', 'currentPage')

// handleSaveBtn 函数会在点击"保存"按钮时触发
const handleSaveBtn = async () => {
  // 整理收集的参数，将其转换成服务器需要的数据格式
  // 1. 整理"照片墙"的数据，并转换成服务器需要的数据格式。
  // 对于已存在的图片，使用url属性；对于新增图片，使用response中服务器返回的url地址
  completeSpuParams.value.spuImageList = allUploadImgs.value.map((item) => ({
    imgName: item.name, // 图片名称
    imgUrl: (item.response as { data: string })?.data ?? item.url, // 图片路径
  }))

  // 2. 整理"销售属性"的数据，并转换成服务器需要的数据格式。
  completeSpuParams.value.spuSaleAttrList = allSaleAttrs.value

  try {
    // 发送"新增"或"编辑" SPU 数据的接口
    await reqAddOrUpdateSpu(completeSpuParams.value)

    // 请求发送成功，弹出提示信息
    ElMessage.success(completeSpuParams.value.id ? '修改成功' : '添加成功')

    // 通知父组件切换场景为"表格界面"
    $emit(
      'change-scene',
      'SpuTable',
      completeSpuParams.value.id ? 'currentPage' : 'firstPage',
    )
  } catch (error) {
    // 请求发送失败，弹出提示信息
    ElMessage.error(completeSpuParams.value.id ? '修改失败' : '添加失败')
    console.log(error)
  }
}
//#endregion -------------- "保存"按钮和"取消"按钮的相关业务逻辑 --------------------
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
        :before-upload="hanleBeforeUpload"
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
        v-model="collectUnselectedSaleAttr"
        :placeholder="
          unselectedSaleAttrNames.length
            ? `未选择 ${unselectedSaleAttrNames.length} 个销售属性`
            : '无'
        "
        style="width: 240px; margin-right: 20px"
      >
        <el-option
          v-for="item in unselectedSaleAttrNames"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        />
      </el-select>
      <!-- "添加销售属性"的按钮 -->
      <el-button
        :disabled="!collectUnselectedSaleAttr"
        type="primary"
        icon="Plus"
        @click="addSaleAttrBtn"
      >
        添加销售属性
      </el-button>
      <!-- 展示销售属性和属性值的表格 -->
      <el-table :data="allSaleAttrs" border style="margin-top: 13px">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="销售属性名" width="150" prop="saleAttrName" />
        <el-table-column label="销售属性值">
          <template #default="{ row }">
            <el-tag
              v-for="(item, tagIndex) in row.spuSaleAttrValueList"
              :key="item.id"
              closable
              style="margin-right: 10px"
              @close="row.spuSaleAttrValueList.splice(tagIndex, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <!-- "编辑模式"显示输入框 -->
            <el-input
              v-if="row.isEditMode"
              ref="editModeInputRef"
              v-model="row.newSaleAttrValue"
              placeholder="请输入属性值"
              size="small"
              style="width: 110px"
              @blur="editModeInputBlur(row)"
            />
            <!-- "查看模式"显示按钮 -->
            <el-button
              v-else
              type="success"
              icon="Plus"
              size="small"
              @click="lookModeBtnClick(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" align="center">
          <template #default="{ row, $index }">
            <el-popconfirm
              width="220"
              icon="DeleteFilled"
              icon-color="#F56C6C"
              :title="`你确定要删除 &quot;${row.saleAttrName}&quot; 销售属性吗？`"
              @confirm="allSaleAttrs.splice($index, 1)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="!allSaleAttrs.length"
        type="primary"
        icon="Select"
        @click="handleSaveBtn"
      >
        保存
      </el-button>
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
