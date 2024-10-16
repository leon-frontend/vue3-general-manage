<script setup lang="ts" name="RoleAuth">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqAddOrUpdateRole,
  reqAllPermissionData,
  reqAllRolesData,
  reqAssignPermission,
  reqDeleteRole,
} from '@/api/auth/role'
import type { SingleMenuPermission, SingleRoleData } from '@/api/auth/role/type'
import type { ElTree, FormInstance, FormRules } from 'element-plus'

// allRolesData 响应式数据用于存储全部已有"角色"数据
const allRolesData = ref<SingleRoleData[]>([])

//#region --------------------- "数据初始化与展示"、"搜索"相关的业务逻辑 ---------------------------
// 与"分页器"相关的响应式数据
const pageNo = ref<number>(1) // 控制分页器的当前页数
const pageSize = ref<number>(10) // 控制每页展示的数据大小
const total = ref<number>(0) // 展示数据总数

// 用于存储用户输入的关键字，用于"搜索"功能
const keyword = ref<string>('')

// getAllRolesData 函数用于获取全部已有用户信息，形参用于跳转到指定页数
const getAllRolesData = async (pager = 1) => {
  // 给 getAllRolesData 的形参传递想要获取数据的页数，默认是获取第一页的数据
  pageNo.value = pager

  try {
    // 发送 reqAllRolesData 请求，获取全部已有用户信息
    const { data } = await reqAllRolesData(
      pageNo.value,
      pageSize.value,
      keyword.value.trim(), // 该字段用于"搜索"功能，默认是空字符串
    )

    // 请求成功响应后，保存请求返回的数据
    total.value = data.total
    allRolesData.value = data.records
  } catch (error) {
    console.log(error)
  }
}

// 组件挂载到页面上时，获取全部已有用户信息
onMounted(() => getAllRolesData())

// changePageNo 函数会在"分页器"的"当前页"发生变化时触发，并且会自动注入"新的当前页"的值
const changePageNo = (newPageNo: number) => getAllRolesData(newPageNo)

// changePageSize 函数会在"分页器"的"页面展示的数据大小"发生变化时触发，并且会自动注入"新的数据大小"的值
const changePageSize = () => getAllRolesData() // 不带参数，切换大小后，展示第一页数据

// searchRoleBtn 函数会在点击"搜索"按钮时触发
const searchRoleBtn = () => {
  getAllRolesData() // 根据 keyword 的值获取用户数据
  keyword.value = '' // 清空输入框中的内容
}

// searchResetBtn 函数会在点击"重置"按钮时触发
const searchResetBtn = () => {
  keyword.value = '' // 清空输入框中的内容
  getAllRolesData() // 根据 keyword 的值获取用户数据
}
//#endregion ------------------ "数据初始化与展示"、"搜索"相关的业务逻辑 ---------------------------

//#region --------------------- "新增"和"更新"角色数据相关的业务逻辑 ----------------------------
// roleDataParams 用于收集"角色"数据，并作为 reqAddOrUpdateRole 请求携带的参数
const roleDataParams = reactive<SingleRoleData>({
  roleName: '',
})

const isDialogShow = ref<boolean>(false) // 控制对话框的显示与隐藏
const formRef = ref<FormInstance | null>(null) // formRef 用于获取 el-form 组件的实例

// addRoleData 函数会在点击"添加角色"按钮时触发
const addRoleData = () => {
  // 清空"dialog"组件中上一次输入的数据
  Object.assign(roleDataParams, {
    roleName: '',
    id: 0, // 清除上一次"编辑模式"下的 id 字段信息
  })

  isDialogShow.value = true // 显示对话框

  // 清空"dialog"组件中上一次的校验提示信息，需要使用 nextTick 等待"抽屉"组件挂载到页面中
  nextTick(() => formRef.value?.clearValidate('roleName'))
}

// updateRoleData 函数会在点击表格中的"编辑"按钮时触发
const updateRoleData = (rowRoleData: SingleRoleData) => {
  isDialogShow.value = true // 显示对话框
  Object.assign(roleDataParams, rowRoleData) // 点击"编辑"按钮时，实现数据回显

  // 清空"dialog"组件中上一次的校验提示信息，需要使用 nextTick 等待"抽屉"组件挂载到页面中
  nextTick(() => formRef.value?.clearValidate('roleName'))
}

// validateRoleName 用于校验 roleName 字段，会在失去焦点(blur)时触发。
const validateRoleName = (
  _: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  value.trim().length >= 2
    ? callback()
    : callback(new Error('角色名称至少为 2 位'))
}

// formRules 表示 dialog 对话框中表单校验的自定义规则的配置对象
const formRules = reactive<FormRules<typeof roleDataParams>>({
  roleName: [{ required: true, validator: validateRoleName, trigger: 'blur' }],
})

// dialogConfirm 函数会在点击 dialog 对话框中的"确定"按钮时触发
const dialogConfirm = async () => {
  try {
    // 先进行 form 表单校验，校验通过后，再执行后续操作
    await formRef.value?.validate()

    // 发送 reqAddOrUpdateRole 请求，用于"新增"或"更新"角色数据
    const { code } = await reqAddOrUpdateRole(roleDataParams)

    // 响应体设计中有一个 code 属性：返回 200 表示请求成功；返回 201 表示请求失败
    if (code === 200) {
      // 请求响应成功后，做如下处理
      isDialogShow.value = false // 请求响应成功后，关闭"dialog"组件
      ElMessage.success(roleDataParams.id ? '更新角色成功' : '添加角色成功')

      // 重新获取一遍数据，若是"新增角色"，则展示第一页的数据；若是"编辑角色"，则展示当前页的数据
      getAllRolesData(roleDataParams.id ? pageNo.value : 1)
    } else {
      isDialogShow.value = false // 请求响应失败后，关闭"dialog"组件
      ElMessage.error(roleDataParams.id ? '更新角色失败' : '添加角色失败')
    }
  } catch (error) {
    console.log(error)
  }
}
//#endregion ------------------ "新增"和"更新"角色数据相关的业务逻辑 ----------------------------

//#region --------------------- "删除"角色数据相关的业务逻辑 ----------------------------
// deleteSingleRole 函数会在点击表格中某一行的"删除"按钮时触发
const deleteSingleRole = async (rowRole: SingleRoleData) => {
  try {
    await reqDeleteRole(rowRole.id as number) // 发送请求，删除某个角色数据
    ElMessage.success('角色删除成功！')
    getAllRolesData(
      allRolesData.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } catch (error) {
    console.log(error)
    ElMessage.error('角色删除失败！')
  }
}
//#endregion ------------------ "删除"角色数据相关的业务逻辑 ----------------------------

//#region --------------------- "分配权限"、树形控件相关的业务逻辑 --------------------------
const isDrawerOpen = ref<boolean>(false) // 控制"抽屉"组件的显示与隐藏
const isSkeletonLoading = ref<boolean>(true) // 控制"骨架屏"组件的显示与隐藏

// allPermissionData 用于存储所有权限数据，并作为树形控件的数据源
const allPermissionData = ref<SingleMenuPermission[]>([])

// selectedPermission 用于存储已选择的"四级(嵌套对象中的最里层数据)"权限数据的 id 数据
const selectedPermissionId = ref<number[]>([])

// defaultTreeProps 表示树形控件的配置项
const defaultTreeProps = {
  children: 'children', // 决定"树形控件的数据"中"孩子节点"的属性名
  label: 'name', // 决定"树形控件的数据"中"展示文本"的属性名
}

/**
 * 该函数用于从所有权限数据中找出"已选择"的"四级(嵌套对象中的最里层数据)"权限数据的 id 数据
 * @param allPermissionData 所有权限数据
 * @param permissionIdList 已选择的"四级(嵌套对象中的最里层数据)"权限数据的 id 数据
 */
const findSelectedPermissionId = (
  allPermissionData: SingleMenuPermission[],
  permissionIdList: number[],
): number[] => {
  // 遍历所有权限数据
  allPermissionData.forEach((permisson) => {
    // 只有当遍历到"四级"权限，且 select 的值为真时，才记录这个权限数据的 id
    if (permisson.select && permisson.level === 4)
      permissionIdList.push(permisson.id)

    // 若存在孩子节点，则进行递归遍历
    if (permisson.children && permisson.children.length > 0)
      findSelectedPermissionId(permisson.children, permissionIdList)
  })

  return permissionIdList
}

// assignPermissionBtn 函数会在点击表格中的"分配权限"按钮时触发
const assignPermissionBtn = async (rowRoleData: SingleRoleData) => {
  isDrawerOpen.value = true // 显示"分配权限"的"抽屉"组件
  isSkeletonLoading.value = true // 显示"骨架屏"组件
  Object.assign(roleDataParams, rowRoleData) // 保存当前行的数据，方便"抽屉"组件使用

  try {
    const { data } = await reqAllPermissionData(roleDataParams.id as number) // 根据角色 id 获取菜单权限
    allPermissionData.value = data // 存储请求返回的所有权限数据
    selectedPermissionId.value = findSelectedPermissionId(
      allPermissionData.value,
      [],
    ) // 找出"已选择"的"四级(嵌套对象中的最里层数据)"权限数据的 id 数据
    isSkeletonLoading.value = false // 请求响应成功后，隐藏"骨架屏"组件
  } catch (error) {
    console.log(error)
  }
}

// treeRef 用于获取 el-tree 树形控件的组件实例
const treeRef = ref<InstanceType<typeof ElTree> | null>(null)

// drawerConfirm 函数会在点击"抽屉"组件的"确定"按钮时触发
const drawerConfirm = async () => {
  // 通过 getCheckedKeys 方法获取被选中的权限数据的 id 数据（node-key 的值）
  const checkedPermissionIds = treeRef.value?.getCheckedKeys()

  // 通过 getHalfCheckedKeys 方法获取"目前半选"的权限数据的 id 数据（node-key 的值）
  const halfCheckedPermissionIds = treeRef.value?.getHalfCheckedKeys()

  // 合并两个 id 数组，用于 reqAssignPermission 请求的第二个参数
  const allCheckedPermissionIds = (checkedPermissionIds as number[]).concat(
    halfCheckedPermissionIds as number[],
  )

  try {
    // 发送请求，给角色分配权限
    await reqAssignPermission(
      roleDataParams.id as number,
      allCheckedPermissionIds,
    )
    ElMessage.success('分配权限成功！')
    isDrawerOpen.value = false // 关闭"抽屉"组件
    window.location.reload() // 页面刷新，页面需要根据"新的权限数据"重新加载
  } catch (error) {
    console.log(error)
    ElMessage.error('分配权限失败！')
    isDrawerOpen.value = false // 关闭"抽屉"组件
  }
}
//#endregion ------------------ "分配权限"、树形控件相关的业务逻辑 --------------------------
</script>

<template>
  <div>
    <!-- "搜索"功能 -->
    <el-card style="height: 80px; margin-bottom: 25px">
      <el-form inline class="form-container">
        <el-form-item label="角色名称：">
          <el-input v-model="keyword" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :disabled="!keyword.trim().length"
            @click="searchRoleBtn"
          >
            搜索
          </el-button>
          <el-button size="large" @click="searchResetBtn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- "角色"数据展示区域 -->
    <el-card>
      <el-button type="primary" icon="Plus" @click="addRoleData">
        添加角色
      </el-button>

      <!-- 表格展示"角色"数据 -->
      <el-table :data="allRolesData" border style="margin: 20px 0">
        <el-table-column type="index" label="#" align="center" width="60" />
        <el-table-column label="ID" prop="id" align="center" width="100" />
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="更新时间"
          prop="updateTime"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="350" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="User"
              @click="assignPermissionBtn(row)"
            >
              分配权限
            </el-button>
            <el-button type="warning" icon="Edit" @click="updateRoleData(row)">
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定删除 ${row.roleName} ?`"
              width="200"
              @confirm="deleteSingleRole(row)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete">删除</el-button>
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
    </el-card>

    <!-- dialog 对话框："新增"和"更新"角色数据 -->
    <el-dialog
      v-model="isDialogShow"
      :title="roleDataParams.id ? '更新角色' : '添加角色'"
      width="500"
    >
      <el-form :model="roleDataParams" :rules="formRules" ref="formRef">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input
            v-model="roleDataParams.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDialogShow = false">取消</el-button>
          <el-button type="primary" @click="dialogConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- "抽屉"组件：用于分配权限 -->
    <el-drawer v-model="isDrawerOpen" title="分配权限" direction="rtl">
      <template #default>
        <el-skeleton :rows="5" :loading="isSkeletonLoading" animated>
          <template #default>
            <!-- 树形控件 -->
            <el-tree
              style="max-width: 600px"
              ref="treeRef"
              :data="allPermissionData"
              show-checkbox
              node-key="id"
              :default-checked-keys="selectedPermissionId"
              :props="defaultTreeProps"
              default-expand-all
            />
          </template>
        </el-skeleton>
      </template>
      <template #footer>
        <el-button size="large" @click="isDrawerOpen = false">取消</el-button>
        <el-button type="primary" size="large" @click="drawerConfirm">
          确定
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.form-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
