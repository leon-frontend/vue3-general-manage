<script setup lang="ts" name="MenuAuth">
import { onMounted, reactive, ref } from 'vue'
import {
  reqAddOrUpdateMenu,
  reqAllMenuPermission,
  reqDeleteMenuPermission,
} from '@/api/auth/menu'
import type {
  AddOrUpdateMenuParams,
  SingleMenuPermission,
} from '@/api/auth/menu/type'
import { ElMessage } from 'element-plus'

// allMenuPermission 响应式数据用于存储全部已有"菜单权限"数据
const allMenuPermission = ref<SingleMenuPermission[]>([])

//#region --------------------- "数据初始化与展示"相关的业务逻辑 ---------------------------
const isSkeletonLoading = ref<boolean>(true) // 控制"骨架屏"组件的显示与隐藏

// getAllMenuPermission 函数用于获取全部已有"菜单权限"数据
const getAllMenuPermission = async () => {
  try {
    const { data } = await reqAllMenuPermission() // 发送请求，获取全部"菜单权限"数据
    allMenuPermission.value = data // 请求成功响应后，保存请求返回的数据
  } catch (error) {
    console.log(error)
  }
}

// 组件挂载到页面上时，获取全部已有"菜单权限"数据
onMounted(async () => {
  isSkeletonLoading.value = true // 显示"骨架屏"组件

  try {
    await getAllMenuPermission() // 获取全部已有"菜单权限"数据
    isSkeletonLoading.value = false // 请求响应成功后，隐藏"骨架屏"组件
  } catch (error) {
    console.log(error)
  }
})
//#endregion ------------------ "数据初始化与展示"相关的业务逻辑 ---------------------------

//#region --------------------- "新增"和"更新"菜单权限数据的业务逻辑 -------------------------
const isDialogShow = ref<boolean>(false) // 控制对话框的显示与隐藏

// menuParams 用于收集"菜单权限"数据，并作为 reqAddOrUpdateMenu 请求携带的参数
const menuParams = reactive<AddOrUpdateMenuParams>({
  pid: 0, // 新增菜单所属父级菜单的 id
  name: '',
  code: '', // 权限值
  level: 0, // 标志当前"菜单权限"的层级
})

// addMenuBtn 函数会在点击表格中某行的"添加菜单"或"添加功能"按钮时触发
const addMenuBtn = (rowMenu: SingleMenuPermission) => {
  // 清空上一次输入的数据
  Object.assign(menuParams, {
    pid: 0, // 新增菜单所属父级菜单的 id
    name: '',
    code: '', // 权限值
    level: 0, // 标志当前"菜单权限"的层级
    id: 0,
  })

  isDialogShow.value = true // 显示对话框
  menuParams.level = rowMenu.level + 1 // 收集新增菜单的 level 数据
  menuParams.pid = rowMenu.id as number // 收集新增菜单所属父级菜单的 id
}

// updateMenuBtn 函数会在点击表格中某行的"编辑"按钮时触发
const updateMenuBtn = (rowMenu: SingleMenuPermission) => {
  Object.assign(menuParams, rowMenu) // 收集当前行的"菜单权限"数据,实现数据回显
  isDialogShow.value = true // 显示对话框
}

// dialogConfirm 函数会在点击 dialog 对话框中的"确认"按钮时触发
const dialogConfirm = async () => {
  try {
    // 发送请求，给某一级菜单"新增子菜单"或"更新"某个菜单
    await reqAddOrUpdateMenu(menuParams)
    ElMessage.success(menuParams.id ? '更新成功！' : '新增成功！')
    isDialogShow.value = false // 关闭对话框
    getAllMenuPermission() // 数据更新完毕后，重新获取一遍数据
  } catch (error) {
    console.log(error)
    ElMessage.error(menuParams.id ? '更新失败！' : '新增失败！')
    isDialogShow.value = false // 关闭对话框
  }
}
//#endregion ------------------ "新增"和"更新"菜单权限数据的业务逻辑 -------------------------

//#region --------------------- 递归"删除"某个菜单权限数据的业务逻辑 -------------------------
// deleteMenuBtn 函数会在点击表格中某行的"删除"按钮时触发
const deleteMenuBtn = async (rowMenu: SingleMenuPermission) => {
  try {
    await reqDeleteMenuPermission(rowMenu.id as number) // 递归删除某个"菜单权限"数据
    ElMessage.success('删除成功!')
    getAllMenuPermission() // 数据更新完毕后，重新获取一遍数据
  } catch (error) {
    console.log(error)
    ElMessage.error('删除失败!')
  }
}
//#endregion ------------------ 递归"删除"某个菜单权限数据的业务逻辑 -------------------------
</script>

<template>
  <div>
    <!-- 表格：展示"菜单权限"数据 -->
    <el-skeleton :rows="10" :loading="isSkeletonLoading" animated>
      <el-table
        :data="allMenuPermission"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="权限值" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column label="操作" align="center" width="350" fixed="right">
          <template #default="{ row }">
            <el-button
              :type="row.level === 3 ? 'success' : 'primary'"
              icon="Plus"
              :disabled="row.level === 4"
              @click="addMenuBtn(row)"
            >
              {{ row.level === 3 ? '添加功能' : '添加菜单' }}
            </el-button>
            <el-button
              type="warning"
              icon="Edit"
              :disabled="row.level === 1"
              @click="updateMenuBtn(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定删除 ${row.name} ?`"
              width="200"
              @confirm="deleteMenuBtn(row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  icon="Delete"
                  :disabled="row.level === 1"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-skeleton>

    <!-- dialog 对话框：实现"菜单权限"数据的"新增和更新"操作 -->
    <el-dialog
      v-model="isDialogShow"
      :title="menuParams.id ? '更新菜单' : '添加菜单'"
      width="500"
    >
      <el-form label-width="auto">
        <el-form-item label="名称：">
          <el-input v-model="menuParams.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="权限值：">
          <el-input v-model="menuParams.code" placeholder="请输入权限值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDialogShow = false">取消</el-button>
          <el-button type="primary" @click="dialogConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
