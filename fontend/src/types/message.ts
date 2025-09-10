// 消息相关类型定义

export interface MessageItem {
  id: number
  title: string
  content: string
  type: string
  is_read: boolean
  created_at: string
  updated_at: string
  user_id?: number
  sender_id?: number
  sender_name?: string
}

export interface MessageListParams {
  page?: number
  page_size?: number
  status?: string
  type?: string
  keyword?: string
}

export interface MessageResponse {
  code: number
  msg: string
  data?: MessageItem[] | MessageItem | any
  total?: number
  page?: number
  page_size?: number
  total_pages?: number
  error?: string
}

export interface MessageStats {
  total: number
  unread: number
  read: number
}

export interface MessageDetail {
  id: number
  title: string
  content: string
  type: string
  is_read: boolean
  created_at: string
  updated_at: string
  user_id: number
  sender_id?: number
  sender_name?: string
  attachments?: MessageAttachment[]
}

export interface MessageAttachment {
  id: number
  filename: string
  file_url: string
  file_size: number
  file_type: string
}

export interface MessageCreate {
  title: string
  content: string
  type: string
  username: string  // 目标用户名
  sender_id?: number
  sender_name?: string
  feedback_id?: number
}

export interface MessageBatchCreate {
  title: string
  content: string
  type: string
  target_user_ids?: number[]  // 目标用户ID列表
}

// 消息类型枚举
export enum MessageType {
  SYSTEM = 'system', // 系统消息
  NOTIFICATION = 'notification', // 通知消息
  ANNOUNCEMENT = 'announcement', // 公告消息
  WARNING = 'warning', // 警告消息
  INFO = 'info' // 信息消息
}

// 消息状态枚举
export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read'
}

// 消息类型选项
export const MESSAGE_TYPE_OPTIONS = [
  { value: MessageType.SYSTEM, label: '系统消息' },
  { value: MessageType.NOTIFICATION, label: '通知消息' },
  { value: MessageType.ANNOUNCEMENT, label: '公告消息' },
  { value: MessageType.WARNING, label: '警告消息' },
  { value: MessageType.INFO, label: '信息消息' }
]

// 消息状态选项
export const MESSAGE_STATUS_OPTIONS = [
  { value: MessageStatus.UNREAD, label: '未读' },
  { value: MessageStatus.READ, label: '已读' }
]

// 消息类型样式映射
export const MESSAGE_TYPE_STYLES = {
  [MessageType.SYSTEM]: { color: '#3498db', icon: 'InfoFilled' },
  [MessageType.NOTIFICATION]: { color: '#27ae60', icon: 'Bell' },
  [MessageType.ANNOUNCEMENT]: { color: '#f39c12', icon: 'Megaphone' },
  [MessageType.WARNING]: { color: '#e74c3c', icon: 'Warning' },
  [MessageType.INFO]: { color: '#9b59b6', icon: 'Document' }
}

