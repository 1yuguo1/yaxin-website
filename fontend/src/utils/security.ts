/**
 * 安全工具类
 * 提供令牌加密、解密、验证等安全功能
 */

// 简单的Base64编码/解码（仅用于基本混淆，不用于敏感数据）
export class SecurityUtils {
    /**
     * Base64编码
     */
    static encode(data: string): string {
        try {
            return btoa(unescape(encodeURIComponent(data)));
        } catch (error) {
            return data;
        }
    }

    /**
     * Base64解码
     */
    static decode(encodedData: string): string {
        try {
            return decodeURIComponent(escape(atob(encodedData)));
        } catch (error) {
            return encodedData;
        }
    }

    /**
     * 生成随机字符串
     */
    static generateRandomString(length = 32): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * 生成时间戳
     */
    static generateTimestamp(): number {
        return Date.now();
    }

    /**
     * 验证令牌格式
     */
    static validateTokenFormat(token: string): boolean {
        if (!token || typeof token !== 'string') {
            return false;
        }
        
        // 基本格式验证（根据实际令牌格式调整）
        const tokenRegex = /^[A-Za-z0-9\-_.]+$/;
        return tokenRegex.test(token) && token.length >= 10;
    }

    /**
     * 检查令牌是否过期
     */
    static isTokenExpired(expiresAt: number): boolean {
        if (!expiresAt) return false;
        return Date.now() >= expiresAt;
    }

    /**
     * 计算令牌剩余时间（秒）
     */
    static getTokenRemainingTime(expiresAt: number): number {
        if (!expiresAt) return 0;
        const remaining = expiresAt - Date.now();
        return Math.max(0, Math.floor(remaining / 1000));
    }

    /**
     * 安全的令牌存储
     */
    static secureStoreToken(token: string, key = 'token_'): void {
        try {
            // 添加时间戳和随机字符串增加安全性
            const timestamp = this.generateTimestamp();
            const randomStr = this.generateRandomString(8);
            const secureToken = this.encode(`${token}|${timestamp}|${randomStr}`);
            
            // 优先使用sessionStorage
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(key, secureToken);
            } else {
                localStorage.setItem(key, secureToken);
            }
        } catch (error) {
            // 安全存储令牌失败处理
        }
    }

    /**
     * 安全获取令牌
     */
    static secureGetToken(key = 'token_'): string {
        try {
            let secureToken = '';
            
            // 优先从sessionStorage获取
            if (typeof sessionStorage !== 'undefined') {
                secureToken = sessionStorage.getItem(key) || '';
            }
            
            if (!secureToken) {
                secureToken = localStorage.getItem(key) || '';
            }
            
            if (!secureToken) return '';
            
            // 解码并提取令牌
            const decoded = this.decode(secureToken);
            const parts = decoded.split('|');
            
            if (parts.length >= 1) {
                return parts[0]; // 返回原始令牌
            }
            
            return '';
        } catch (error) {
            return '';
        }
    }

    /**
     * 安全清除令牌
     */
    static secureClearToken(key = 'token_'): void {
        try {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem(key);
            }
            localStorage.removeItem(key);
        } catch (error) {
            // 安全清除令牌失败处理
        }
    }

    /**
     * 检查环境安全性
     */
    static checkEnvironmentSecurity(): {
        isSecure: boolean;
        warnings: string[];
    } {
        const warnings: string[] = [];
        let isSecure = true;

        // 检查HTTPS
        if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
            warnings.push('当前连接未使用HTTPS，令牌传输可能不安全');
            isSecure = false;
        }

        // 检查localStorage支持
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (error) {
            warnings.push('localStorage不可用，令牌存储可能受限');
        }

        // 检查sessionStorage支持
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
        } catch (error) {
            warnings.push('sessionStorage不可用，令牌存储可能受限');
        }

        return { isSecure, warnings };
    }

    /**
     * 令牌混淆（简单混淆，不用于高安全要求场景）
     */
    static obfuscateToken(token: string): string {
        if (!token) return '';
        
        // 简单的字符替换混淆
        const chars = token.split('');
        const obfuscated = chars.map((char, index) => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(code + (index % 3) + 1);
        });
        
        return this.encode(obfuscated.join(''));
    }

    /**
     * 令牌去混淆
     */
    static deobfuscateToken(obfuscatedToken: string): string {
        if (!obfuscatedToken) return '';
        
        try {
            const decoded = this.decode(obfuscatedToken);
            const chars = decoded.split('');
            const deobfuscated = chars.map((char, index) => {
                const code = char.charCodeAt(0);
                return String.fromCharCode(code - (index % 3) - 1);
            });
            
            return deobfuscated.join('');
        } catch (error) {
            return '';
        }
    }
}

// 导出便捷方法
export const encode = SecurityUtils.encode;
export const decode = SecurityUtils.decode;
export const generateRandomString = SecurityUtils.generateRandomString;
export const validateTokenFormat = SecurityUtils.validateTokenFormat;
export const isTokenExpired = SecurityUtils.isTokenExpired;
export const secureStoreToken = SecurityUtils.secureStoreToken;
export const secureGetToken = SecurityUtils.secureGetToken;
export const secureClearToken = SecurityUtils.secureClearToken;

