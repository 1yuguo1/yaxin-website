<template>
  <div class="comment-section">
    <div class="comment-header">
      <h3>评论 ({{ commentStats.total_all || 0 }})</h3>
    </div>

    <!-- 发表评论 -->
    <div class="comment-form" v-if="isLoggedIn">
      <div class="form-group">
        <textarea
          v-model="newComment"
          placeholder="写下你的评论..."
          rows="4"
          maxlength="500"
          class="comment-input"
        ></textarea>
        <div class="char-count">{{ newComment.length }}/500</div>
      </div>
      <div class="form-actions">
        <el-button 
          type="primary" 
          @click="submitComment"
          :disabled="!newComment.trim() || isSubmitting"
          :loading="isSubmitting"
        >
          发表评论
        </el-button>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div class="login-prompt" v-else>
      <p>请先登录后再发表评论</p>
      <el-button type="primary" @click="goToLogin">去登录</el-button>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list" v-if="comments.length > 0">
      <div 
        v-for="comment in comments" 
        :key="comment.id" 
        class="comment-item"
      >
        <div class="comment-content">
          <div class="comment-header">
            <span class="username">{{ comment.username }}</span>
            <span class="time">{{ formatTime(comment.created_at) }}</span>
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-actions">
            <el-button 
              type="text" 
              size="small" 
              @click="likeComment(comment.id)"
              :disabled="isLiking"
            >
              <el-icon><Star /></el-icon>
              {{ comment.like_count }}
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="showReplyForm(comment.id)"
              v-if="isLoggedIn"
            >
              回复
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="deleteComment(comment.id)"
              v-if="canDeleteComment(comment)"
              class="delete-btn"
            >
              删除
            </el-button>
          </div>
        </div>

        <!-- 回复表单 -->
        <div class="reply-form" v-if="replyFormVisible === comment.id">
          <textarea
            v-model="replyContent"
            placeholder="写下你的回复..."
            rows="3"
            maxlength="300"
            class="reply-input"
          ></textarea>
          <div class="reply-actions">
            <el-button 
              size="small" 
              @click="cancelReply"
            >
              取消
            </el-button>
            <el-button 
              type="primary" 
              size="small" 
              @click="submitReply(comment.id)"
              :disabled="!replyContent.trim() || isSubmitting"
              :loading="isSubmitting"
            >
              回复
            </el-button>
          </div>
        </div>

        <!-- 回复列表 -->
        <div class="replies" v-if="comment.reply_count > 0">
          <div 
            v-for="reply in getReplies(comment.id)" 
            :key="reply.id"
            class="reply-item"
          >
            <div class="reply-content">
              <div class="reply-header">
                <span class="username">{{ reply.username }}</span>
                <span class="time">{{ formatTime(reply.created_at) }}</span>
              </div>
              <div class="reply-text">{{ reply.content }}</div>
              <div class="reply-actions">
                <el-button 
                  type="text" 
                  size="small" 
                  @click="likeComment(reply.id)"
                  :disabled="isLiking"
                >
                  <el-icon><Star /></el-icon>
                  {{ reply.like_count }}
                </el-button>
                <el-button 
                  type="text" 
                  size="small" 
                  @click="deleteComment(reply.id)"
                  v-if="canDeleteComment(reply)"
                  class="delete-btn"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <p>暂无评论，快来发表第一条评论吧！</p>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadComments"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch,defineProps,defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import router from '@/router'
import { 
  getComments, 
  createComment, 
  deleteComment as deleteCommentApi, 
  likeComment as likeCommentApi,
  getCommentStats,
  updateArticleViewCount
} from '@/api/comment'

const props = defineProps({
  articleId: {
    type: Number,
    required: true
  }
})

// 响应式数据
const comments = ref([])
const replies = ref({}) // 存储回复数据
const commentStats = ref({ total_all: 0 })
const newComment = ref('')
const replyContent = ref('')
const replyFormVisible = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = ref(0)
const isSubmitting = ref(false)
const isLiking = ref(false)

// 计算属性
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token_')
})

// 方法定义
const loadComments = async (page = 1) => {
  try {
    const response = await getComments({
      article_id: props.articleId,
      page,
      page_size: pageSize.value
    })
    
    if (response.code === 200) {
      comments.value = response.data || []
      total.value = response.total || 0
      totalPages.value = response.total_pages || 0
      currentPage.value = page
      
      // 加载每个评论的回复
      await loadReplies()
    }
  } catch (error) {
    console.error('加载评论失败:', error)
    ElMessage.error('加载评论失败')
  }
}

const loadReplies = async () => {
  for (const comment of comments.value) {
    if (comment.reply_count > 0) {
      try {
        const response = await getComments({
          article_id: props.articleId,
          parent_id: comment.id,
          page: 1,
          page_size: 10
        })
        
        if (response.code === 200) {
          replies.value[comment.id] = response.data || []
        }
      } catch (error) {
        console.error('加载回复失败:', error)
      }
    }
  }
}

const loadCommentStats = async () => {
  try {
    const response = await getCommentStats(props.articleId)
    if (response.code === 200) {
      commentStats.value = response.data
    }
  } catch (error) {
    console.error('加载评论统计失败:', error)
  }
}

const updateViewCount = async () => {
  try {
    await updateArticleViewCount(props.articleId)
  } catch (error) {
    console.error('更新浏览数失败:', error)
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  isSubmitting.value = true
  try {
    const response = await createComment({
      article_id: props.articleId,
      content: newComment.value.trim()
    })
    
    if (response.code === 200) {
      ElMessage.success('评论发表成功')
      newComment.value = ''
      await loadComments(currentPage.value)
      await loadCommentStats()
    } else {
      ElMessage.error(response.msg || '评论发表失败')
    }
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error('评论发表失败')
  } finally {
    isSubmitting.value = false
  }
}

const submitReply = async (parentId) => {
  if (!replyContent.value.trim()) return
  
  isSubmitting.value = true
  try {
    const response = await createComment({
      article_id: props.articleId,
      content: replyContent.value.trim(),
      parent_id: parentId
    })
    
    if (response.code === 200) {
      ElMessage.success('回复发表成功')
      replyContent.value = ''
      replyFormVisible.value = null
      await loadComments(currentPage.value)
      await loadCommentStats()
    } else {
      ElMessage.error(response.msg || '回复发表失败')
    }
  } catch (error) {
    console.error('发表回复失败:', error)
    ElMessage.error('回复发表失败')
  } finally {
    isSubmitting.value = false
  }
}

const deleteComment = async (commentId) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await deleteCommentApi(commentId)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      await loadComments(currentPage.value)
      await loadCommentStats()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const likeComment = async (commentId) => {
  isLiking.value = true
  try {
    const response = await likeCommentApi(commentId)
    if (response.code === 200) {
      ElMessage.success('点赞成功')
      await loadComments(currentPage.value)
    } else {
      ElMessage.error(response.msg || '点赞失败')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('点赞失败')
  } finally {
    isLiking.value = false
  }
}

const showReplyForm = (commentId) => {
  replyFormVisible.value = commentId
  replyContent.value = ''
}

const cancelReply = () => {
  replyFormVisible.value = null
  replyContent.value = ''
}

const getReplies = (commentId) => {
  return replies.value[commentId] || []
}

const canDeleteComment = (comment) => {
  // 这里可以根据用户权限判断是否可以删除
  // 简单实现：只有评论作者可以删除
  const currentUser = localStorage.getItem('username')
  return comment.username === currentUser
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
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

const goToLogin = () => {
  router.push('/login')
}

// 监听文章ID变化
watch(() => props.articleId, (newId) => {
  if (newId) {
    loadComments()
    loadCommentStats()
    updateViewCount()
  }
}, { immediate: true })

// 组件挂载时加载数据
onMounted(() => {
  if (props.articleId) {
    loadComments()
    loadCommentStats()
    updateViewCount()
  }
})
</script>

<style scoped>
.comment-section {
  margin-top: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comment-header h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.comment-form {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.form-group {
  position: relative;
  margin-bottom: 15px;
}

.comment-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
}

.comment-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.login-prompt {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 30px;
}

.login-prompt p {
  margin: 0 0 15px 0;
  color: #666;
}

.comments-list {
  margin-bottom: 20px;
}

.comment-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  margin-bottom: 15px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.username {
  font-weight: 600;
  color: #409eff;
}

.time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #333;
}

.comment-actions {
  display: flex;
  gap: 15px;
}

.delete-btn {
  color: #f56c6c !important;
}

.reply-form {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.reply-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 10px;
}

.reply-input:focus {
  outline: none;
  border-color: #409eff;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.replies {
  margin-top: 15px;
  margin-left: 20px;
}

.reply-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-content {
  margin-bottom: 10px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.reply-text {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #333;
}

.reply-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .comment-section {
    padding: 15px;
  }
  
  .comment-form {
    padding: 15px;
  }
  
  .replies {
    margin-left: 10px;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
