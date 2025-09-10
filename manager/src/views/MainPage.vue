<template>
  <AppLayout @menu-change="handleMenuChange" />
</template>
<script setup>
import { onBeforeMount } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import { verifyToken, logout, getUserRole } from "@/utils/authApi";
import { useStore } from 'vuex'

const store = useStore()

// 处理菜单切换事件
const handleMenuChange = (index) => {
  // 菜单切换逻辑现在在各个子组件中处理
  console.log('菜单切换到:', index)
}

// 初始化用户信息
onBeforeMount(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    // 没有token，跳转到登录页
    logout()
    return
  }
  
  try {
    const response = await verifyToken(token)
    if (response.code === 200) {
      localStorage.setItem('username', response.user_id)
      localStorage.setItem('admin_token', token) // 保存管理员token
      
      // 确保权限信息是最新的
      const username = response.user_id
      try {
        const roleResponse = await getUserRole(username)
        if (roleResponse.code === 200) {
          const userRole = roleResponse.role_id
          // 使用Vuex更新全局状态
          store.dispatch('login', { username, role: userRole })
        }
      } catch (roleError) {
        console.error('获取用户权限失败:', roleError)
        // 如果权限获取失败，尝试从localStorage读取
        const savedRole = localStorage.getItem('userRole')
        if (savedRole) {
          store.dispatch('login', { username, role: parseInt(savedRole) })
        } else {
          store.dispatch('login', { username, role: 1 }) // 默认权限
        }
      }
    } else {
      // 登录失败，跳转到登录页
      logout()
    }
  } catch (error) {
    console.error('初始化失败:', error)
    logout()
  }
})

</script>