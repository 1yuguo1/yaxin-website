import http from '@/utils/http'

// 内容管理相关API接口

// 删除文章
export const deleteArticle = async (articleId: number) => {
  try {
    const response = await http.get(`/deleteArticle/${articleId}`)
    return response.data
  } catch (error) {
    console.error('删除文章失败:', error)
    throw error
  }
}

// 获取文章数据（分页）
export const getArticleData = async (artType: string, page: number) => {
  try {
    const response = await http.get(`/articleData/${artType}/${page}`)
    return response.data
  } catch (error) {
    console.error('获取文章数据失败:', error)
    throw error
  }
}

// 获取文章总数
export const getArticleTotal = async (artType: string) => {
  try {
    const response = await http.get(`/articleTotal/${artType}`)
    return response.data
  } catch (error) {
    console.error('获取文章总数失败:', error)
    throw error
  }
}

// 获取所有文章数据
export const getAllArticleData = async (artType: string) => {
  try {
    const response = await http.get(`/articleData/${artType}/1`)
    return response.data
  } catch (error) {
    console.error('获取所有文章数据失败:', error)
    throw error
  }
}




