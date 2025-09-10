import { defineStore } from 'pinia'
import { getLoginMsg, login_ } from '@/api/login'
import { ElMessage } from 'element-plus'

// 用户信息接口定义
interface UserInfo {
    username: string
    name: string
    userId?: string
}

// 令牌信息接口定义
interface TokenInfo {
    accessToken: string
    refreshToken?: string
    expiresAt?: number
}

export const useUserStore = defineStore('user', {
    state: () => ({
        // 用户认证状态
        isAuthenticated: false,
        isLoading: false,
        
        // 用户信息
        userInfo: {
            username: '',
            name: '',
            userId: ''
        } as UserInfo,
        
        // 令牌信息
        tokenInfo: {
            accessToken: '',
            refreshToken: '',
            expiresAt: 0
        } as TokenInfo,
        
        // 令牌管理配置
        tokenConfig: {
            // 令牌过期前多少秒开始刷新
            refreshThreshold: 300, // 5分钟
            // 最大重试次数
            maxRetries: 3,
            // 是否启用自动刷新
            autoRefresh: true
        }
    }),
    
    getters: {
        // 检查令牌是否有效
        isTokenValid: (state) => {
            if (!state.tokenInfo.accessToken) return false
            if (state.tokenInfo.expiresAt && Date.now() >= state.tokenInfo.expiresAt) {
                return false
            }
            return true
        },
        
        // 检查令牌是否需要刷新
        shouldRefreshToken: (state) => {
            if (!state.tokenInfo.expiresAt) return false
            const now = Date.now()
            const refreshTime = state.tokenInfo.expiresAt - (state.tokenConfig.refreshThreshold * 1000)
            return now >= refreshTime
        },
        
        // 获取用户显示名称
        displayName: (state) => {
            return state.userInfo.name || state.userInfo.username || '用户'
        }
    },
    
    actions: {
        // 初始化用户状态
        async initializeAuth() {
            this.isLoading = true
            try {
                const savedToken = this.getStoredToken()
                if (savedToken) {
                    this.tokenInfo.accessToken = savedToken
                    await this.validateToken()
                }
            } catch (error) {
                this.clearAuth()
            } finally {
                this.isLoading = false
            }
        },
        
        // 用户登录
        async login(username: string, password: string): Promise<boolean> {
            this.isLoading = true
            try {
                const result = await login_(username, password)
                if (result) {
                    // 登录成功，获取存储的令牌
                    const token = this.getStoredToken()
                    if (token) {
                        this.tokenInfo.accessToken = token
                        // 获取用户信息
                        const success = await this.validateToken()
                        if (success) {
                            return true
                        }
                    }
                    ElMessage.error('登录成功但获取用户信息失败')
                    return false
                } else {
                    ElMessage.error('登录失败，请检查用户名和密码')
                    return false
                }
            } catch (error) {
                ElMessage.error('登录失败，请稍后重试')
                return false
            } finally {
                this.isLoading = false
            }
        },
        
        // 验证令牌并获取用户信息
        async validateToken(): Promise<boolean> {
            if (!this.tokenInfo.accessToken) {
                this.clearAuth()
                return false
            }
            
            try {
                const userInfo = await getLoginMsg(this.tokenInfo.accessToken)
                if (userInfo && typeof userInfo === 'object') {
                    const userData = userInfo as UserInfo
                    this.isAuthenticated = true
                    this.userInfo = {
                        username: userData.username || '',
                        name: userData.name || '',
                        userId: userData.username || ''
                    }
                    this.storeToken()
                    return true
                } else {
                    this.clearAuth()
                    return false
                }
            } catch (error) {
                this.clearAuth()
                return false
            }
        },
        
        // 刷新令牌
        async refreshToken(): Promise<boolean> {
            if (!this.tokenConfig.autoRefresh) return false
            
            try {
                // 这里需要根据后端API实现刷新逻辑
                // 暂时使用重新验证的方式
                return await this.validateToken()
            } catch (error) {
                this.clearAuth()
                return false
            }
        },
        
        // 用户登出
        logout() {
            this.clearAuth()
            ElMessage.success('已安全退出')
        },
        
        // 清除认证信息
        clearAuth() {
            this.isAuthenticated = false
            this.userInfo = { username: '', name: '', userId: '' }
            this.tokenInfo = { accessToken: '', refreshToken: '', expiresAt: 0 }
            this.removeStoredToken()
        },
        
        // 存储令牌到安全位置
        storeToken() {
            if (this.tokenInfo.accessToken) {
                // 优先使用sessionStorage，更安全
                try {
                    sessionStorage.setItem('token_', this.tokenInfo.accessToken)
                    // 如果支持，也可以使用httpOnly cookie
                } catch (error) {
                    localStorage.setItem('token_', this.tokenInfo.accessToken)
                }
            }
        },
        
        // 从存储中获取令牌
        getStoredToken(): string {
            try {
                return sessionStorage.getItem('token_') || localStorage.getItem('token_') || ''
            } catch (error) {
                return localStorage.getItem('token_') || ''
            }
        },
        
        // 移除存储的令牌
        removeStoredToken() {
            try {
                sessionStorage.removeItem('token_')
                localStorage.removeItem('token_')
            } catch (error) {
                // 清除令牌存储失败处理
            }
        },
        
        // 更新令牌配置
        updateTokenConfig(config: Partial<typeof this.tokenConfig>) {
            this.tokenConfig = { ...this.tokenConfig, ...config }
        }
    }
})