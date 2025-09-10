/**
 * 令牌管理工具类
 * 提供令牌的安全存储、验证、刷新等功能
 */

import { ElMessage } from 'element-plus';

// 令牌存储键名
const TOKEN_KEY = 'token_';
const REFRESH_TOKEN_KEY = 'refresh_token_';
const TOKEN_EXPIRES_KEY = 'token_expires_';

// 存储类型枚举
export enum StorageType {
    SESSION = 'sessionStorage',
    LOCAL = 'localStorage',
    MEMORY = 'memory'
}

// 令牌信息接口
export interface TokenInfo {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    tokenType?: string;
}

// 令牌配置接口
export interface TokenConfig {
    // 存储类型
    storageType: StorageType;
    // 令牌过期前多少秒开始刷新
    refreshThreshold: number;
    // 是否启用自动刷新
    autoRefresh: boolean;
    // 最大重试次数
    maxRetries: number;
    // 刷新间隔（毫秒）
    refreshInterval: number;
}

// 内存存储（用于临时存储）
const memoryStorage = new Map<string, string>();

/**
 * 令牌管理类
 */
export class TokenManager {
    private config: TokenConfig;
    private refreshTimer: ReturnType<typeof setTimeout> | null = null;
    private isRefreshing = false;
    private refreshPromise: Promise<boolean> | null = null;

    constructor(config: Partial<TokenConfig> = {}) {
        this.config = {
            storageType: StorageType.SESSION,
            refreshThreshold: 300, // 5分钟
            autoRefresh: true,
            maxRetries: 3,
            refreshInterval: 60000, // 1分钟检查一次
            ...config
        };
    }

    /**
     * 存储令牌
     */
    setToken(tokenInfo: TokenInfo): void {
        try {
            const storage = this.getStorage();
            
            // 存储访问令牌
            storage.setItem(TOKEN_KEY, tokenInfo.accessToken);
            
            // 存储刷新令牌（如果存在）
            if (tokenInfo.refreshToken) {
                storage.setItem(REFRESH_TOKEN_KEY, tokenInfo.refreshToken);
            }
            
            // 存储过期时间（如果存在）
            if (tokenInfo.expiresAt) {
                storage.setItem(TOKEN_EXPIRES_KEY, tokenInfo.expiresAt.toString());
            }
            
            // 启动自动刷新
            if (this.config.autoRefresh) {
                this.startAutoRefresh();
            }
            
        } catch (error) {
            ElMessage.error('令牌存储失败');
        }
    }

    /**
     * 获取访问令牌
     */
    getAccessToken(): string {
        try {
            const storage = this.getStorage();
            return storage.getItem(TOKEN_KEY) || '';
        } catch (error) {
            return '';
        }
    }

    /**
     * 获取刷新令牌
     */
    getRefreshToken(): string {
        try {
            const storage = this.getStorage();
            return storage.getItem(REFRESH_TOKEN_KEY) || '';
        } catch (error) {
            return '';
        }
    }

    /**
     * 获取令牌过期时间
     */
    getTokenExpiresAt(): number {
        try {
            const storage = this.getStorage();
            const expiresStr = storage.getItem(TOKEN_EXPIRES_KEY);
            return expiresStr ? parseInt(expiresStr, 10) : 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * 检查令牌是否存在
     */
    hasToken(): boolean {
        return !!this.getAccessToken();
    }

    /**
     * 检查令牌是否有效
     */
    isTokenValid(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;
        
        const expiresAt = this.getTokenExpiresAt();
        if (expiresAt && Date.now() >= expiresAt) {
            return false;
        }
        
        return true;
    }

    /**
     * 检查令牌是否需要刷新
     */
    shouldRefreshToken(): boolean {
        const expiresAt = this.getTokenExpiresAt();
        if (!expiresAt) return false;
        
        const now = Date.now();
        const refreshTime = expiresAt - (this.config.refreshThreshold * 1000);
        return now >= refreshTime;
    }

    /**
     * 清除所有令牌
     */
    clearTokens(): void {
        try {
            const storage = this.getStorage();
            storage.removeItem(TOKEN_KEY);
            storage.removeItem(REFRESH_TOKEN_KEY);
            storage.removeItem(TOKEN_EXPIRES_KEY);
            
            // 清除内存存储
            memoryStorage.clear();
            
            // 停止自动刷新
            this.stopAutoRefresh();
            
        } catch (error) {
            // 清除令牌失败处理
        }
    }

    /**
     * 刷新令牌
     */
    async refreshToken(): Promise<boolean> {
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }
        
        this.isRefreshing = true;
        this.refreshPromise = this.performRefresh();
        
        try {
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    /**
     * 执行令牌刷新
     */
    private async performRefresh(): Promise<boolean> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return false;
        }
        
        try {
            // 这里需要根据后端API实现刷新逻辑
            // 暂时使用重新验证的方式
            const { API_BASE_URL } = await import('@/config/api');
            const response = await fetch(`${API_BASE_URL}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    // 更新令牌
                    this.setToken({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        expiresAt: data.expiresAt
                    });
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * 启动自动刷新
     */
    private startAutoRefresh(): void {
        this.stopAutoRefresh();
        
        this.refreshTimer = setInterval(() => {
            if (this.shouldRefreshToken() && this.hasToken()) {
                this.refreshToken().catch(error => {
                    // 自动刷新令牌失败处理
                });
            }
        }, this.config.refreshInterval);
    }

    /**
     * 停止自动刷新
     */
    private stopAutoRefresh(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    /**
     * 获取存储对象
     */
    private getStorage(): Storage {
        switch (this.config.storageType) {
            case StorageType.SESSION:
                return sessionStorage;
            case StorageType.LOCAL:
                return localStorage;
            case StorageType.MEMORY:
                return {
                    getItem: (key: string) => memoryStorage.get(key) || null,
                    setItem: (key: string, value: string) => memoryStorage.set(key, value),
                    removeItem: (key: string) => memoryStorage.delete(key),
                    clear: () => memoryStorage.clear(),
                    length: memoryStorage.size,
                    key: (index: number) => Array.from(memoryStorage.keys())[index] || null
                } as Storage;
            default:
                return sessionStorage;
        }
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<TokenConfig>): void {
        this.config = { ...this.config, ...config };
        
        // 如果自动刷新配置改变，重新启动
        if (config.autoRefresh !== undefined) {
            if (config.autoRefresh) {
                this.startAutoRefresh();
            } else {
                this.stopAutoRefresh();
            }
        }
    }

    /**
     * 获取当前配置
     */
    getConfig(): TokenConfig {
        return { ...this.config };
    }

    /**
     * 销毁管理器
     */
    destroy(): void {
        this.stopAutoRefresh();
        this.isRefreshing = false;
        this.refreshPromise = null;
    }
}

// 创建默认的令牌管理器实例
export const tokenManager = new TokenManager({
    storageType: StorageType.SESSION,
    autoRefresh: true,
    refreshThreshold: 300
});

// 导出便捷方法
export const getToken = () => tokenManager.getAccessToken();
export const setToken = (tokenInfo: TokenInfo) => tokenManager.setToken(tokenInfo);
export const clearTokens = () => tokenManager.clearTokens();
export const isTokenValid = () => tokenManager.isTokenValid();
export const shouldRefreshToken = () => tokenManager.shouldRefreshToken();
export const refreshToken = () => tokenManager.refreshToken();

