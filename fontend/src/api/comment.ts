import http from '@/utils/request'
import axios from 'axios'
import { apiConfig } from '@/config/api'
import type { 
  CommentListParams, 
  CommentResponse, 
  CommentCreate,
  CommentStats
} from '@/types/comment'

// 创建不需要认证的axios实例
const publicInstance = axios.create(apiConfig)

/**
 * 获取文章评论列表
 * @param params 查询参数
 * @returns Promise<CommentResponse>
 */
export const getComments = async (params: CommentListParams): Promise<CommentResponse> => {
  try {
    const queryParams = new URLSearchParams()
    
    queryParams.append('article_id', params.article_id.toString())
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.page_size) queryParams.append('page_size', params.page_size.toString())
    if (params.parent_id) queryParams.append('parent_id', params.parent_id.toString())
    
    const queryString = queryParams.toString()
    const url = `/comments?${queryString}`
    
    const response = await publicInstance.get(url)
    return response.data
  } catch (error) {
    console.error('获取评论列表失败:', error)
    throw error
  }
}

/**
 * 创建评论
 * @param commentData 评论数据
 * @returns Promise<CommentResponse>
 */
export const createComment = async (commentData: CommentCreate): Promise<CommentResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    
    const response = await http.post('/comments', commentData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('创建评论失败:', error)
    throw error
  }
}

/**
 * 删除评论
 * @param commentId 评论ID
 * @returns Promise<CommentResponse>
 */
export const deleteComment = async (commentId: number): Promise<CommentResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    
    const response = await http.delete(`/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('删除评论失败:', error)
    throw error
  }
}

/**
 * 点赞评论
 * @param commentId 评论ID
 * @returns Promise<CommentResponse>
 */
export const likeComment = async (commentId: number): Promise<CommentResponse> => {
  try {
    const token = localStorage.getItem('token_')
    if (!token) {
      throw new Error('用户未登录')
    }
    
    const response = await http.post(`/comments/${commentId}/like`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('点赞评论失败:', error)
    throw error
  }
}

/**
 * 获取评论统计信息
 * @param articleId 文章ID
 * @returns Promise<CommentResponse>
 */
export const getCommentStats = async (articleId: number): Promise<CommentResponse> => {
  try {
    const response = await publicInstance.get(`/comments/stats/${articleId}`)
    return response.data
  } catch (error) {
    console.error('获取评论统计失败:', error)
    throw error
  }
}

/**
 * 更新文章浏览数
 * @param articleId 文章ID
 * @returns Promise<CommentResponse>
 */
export const updateArticleViewCount = async (articleId: number): Promise<CommentResponse> => {
  try {
    const response = await publicInstance.post(`/articles/${articleId}/view`)
    return response.data
  } catch (error) {
    console.error('更新浏览数失败:', error)
    throw error
  }
}
