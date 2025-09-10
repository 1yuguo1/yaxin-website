import http from '@/utils/http'

// 报告生成相关API接口

// 获取视图数据
export const getViewData = async (username: string, type: number) => {
  try {
    const response = await http.get(`/viewdata/${username}/${type}`)
    return response.data
  } catch (error) {
    console.error('获取视图数据失败:', error)
    throw error
  }
}

// 生成报告
export const generateReport = async (username: string) => {
  try {
    const response = await http.get(`/report/${username}`)
    return response.data
  } catch (error) {
    console.error('生成报告失败:', error)
    throw error
  }
}

// 下载报告文件
export const downloadReport = async (username: string) => {
  try {
    const response = await http.get(`/reportfile/${username}`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    console.error('下载报告失败:', error)
    throw error
  }
}





