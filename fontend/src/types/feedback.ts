// 反馈相关类型定义

export interface FeedbackItem {
  username?: string  // 用户名，可选字段（已登录用户）
  user_name: string
  user_email: string
  type: string
  content: string
}

export interface FeedbackReply {
  content: string
}

export interface FeedbackListParams {
  page?: number
  page_size?: number
  status?: string
  type?: string
  keyword?: string
}

export interface FeedbackResponse {
  code: number
  msg: string
  data?: any
  total?: number
  page?: number
  page_size?: number
  error?: string
}

export interface FeedbackStats {
  total: number
  unread: number
  read: number
  replied: number
}

export interface FeedbackDetail {
  id: number
  username?: string  // 用户名，可选字段
  user_name: string
  user_email: string
  type: string
  content: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
  updated_at: string
  reply_content?: string  // 回复内容
  reply_at?: string
  replied_by?: number
}

export interface FeedbackListItem {
  id: number
  username?: string  // 用户名，可选字段
  user_name: string
  user_email: string
  type: string
  content: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
  updated_at: string
  reply_content?: string  // 回复内容
  reply_at?: string
  replied_by?: number
}

// 反馈类型枚举
export enum FeedbackType {
  CONSULTATION = 'consultation', // 咨询
  COMPLAINT = 'complaint', // 投诉
  SUGGESTION = 'suggestion', // 建议
  OTHER = 'other' // 其它
}

// 反馈状态枚举
export enum FeedbackStatus {
  UNREAD = 'unread',
  READ = 'read',
  REPLIED = 'replied'
}

// 反馈类型选项
export const FEEDBACK_TYPE_OPTIONS = [
  { value: FeedbackType.CONSULTATION, label: '咨询' },
  { value: FeedbackType.COMPLAINT, label: '投诉' },
  { value: FeedbackType.SUGGESTION, label: '建议' },
  { value: FeedbackType.OTHER, label: '其它' }
]

// 反馈状态选项
export const FEEDBACK_STATUS_OPTIONS = [
  { value: FeedbackStatus.UNREAD, label: '未读' },
  { value: FeedbackStatus.READ, label: '已读' },
  { value: FeedbackStatus.REPLIED, label: '已回复' }
]

