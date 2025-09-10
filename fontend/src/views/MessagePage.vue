<template>
    <div class="message-page">
        <NavComp @search="onSearch" :isFixed="isFixed_" :isColored="isColored_" :icon_num="icon_num_" :isLogin="isLogin_" :name="name_"></NavComp>
        
        <main class="main-content">
            <div class="page-header">
                <h1>系统消息</h1>
            </div>

            <!-- 左右分栏布局 -->
            <div class="message-layout">
                <!-- 左侧消息列表 -->
                <div class="message-list-container">
                    <div class="list-header">
                        <h3>消息列表</h3>
                    </div>
                    <div class="message-list" v-loading="isLoading">
                        <div v-if="messages.length === 0 && !isLoading" class="empty-state">
                            <el-icon class="empty-icon"><Message /></el-icon>
                            <p>暂无消息</p>
                        </div>
                        
                        <div v-else>
                            <div 
                                v-for="message in messages" 
                                :key="message.id"
                                class="message-item"
                                :class="{ 
                                    'unread': !message.is_read,
                                    'selected': selectedMessage?.id === message.id
                                }"
                                @click="selectMessage(message)"
                            >
                                <div class="message-header">
                                    <div class="message-title">
                                        <el-icon v-if="!message.is_read" class="unread-dot"><CircleFilled /></el-icon>
                                        <span>{{ message.title }}</span>
                                    </div>
                                    <div class="message-meta">
                                        <span class="message-time">{{ formatTime(message.created_at) }}</span>
                                    </div>
                                </div>
                                <div class="message-preview">
                                    <p>{{ message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分页 -->
                    <div v-if="totalPages > 1" class="pagination-container">
                        <el-pagination
                            v-model:current-page="currentPage"
                            :page-size="pageSize"
                            :total="totalCount"
                            layout="prev, pager, next"
                            @current-change="handlePageChange"
                        />
                    </div>
                </div>

                <!-- 右侧消息内容展示区 -->
                <div class="message-content-container">
                    <div v-if="!selectedMessage" class="no-selection">
                        <el-icon class="no-selection-icon"><Message /></el-icon>
                        <p>请选择一条消息查看详情</p>
                    </div>
                    <div v-else class="message-detail">
                        <div class="detail-header">
                            <h2>{{ selectedMessage.title }}</h2>
                            <div class="detail-meta">
                                <span class="detail-time">{{ formatTime(selectedMessage.created_at) }}</span>
                                <el-icon v-if="!selectedMessage.is_read" class="unread-badge"><CircleFilled /></el-icon>
                            </div>
                        </div>
                        <div class="detail-content">
                            <p>{{ selectedMessage.content }}</p>
                        </div>
                        <div class="detail-actions">
                            <button 
                                v-if="!selectedMessage.is_read" 
                                @click="markAsRead(selectedMessage.id)"
                                class="mark-read-btn"
                            >
                                标记为已读
                            </button>
                            <button 
                                @click="deleteMessage(selectedMessage.id)"
                                class="delete-btn"
                            >
                                删除消息
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavComp from '@/components/NavComp.vue'
import { getUserMessages, markUserMessageRead, deleteUserMessage } from '@/api/login'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 导航相关状态
const isFixed_ = ref(true)
const isColored_ = ref(true)
const icon_num_ = ref(true)
const isLogin_ = ref(false)
const name_ = ref('')

// 消息相关状态
const messages = ref([])
const selectedMessage = ref(null)
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 检查登录状态
const checkLoginStatus = () => {
    const token = localStorage.getItem('token_')
    if (!token) {
        ElMessage.warning('请先登录')
        router.push('/login')
        return false
    }
    isLogin_.value = true
    // 这里可以获取用户信息
    return true
}

// 获取消息列表
const fetchMessages = async () => {
    if (!checkLoginStatus()) return
    
    isLoading.value = true
    try {
        const response = await getUserMessages({
            page: currentPage.value,
            page_size: pageSize.value
        })
        
        if (response.code === 200) {
            messages.value = response.data || []
            totalCount.value = response.total || 0
            // 如果有选中的消息，需要重新设置选中状态
            if (selectedMessage.value) {
                const currentSelected = messages.value.find(msg => msg.id === selectedMessage.value.id)
                selectedMessage.value = currentSelected || null
            }
        } else {
            ElMessage.error(response.msg || '获取消息失败')
        }
    } catch (error) {
        console.error('获取消息失败:', error)
        if (error.message === '用户未登录') {
            ElMessage.error('请先登录')
            router.push('/login')
        } else {
            ElMessage.error('网络错误，请稍后重试')
        }
    } finally {
        isLoading.value = false
    }
}

// 选择消息
const selectMessage = (message) => {
    selectedMessage.value = message
}

// 标记消息为已读
const markAsRead = async (messageId) => {
    try {
        const response = await markUserMessageRead(messageId)
        if (response.code === 200) {
            const message = messages.value.find(msg => msg.id === messageId)
            if (message) {
                message.is_read = true
            }
            // 如果当前选中的消息被标记为已读，更新选中消息状态
            if (selectedMessage.value && selectedMessage.value.id === messageId) {
                selectedMessage.value.is_read = true
            }
            ElMessage.success('标记成功')
        } else {
            ElMessage.error(response.msg || '标记失败')
        }
    } catch (error) {
        console.error('标记消息失败:', error)
        ElMessage.error('操作失败')
    }
}


// 删除消息
const deleteMessage = async (messageId) => {
    try {
        await ElMessageBox.confirm('确定要删除这条消息吗？', '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        
        const response = await deleteUserMessage(messageId)
        if (response.code === 200) {
            messages.value = messages.value.filter(msg => msg.id !== messageId)
            totalCount.value--
            // 如果删除的是当前选中的消息，清空选中状态
            if (selectedMessage.value && selectedMessage.value.id === messageId) {
                selectedMessage.value = null
            }
            ElMessage.success('删除成功')
        } else {
            ElMessage.error(response.msg || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除消息失败:', error)
            ElMessage.error('删除失败')
        }
    }
}


// 分页处理
const handlePageChange = (page) => {
    currentPage.value = page
    fetchMessages()
}

// 格式化时间
const formatTime = (timeString) => {
    const date = new Date(timeString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) { // 1分钟内
        return '刚刚'
    } else if (diff < 3600000) { // 1小时内
        return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) { // 1天内
        return `${Math.floor(diff / 3600000)}小时前`
    } else {
        return date.toLocaleDateString()
    }
}

// 搜索功能
const onSearch = (searchTerm) => {
    console.log('搜索:', searchTerm)
}

// 组件挂载时获取消息
onMounted(() => {
    fetchMessages()
})
</script>

<style scoped>
.message-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
    margin-top: 12vh;
    padding: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
}

.page-header {
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
    margin: 0;
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 600;
}

/* 左右分栏布局 */
.message-layout {
    display: flex;
    gap: 2rem;
    height: calc(100vh - 300px);
    min-height: 500px;
}

.message-list-container {
    flex: 0 0 400px;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.list-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #ecf0f1;
    background: #f8f9fa;
}

.list-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
    font-weight: 600;
}

.message-list {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

.message-content-container {
    flex: 1;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #7f8c8d;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.message-item {
    border-bottom: 1px solid #ecf0f1;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 1rem 1.5rem;
}

.message-item:last-child {
    border-bottom: none;
}

.message-item:hover {
    background: #f8f9fa;
}

.message-item.unread {
    background: #fef9e7;
}

.message-item.selected {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.message-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.unread-dot {
    color: #e74c3c;
    font-size: 0.8rem;
}

.message-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #7f8c8d;
    font-size: 0.9rem;
}

.message-preview {
    color: #7f8c8d;
    font-size: 0.9rem;
    line-height: 1.4;
}

.message-preview p {
    margin: 0;
}

.expand-icon {
    transition: transform 0.3s ease;
}

/* 右侧内容区域 */
.no-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #7f8c8d;
    text-align: center;
}

.no-selection-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.message-detail {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.detail-header {
    padding: 2rem;
    border-bottom: 1px solid #ecf0f1;
    background: #f8f9fa;
}

.detail-header h2 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
}

.detail-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #7f8c8d;
    font-size: 0.9rem;
}

.unread-badge {
    color: #e74c3c;
    font-size: 0.8rem;
}

.detail-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.detail-content p {
    margin: 0;
    line-height: 1.6;
    color: #2c3e50;
    font-size: 1rem;
}

.detail-actions {
    padding: 1.5rem 2rem;
    border-top: 1px solid #ecf0f1;
    background: #f8f9fa;
    display: flex;
    gap: 1rem;
}

.message-body {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #2c3e50;
}

.message-actions {
    display: flex;
    gap: 1rem;
}

.mark-read-btn,
.delete-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.mark-read-btn {
    background: #3498db;
    color: white;
}

.mark-read-btn:hover {
    background: #2980b9;
}

.delete-btn {
    background: #e74c3c;
    color: white;
}

.delete-btn:hover {
    background: #c0392b;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .main-content {
        padding: 1rem;
        margin-top: 10vh;
    }
    
    .page-header h1 {
        font-size: 1.5rem;
        text-align: center;
    }
    
    .message-layout {
        flex-direction: column;
        height: auto;
        gap: 1rem;
    }
    
    .message-list-container {
        flex: none;
        height: 400px;
    }
    
    .message-content-container {
        height: 300px;
    }
    
    .message-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .message-meta {
        align-self: flex-end;
    }
    
    .detail-actions {
        flex-direction: column;
    }
}
</style>

