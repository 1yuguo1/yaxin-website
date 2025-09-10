import http from '@/utils/http'

// 个人中心相关API接口

// 更新个人信息
export const updatePersonalInfo = async (formData: any) => {
  try {
    const response = await http.post('/addInform', formData)
    return response.data
  } catch (error) {
    console.error('更新个人信息失败:', error)
    throw error
  }
}

// 修改密码
export const changePassword = async (passwordData: any) => {
  try {
    const response = await http.post('/changePass', passwordData)
    return response.data
  } catch (error) {
    console.error('修改密码失败:', error)
    throw error
  }
}

// 获取个人信息
export const getPersonalInfo = async (username: string) => {
  try {
    const response = await http.get(`/inform/${username}`)
    return response.data
  } catch (error) {
    console.error('获取个人信息失败:', error)
    throw error
  }
}





