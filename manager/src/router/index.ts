import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import LoginPage from '@/views/LoginPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path:'/login',
    name:'login',
    component:LoginPage
  },
  {
    path:'/',
    name:'main',
    component:MainPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth); // 检查目标路由是否需要登录校验
  const isAuthenticated = localStorage.getItem('token'); // 假设登录状态存储在 localStorage 中

  if (requiresAuth && !isAuthenticated) {
    // 如果需要登录校验但未登录，跳转到登录页面
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    // 如果已登录但访问登录页，跳转到主页
    next({ name: 'main' });
  } else {
    next();
  }
});

export default router
