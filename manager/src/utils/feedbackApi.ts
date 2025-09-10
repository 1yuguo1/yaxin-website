import http from '@/utils/http'

// 反馈数据类型定义
export interface FeedbackItem {
  id: number
  user_id: number  // 用户ID，用于身份识别
  user_name: string
  user_email: string
  type: 'consultation' | 'complaint' | 'suggestion' | 'other'
  content: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
  reply_at?: string
  reply_content?: string
}

// 回复表单类型
export interface ReplyForm {
  content: string
}

// 创建反馈表单类型
export interface CreateFeedbackForm {
  user_id?: number  // 用户ID，可选字段
  user_name: string
  user_email: string
  type: 'consultation' | 'complaint' | 'suggestion' | 'other'
  content: string
}

// 创建反馈
export const createFeedback = async (feedbackData: CreateFeedbackForm) => {
  try {
    const response = await http.post('/feedback', feedbackData)
    return response.data
  } catch (error) {
    console.error('创建反馈失败:', error)
    throw error
  }
}

// 获取反馈列表
export const getFeedbackList = async (page = 1, pageSize = 10) => {
    try {
      const response = await http.get('/feedback/list', {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      console.error('获取反馈列表失败:', error)
      throw error
    }
  }

// 获取反馈详情
export const getFeedbackDetail = async (id: number) => {
  try {
    const response = await http.get(`/feedback/${id}`)
    return response.data
  } catch (error) {
    console.error('获取反馈详情失败:', error)
    throw error
  }
}

// 回复反馈
export const replyFeedback = async (id: number, replyData: ReplyForm) => {
  try {
    const response = await http.put(`/feedback/${id}/reply`, replyData)
    return response.data
  } catch (error) {
    console.error('回复反馈失败:', error)
    throw error
  }
}

// 标记反馈为已读
export const markFeedbackAsRead = async (id: number) => {
  try {
    const response = await http.put(`/feedback/${id}/read`)
    return response.data
  } catch (error) {
    console.error('标记反馈为已读失败:', error)
    throw error
  }
}

// 批量标记为已读
export const markAllFeedbackAsRead = async () => {
  try {
    const response = await http.put('/feedback/mark-all-read')
    return response.data
  } catch (error) {
    console.error('批量标记为已读失败:', error)
    throw error
  }
}

// 删除反馈
export const deleteFeedback = async (id: number) => {
  try {
    const response = await http.delete(`/feedback/${id}`)
    return response.data
  } catch (error) {
    console.error('删除反馈失败:', error)
    throw error
  }
}

// 搜索反馈
export const searchFeedback = async (params: {
  keyword?: string
  status?: string
  type?: string
  page?: number
  pageSize?: number
}) => {
  try {
    const response = await http.get('/feedback/search', {
      params
    })
    return response.data
  } catch (error) {
    console.error('搜索反馈失败:', error)
    throw error
  }
}

// 获取反馈统计信息
export const getFeedbackStats = async () => {
  try {
    const response = await http.get('/feedback/stats')
    return response.data
  } catch (error) {
    console.error('获取反馈统计失败:', error)
    throw error
  }
}

// 消息相关类型定义
export interface MessageCreate {
  title: string
  content: string
  type: string
  user_id: number
  sender_id?: number
  sender_name?: string
  feedback_id?: number // 关联的反馈ID，用于后端更新反馈状态
}

// 发送系统消息（管理员接口）
export const sendSystemMessage = async (messageData: MessageCreate, token: string) => {
  try {
    const response = await http.post('/message/send', messageData, {
      params: { token }
    })
    return response.data
  } catch (error) {
    console.error('发送系统消息失败:', error)
    throw error
  }
}
