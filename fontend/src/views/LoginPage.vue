<template>
    <div class="login-container">
        <!-- 返回按钮 -->
        <div class="back-button" @click="router.back()">
            <el-icon><ArrowLeftBold /></el-icon>
            <span>返回</span>
        </div>
        
        <!-- 系统通知 -->
        <div class="system-notice desktop-only">
            <el-alert
                title="系统通知"
                type="warning"
                :closable="false"
                show-icon
            >
                <template #default>
                    <p>由于新政策要求，短信验证码功能需要运营商审核，暂时无法使用。</p>
                    <p>• 注册时验证码可随意填写</p>
                    <p>• 忘记密码功能暂时停用</p>
                    <p>• 给您带来的不便敬请谅解</p>
                </template>
            </el-alert>
        </div>
        
        <!-- 注册成功提示 -->
        <div v-if="isRegist==1" class="success-message">
            注册成功，页面将在{{ backLoginTime }}秒后重返登录页
        </div>
        
        <!-- 登录表单 -->
        <div class="login-form">
            <h1 class="form-title">Welcome</h1>
            
            <el-tabs v-model="activeName" @tab-change="change_tab">
                <!-- 快捷登录 -->
                <el-tab-pane label="快捷登录" name="first">
                    <div class="form-content">
                        <div class="input-group">
                            <input 
                                v-model="phoneNumber_" 
                                placeholder="请输入您的手机号码"
                                type="tel"
                                class="form-input"
                                @blur="validatePhone"
                            >
                            <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
                        </div>
                        
                        <div class="input-group">
                            <input 
                                v-model="password_" 
                                placeholder="请输入您的密码"
                                type="password"
                                class="form-input"
                                @blur="validatePassword"
                            >
                            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
                        </div>
                        
                        <div v-if="isWrong" class="error-message">用户名或密码错误</div>
                        
                        <!-- 验证码组件 -->
                        <div class="captcha-container">
                            <CaptchaComp 
                                v-if="tab_type == 0" 
                                ref="loginCaptcha"
                                @success="finish_vaid" 
                            />
                        </div>
                        
                        <!-- 协议同意 -->
                        <div class="agreement">
                            <label class="checkbox-label">
                                <input v-model="agree" type="checkbox" class="checkbox">
                                <span>已阅读并同意</span>
                                <router-link to="/noticeb" class="link">用户协议</router-link>、
                                <router-link to="/notice" class="link">隐私协议</router-link>
                            </label>
                            <span class="forgot-password-disabled">忘记密码功能维护中</span>
                        </div>
                        
                        <!-- 登录按钮 -->
                        <el-button 
                            id="login"
                            @click="login" 
                            size="large" 
                            type="primary"
                            class="login-button"
                            :loading="isLoading"
                        >
                            登录
                        </el-button>
                        
                        <!-- 其他登录方式 -->
                        <el-divider>其它登录方式</el-divider>
                        <div class="social-login">
                            <div class="social-icons">
                                <img src="@/assets/weixin_login.png" alt="微信登录">
                                <img src="@/assets/qq_login.png" alt="QQ登录">
                                <img src="@/assets/weibo_login.png" alt="微博登录">
                                <img src="@/assets/zhifu_login.png" alt="支付宝登录">
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                
                <!-- 亚信用户注册 -->
                <el-tab-pane label="亚信用户注册" name="second">
                    <div class="form-content">
                        <div class="input-group">
                            <input 
                                v-model="phoneNumber" 
                                placeholder="请输入您的手机号码"
                                type="tel"
                                class="form-input"
                                @blur="validatePhone"
                            >
                            <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
                        </div>
                        
                        <div class="input-group">
                            <input 
                                v-model="password" 
                                placeholder="请输入您要设置的密码"
                                type="password"
                                class="form-input"
                                @blur="validatePassword"
                            >
                            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
                        </div>
                        
                        <!-- 验证码组件 -->
                        <div class="captcha-container">
                            <CaptchaComp 
                                v-if="tab_type == 1" 
                                ref="registerCaptcha"
                                button-id="#register"
                                @success="finish_vaid" 
                            />
                        </div>
                        
                        <!-- 验证码输入 -->
                        <div class="phonenumber">
                            <input 
                                v-model="code" 
                                placeholder="验证码可随意填写"
                                class="form-input"
                            >
                            <el-button 
                                @click="sendSms" 
                                v-if="!isSend" 
                                size="large"
                                type="default"
                                :loading="isLoading"
                                disabled
                            >
                                验证码功能维护中
                            </el-button>
                            <div v-else class="countdown">
                                {{ sendTime }}秒后重发
                            </div>
                        </div>
                        
                        <div v-if="isRegist==2" class="error-message">注册失败,请更换手机号码后重试</div>
                        
                        <!-- 注册按钮 -->
                        <el-button 
                            id="register"
                            @click="regist" 
                            size="large" 
                            type="primary"
                            class="login-button"
                            :loading="isLoading"
                        >
                            注册
                        </el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        
        <!-- 忘记密码弹出面板 -->
        <el-dialog
            v-model="forgotPasswordVisible"
            title="忘记密码"
            width="90%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="forgot-password-dialog"
        >
            <div class="forgot-password-content">
                <div class="step-indicator">
                    <div class="step" :class="{ active: forgotPasswordStep === 1, completed: forgotPasswordStep > 1 }">
                        <div class="step-number">1</div>
                        <div class="step-text">验证手机号</div>
                    </div>
                    <div class="step-line" :class="{ active: forgotPasswordStep > 1 }"></div>
                    <div class="step" :class="{ active: forgotPasswordStep === 2, completed: forgotPasswordStep > 2 }">
                        <div class="step-number">2</div>
                        <div class="step-text">重置密码</div>
                    </div>
                </div>
                
                <!-- 步骤1：验证手机号 -->
                <div v-if="forgotPasswordStep === 1" class="step-content">
                    <div class="input-group">
                        <input 
                            v-model="forgotPasswordPhone" 
                            placeholder="请输入您的手机号码"
                            type="tel"
                            class="forgot-password-input"
                            @blur="validateForgotPasswordPhone"
                        >
                        <div v-if="forgotPasswordPhoneError" class="error-message">{{ forgotPasswordPhoneError }}</div>
                    </div>
                    
                    <div class="input-group">
                        <div class="phonenumber">
                            <input 
                                v-model="forgotPasswordCode" 
                                placeholder="请输入验证码"
                                class="forgot-password-input"
                            >
                            <el-button 
                                @click="sendForgotPasswordCodeAction" 
                                v-if="!forgotPasswordCodeSent" 
                                size="large"
                                type="default"
                                :loading="forgotPasswordLoading"
                                :disabled="!forgotPasswordPhone || forgotPasswordPhoneError"
                            >
                                获取验证码
                            </el-button>
                            <div v-else class="countdown">
                                {{ forgotPasswordCountdown }}秒后重发
                            </div>
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <el-button @click="forgotPasswordVisible = false" size="large">取消</el-button>
                        <el-button 
                            @click="verifyForgotPasswordCode" 
                            type="primary" 
                            size="large"
                            :disabled="!forgotPasswordPhone || !forgotPasswordCode || forgotPasswordPhoneError"
                            :loading="forgotPasswordLoading"
                        >
                            下一步
                        </el-button>
                    </div>
                </div>
                
                <!-- 步骤2：重置密码 -->
                <div v-if="forgotPasswordStep === 2" class="step-content">
                    <div class="input-group">
                        <input 
                            v-model="newPassword" 
                            placeholder="请输入新密码"
                            type="password"
                            class="forgot-password-input"
                            @blur="validateNewPassword"
                        >
                        <div v-if="newPasswordError" class="error-message">{{ newPasswordError }}</div>
                    </div>
                    
                    <div class="input-group">
                        <input 
                            v-model="confirmPassword" 
                            placeholder="请确认新密码"
                            type="password"
                            class="forgot-password-input"
                            @blur="validateConfirmPassword"
                        >
                        <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
                    </div>
                    
                    <div class="button-group">
                        <el-button @click="forgotPasswordStep = 1" size="large">上一步</el-button>
                        <el-button 
                            @click="resetPasswordAction" 
                            type="primary" 
                            size="large"
                            :disabled="!newPassword || !confirmPassword || newPasswordError || confirmPasswordError"
                            :loading="forgotPasswordLoading"
                        >
                            重置密码
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<style scoped>
/* 移动端优先的响应式设计 */
.login-container {
    width: 100vw;
    height: 100vh;
    background-image: url('@/assets/login.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
}

.back-button {
    position: absolute;
    left: 20px;
    top: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    z-index: 1000;
    padding: 12px;
    min-height: 44px;
    min-width: 44px;
    transition: opacity 0.3s ease;
}

.back-button:hover {
    opacity: 0.8;
}

.system-notice {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 300px;
    max-width: 400px;
    z-index: 1000;
}

.system-notice .el-alert {
    background-color: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
    backdrop-filter: blur(10px);
}

.system-notice .el-alert__title {
    color: #856404;
    font-weight: bold;
}

.system-notice .el-alert__content p {
    margin: 4px 0;
    color: #856404;
    font-size: 14px;
    line-height: 1.4;
}

.success-message {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    color: black;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    font-size: 14px;
    text-align: center;
    max-width: 90vw;
}

.login-form {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    overflow: hidden;
    padding: 24px;
    box-sizing: border-box;
}

.form-title {
    text-align: center;
    margin: 0 0 32px 0;
    font-size: 28px;
    font-weight: 600;
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-input {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0 16px;
    font-size: 16px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

.form-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.form-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.15);
}

.form-input.error {
    border-color: #ff4757;
    background: rgba(255, 71, 87, 0.1);
}

.error-message {
    color: #ff4757;
    font-size: 14px;
    margin-top: 4px;
}

.captcha-container {
    display: flex;
    justify-content: center;
    margin: 16px 0;
}

.agreement {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    font-size: 14px;
    line-height: 1.5;
}

.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
    flex: 1;
}

.checkbox {
    width: 18px;
    height: 18px;
    margin: 0;
    flex-shrink: 0;
    margin-top: 2px;
}

.link {
    color: #00d4ff;
    text-decoration: none;
}

.link:hover {
    text-decoration: underline;
}

.forgot-password {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
}

.forgot-password:hover {
    color: white;
}

.forgot-password-disabled {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    cursor: not-allowed;
    white-space: nowrap;
}

.login-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    margin-top: 8px;
}

.social-login {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.social-icons {
    display: flex;
    gap: 20px;
}

.social-icons img {
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.social-icons img:hover {
    transform: scale(1.1);
}

.phonenumber {
    display: flex;
    align-items: center;
    gap: 12px;
}

.phonenumber .form-input {
    flex: 1;
}

.phonenumber .el-button {
    flex-shrink: 0;
    white-space: nowrap;
}

.countdown {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    white-space: nowrap;
}

:deep(.el-tabs__item) {
    color: white;
}

:deep(.el-tabs__item.is-active) {
    color: #00d4ff;
}

:deep(.el-divider__text) {
    background-color: transparent;
    color: rgba(255, 255, 255, 0.8);
}

/* 桌面端样式 (min-width: 1024px) */
@media (min-width: 1024px) {
    .login-container {
        padding: 10px;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    
    .login-form {
        width: 400px;
        max-width: none;
        padding: 20px 30px;
        height: auto;
        max-height: 80vh;
        overflow: visible;
        box-sizing: border-box;
    }
    
    .form-title {
        font-size: 24px;
        margin-bottom: 16px;
    }
    
    .form-content {
        gap: 10px;
    }
    
    .back-button {
        left: 40px;
        top: 40px;
    }
    
    .system-notice {
        right: 40px;
        width: 350px;
    }
    
    .success-message {
        top: 40px;
    }
    
    .input-group {
        gap: 4px;
    }
    
    .form-input {
        height: 38px;
        font-size: 13px;
        padding: 0 12px;
    }
    
    .login-button {
        height: 38px;
        font-size: 13px;
        margin-top: 0;
    }
    
    .agreement {
        gap: 8px;
        font-size: 11px;
        margin-top: 4px;
    }
    
    .social-login {
        margin-top: 8px;
    }
    
    .social-icons {
        gap: 14px;
    }
    
    .social-icons img {
        width: 32px;
        height: 32px;
    }
    
    .captcha-container {
        margin: 4px 0;
    }
    
    .phonenumber {
        gap: 6px;
    }
    
    .error-message {
        font-size: 11px;
        margin-top: 1px;
    }
    
    .countdown {
        font-size: 11px;
    }
    
    .el-divider {
        margin: 8px 0;
    }
    
    /* 大屏幕优化 */
    @media (min-width: 1200px) {
        .login-form {
            width: 420px;
            padding: 30px 40px;
        }
        
        .form-title {
            font-size: 26px;
            margin-bottom: 18px;
        }
        
        .form-content {
            gap: 12px;
        }
        
        .form-input {
            height: 40px;
            font-size: 14px;
        }
        
        .login-button {
            height: 40px;
            font-size: 14px;
        }
    }
    
    /* 超大屏幕优化 */
    @media (min-width: 1440px) {
        .login-form {
            width: 440px;
            padding: 35px 45px;
        }
        
        .form-title {
            font-size: 28px;
            margin-bottom: 20px;
        }
        
        .form-content {
            gap: 14px;
        }
        
        .form-input {
            height: 42px;
            font-size: 15px;
        }
        
        .login-button {
            height: 42px;
            font-size: 15px;
        }
    }
}

/* 移动端优化 (max-width: 1023px) */
@media (max-width: 1023px) {
    .login-container {
        padding: 16px;
    }
    
    .login-form {
        padding: 20px;
    }
    
    .form-title {
        font-size: 24px;
    }
    
    .agreement {
        flex-direction: column;
        gap: 12px;
    }
    
    .social-icons {
        gap: 16px;
    }
    
    .social-icons img {
        width: 36px;
        height: 36px;
    }
    
    .back-button {
        left: 16px;
        top: 16px;
        font-size: 14px;
    }
    
    /* 在移动端隐藏系统通知 */
    .desktop-only {
        display: none !important;
    }
    
    .success-message {
        top: 16px;
        padding: 12px 20px;
        font-size: 13px;
    }
}

/* 横屏适配 */
@media (max-height: 600px) and (orientation: landscape) {
    .login-form {
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .form-content {
        gap: 16px;
    }
    
    .form-title {
        margin-bottom: 20px;
        font-size: 24px;
    }
}

/* 忘记密码弹出面板样式 */
.forgot-password-dialog {
    max-width: 500px;
    margin: 0 auto;
}

.forgot-password-input {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    background: #fff;
    color: #303133;
    padding: 0 16px;
    font-size: 16px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

.forgot-password-input::placeholder {
    color: #c0c4cc;
}

.forgot-password-input:focus {
    outline: none;
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.forgot-password-input.error {
    border-color: #f56c6c;
}

.forgot-password-content .phonenumber .forgot-password-input {
    flex: 1;
}

.forgot-password-content {
    padding: 20px 0;
}

.step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    padding: 0 20px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e0e0e0;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
}

.step.active .step-number {
    background: #409eff;
    color: white;
}

.step.completed .step-number {
    background: #67c23a;
    color: white;
}

.step-text {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
    text-align: center;
}

.step.active .step-text {
    color: #409eff;
    font-weight: 600;
}

.step.completed .step-text {
    color: #67c23a;
}

.step-line {
    width: 60px;
    height: 2px;
    background: #e0e0e0;
    margin: 0 10px;
    transition: all 0.3s ease;
}

.step-line.active {
    background: #67c23a;
}

.step-content {
    padding: 0 20px;
}

.button-group {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.button-group .el-button {
    flex: 1;
    height: 44px;
    font-size: 16px;
    border-radius: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .forgot-password-dialog {
        width: 95% !important;
        margin: 0 auto;
    }
    
    .step-indicator {
        padding: 0 10px;
    }
    
    .step-number {
        width: 28px;
        height: 28px;
        font-size: 12px;
    }
    
    .step-text {
        font-size: 11px;
    }
    
    .step-line {
        width: 40px;
        margin: 0 8px;
    }
    
    .step-content {
        padding: 0 10px;
    }
    
    .button-group {
        flex-direction: column;
        gap: 8px;
    }
    
    .button-group .el-button {
        height: 40px;
        font-size: 14px;
    }
}

/* 桌面端适配 */
@media (min-width: 1024px) {
    .forgot-password-dialog {
        width: 500px !important;
    }
    
    .step-indicator {
        margin-bottom: 40px;
    }
    
    .step-number {
        width: 36px;
        height: 36px;
        font-size: 16px;
    }
    
    .step-text {
        font-size: 14px;
    }
    
    .step-line {
        width: 80px;
        margin: 0 15px;
    }
    
    .button-group {
        margin-top: 30px;
    }
    
    .button-group .el-button {
        height: 48px;
        font-size: 16px;
    }
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { ElMessage } from 'element-plus'
import CaptchaComp from '@/components/CaptchaComp.vue'
import { getPhoneCode, regist_, login_, resetPassword } from '@/api/login'
import router from '@/router'
import { useUserStore } from '@/store'

// 响应式数据
const activeName = ref('first')
const loginCaptcha = ref(null)
const registerCaptcha = ref(null)
const isLoading = ref(false)

// 用户状态管理
const userStore = useUserStore()

// 表单数据
const phoneNumber = ref('')
const password = ref('')
const phoneNumber_ = ref('')
const password_ = ref('')
const code = ref('')
const agree = ref(false)

// 状态管理
const tab_type = ref(0)
const isSend = ref(false)
const isVaid = ref(false)
const isWrong = ref(false)
const isRegist = ref(0)
const backLoginTime = ref(3)
const sendTime = ref(60)

// 验证错误信息
const phoneError = ref('')
const passwordError = ref('')

// 忘记密码相关数据
const forgotPasswordVisible = ref(false)
const forgotPasswordStep = ref(1)
const forgotPasswordPhone = ref('')
const forgotPasswordCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const forgotPasswordPhoneError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')
const forgotPasswordCodeSent = ref(false)
const forgotPasswordCountdown = ref(60)
const forgotPasswordLoading = ref(false)

// 定时器引用
let countdownTimer = null
let backTimer = null
let forgotPasswordTimer = null

// 计算属性
const canLogin = computed(() => {
    return isVaid.value && agree.value && phoneNumber_.value && password_.value
})

const canRegister = computed(() => {
    return isVaid.value && phoneNumber.value && password.value && code.value
})

// 表单验证
const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/
  const currentPhone = activeName.value === 'first' ? phoneNumber_.value : phoneNumber.value
  
  if (!currentPhone) {
    phoneError.value = ''
    return false
  }
  if (!phoneRegex.test(currentPhone)) {
    phoneError.value = '请输入正确的手机号'
    return false
  }
  phoneError.value = ''
  return true
}

const validatePassword = () => {
  const currentPassword = activeName.value === 'first' ? password_.value : password.value
  
  if (!currentPassword) {
    passwordError.value = ''
    return false
  }
  if (currentPassword.length < 6) {
    passwordError.value = '密码至少6位'
    return false
  }
  passwordError.value = ''
  return true
}

// 标签页切换
const change_tab = (name) => {
  isVaid.value = false
  isWrong.value = false
  phoneError.value = ''
  passwordError.value = ''
  
  // 清空表单数据
  phoneNumber.value = ''
  password.value = ''
  phoneNumber_.value = ''
  password_.value = ''
  code.value = ''
  agree.value = false
  
  // 清空验证码相关状态
  isSend.value = false
  sendTime.value = 60
  
  if (name === 'first') {
    tab_type.value = 0
  } else if (name === 'second') {
    tab_type.value = 1
  }
}

// 发送验证码
const sendSms = async () => {
    if (!isVaid.value) {
        ElMessage.warning('请完成滑动验证')
        return
    }
    
    if (!validatePhone()) {
        return
    }
    
    try {
        isLoading.value = true
        await getPhoneCode(phoneNumber.value)
        isSend.value = true
        startCountdown()
        ElMessage.success('验证码已发送')
    } catch (error) {
        ElMessage.error('发送失败，请重试')
    } finally {
        isLoading.value = false
    }
}

// 倒计时逻辑
const startCountdown = () => {
    countdownTimer = setInterval(() => {
        sendTime.value--
        if (sendTime.value <= 0) {
            clearInterval(countdownTimer)
            isSend.value = false
            sendTime.value = 60
        }
    }, 1000)
}

// 验证完成
const finish_vaid = () => {
    isVaid.value = true
}

// 登录
const login = async () => {
  if (!isVaid.value) {
    ElMessage.warning('请完成滑动验证')
    return
  }
  
  if (!agree.value) {
    ElMessage.warning('请阅读并同意用户协议与隐私协议')
    return
  }
  
  // 提交时验证
  if (!phoneNumber_.value) {
    phoneError.value = '请输入手机号'
    return
  }
  if (!password_.value) {
    passwordError.value = '请输入密码'
    return
  }
  
  if (!validatePhone() || !validatePassword()) {
    return
  }
  
  try {
    isLoading.value = true
    const result = await userStore.login(phoneNumber_.value, password_.value)
    
    if (result) {
      ElMessage.success('登录成功')
      // 清空表单
      phoneNumber_.value = ''
      password_.value = ''
      agree.value = false
      isVaid.value = false
      phoneError.value = ''
      passwordError.value = ''
      router.push('/')
    } else {
      isWrong.value = true
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    ElMessage.error('登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 注册
const regist = async () => {
  if (!isVaid.value) {
    ElMessage.warning('请完成滑动验证')
    return
  }
  
  // 提交时验证
  if (!phoneNumber.value) {
    phoneError.value = '请输入手机号'
    return
  }
  if (!password.value) {
    passwordError.value = '请输入密码'
    return
  }
  // 验证码现在可以随意填写，不再强制验证
  if (!code.value) {
    code.value = '123456' // 设置默认验证码
  }
  
  if (!validatePhone() || !validatePassword()) {
    return
  }
  
  try {
    isLoading.value = true
    const result = await regist_(phoneNumber.value, password.value, code.value)
    
    if (result) {
      isRegist.value = 1
      startBackCountdown()
      ElMessage.success('注册成功')
      // 清空表单
      phoneNumber.value = ''
      password.value = ''
      code.value = ''
      isVaid.value = false
      phoneError.value = ''
      passwordError.value = ''
    } else {
      isRegist.value = 2
      ElMessage.error('注册失败，请更换手机号码后重试')
    }
  } catch (error) {
    ElMessage.error('注册失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 返回倒计时
const startBackCountdown = () => {
    backTimer = setInterval(() => {
        backLoginTime.value--
        if (backLoginTime.value <= 0) {
            clearInterval(backTimer)
            location.reload()
        }
    }, 1000)
}

// 忘记密码相关方法
const showForgotPasswordModal = () => {
    forgotPasswordVisible.value = true
    resetForgotPasswordForm()
}

const resetForgotPasswordForm = () => {
    forgotPasswordStep.value = 1
    forgotPasswordPhone.value = ''
    forgotPasswordCode.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    forgotPasswordPhoneError.value = ''
    newPasswordError.value = ''
    confirmPasswordError.value = ''
    forgotPasswordCodeSent.value = false
    forgotPasswordCountdown.value = 60
    forgotPasswordLoading.value = false
    if (forgotPasswordTimer) {
        clearInterval(forgotPasswordTimer)
    }
}

const validateForgotPasswordPhone = () => {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!forgotPasswordPhone.value) {
        forgotPasswordPhoneError.value = ''
        return false
    }
    if (!phoneRegex.test(forgotPasswordPhone.value)) {
        forgotPasswordPhoneError.value = '请输入正确的手机号'
        return false
    }
    forgotPasswordPhoneError.value = ''
    return true
}

const validateNewPassword = () => {
    if (!newPassword.value) {
        newPasswordError.value = '请输入新密码'
        return false
    }
    if (newPassword.value.length < 6) {
        newPasswordError.value = '密码至少6位'
        return false
    }
    newPasswordError.value = ''
    return true
}

const validateConfirmPassword = () => {
    if (!confirmPassword.value) {
        confirmPasswordError.value = '请确认新密码'
        return false
    }
    if (confirmPassword.value !== newPassword.value) {
        confirmPasswordError.value = '两次输入的密码不一致'
        return false
    }
    confirmPasswordError.value = ''
    return true
}

const sendForgotPasswordCodeAction = () => {
    if (!validateForgotPasswordPhone()) {
        return
    }
    
    forgotPasswordLoading.value = true
    getPhoneCode(forgotPasswordPhone.value)
    forgotPasswordCodeSent.value = true
    startForgotPasswordCountdown()
    ElMessage.success('验证码已发送')
    forgotPasswordLoading.value = false
}

const startForgotPasswordCountdown = () => {
    forgotPasswordTimer = setInterval(() => {
        forgotPasswordCountdown.value--
        if (forgotPasswordCountdown.value <= 0) {
            clearInterval(forgotPasswordTimer)
            forgotPasswordCodeSent.value = false
            forgotPasswordCountdown.value = 60
        }
    }, 1000)
}

const verifyForgotPasswordCode = () => {
    if (!forgotPasswordPhone.value || !forgotPasswordCode.value) {
        ElMessage.warning('请填写完整信息')
        return
    }
    
    if (!validateForgotPasswordPhone()) {
        return
    }
    
    // 这里可以添加验证码验证逻辑，暂时直接进入下一步
    forgotPasswordStep.value = 2
}

const resetPasswordAction = async () => {
    if (!validateNewPassword() || !validateConfirmPassword()) {
        return
    }
    
    try {
        forgotPasswordLoading.value = true
        const result = await resetPassword(forgotPasswordPhone.value, forgotPasswordCode.value, newPassword.value)
        
        if (result) {
            ElMessage.success('密码重置成功')
            forgotPasswordVisible.value = false
            resetForgotPasswordForm()
        } else {
            ElMessage.error('密码重置失败，请重试')
        }
    } catch (error) {
        ElMessage.error('密码重置失败，请重试')
    } finally {
        forgotPasswordLoading.value = false
    }
}

// 组件卸载时清理定时器
onBeforeUnmount(() => {
    if (countdownTimer) {
        clearInterval(countdownTimer)
    }
    if (backTimer) {
        clearInterval(backTimer)
    }
    if (forgotPasswordTimer) {
        clearInterval(forgotPasswordTimer)
    }
})
</script>

