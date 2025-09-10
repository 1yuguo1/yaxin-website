<template>
  <div class="feedback-management">
    <div class="header-actions">
      <el-button type="primary" @click="refreshData">刷新数据</el-button>
      <el-button type="success" @click="markAllRead" :disabled="unreadCount === 0">
        全部标记为已读 ({{ unreadCount }})
      </el-button>
    </div>
    
    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="filterStatus" placeholder="选择状态" @change="handleFilter">
            <el-option label="全部" value="" />
            <el-option label="未读" value="unread" />
            <el-option label="已读" value="read" />
            <el-option label="已回复" value="replied" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterType" placeholder="选择类型" @change="handleFilter">
            <el-option label="全部类型" value="" />
            <el-option label="咨询" value="consultation" />
            <el-option label="投诉" value="complaint" />
            <el-option label="建议" value="suggestion" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户姓名、邮箱或内容"
            @input="handleSearch"
            @clear="handleSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    
    <!-- 反馈列表 -->
    <div class="table-container">
      <el-table :data="filteredData" v-loading="loading" @row-click="handleRowClick">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user_name" label="用户姓名" width="120" />
        <el-table-column prop="user_email" label="邮箱" width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="160" />
        <el-table-column prop="reply_at" label="回复时间" width="160" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button 
              link 
              type="primary" 
              size="small" 
              @click.stop="viewDetail(scope.row)"
            >
              查看详情
            </el-button>
            <el-button 
              link 
              type="success" 
              size="small" 
              @click.stop="replyFeedback(scope.row)"
              :disabled="scope.row.status === 'replied'"
            >
              回复
            </el-button>
            <el-button 
              link 
              type="danger" 
              size="small" 
              @click.stop="deleteFeedback(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @current-change="changePage" 
        background 
        layout="prev, pager, next, total" 
        :total="total"
        :page-size="pageSize" 
        v-model:current-page="currentPage" 
      />
    </div>
    
    <!-- 详情/回复对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="60%"
      :close-on-click-modal="false"
    >
      <div v-if="selectedFeedback" class="feedback-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户姓名">{{ selectedFeedback.user_name }}</el-descriptions-item>
          <el-descriptions-item label="用户邮箱">{{ selectedFeedback.user_email }}</el-descriptions-item>
          <el-descriptions-item label="反馈类型">
            <el-tag :type="getTypeTagType(selectedFeedback.type)">
              {{ getTypeText(selectedFeedback.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag :type="getStatusTagType(selectedFeedback.status)">
              {{ getStatusText(selectedFeedback.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间" :span="2">{{ selectedFeedback.created_at }}</el-descriptions-item>
          <el-descriptions-item label="反馈内容" :span="2">
            <div class="content-text">{{ selectedFeedback.content }}</div>
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedFeedback.reply_content" label="回复内容" :span="2">
            <div class="reply-text">{{ selectedFeedback.reply_content }}</div>
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedFeedback.reply_at" label="回复时间" :span="2">{{ selectedFeedback.reply_at }}</el-descriptions-item>
        </el-descriptions>
        
        <!-- 回复表单 -->
        <div v-if="isReplyMode" class="reply-form">
          <el-divider>回复用户</el-divider>
          <el-form :model="replyForm" label-width="100px">
            <el-form-item label="处理方式">
              <el-radio-group v-model="replyForm.sendAsMessage">
                <el-radio :label="false">仅更新反馈状态</el-radio>
                <el-radio :label="true">更新状态并发送系统消息</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item v-if="replyForm.sendAsMessage" label="消息标题">
              <el-input
                v-model="replyForm.title"
                placeholder="请输入消息标题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item v-if="replyForm.sendAsMessage" label="消息类型">
              <el-select v-model="replyForm.type" placeholder="选择消息类型">
                <el-option label="系统通知" value="system" />
                <el-option label="反馈回复" value="feedback_reply" />
                <el-option label="重要通知" value="important" />
                <el-option label="服务提醒" value="service" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="回复内容">
              <el-input
                v-model="replyForm.content"
                type="textarea"
                :rows="4"
                placeholder="请输入回复内容"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item v-if="replyForm.sendAsMessage" label="发送者">
              <el-input
                v-model="senderInfo.name"
                placeholder="发送者姓名"
                maxlength="50"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="isReplyMode" type="primary" @click="submitReply" :loading="submitting">
            {{ replyForm.sendAsMessage ? '发送系统消息' : '更新反馈状态' }}
          </el-button>
          <el-button v-else type="primary" @click="markAsRead" :disabled="selectedFeedback?.status !== 'unread'">
            标记为已读
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { 
  getFeedbackList, 
  replyFeedback as apiReplyFeedback, 
  markFeedbackAsRead, 
  markAllFeedbackAsRead, 
  deleteFeedback as apiDeleteFeedback,
  sendSystemMessage,
  searchFeedback
} from '@/utils/feedbackApi'

// 响应式数据
const feedbackData = ref([])
const filteredData = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 筛选条件
const filterStatus = ref('')
const filterType = ref('')
const searchKeyword = ref('')

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isReplyMode = ref(false)
const selectedFeedback = ref(null)
const submitting = ref(false)

// 回复表单
const replyForm = ref({
  content: '',
  title: '',
  type: 'system',
  sendAsMessage: false
})

// 发送者信息
const senderInfo = ref({
  id: null,
  name: '系统管理员'
})

// 计算属性
const unreadCount = computed(() => {
  return feedbackData.value.filter(item => item.status === 'unread').length
})

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    consultation: 'primary',
    complaint: 'danger',
    suggestion: 'success',
    other: 'info'
  }
  return typeMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type) => {
  const typeMap = {
    consultation: '咨询',
    complaint: '投诉',
    suggestion: '建议',
    other: '其他'
  }
  return typeMap[type] || '未知'
}

// 获取状态标签样式
const getStatusTagType = (status) => {
  const statusMap = {
    unread: 'warning',
    read: 'info',
    replied: 'success'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    unread: '未读',
    read: '已读',
    replied: '已回复'
  }
  return statusMap[status] || '未知'
}

// 加载反馈数据
const loadFeedbackData = async () => {
  loading.value = true
  try {
    const response = await getFeedbackList(currentPage.value, pageSize.value)
    
      if (response.code === 200) {
        feedbackData.value = response.data || []
        console.log(feedbackData.value);
        
        total.value = response.total || 0
        applyFilters()
      } else {
        ElMessage.error(response.msg || '获取反馈数据失败')
        feedbackData.value = []
        total.value = 0
      }
  } catch (error) {
    console.error('加载反馈数据失败:', error)
    ElMessage.error('加载反馈数据失败，请检查网络连接')
    feedbackData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 应用筛选条件
const applyFilters = () => {
  let filtered = [...feedbackData.value]
  
  // 状态筛选
  if (filterStatus.value) {
    filtered = filtered.filter(item => item.status === filterStatus.value)
  }
  
  // 类型筛选
  if (filterType.value) {
    filtered = filtered.filter(item => item.type === filterType.value)
  }
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.user_name.toLowerCase().includes(keyword) ||
      item.user_email.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword)
    )
  }
  
  filteredData.value = filtered
}

// 处理筛选
const handleFilter = async () => {
  // 如果有搜索条件，使用搜索API
  if (searchKeyword.value || filterStatus.value || filterType.value) {
    await handleSearch()
  } else {
    // 否则重新加载数据
    currentPage.value = 1
    loadFeedbackData()
  }
}

// 搜索防抖定时器
let searchTimer = null

// 处理搜索
const handleSearch = async () => {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  // 设置新的定时器，500ms后执行搜索
  searchTimer = setTimeout(async () => {
    loading.value = true
    try {
      const response = await searchFeedback({
        keyword: searchKeyword.value,
        status: filterStatus.value,
        type: filterType.value,
        page: currentPage.value,
        pageSize: pageSize.value
      })
      
      if (response.code === 200) {
        feedbackData.value = response.data || []
        total.value = response.total || 0
        filteredData.value = feedbackData.value
      } else {
        ElMessage.error(response.msg || '搜索失败')
      }
    } catch (error) {
      console.error('搜索失败:', error)
      ElMessage.error('搜索失败，请检查网络连接')
    } finally {
      loading.value = false
    }
  }, 500)
}

// 分页处理
const changePage = (page) => {
  currentPage.value = page
  loadFeedbackData()
}

// 查看详情
const viewDetail = (row) => {
  selectedFeedback.value = row
  dialogTitle.value = '反馈详情'
  isReplyMode.value = false
  dialogVisible.value = true
}

// 回复反馈
const replyFeedback = (row) => {
  selectedFeedback.value = row
  dialogTitle.value = '回复反馈'
  isReplyMode.value = true
  replyForm.value = {
    content: '',
    title: `关于您的${getTypeText(row.type)}反馈的回复`,
    type: 'feedback_reply',
    sendAsMessage: false
  }
  dialogVisible.value = true
}

// 提交回复
const submitReply = async () => {
  if (!replyForm.value.content.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  
  // 如果选择发送系统消息，需要验证标题和用户ID
  if (replyForm.value.sendAsMessage) {
    if (!replyForm.value.title.trim()) {
      ElMessage.warning('请输入消息标题')
      return
    }
    if (!selectedFeedback.value.username) {
      ElMessage.warning('该反馈缺少用户名信息，无法发送系统消息。请联系系统管理员检查反馈数据。')
      return
    }
  }
  
  submitting.value = true
  try {
    let success = false
    
    if (replyForm.value.sendAsMessage) {
      // 发送系统消息（包含更新反馈状态的逻辑）
      try {
        const messageData = {
          title: replyForm.value.title,
          content: replyForm.value.content,
          type: replyForm.value.type,
          username: selectedFeedback.value.username,
          sender_id: senderInfo.value.id,
          sender_name: senderInfo.value.name,
          feedback_id: selectedFeedback.value.id // 添加反馈ID，用于后端更新反馈状态
        }
        
        // 获取管理员token
        const adminToken = localStorage.getItem('admin_token') || 'your_admin_token'
        
        const messageResponse = await sendSystemMessage(messageData, adminToken)
        
        if (messageResponse.code === 200) {
          success = true
          ElMessage.success('系统消息发送成功，反馈状态已更新')
          
          // 更新本地数据
          const index = feedbackData.value.findIndex(item => item.id === selectedFeedback.value.id)
          if (index !== -1) {
            feedbackData.value[index].status = 'replied'
            feedbackData.value[index].reply_content = replyForm.value.content
            feedbackData.value[index].reply_at = new Date().toLocaleString()
          }
        } else {
          ElMessage.error(messageResponse.msg || '系统消息发送失败')
        }
      } catch (messageError) {
        console.error('发送系统消息失败:', messageError)
        ElMessage.error('发送系统消息失败')
      }
    } else {
      // 仅更新反馈状态，不发送系统消息
      try {
        const replyResponse = await apiReplyFeedback(selectedFeedback.value.id, {
          content: replyForm.value.content
        })
        
        if (replyResponse.code === 200) {
          success = true
          ElMessage.success('反馈状态已更新')
          
          // 更新本地数据
          const index = feedbackData.value.findIndex(item => item.id === selectedFeedback.value.id)
          if (index !== -1) {
            feedbackData.value[index].status = 'replied'
            feedbackData.value[index].reply_content = replyForm.value.content
            feedbackData.value[index].reply_at = new Date().toLocaleString()
          }
        } else {
          ElMessage.error(replyResponse.msg || '更新反馈状态失败')
        }
      } catch (replyError) {
        console.error('更新反馈状态失败:', replyError)
        ElMessage.error('更新反馈状态失败')
      }
    }
    
    if (success) {
      dialogVisible.value = false
      applyFilters()
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

// 标记为已读
const markAsRead = async () => {
  try {
    // 使用真实API调用
    const response = await markFeedbackAsRead(selectedFeedback.value.id)
    
    if (response.code === 200) {
      const index = feedbackData.value.findIndex(item => item.id === selectedFeedback.value.id)
      if (index !== -1) {
        feedbackData.value[index].status = 'read'
      }
      
      ElMessage.success('已标记为已读')
      dialogVisible.value = false
      applyFilters()
    } else {
      ElMessage.error(response.msg || '操作失败')
    }
  } catch (error) {
    console.error('标记失败:', error)
    ElMessage.error('操作失败')
  }
}

// 全部标记为已读
const markAllRead = async () => {
  try {
    await ElMessageBox.confirm('确定要将所有未读反馈标记为已读吗？', '确认操作', {
      type: 'warning'
    })
    
    // 使用真实API调用
    const response = await markAllFeedbackAsRead()
    
    if (response.code !== 200) {
      ElMessage.error(response.msg || '操作失败')
      return
    }
    
    feedbackData.value.forEach(item => {
      if (item.status === 'unread') {
        item.status = 'read'
      }
    })
    
    ElMessage.success('已全部标记为已读')
    applyFilters()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量标记失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 删除反馈
const deleteFeedback = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条反馈吗？', '确认删除', {
      type: 'warning'
    })
    
    // 使用真实API调用
    const response = await apiDeleteFeedback(row.id)
    
    if (response.code !== 200) {
      ElMessage.error(response.msg || '删除失败')
      return
    }
    
    const index = feedbackData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      feedbackData.value.splice(index, 1)
    }
    
    ElMessage.success('删除成功')
    applyFilters()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 刷新数据
const refreshData = () => {
  loadFeedbackData()
}

// 行点击处理
const handleRowClick = (row) => {
  viewDetail(row)
}


// 初始化
onMounted(() => {
  loadFeedbackData()
})
</script>

<style scoped>
.feedback-management {
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
  display: flex;
  gap: 10px;
}

.filter-section {
  flex-shrink: 0;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
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

.feedback-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.content-text, .reply-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.reply-form {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 表格行点击样式 */
:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
