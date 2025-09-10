import http from '@/utils/request'
import type { 
  MessageListParams, 
  MessageResponse, 
  MessageItem,
  MessageCreate,
  MessageBatchCreate
} from '@/types/message'

/**
 * 获取消息列表
 * @param params 查询参数
 * @returns Promise<MessageResponse>
 */
export const getMessages = async (params: MessageListParams = {}): Promise<MessageResponse> => {
  try {
    const queryParams = new URLSearchParams()
    
    // 添加token参数（必需）
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    queryParams.append('token', token)
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.page_size) queryParams.append('page_size', params.page_size.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.type) queryParams.append('type', params.type)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    
    const queryString = queryParams.toString()
    const url = `/message/list?${queryString}`
    
    const response = await http.get(url)
    return response.data
  } catch (error) {
    console.error('获取消息列表失败:', error)
    throw error
  }
}

/**
 * 获取消息详情
 * @param messageId 消息ID
 * @returns Promise<MessageResponse>
 */
export const getMessageDetail = async (messageId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    const url = `/message/${messageId}?token=${token}`
    
    const response = await http.get(url)
    return response.data
  } catch (error) {
    console.error('获取消息详情失败:', error)
    throw error
  }
}

/**
 * 标记消息为已读
 * @param messageId 消息ID
 * @returns Promise<MessageResponse>
 */
export const markMessageAsRead = async (messageId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    const url = `/message/${messageId}/read?token=${token}`
    
    const response = await http.put(url)
    return response.data
  } catch (error) {
    console.error('标记消息已读失败:', error)
    throw error
  }
}

/**
 * 批量标记为已读
 * @returns Promise<MessageResponse>
 */
export const markAllMessagesAsRead = async (): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    const url = `/message/mark-all-read?token=${token}`
    
    const response = await http.put(url)
    return response.data
  } catch (error) {
    console.error('批量标记已读失败:', error)
    throw error
  }
}

/**
 * 删除消息
 * @param messageId 消息ID
 * @returns Promise<MessageResponse>
 */
export const deleteMessage = async (messageId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    const url = `/message/${messageId}?token=${token}`
    
    const response = await http.delete(url)
    return response.data
  } catch (error) {
    console.error('删除消息失败:', error)
    throw error
  }
}

/**
 * 获取消息统计信息
 * @returns Promise<MessageResponse>
 */
export const getMessageStats = async (): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    const url = `/message/stats?token=${token}`
    
    const response = await http.get(url)
    return response.data
  } catch (error) {
    console.error('获取消息统计失败:', error)
    throw error
  }
}

/**
 * 发送系统消息（管理员接口）
 * @param messageData 消息数据
 * @returns Promise<MessageResponse>
 */
export const sendSystemMessage = async (messageData: {
  title: string
  content: string
  type: string
  username: string  // 目标用户名
  sender_id?: number
  sender_name?: string
  feedback_id?: number
}): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem('token_')
    const url = token ? `/message/send?token=${token}` : '/message/send'
    
    const response = await http.post(url, messageData)
    return response.data
  } catch (error) {
    console.error('发送系统消息失败:', error)
    throw error
  }
}

/**
 * 批量发送消息（管理员接口）
 * @param messageData 消息数据
 * @returns Promise<MessageResponse>
 */
export const sendBatchMessages = async (messageData: {
  title: string
  content: string
  type: string
  target_user_ids?: number[]  // 目标用户ID列表，为空则发送给所有用户
}): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem('token_')
    const url = token ? `/message/send-batch?token=${token}` : '/message/send-batch'
    
    const response = await http.post(url, messageData)
    return response.data
  } catch (error) {
    console.error('批量发送消息失败:', error)
    throw error
  }
}

