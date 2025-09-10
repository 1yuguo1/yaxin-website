<template>
  <div class="app-sidebar">
    <div class="sidebar-header">
      <div style="color: white;font-size: 22px;font-weight: bold;">亚信后台管理系统</div>
    </div>
    <el-menu 
      active-text-color="#ffd04b" 
      background-color="#303133" 
      class="el-menu-vertical-demo"
      default-active="1-1" 
      text-color="#fff" 
      @select="handleMenuSelect"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>自助业务</span>
        </template>
        <el-menu-item index="1-1">生成报告</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item v-show="level == -1" index="2">
        <template #title>
          <el-icon><List /></el-icon>
          <span>权限管理</span>
        </template>
      </el-menu-item>
      
      <el-menu-item index="3">
        <template #title>
          <el-icon><UserFilled /></el-icon>
          <span>个人中心</span>
        </template>
      </el-menu-item>
      
      <el-sub-menu v-show="level == -1" index="4">
        <template #title>
          <el-icon><InfoFilled /></el-icon>
          <span>官网管理</span>
        </template>
        <el-menu-item index="4-1">首页最新动态</el-menu-item>
        <el-menu-item index="4-2">服务介绍</el-menu-item>
        <el-menu-item index="4-3">最新资讯</el-menu-item>
        <el-menu-item index="4-4">案例分享</el-menu-item>
        <el-menu-item index="4-5">领导团队</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item v-show="level == -1" index="5">
        <template #title>
          <el-icon><ChatDotRound /></el-icon>
          <span>反馈管理</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, defineEmits, watch, computed } from 'vue'
import { Location, List, UserFilled, InfoFilled, ChatDotRound } from '@element-plus/icons-vue'
import { useStore } from 'vuex'



const store = useStore()
const roletype = inject('roletype')

// 使用Vuex中的权限状态
const level = computed(() => store.getters.userRole)

const emit = defineEmits(['menu-change'])

// 菜单选择处理
const handleMenuSelect = (index) => {
  roletype.value = index
  // 触发菜单切换事件，让父组件处理具体逻辑
  emit('menu-change', index)
}

// 初始化时从localStorage恢复权限状态
onMounted(() => {
  const savedRole = localStorage.getItem('userRole')
  const savedUsername = localStorage.getItem('username')
  if (savedRole && savedUsername) {
    store.dispatch('login', { username: savedUsername, role: parseInt(savedRole) })
  }
})
</script>

<style scoped>
.app-sidebar {
  width: 17%;
  height: 100%;
  background-color: #303133;
}

.sidebar-header {
  width: 100%;
  height: 10%;
  background-color: rgb(72, 149, 232);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
