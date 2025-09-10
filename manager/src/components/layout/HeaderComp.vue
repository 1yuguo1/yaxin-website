<template>
  <div class="app-header">
    <el-icon @click="$emit('toggle-sidebar')" style="font-size: 20px;margin-left: 20px;cursor: grab;">
      <Fold />
    </el-icon>
    
    <div class="user-info">
      <el-avatar 
        style="margin-right: 5px;" 
        shape="square" 
        size="default" 
        :src="imageUrl" 
      />
      {{ form.nickname }}
    </div>
    
    <div class="logout-btn" @click="handleLogout">
      <el-icon><CircleClose /></el-icon>
      注销
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { Fold, CircleClose } from '@element-plus/icons-vue'
import { getUserInfo, getUserAvatar } from '@/utils/userApi'
import { logout } from '@/utils/authApi'
import { getBaseURL } from '@/utils/http'

const emit = defineEmits(['toggle-sidebar'])

const form = ref({
  username: '',
  nickname: '',
  real_name: '',
  position: '',
  phone_number: '',
  email: ''
})

const imageUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')

// 注销处理
const handleLogout = () => {
  logout()
}

// 获取用户信息
onMounted(async () => {
  const username = localStorage.getItem('username')
  if (username) {
    try {
      const response = await getUserInfo(username)
      if (response.code === 200) {
        form.value = response.data
        imageUrl.value = `${getBaseURL()}/image/${username}`
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
})
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 10%;
  background-color: rgb(93, 161, 230);
  display: flex;
  align-items: center;
}

.user-info {
  width: 10%;
  height: 100%;
  cursor: grab;
  position: absolute;
  right: 8%;
  display: flex;
  align-items: center;
}

.logout-btn {
  width: 5%;
  height: 100%;
  cursor: grab;
  position: absolute;
  right: 2%;
  display: flex;
  align-items: center;
}
</style>
