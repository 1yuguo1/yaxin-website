// 评论相关类型定义

export interface Comment {
  id: number
  article_id: number
  user_id: number
  username: string
  content: string
  parent_id?: number  // 父评论ID，用于回复
  created_at: string
  updated_at: string
  is_deleted: boolean
  like_count: number
  reply_count: number
}

export interface CommentCreate {
  article_id: number
  content: string
  parent_id?: number
}

export interface CommentResponse {
  code: number
  msg: string
  data?: Comment[] | Comment | any
  total?: number
  page?: number
  page_size?: number
  error?: string
}

export interface CommentListParams {
  article_id: number
  page?: number
  page_size?: number
  parent_id?: number  // 获取回复评论
}

export interface CommentStats {
  total_comments: number
  total_replies: number
}

// 评论状态枚举
export enum CommentStatus {
  ACTIVE = 'active',
  DELETED = 'deleted'
}

// 评论类型枚举
export enum CommentType {
  COMMENT = 'comment',  // 主评论
  REPLY = 'reply'      // 回复
}

