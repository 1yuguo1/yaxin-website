<template>
  <div class="feedback-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>提交反馈</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        @submit.prevent="submitForm"
      >
        <el-form-item label="姓名" prop="user_name">
          <el-input
            v-model="form.user_name"
            placeholder="请输入您的姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="user_email">
          <el-input
            v-model="form.user_email"
            placeholder="请输入您的邮箱"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="反馈类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择反馈类型">
            <el-option label="咨询" value="consultation" />
            <el-option label="投诉" value="complaint" />
            <el-option label="建议" value="suggestion" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="反馈内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请详细描述您的问题或建议"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            提交反馈
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createFeedback, type CreateFeedbackForm } from '@/utils/feedbackApi'

// 表单引用
const formRef = ref()

// 提交状态
const submitting = ref(false)

// 表单数据
const form = reactive<CreateFeedbackForm>({
  user_id: undefined, // 如果有登录用户，可以从localStorage获取
  user_name: '',
  user_email: '',
  type: 'consultation',
  content: ''
})

// 表单验证规则
const rules = {
  user_name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  user_email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入反馈内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '反馈内容长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    // 如果有登录用户，设置user_id
    const currentUser = localStorage.getItem('username')
    if (currentUser) {
      // 这里可以根据实际情况获取用户ID
      // form.user_id = getCurrentUserId()
    }
    
    const response = await createFeedback(form)
    
    if (response.code === 200) {
      ElMessage.success('反馈提交成功！我们会尽快处理您的反馈。')
      resetForm()
    } else {
      ElMessage.error(response.msg || '反馈提交失败')
    }
  } catch (error) {
    console.error('提交反馈失败:', error)
    ElMessage.error('提交反馈失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  
  formRef.value.resetFields()
  Object.assign(form, {
    user_id: undefined,
    user_name: '',
    user_email: '',
    type: 'consultation',
    content: ''
  })
}
</script>

<style scoped>
.feedback-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 18px;
  font-weight: bold;
}
</style>
