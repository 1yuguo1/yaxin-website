import http from '@/utils/http'

// 文章管理相关API接口

// 创建文章
export const createArticle = async (articleData: {
  title: string
  content: string
  author: string
  category_id: number
  tags: string
}) => {
  try {
    const response = await http.post('/carticle', articleData)
    return response.data
  } catch (error) {
    console.error('创建文章失败:', error)
    throw error
  }
}

// 获取文章列表
export const getArticleList = async (page = 1, pageSize = 10) => {
  try {
    const response = await http.get('/articles/list', {
      params: { page, page_size: pageSize }
    })
    return response.data
  } catch (error) {
    console.error('获取文章列表失败:', error)
    throw error
  }
}

// 获取文章详情
export const getArticleDetail = async (id: number) => {
  try {
    const response = await http.get(`/articles/${id}`)
    return response.data
  } catch (error) {
    console.error('获取文章详情失败:', error)
    throw error
  }
}

// 更新文章
export const updateArticle = async (id: number, articleData: any) => {
  try {
    const response = await http.put(`/articles/${id}`, articleData)
    return response.data
  } catch (error) {
    console.error('更新文章失败:', error)
    throw error
  }
}

// 删除文章
export const deleteArticle = async (id: number) => {
  try {
    const response = await http.delete(`/articles/${id}`)
    return response.data
  } catch (error) {
    console.error('删除文章失败:', error)
    throw error
  }
}

// 获取文章分类
export const getArticleCategories = async () => {
  try {
    const response = await http.get('/articles/categories')
    return response.data
  } catch (error) {
    console.error('获取文章分类失败:', error)
    throw error
  }
}




