import http from '@/utils/request'
import type { 
  FeedbackItem, 
  FeedbackReply, 
  FeedbackListParams, 
  FeedbackResponse, 
  FeedbackStats 
} from '@/types/feedback'

/**
 * 创建新反馈（公开接口）
 * @param feedbackData 反馈数据
 * @returns Promise<FeedbackResponse>
 */
export const createFeedback = async (feedbackData: FeedbackItem): Promise<FeedbackResponse> => {
  try {
    const response = await http.post('/feedback', feedbackData)
    return response.data
  } catch (error) {
    console.error('创建反馈失败:', error)
    throw error
  }
}

/**
 * 获取反馈列表（管理员接口）
 * @param params 查询参数
 * @returns Promise<FeedbackResponse>
 */
export const getFeedbackList = async (params: FeedbackListParams = {}): Promise<FeedbackResponse> => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.page_size) queryParams.append('page_size', params.page_size.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.type) queryParams.append('type', params.type)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    
    const queryString = queryParams.toString()
    const url = queryString ? `/feedback/list?${queryString}` : '/feedback/list'
    
    const response = await http.get(url)
    return response.data
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    throw error
  }
}

/**
 * 获取反馈详情
 * @param feedbackId 反馈ID
 * @returns Promise<FeedbackResponse>
 */
export const getFeedbackDetail = async (feedbackId: number): Promise<FeedbackResponse> => {
  try {
    const response = await http.get(`/feedback/${feedbackId}`)
    return response.data
  } catch (error) {
    console.error('获取反馈详情失败:', error)
    throw error
  }
}

/**
 * 回复反馈
 * @param feedbackId 反馈ID
 * @param replyData 回复数据
 * @returns Promise<FeedbackResponse>
 */
export const replyFeedback = async (feedbackId: number, replyData: FeedbackReply): Promise<FeedbackResponse> => {
  try {
    const response = await http.put(`/feedback/${feedbackId}/reply`, replyData)
    return response.data
  } catch (error) {
    console.error('回复反馈失败:', error)
    throw error
  }
}

/**
 * 标记反馈为已读
 * @param feedbackId 反馈ID
 * @returns Promise<FeedbackResponse>
 */
export const markFeedbackRead = async (feedbackId: number): Promise<FeedbackResponse> => {
  try {
    const response = await http.put(`/feedback/${feedbackId}/read`)
    return response.data
  } catch (error) {
    console.error('标记反馈已读失败:', error)
    throw error
  }
}

/**
 * 批量标记为已读
 * @returns Promise<FeedbackResponse>
 */
export const markAllFeedbackRead = async (): Promise<FeedbackResponse> => {
  try {
    const response = await http.put('/feedback/mark-all-read')
    return response.data
  } catch (error) {
    console.error('批量标记已读失败:', error)
    throw error
  }
}

/**
 * 删除反馈
 * @param feedbackId 反馈ID
 * @returns Promise<FeedbackResponse>
 */
export const deleteFeedback = async (feedbackId: number): Promise<FeedbackResponse> => {
  try {
    const response = await http.delete(`/feedback/${feedbackId}`)
    return response.data
  } catch (error) {
    console.error('删除反馈失败:', error)
    throw error
  }
}

/**
 * 搜索反馈（管理员接口）
 * @param params 搜索参数
 * @returns Promise<FeedbackResponse>
 */
export const searchFeedback = async (params: {
  keyword?: string
  status?: string
  type?: string
  page?: number
  pageSize?: number
}): Promise<FeedbackResponse> => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.status) queryParams.append('status', params.status)
    if (params.type) queryParams.append('type', params.type)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    
    const queryString = queryParams.toString()
    const url = queryString ? `/feedback/search?${queryString}` : '/feedback/search'
    
    const response = await http.get(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token_')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('搜索反馈失败:', error)
    throw error
  }
}

/**
 * 获取反馈统计信息
 * @returns Promise<FeedbackResponse>
 */
export const getFeedbackStats = async (): Promise<FeedbackResponse> => {
  try {
    const response = await http.get('/feedback/stats')
    return response.data
  } catch (error) {
    console.error('获取反馈统计失败:', error)
    throw error
  }
}
