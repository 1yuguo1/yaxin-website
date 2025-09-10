import http from '@/utils/http'

// 登录接口
export const login = async (username: string, password: string) => {
  try {
    const response = await http.post('/mlogin', {
      username,
      password
    })
    return response.data
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// 验证token接口
export const verifyToken = async (token: string) => {
  try {
    const response = await http.post('/loginmsgm', {
      token
    })
    return response.data
  } catch (error) {
    console.error('Token验证失败:', error)
    throw error
  }
}

// 验证码验证接口
export const captchaVerifyCallback = async (captchaVerifyParam: string) => {
  try {
    const response = await http.post('/aliyunvaid', {
      captchaVerifyParam
    })
    return {
      captchaResult: response.data.result,
      bizResult: true
    }
  } catch (error) {
    console.error('验证码验证失败:', error)
    return {
      captchaResult: false,
      bizResult: true
    }
  }
}

// 获取用户权限等级
export const getUserRole = async (username: string) => {
  try {
    const response = await http.get(`/role/${username}`)
    return response.data
  } catch (error) {
    console.error('获取用户权限失败:', error)
    throw error
  }
}

// 登出接口
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('admin_token')
  window.location.href = '/#/login'
}




