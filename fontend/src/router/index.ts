import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import NoticePage from '@/views/NoticePage.vue'
import NoticePageb from '@/views/NoticePageb.vue'
import ServiceComp from '@/views/ServiceComp.vue'
import ProfessMsg from '@/views/ProfessMsg.vue'
import AboutUs from '@/views/AboutUs.vue'
import MsgShare from '@/views/MsgShare.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import AskPage from '@/views/AskPage.vue'
import MessagePage from '@/views/MessagePage.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: MainPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/notice',
    name: 'notice',
    component: NoticePage
  },
  {
    path:'/noticeb',
    name:'noticeb',
    component: NoticePageb
  },
  {
    path:'/service',
    name:'service',
    component: ServiceComp
  },
  {
    path:'/profess',
    name:'profess',
    component: ProfessMsg
  },
  {
    path:'/us',
    name:'us',
    component: AboutUs
  },
  {
    path:'/share',
    name:'share',
    component: MsgShare
  },
  {
    path:'/detail',
    name:'detail',
    component: ArticleDetail
  },
  {
    path:'/ask',
    name:'ask',
    component: AskPage
  },
  {
    path:'/messages',
    name:'messages',
    component: MessagePage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Token验证缓存
let tokenValidationCache: {
  token: string | null,
  isValid: boolean,
  timestamp: number,
  duration: number
} = {
  token: null,
  isValid: false,
  timestamp: 0,
  duration: 5 * 60 * 1000 // 5分钟缓存
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    // 检查令牌是否存在
    const token = sessionStorage.getItem('token_') || localStorage.getItem('token_')
    
    if (!token) {
      // 没有令牌，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // 检查缓存
    const now = Date.now()
    if (tokenValidationCache.token === token && 
        tokenValidationCache.isValid && 
        (now - tokenValidationCache.timestamp) < tokenValidationCache.duration) {
      next()
      return
    }
    
    // 验证令牌有效性
    try {
      const { API_BASE_URL } = await import('@/config/api');
      const response = await fetch(`${API_BASE_URL}/loginmsg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })
      
      const data = await response.json()
      
      if (data.code !== 200) {
        // 令牌无效，清除缓存和存储
        tokenValidationCache = { token: null, isValid: false, timestamp: 0, duration: 5 * 60 * 1000 }
        sessionStorage.removeItem('token_')
        localStorage.removeItem('token_')
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }
      
      // 更新缓存
      tokenValidationCache = {
        token,
        isValid: true,
        timestamp: now,
        duration: 5 * 60 * 1000
      }
      
    } catch (error) {
      // 网络错误或服务器错误，清除缓存
      tokenValidationCache = { token: null, isValid: false, timestamp: 0, duration: 5 * 60 * 1000 }
      sessionStorage.removeItem('token_')
      localStorage.removeItem('token_')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // 如果已登录用户访问登录页，重定向到首页
  if (to.path === '/login') {
    const token = sessionStorage.getItem('token_') || localStorage.getItem('token_')
    if (token) {
      next('/')
      return
    }
  }
  
  next()
})

// 路由错误处理
router.onError((error) => {
  // 路由错误处理
})

export default router
