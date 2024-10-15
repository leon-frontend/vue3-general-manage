<script setup lang="ts" name="TradeMarkModal">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqAddOrUpdateTradeMark } from '@/api/product/tradeMark'
import type { UploadProps, FormInstance } from 'element-plus'
import type {
  SingleTradeMarkData,
  TradeMarkResponseNullData,
} from '@/api/product/tradeMark/type'

// 定义父组件传递过来的数据的 TS 类型
interface Props {
  modalTradeMarkData: SingleTradeMarkData
  isModalShow: boolean
  controlModalShow: (isShow: boolean) => boolean
  getHasTradeMark: () => Promise<void>
}

// 使用 defineProps 接收父组件传递过来的数据
const props = defineProps<Props>()

// modalFormRef 表示 el-form 组件实例
const modalFormRef = ref<FormInstance | null>(null)

// 向父组件暴露 el-form 组件实例，让父组件使用
defineExpose({ modalFormRef })

//#region ----------------- Modal 弹框中的表单校验 --------------------
// 定义校验方法中的 callback 形参的 TS 类型
type ValidatorCallback = (errorMessage?: string) => void

/**
 * validatorTmName 函数是表单校验 tmName 字段的自定义校验方法
 * @param rule 表示校验规则对象，这里由于没有使用到该参数，所以使用 _ 占位
 * @param value 表示表单控件收集的数据
 * @param callback 校验成功时，调用该方法且不传递参数，表示放行；校验失败时，调用该方法且其参数为失败的信息。
 */
const validatorTmName = (
  _: unknown,
  value: string,
  callback: ValidatorCallback,
) => {
  value.trim().length >= 2
    ? callback()
    : callback('品牌名称的长度需要大于等于两位')
}

// validatorLogoUrl 函数是表单校验 logoUrl 字段的自定义校验方法
const validatorLogoUrl = (
  _: unknown,
  value: string, // value 时图片文件的 url，是一个 string 类型
  callback: ValidatorCallback,
) => {
  value ? callback() : callback('请上传 Logo 图片')
}

/**
 * 自定义 Modal 框中的表单校验规则
 * @property required 表示必须要填写的字段
 * @property trigger 表示表单校验触发的时机
 * @property validator 表示校验字段的方法
 */
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
//#endregion -------------- Modal 弹框中的表单校验 --------------------

//#region ----------------- 图片文件上传的业务逻辑 --------------------
// beforeAvatarUpload 函数会在上传文件之前触发，校验上传文件的格式和文件大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('图片文件必须是 JPG | PNG | GIF 格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片文件大小不允许超过 4MB!')
    return false
  }
  return true
}

// 定义图片文件上传请求返回数据的 TS 类型
type FileUploadResData = {
  code: number
  data: string // 图片文件的 URL 地址
  message: string
  ok: boolean
}

/**
 * handleAvatarSuccess 函数会在文件上传成功时触发
 * @param response 为当前图片文件成功上传后，返回的数据，包括图片文件的 URL 地址
 * @param uploadFile （第二个参数，此处省略）为图片文件的详细信息
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: FileUploadResData,
) => {
  // 在 modalTradeMarkData 响应式数据中收集品牌数据的图片文件地址
  props.modalTradeMarkData.logoUrl = response.data

  // 图片上传成功之后，清除之前的图片校验结果
  modalFormRef.value?.clearValidate('logoUrl')
}
//#endregion ----------------- 图片文件上传的业务逻辑 --------------------

// handleModalConfirm 函数会在点击 Modal 弹框中的"确定"按钮时触发
const handleModalConfirm = async () => {
  try {
    // 发送请求之前，对表单进行校验
    await modalFormRef.value?.validate()

    // 根据数据是否存在 id ，发送"新增品牌数据"的请求或"修改已有品牌数据"的请求
    const result: TradeMarkResponseNullData = await reqAddOrUpdateTradeMark(
      props.modalTradeMarkData,
    )

    // 当返回的响应码是 200 时，表示响应成功
    if (result.code === 200) {
      // 弹出提示信息
      ElMessage.success(
        props.modalTradeMarkData.id ? '编辑品牌成功' : '添加品牌成功',
      )

      // 重新发送请求，获取更新后的数据（需要更新数据总数等等）
      props.getHasTradeMark()
    } else {
      // 弹出提示信息
      ElMessage.error(
        props.modalTradeMarkData.id ? '编辑品牌失败' : '添加品牌失败',
      )
    }

    // 隐藏 Modal 弹框
    props.controlModalShow(false)
  } catch (error) {
    console.log('表单校验失败：', error)
  }
}
</script>

<template>
  <!-- el-dialog 组件中的 model-value 属性用于控制 Modal 弹框的显示与隐藏 -->
  <el-dialog
    :model-value="isModalShow"
    :title="modalTradeMarkData.id ? '编辑品牌' : '添加品牌'"
    @close="controlModalShow(false)"
  >
    <el-form
      ref="modalFormRef"
      :model="modalTradeMarkData"
      :rules="rules"
      label-width="auto"
      style="width: 70%; margin: 20px auto"
    >
      <!-- "品牌名称"字段: 在使用了 validate、resetFields 的方法时，prop 属性是必填的 -->
      <el-form-item label="品牌名称：" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="modalTradeMarkData.tmName"
        ></el-input>
      </el-form-item>
      <!-- "图片上传"字段 -->
      <el-form-item label="品牌 LOGO：" prop="logoUrl">
        <!-- 图片上传组件：action 表示请求的 URL，上传路径要主动携带 /api 路径 -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
        >
          <el-image
            v-if="modalTradeMarkData.logoUrl"
            :src="modalTradeMarkData.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 使用具名插槽 footer 实现底部的两个按钮 -->
    <template #footer>
      <el-space size="large" style="margin-right: 20px">
        <el-button
          type="primary"
          size="default"
          @click="controlModalShow(false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="default" @click="handleModalConfirm">
          确定
        </el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(el-upload:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
