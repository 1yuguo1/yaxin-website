<template>
  <div class="user-management">
    <div class="header-actions">
      <el-button type="primary" @click="handleCreateUser" :loading="loading">添加用户</el-button>
    </div>
    
    <div class="table-container">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="id" label="id" width="120" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="password" label="密码" width="120" />
        <el-table-column prop="role_id" label="权限等级" width="120" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column prop="created_at" label="账号创建时间" width="120" />
        <el-table-column prop="last_login_at" label="上一次登录时间" width="120" />
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default="scope">
            <el-button 
              link 
              type="primary" 
              size="small" 
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
            <el-button 
              @click="changeStatus(scope.row)" 
              link 
              type="primary"
              size="small"
            >
              禁用/启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div class="pagination-container">
      <el-pagination
        @current-change="changePage" 
        background 
        layout="prev, pager, next" 
        :total="total"
        :page-size="size" 
        v-model:current-page="currentPage" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  createUser, 
  deleteUser, 
  changeUserStatus, 
  getUsersByPage, 
  initUserData, 
  getUserTotal 
} from '@/utils/userApi'

// 响应式数据
const tableData = ref([])
const loading = ref(false)
const total = ref(20)
const size = ref(8)
const currentPage = ref(1)

// 创建用户
const handleCreateUser = async () => {
  loading.value = true
  try {
    const response = await createUser()
    if (response.code === 200) {
      ElMessage.success('用户创建成功')
      await loadUserData()
      await loadTotal()
    } else {
      ElMessage.error(response.msg || '创建用户失败')
    }
  } catch (error) {
    console.error('创建用户失败:', error)
    ElMessage.error('创建用户失败')
  } finally {
    loading.value = false
  }
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个用户吗？', '确认删除', {
      type: 'warning'
    })
    
    loading.value = true
    try {
      const response = await deleteUser(row.username)
      if (response.code === 200) {
        ElMessage.success('用户删除成功')
        await loadTotal()
        await loadUserData()
        currentPage.value = 1
      } else {
        ElMessage.error(response.msg || '删除用户失败')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    } finally {
      loading.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
    }
  }
}

// 改变用户状态
const changeStatus = async (row) => {
  loading.value = true
  try {
    const response = await changeUserStatus(row.username)
    if (response.code === 200) {
      ElMessage.success('用户状态更新成功')
      await loadUserData()
      currentPage.value = 1
    } else {
      ElMessage.error(response.msg || '更新用户状态失败')
    }
  } catch (error) {
    console.error('改变用户状态失败:', error)
    ElMessage.error('更新用户状态失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const changePage = async (page) => {
  loading.value = true
  try {
    const response = await getUsersByPage(page)
    if (response.code === 200) {
      tableData.value = response.data
    } else {
      ElMessage.error(response.msg || '分页加载失败')
    }
  } catch (error) {
    console.error('分页加载失败:', error)
    ElMessage.error('分页加载失败')
  } finally {
    loading.value = false
  }
}

// 加载用户数据
const loadUserData = async () => {
  loading.value = true
  try {
    const response = await initUserData()
    if (response.code === 200) {
      tableData.value = response.data
    } else {
      ElMessage.error(response.msg || '加载用户数据失败')
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    ElMessage.error('加载用户数据失败')
  } finally {
    loading.value = false
  }
}

// 加载总数
const loadTotal = async () => {
  try {
    const response = await getUserTotal()
    if (response.code === 200) {
      total.value = response.total
    } else {
      ElMessage.error(response.msg || '加载总数失败')
    }
  } catch (error) {
    console.error('加载总数失败:', error)
    ElMessage.error('加载总数失败')
  }
}

// 初始化
onMounted(async () => {
  await loadUserData()
  await loadTotal()
  console.log('UserManagement initialized, total:', total.value)
})
</script>

<style scoped>
.user-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.header-actions {
  flex-shrink: 0;
  margin-bottom: 20px;
}

.table-container {
  flex: 1;
  overflow: auto;
  margin-bottom: 20px;
}

.pagination-container {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}
</style>
