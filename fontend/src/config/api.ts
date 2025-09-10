/**
 * API配置管理
 * 根据环境自动切换API地址
 */

// 获取API基础地址
export const getApiBaseURL = (): string => {
  // 优先使用环境变量
  if (process.env.VUE_APP_API_BASE_URL) {
    return process.env.VUE_APP_API_BASE_URL;
  }
  
  // 根据NODE_ENV自动切换
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000/api'  // 开发环境
    : 'set your real url here';  // 生产环境
};

// 获取验证码脚本地址
export const getCaptchaScriptURL = (): string => {
  return process.env.VUE_APP_CAPTCHA_SCRIPT_URL || 
    'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js';
};

// API配置对象
export const apiConfig = {
  baseURL: getApiBaseURL(),
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// 导出常用配置
export const API_BASE_URL = getApiBaseURL();
export const CAPTCHA_SCRIPT_URL = getCaptchaScriptURL();
