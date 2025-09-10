<template>
  <div class="team-management">
    <div class="header-actions">
      <el-button type="primary" @click="addLeader">添加成员</el-button>
    </div>
    
    <div class="leader-list" v-loading="isLeaderCard">
      <div 
        class="leader-card" 
        v-for="(item, index) in leaderData" 
        :key="index"
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave"
      >
        <el-image 
          style="width: 100%; height: 80%" 
          :src="getBaseURL() + '/imagel/'+ item.id" 
          fit="cover" 
        />
        <div class="leader-name">{{ item.name }}</div>
        <div class="leader-role">{{ item.role }}</div>
        
        <div v-if="isMouse" class="leader-actions">
          <el-button 
            @click="editLeader(item.id, item.name, item.role)" 
            size="small" 
            style="margin-right: 4px;"
          >
            编辑
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="deleteLeader(item.id)"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑成员表单 -->
    <div v-if="leaderForm" class="leader-form">
      <el-upload 
        :before-upload="beforeAvatarUpload" 
        ref="uploadRef" 
        :action="actionUrl" 
        :data="leaderData" 
        :auto-upload="false" 
        class="avatar-uploader"
      >
        <el-icon class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      
      <div class="form-fields">
        <span>姓名</span>
        <el-input 
          v-model="leaderFormData.name" 
          style="margin-top: 3%;margin-bottom: 3%;width: 70%;"
        />
        
        <div>
          <span>职务</span>
          <el-input 
            v-model="leaderFormData.role" 
            style="margin-top: 3%;margin-bottom: 3%;width: 70%;"
          />
        </div>
      </div>
      
      <div class="form-actions">
        <el-button 
          @click="submitUpload" 
          style="margin-right: 10px;" 
          type="primary"
        >
          提交
        </el-button>
        <el-button @click="cancelLeader">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/http'
import { getBaseURL } from '@/utils/http'

// 响应式数据
const leaderData = ref([])
const isMouse = ref(false)
const leaderForm = ref(false)
const leaderFormData = ref({ name: '', role: '' })
const isLeaderCard = ref(false)
const actionUrl = ref(getBaseURL() + '/addLeader')
const leaderEnum = ref(1)
const uploadRef = ref(null)

// 鼠标进入处理
const handleMouseEnter = () => {
  isMouse.value = true
}

// 鼠标离开处理
const handleMouseLeave = () => {
  isMouse.value = false
}

// 添加成员
const addLeader = () => {
  leaderEnum.value = 1
  leaderFormData.value = { name: '', role: '' }
  leaderForm.value = true
}

// 编辑成员
const editLeader = (id, name, role) => {
  leaderEnum.value = 2
  leaderFormData.value = { id, name, role }
  leaderForm.value = true
}

// 删除成员
const deleteLeader = async (id) => {
  try {
    const res = await http.get(`/dleader/${id}`)
    if (res.data.code == 200) {
      updateView()
    }
  } catch (error) {
    console.error('删除成员失败:', error)
  }
}

// 取消操作
const cancelLeader = () => {
  leaderForm.value = false
}

// 提交上传
const submitUpload = async () => {
  if (leaderEnum.value == 1) {
    actionUrl.value = getBaseURL() + '/addLeader'
  } else if (leaderEnum.value == 2) {
    actionUrl.value = getBaseURL() + '/upLeader'
  }
  
  leaderForm.value = false
  if (uploadRef.value != null) {
    await uploadRef.value.submit()
    updateView()
  }
}

// 头像上传前验证
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

// 更新视图
const updateView = async () => {
  isLeaderCard.value = true
  try {
    const res = await http.get('/leaderData')
    leaderData.value = res.data.data
    isLeaderCard.value = false
  } catch (error) {
    console.error('更新视图失败:', error)
    isLeaderCard.value = false
  }
}

// 初始化
onMounted(() => {
  updateView()
})
</script>

<style scoped>
.team-management {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.header-actions {
  width: 100%;
  height: 5%;
  padding-left: 20px;
  margin-top: 1%;
}

.leader-list {
  width: 90%;
  height: 84%;
  padding: 5% 5% 5% 5%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow-y: scroll;
  position: relative;
}

.leader-card {
  width: 20%;
  height: 40%;
  background-color: rgb(93, 161, 230);
  position: relative;
}

.leader-name {
  font-weight: 500;
  font-size: 20px;
  line-height: 25px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.leader-role {
  font-size: 14px;
  line-height: 18px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.leader-actions {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.leader-form {
  width: 40%;
  height: 50%;
  position: absolute;
  background-color: white;
  top: 25%;
  left: 30%;
}

.form-fields {
  padding: 20px;
}

.form-actions {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 5px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
