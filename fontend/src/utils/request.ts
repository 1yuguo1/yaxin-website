import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ElMessage } from 'element-plus';
import router from '@/router';
import { apiConfig } from '@/config/api';

// 创建axios实例
const instance = axios.create(apiConfig);

// 请求队列，用于处理并发请求
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

// 获取令牌的辅助函数
const getToken = (): string => {
    try {
        return sessionStorage.getItem('token_') || localStorage.getItem('token_') || '';
    } catch (error) {
        return localStorage.getItem('token_') || '';
    }
};

// 清除令牌的辅助函数
const clearToken = () => {
    try {
        sessionStorage.removeItem('token_');
        localStorage.removeItem('token_');
    } catch (error) {
        // 清除令牌失败处理
    }
};

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 添加令牌到请求头
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 添加请求时间戳，防止缓存
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now()
            };
        }
        
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 统一处理响应数据
        const { data } = response;
        
        // 检查业务状态码
        if (data.code !== undefined && data.code !== 200) {
            // 业务错误处理
            const errorMessage = data.message || '请求失败';
            
            // 特殊错误码处理
            switch (data.code) {
                case 401:
                    // 未授权，清除令牌并跳转登录
                    clearToken();
                    router.push('/login');
                    ElMessage.error('登录已过期，请重新登录');
                    break;
                case 403:
                    ElMessage.error('没有权限访问该资源');
                    break;
                case 404:
                    ElMessage.error('请求的资源不存在');
                    break;
                case 500:
                    ElMessage.error('服务器内部错误');
                    break;
                default:
                    ElMessage.error(errorMessage);
            }
            
            return Promise.reject(new Error(errorMessage));
        }
        
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // 处理网络错误
        if (!error.response) {
            ElMessage.error('网络连接失败，请检查网络设置');
            return Promise.reject(error);
        }
        
        const { status } = error.response;
        
        // 处理401未授权错误
        if (status === 401 && !originalRequest._retry) {
            // 检查是否有token，没有token直接跳转登录
            const token = getToken();
            if (!token) {
                clearToken();
                router.push('/login');
                ElMessage.error('请先登录');
                return Promise.reject(error);
            }
            
            if (isRefreshing) {
                // 如果正在刷新令牌，将请求加入队列
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return instance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // 使用现有的 /loginmsg 接口重新验证令牌
                const refreshSuccess = await validateToken(token);
                
                if (refreshSuccess) {
                    processQueue(null, token);
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return instance(originalRequest);
                } else {
                    processQueue(new Error('令牌验证失败'), null);
                    clearToken();
                    router.push('/login');
                    ElMessage.error('登录已过期，请重新登录');
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearToken();
                router.push('/login');
                ElMessage.error('登录已过期，请重新登录');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // 处理其他HTTP错误
        switch (status) {
            case 400:
                ElMessage.error('请求参数错误');
                break;
            case 403:
                ElMessage.error('没有权限访问该资源');
                break;
            case 404:
                ElMessage.error('请求的资源不存在');
                break;
            case 408:
                ElMessage.error('请求超时');
                break;
            case 429:
                ElMessage.error('请求过于频繁，请稍后重试');
                break;
            case 500:
                ElMessage.error('服务器内部错误');
                break;
            case 502:
                ElMessage.error('网关错误');
                break;
            case 503:
                ElMessage.error('服务暂时不可用');
                break;
            case 504:
                ElMessage.error('网关超时');
                break;
            default:
                ElMessage.error(`请求失败 (${status})`);
        }
        
        return Promise.reject(error);
    }
);

// 验证令牌的辅助函数
const validateToken = async (token: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${apiConfig.baseURL}/loginmsg`, { token });
        return response.data.code === 200;
    } catch (error) {
        return false;
    }
};

// 添加请求重试机制
const retryRequest = async (config: AxiosRequestConfig, retries = 3): Promise<AxiosResponse> => {
    try {
        return await instance(config);
    } catch (error) {
        if (retries > 0 && (error as AxiosError).code !== 'ECONNABORTED') {
            console.log(`请求失败，${retries}次重试机会`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
            return retryRequest(config, retries - 1);
        }
        throw error;
    }
};

// 导出增强的axios实例
export default instance;
export { retryRequest };