import http from '@/utils/http'

// 团队管理相关API接口

// 删除团队成员
export const deleteLeader = async (id: number) => {
  try {
    const response = await http.get(`/dleader/${id}`)
    return response.data
  } catch (error) {
    console.error('删除团队成员失败:', error)
    throw error
  }
}

// 获取团队成员数据
export const getLeaderData = async () => {
  try {
    const response = await http.get('/leaderData')
    return response.data
  } catch (error) {
    console.error('获取团队成员数据失败:', error)
    throw error
  }
}
