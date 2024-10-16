<script setup lang="ts" name="UserAuth">
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqAddOrUpdateUser,
  reqAllUserAuthInfo,
  reqAssignRole,
  reqDeleteBatch,
  reqDeleteSingle,
  reqGetAllRoles,
} from '@/api/auth/user'
import { ElMessage } from 'element-plus'
import type {
  AssignRoleParam,
  SingleRole,
  SingleUserAuthInfo,
} from '@/api/auth/user/type'
import type { FormInstance, FormRules } from 'element-plus'

// allUserAuthInfo 响应式数据用于存储全部已有用户信息
const allUserAuthInfo = ref<SingleUserAuthInfo[]>([])

//#region --------------------- "数据初始化与展示"、"搜索"相关的业务逻辑 ---------------------------
// 与"分页器"相关的响应式数据
const pageNo = ref<number>(1) // 控制分页器的当前页数
const pageSize = ref<number>(5) // 控制每页展示的数据大小
const total = ref<number>(0) // 展示数据总数

// 用于存储用户输入的关键字，用于"搜索"功能
const keyword = ref<string>('')

// getAllUserAuthInfo 函数用于获取全部已有用户信息，形参用于跳转到指定页数
const getAllUserAuthInfo = async (pager = 1) => {
  // 给 getAllUserAuthInfo 的形参传递想要获取数据的页数，默认是获取第一页的数据
  pageNo.value = pager

  try {
    // 发送 reqAllUserAuthInfo 请求，获取全部已有用户信息
    const { data } = await reqAllUserAuthInfo(
      pageNo.value,
      pageSize.value,
      keyword.value.trim(), // 该字段用于"搜索"功能，默认是空字符串
    )

    // 请求成功响应后，保存请求返回的数据
    total.value = data.total
    allUserAuthInfo.value = data.records
  } catch (error) {
    console.log(error)
  }
}

// 组件挂载到页面上时，获取全部已有用户信息
onMounted(() => getAllUserAuthInfo())

// changePageNo 函数会在"分页器"的"当前页"发生变化时触发，并且会自动注入"新的当前页"的值
const changePageNo = (newPageNo: number) => getAllUserAuthInfo(newPageNo)

// changePageSize 函数会在"分页器"的"页面展示的数据大小"发生变化时触发，并且会自动注入"新的数据大小"的值
const changePageSize = () => getAllUserAuthInfo() // 不带参数，切换大小后，展示第一页数据

// searchUserAuthInfo 函数会在点击"搜索"按钮时触发
const searchUserAuthInfo = () => {
  getAllUserAuthInfo() // 根据 keyword 的值获取用户数据
  keyword.value = '' // 清空输入框中的内容
}

// searchResetBtn 函数会在点击"重置"按钮时触发
const searchResetBtn = () => {
  keyword.value = '' // 清空输入框中的内容
  getAllUserAuthInfo() // 根据 keyword 的值获取用户数据
}
//#endregion ------------------ "数据初始化与展示"、"搜索"相关的业务逻辑 ---------------------------

//#region ----------------------- "新增"、"编辑"用户信息的业务逻辑 ---------------------------
// userAuthInfoParams 用于收集用户信息，并作为 reqAddOrUpdateUser 请求携带的参数
const userAuthInfoParams = reactive<SingleUserAuthInfo>({
  username: '',
  name: '',
  password: '',
})

// isUserDrawerOpen 用于控制"新增用户"和"编辑用户"的"抽屉"组件的显示与隐藏
const isUserDrawerOpen = ref<boolean>(false)

// 统一定义自定义校验函数的 TS 类型
type ValidateFn = (
  _: unknown,
  value: string,
  callback: (error?: Error) => void,
) => void

// validateUsername 用于校验 username 字段，会在失去焦点(blur)时触发。
const validateUsername: ValidateFn = (_, value, callback) => {
  value.trim().length >= 5
    ? callback()
    : callback(new Error('用户姓名至少为 5 位'))
}

// validateName 用于校验 name 字段，会在失去焦点(blur)时触发。
const validateName: ValidateFn = (_, value, callback) => {
  value.trim().length >= 5
    ? callback()
    : callback(new Error('用户昵称至少为 5 位'))
}

// validateName 用于校验 name 字段，会在失去焦点(blur)时触发。
const validatePassword: ValidateFn = (_, value, callback) => {
  value.trim().length >= 6
    ? callback()
    : callback(new Error('用户密码至少为 6 位'))
}

// formRules 表示表单校验的自定义规则的配置对象
const formRules = reactive<FormRules<typeof userAuthInfoParams>>({
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  name: [{ required: true, validator: validateName, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
})

// formRef 用于获取 el-form 组件的实例
const formRef = ref<FormInstance | null>(null)

// addUserAuthInfo 函数会在点击"新增用户"按钮时触发
const addUserAuthInfo = () => {
  // 清空"抽屉"组件中上一次输入的数据
  Object.assign(userAuthInfoParams, {
    username: '',
    name: '',
    password: '',
    id: 0, // 清除上一次"编辑模式"下的 id 字段信息
  })

  isUserDrawerOpen.value = true // 显示"抽屉"组件

  // 清空"抽屉"组件中上一次的校验提示信息，需要使用 nextTick 等待"抽屉"组件挂载到页面中
  nextTick(() => {
    formRef.value?.clearValidate('username')
    formRef.value?.clearValidate('name')
    formRef.value?.clearValidate('password')
  })
}

// updateUserAuthInfo 函数会在点击表格中的"编辑"按钮时触发
const updateUserAuthInfo = (rowUser: SingleUserAuthInfo) => {
  isUserDrawerOpen.value = true // 显示"抽屉"组件
  Object.assign(userAuthInfoParams, rowUser) // 点击"编辑"按钮时，实现数据回显

  // 清空"抽屉"组件中上一次的校验提示信息，需要使用 nextTick 等待"抽屉"组件挂载到页面中
  nextTick(() => {
    formRef.value?.clearValidate('username')
    formRef.value?.clearValidate('name')
  })
}

// userDrawerConfirm 函数会在点击"抽屉"组件的"确定"按钮时触发
const userDrawerConfirm = async () => {
  try {
    // 先进行 form 表单校验，校验通过后，再执行后续操作
    await formRef.value?.validate()

    // 发送 reqAddOrUpdateUser 请求，用于"新增"或"更新"用户信息
    const { code } = await reqAddOrUpdateUser(userAuthInfoParams)

    // 响应体设计中有一个 code 属性：返回 200 表示请求成功；返回 201 表示请求失败
    if (code === 200) {
      // 请求响应成功后，做如下处理
      isUserDrawerOpen.value = false // 请求响应成功后，关闭"抽屉"组件
      ElMessage.success(userAuthInfoParams.id ? '更新成功' : '添加成功')

      // 重新获取一遍数据，若是"新增用户"，则展示第一页的数据；若是"编辑用户"，则展示当前页的数据
      getAllUserAuthInfo(userAuthInfoParams.id ? pageNo.value : 1)
    } else {
      isUserDrawerOpen.value = false // 请求响应失败后，关闭"抽屉"组件
      ElMessage.error(userAuthInfoParams.id ? '更新失败' : '添加失败')
    }
  } catch (error) {
    console.log(error)
  }
}
//#endregion -------------------- "新增"、"编辑"用户信息的业务逻辑 ---------------------------

//#region ----------------------- "删除"用户信息的业务逻辑 ---------------------------
// delUserAuthInfo 函数会在点击表格中某一行的"删除"按钮时触发
const delUserAuthInfo = async (rowUser: SingleUserAuthInfo) => {
  try {
    // 发送 reqDeleteSingle 请求，根据 id 列表删除某个用户数据
    await reqDeleteSingle(rowUser.id as number)
    ElMessage.success('删除成功！')

    // 重新获取一遍"当前页"的数据。若删除当前数据后当前页没有数据了，则获取前一夜的数据
    getAllUserAuthInfo(
      allUserAuthInfo.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } catch (error) {
    console.log(error)
    ElMessage.error('删除失败！')
  }
}

// delBatchUserId 用于存储需要"批量删除"用户的 id 信息
const delBatchUserIdList = ref<number[]>([])

// changeSelection 会在当表格中的选择项(复选框)发生变化时触发
const changeSelection = (newSelection: SingleUserAuthInfo[]) => {
  // 更新需要"批量删除"用户的 id 信息
  delBatchUserIdList.value = newSelection.map(
    (userInfo) => userInfo.id as number,
  )
}

// delBatchUserAuthInfo 函数会在点击"批量删除"按钮时触发
const delBatchUserAuthInfo = async () => {
  try {
    await reqDeleteBatch(delBatchUserIdList.value) // 根据 id 列表批量删除用户数据
    ElMessage.success('批量删除成功！')

    // 重新获取一遍数据
    getAllUserAuthInfo(
      allUserAuthInfo.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } catch (error) {
    console.log(error)
    ElMessage.error('批量删除失败！')
  }
}
//#endregion -------------------- "删除"用户信息的业务逻辑 ---------------------------

//#region ----------------------- "分配角色"相关的业务逻辑 ------------------------------
// isRoleDrawerOpen 用于控制"分配角色"的"抽屉"组件的显示与隐藏
const isRoleDrawerOpen = ref<boolean>(false)

// assignRoleBtn 函数会在点击"分配角色"按钮时触发
const assignRoleBtn = async (rowUser: SingleUserAuthInfo) => {
  Object.assign(userAuthInfoParams, rowUser) // 存储当前行的数据，实现表单数据回显

  try {
    // 发送 reqGetAllRoles 请求，获取"角色"数据
    const {
      data: { assignRoles, allRolesList },
    } = await reqGetAllRoles(rowUser.id as number)

    allRoles.value = allRolesList // 更新所有的"角色"数据
    checkedRoles.value = assignRoles // 更新被选中的"角色"数据
    isIndeterminate.value =
      checkedRoles.value.length > 0 &&
      checkedRoles.value.length < allRoles.value.length // 更新"全选"复选框的样式
    isRoleDrawerOpen.value = true // 请求响应成功后，显示"抽屉"组件
  } catch (error) {
    console.log(error)
  }
}

// "复选框"相关的响应式数据
const isCheckAll = ref<boolean>(false) // 用于控制"全选"复选框
const isIndeterminate = ref<boolean>(false) // 只选择了某一部分的复选框时(值为 true)展示的样式
const allRoles = ref<SingleRole[]>([]) // 用于存储所有的"角色"数据
const checkedRoles = ref<SingleRole[]>([]) // 用于存储被选中的"角色"数据

/**
 * changeCheckAll 会在"全选"复选框的值发生变化时触发
 * @param isChecked 表示"全选"复选框是否被选中
 */
const changeCheckAll = (isChecked: boolean) => {
  checkedRoles.value = isChecked ? allRoles.value : [] // 更新被选中的"角色"
  isIndeterminate.value = false // 更新"全选"复选框的样式
}

/**
 * changeCheckedRoles 会在任意一个复选框(除"全选"以外)的值发生变化时触发
 * @param checkedRolesArr 是由当前"被选中的复选框"组成的数组
 */
const changeCheckedRoles = (checkedRolesArr: string[]) => {
  const checkedCount = checkedRolesArr.length // "被选中的复选框"的数组长度
  isCheckAll.value = allRoles.value.length === checkedCount // 更新"全选"复选框的选中状态
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length // 更新"全选"复选框的样式
}

// roleDrawerConfirm 会在点击"抽屉"组件的"确定"按钮时触发
const roleDrawerConfirm = async () => {
  // 收集 reqAssignRole 请求的形参需要的数据
  const assignRoleParam: AssignRoleParam = {
    userId: userAuthInfoParams.id as number,
    roleIdList: checkedRoles.value.map((role) => role.id),
  }

  try {
    await reqAssignRole(assignRoleParam) // 发送 reqAssignRole 请求，分配角色
    ElMessage.success('分配角色成功！')
    isRoleDrawerOpen.value = false // 关闭"抽屉"组件
    getAllUserAuthInfo(pageNo.value) // 数据更新完毕后，重新获取一遍"当前页"的"用户"数据
  } catch (error) {
    console.log(error)
    ElMessage.error('分配角色失败！')
  }
}
//#endregion --------------------- "分配角色"相关的业务逻辑 ------------------------------
</script>

<template>
  <div>
    <el-card style="height: 80px; margin-bottom: 25px">
      <el-form inline class="form-container">
        <el-form-item label="用户名：">
          <el-input v-model="keyword" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :disabled="!keyword.trim().length"
            @click="searchUserAuthInfo"
          >
            搜索
          </el-button>
          <el-button size="large" @click="searchResetBtn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" icon="Plus" @click="addUserAuthInfo">
        添加用户
      </el-button>
      <el-button
        type="danger"
        icon="Delete"
        :disabled="!delBatchUserIdList.length"
        @click="delBatchUserAuthInfo"
      >
        批量删除
      </el-button>

      <!-- 表格展示用户信息 -->
      <el-table
        :data="allUserAuthInfo"
        border
        style="margin: 20px 0"
        @selection-change="changeSelection"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column type="index" label="#" align="center" width="60" />
        <el-table-column label="ID" prop="id" align="center" width="100" />
        <el-table-column
          label="用户姓名"
          prop="username"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="用户昵称"
          prop="name"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="用户角色"
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
            <el-button type="primary" icon="User" @click="assignRoleBtn(row)">
              分配角色
            </el-button>
            <el-button
              type="warning"
              icon="Edit"
              @click="updateUserAuthInfo(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定删除 ${row.username} ?`"
              width="200"
              @confirm="delUserAuthInfo(row)"
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
        :page-sizes="[5, 7, 9, 11]"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @current-change="changePageNo"
        @size-change="changePageSize"
      />
    </el-card>

    <!-- "抽屉"组件，用于"新增"和"修改"用户信息 -->
    <el-drawer
      v-model="isUserDrawerOpen"
      :title="userAuthInfoParams.id ? '编辑用户' : '添加用户'"
      direction="rtl"
    >
      <template #default>
        <el-form :model="userAuthInfoParams" :rules="formRules" ref="formRef">
          <el-form-item label="用户姓名：" prop="username">
            <el-input
              v-model="userAuthInfoParams.username"
              placeholder="请填写用户姓名"
            />
          </el-form-item>
          <el-form-item label="用户昵称：" prop="name">
            <el-input
              v-model="userAuthInfoParams.name"
              placeholder="请填写用户昵称"
            />
          </el-form-item>
          <el-form-item
            label="用户密码："
            prop="password"
            v-if="!userAuthInfoParams.id"
          >
            <el-input
              v-model="userAuthInfoParams.password"
              placeholder="请填写用户密码"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button size="large" @click="isUserDrawerOpen = false">
          取消
        </el-button>
        <el-button type="primary" size="large" @click="userDrawerConfirm">
          确定
        </el-button>
      </template>
    </el-drawer>

    <!-- "抽屉"组件，用于"分配角色"-->
    <el-drawer v-model="isRoleDrawerOpen" title="分配角色" direction="rtl">
      <template #default>
        <el-form>
          <el-form-item label="用户姓名：">
            <el-input v-model="userAuthInfoParams.username" disabled />
          </el-form-item>
          <el-form-item label="角色列表：">
            <el-checkbox
              v-model="isCheckAll"
              :indeterminate="isIndeterminate"
              @change="changeCheckAll"
            >
              全选
            </el-checkbox>
            <!-- 显示"角色"信息的复选框 -->
            <el-checkbox-group
              v-model="checkedRoles"
              @change="changeCheckedRoles"
            >
              <el-checkbox
                v-for="role in allRoles"
                :key="role.id"
                :label="role"
                :value="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button size="large" @click="isRoleDrawerOpen = false">
          取消
        </el-button>
        <el-button type="primary" size="large" @click="roleDrawerConfirm">
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
