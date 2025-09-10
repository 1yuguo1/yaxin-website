import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useUserStore } from './store'
import { tokenManager } from './utils/tokenManager'
import { SecurityUtils } from './utils/security'

// 创建Pinia实例
const pinia = createPinia()

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 使用插件
app.use(pinia).use(router).use(ElementPlus)

// 初始化应用
const initializeApp = async () => {
    try {
        // 检查环境安全性
        const securityCheck = SecurityUtils.checkEnvironmentSecurity()
        if (!securityCheck.isSecure) {
            // 安全警告处理
        }
        
        // 初始化用户状态
        const userStore = useUserStore()
        await userStore.initializeAuth()
        
        // 启动令牌管理器
        tokenManager.updateConfig({
            autoRefresh: true,
            refreshThreshold: 300
        })
        
        // 应用初始化完成
    } catch (error) {
        // 应用初始化失败处理
    }
}

// 挂载应用
app.mount('#app')

// 初始化应用逻辑
initializeApp()
