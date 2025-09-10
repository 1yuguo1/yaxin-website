<template>
  <div class="personal-center">
    <div class="header-actions">
      <el-button @click="changeInform" type="primary">修改资料</el-button>
      <el-button @click="changePass" type="danger">修改密码</el-button>
    </div>
    
    <!-- 修改资料表单 -->
    <el-form 
      v-if="isInform === 'form'" 
      :model="form" 
      label-width="auto"
      class="form-container"
    >
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.real_name" />
      </el-form-item>
      <el-form-item label="职务">
        <el-input v-model="form.position" />
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.phone_number" />
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">完成</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 修改密码表单 -->
    <el-form 
      v-else-if="isInform === 'password'" 
      :model="passwordForm" 
      label-width="auto"
      class="form-container"
    >
      <el-form-item label="旧密码">
        <el-input type="password" v-model="passwordForm.old" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="passwordForm.new" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit1">完成</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 个人信息概览 -->
    <el-descriptions 
      v-loading="!isSubmit" 
      v-else-if="isInform === 'default'" 
      title="个人信息概览" 
      border
    >
      <el-descriptions-item :rowspan="2" :width="140" label="头像" align="center">
        <el-upload 
          class="avatar-uploader" 
          :action="getBaseURL() + '/upImage'" 
          :data="imageData"
          :show-file-list="false" 
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-descriptions-item>
      <el-descriptions-item label="用户名">{{ form.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ form.nickname }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ form.real_name }}</el-descriptions-item>
      <el-descriptions-item label="职务">{{ form.position }}</el-descriptions-item>
      <el-descriptions-item label="电话号码">{{ form.phone_number }}</el-descriptions-item>
      <el-descriptions-item label="电子邮箱">{{ form.email }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { updatePersonalInfo, changePassword, getPersonalInfo } from '@/utils/personalApi'
import { getBaseURL } from '@/utils/http'

// 响应式数据
const isInform = ref('default')
const isSubmit = ref(true)
const form = ref({
  username: '',
  avatar_url: getBaseURL() + '/image/',
  nickname: '',
  real_name: '',
  position: '',
  phone_number: '',
  email: ''
})
const passwordForm = ref({
  username: '',
  old: '',
  new: ''
})
const imageUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
const imageData = ref({ username: '', type: 'avatar' })

// 修改资料
const changeInform = () => {
  isInform.value = 'form'
}

// 修改密码
const changePass = () => {
  isInform.value = 'password'
}

// 提交资料修改
const onSubmit = async () => {
  isInform.value = 'default'
  isSubmit.value = false
  try {
    const response = await updatePersonalInfo(form.value)
    if (response.code === 200) {
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(response.msg || '修改失败')
    }
  } catch (error) {
    console.error('提交资料修改失败:', error)
    ElMessage.error('修改失败')
  } finally {
    isSubmit.value = true
  }
}

// 提交密码修改
const onSubmit1 = async () => {
  isInform.value = 'default'
  isSubmit.value = false
  try {
    const response = await changePassword(passwordForm.value)
    if (response.code === 200) {
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(response.msg || '修改失败')
    }
  } catch (error) {
    console.error('提交密码修改失败:', error)
    ElMessage.error('修改失败')
  } finally {
    isSubmit.value = true
  }
}

// 取消操作
const onCancel = () => {
  isInform.value = 'default'
}

// 头像上传前验证
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

// 头像上传成功处理
const handleAvatarSuccess = (response, file) => {
  imageUrl.value = URL.createObjectURL(file.raw)
}

// 初始化
onMounted(async () => {
  const username = localStorage.getItem('username')
  if (username) {
    form.value.username = username
    passwordForm.value.username = username
    imageData.value.username = username
    imageUrl.value = `${getBaseURL()}/image/${username}`
    
    try {
      const response = await getPersonalInfo(username)
      if (response.code === 200) {
        form.value = response.data
      } else {
        ElMessage.error(response.msg || '获取个人信息失败')
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取个人信息失败')
    }
  }
})
</script>

<style scoped>
.personal-center {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.header-actions {
  width: 100%;
  height: 5%;
  margin-top: 2%;
  margin-bottom: 2%;
  position: relative;
}

.form-container {
  width: 70%;
  position: absolute;
  top: 20%;
  left: 15%;
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
