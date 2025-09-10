import http from '@/utils/http'

// 用户管理相关API接口


// 创建用户
export const createUser = async () => {
  try {
    const response = await http.get('/createadmin')
    return response.data
  } catch (error) {
    console.error('创建用户失败:', error)
    throw error
  }
}

// 删除用户
export const deleteUser = async (username: string) => {
  try {
    const response = await http.get(`/delete/${username}`)
    return response.data
  } catch (error) {
    console.error('删除用户失败:', error)
    throw error
  }
}

// 改变用户状态
export const changeUserStatus = async (username: string) => {
  try {
    const response = await http.get(`/status/${username}`)
    return response.data
  } catch (error) {
    console.error('改变用户状态失败:', error)
    throw error
  }
}

// 分页获取用户数据
export const getUsersByPage = async (page: number) => {
  try {
    const response = await http.get(`/page/${page}`)
    return response.data
  } catch (error) {
    console.error('分页加载失败:', error)
    throw error
  }
}

// 初始化用户数据
export const initUserData = async () => {
  try {
    const response = await http.get('/initadmin')
    return response.data
  } catch (error) {
    console.error('加载用户数据失败:', error)
    throw error
  }
}

// 获取用户总数
export const getUserTotal = async () => {
  try {
    const response = await http.get('/total')
    return response.data
  } catch (error) {
    console.error('加载总数失败:', error)
    throw error
  }
}

// 获取用户信息
export const getUserInfo = async (username: string) => {
  try {
    const response = await http.get(`/inform/${username}`)
    return response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

// 获取用户头像
export const getUserAvatar = async (username: string) => {
  try {
    const response = await http.get(`/image/${username}`)
    return response.data
  } catch (error) {
    console.error('获取用户头像失败:', error)
    throw error
  }
}
