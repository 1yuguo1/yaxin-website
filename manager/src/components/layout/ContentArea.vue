<template>
  <div class="content-area">
    <!-- 报告生成模块 -->
    <ReportGenerator v-if="roletype === '1-1'" />
    
    <!-- 权限管理模块 -->
    <UserManagement v-else-if="roletype === '2'" />
    
    <!-- 个人中心模块 -->
    <PersonalCenter v-else-if="roletype === '3'" />
    
    <!-- 文章编辑模块 -->
    <ArticleEditor v-else-if="roletype === '4-1'" />
    
    <!-- 内容管理模块 -->
    <ContentManagement 
      v-else-if="['4-2', '4-3', '4-4'].includes(roletype)" 
      :type="roletype" 
      :key="roletype"
    />
    
    <!-- 团队管理模块 -->
    <TeamManagement v-else-if="roletype === '4-5'" />
    
    <!-- 反馈管理模块 -->
    <FeedbackManagement v-else-if="roletype === '5'" />
  </div>
</template>

<script setup>
import { inject, defineProps } from 'vue'
import ReportGenerator from '../business/ReportGenerator.vue'
import UserManagement from '../business/UserManagement.vue'
import PersonalCenter from '../business/PersonalCenter.vue'
import ArticleEditor from '../business/ArticleEditor.vue'
import ContentManagement from '../business/ContentManagement.vue'
import TeamManagement from '../business/TeamManagement.vue'
import FeedbackManagement from '../business/FeedbackManagement.vue'

const roletype = inject('roletype')

defineProps({
  type: {
    type: String,
    default: '4-2'
  }
})
</script>

<style scoped>
.content-area {
  width: 100%;
  height: 90%;
  position: relative;
  overflow: hidden;
}
</style>
