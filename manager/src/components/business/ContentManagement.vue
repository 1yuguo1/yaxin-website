<template>
  <div class="content-management">
    <div class="header-actions">
      <el-button type="primary" @click="addContent">添加板块</el-button>
    </div>
    
    <div class="table-container">
      <el-table :data="serviceData" v-loading="isRequest">
        <el-table-column prop="article_id" label="id" width="120" />
        <el-table-column prop="title" label="板块名" width="120" />
        <el-table-column prop="publish_time" label="发布时间" width="120" />
        <el-table-column prop="update_time" label="更新时间" width="120" />
        <el-table-column prop="view_count" label="浏览量" width="120" />
        <el-table-column prop="like_count" label="点赞数" width="120" />
        <el-table-column prop="is_published" label="是否发布" width="120" />
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default="scope">
            <el-button 
              link 
              type="primary" 
              size="small" 
              @click="editContent(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              @click="deleteContent(scope.row)" 
              link 
              type="primary" 
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div class="pagination-container">
      <el-pagination
        @current-change="changePage" 
        background 
        layout="prev, pager, next" 
        :total="total"
        :page-size="size" 
        v-model:current-page="currentPage" 
      />
    </div>
    
    <!-- 添加/编辑表单 -->
    <ArticleForm 
      v-if="showForm" 
      @add="updateView" 
      :message="artType" 
      @cancel="cancelForm"
      class="form-overlay"
    />
    
    <UpdateForm 
      v-if="isUpdate" 
      @update="updateView" 
      :article_id="currentId" 
      :title="currentTitle"
      :content="currentContent" 
      @cancel="cancelUpdate" 
      class="form-overlay"
    />
    
    <!-- 遮罩层 -->
    <div 
      v-if="showForm || isUpdate" 
      class="overlay"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteArticle, getArticleData, getArticleTotal, getAllArticleData } from '@/utils/contentApi'
import ArticleForm from '../ArticleForm.vue'
import UpdateForm from '../UpdateForm.vue'

const props = defineProps({
  type: {
    type: String,
    default: '4-2'
  }
})

// 响应式数据
const serviceData = ref([])
const isRequest = ref(false)
const showForm = ref(false)
const isUpdate = ref(false)
const currentId = ref('')
const currentTitle = ref('')
const currentContent = ref('')
const total = ref(20)
const size = ref(8)
const currentPage = ref(1)

// 计算属性：根据类型确定文章类型
const artType = computed(() => {
  const typeMap = {
    '4-2': 2,
    '4-3': 3,
    '4-4': 4
  }
  return typeMap[props.type] || 2
})

// 添加内容
const addContent = () => {
  showForm.value = true
}

// 编辑内容
const editContent = (row) => {
  currentId.value = row.article_id
  currentTitle.value = row.title
  currentContent.value = row.content
  isUpdate.value = true
}

// 删除内容
const deleteContent = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个内容吗？', '确认删除', {
      type: 'warning'
    })
    
    const response = await deleteArticle(row.article_id)
    if (response.code === 200) {
      ElMessage.success('内容删除成功')
      updateView()
    } else {
      ElMessage.error(response.msg || '删除内容失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除内容失败:', error)
      ElMessage.error('删除内容失败')
    }
  }
}

// 分页处理
const changePage = async (page) => {
  try {
    const response = await getArticleData(artType.value, page)
    if (response.code === 200) {
      serviceData.value = response.data
    } else {
      ElMessage.error(response.msg || '分页加载失败')
    }
  } catch (error) {
    console.error('分页加载失败:', error)
    ElMessage.error('分页加载失败')
  }
}

// 更新视图
const updateView = async () => {
  isRequest.value = true
  try {
    const response = await getAllArticleData(artType.value)
    if (response.code === 200) {
      serviceData.value = response.data
    } else {
      ElMessage.error(response.msg || '获取数据失败')
    }
    
    const totalResponse = await getArticleTotal(artType.value)
    if (totalResponse.code === 200) {
      total.value = totalResponse.data
    } else {
      ElMessage.error(totalResponse.msg || '获取总数失败')
    }
  } catch (error) {
    console.error('更新视图失败:', error)
    ElMessage.error('更新视图失败')
  } finally {
    isRequest.value = false
  }
}

// 取消表单
const cancelForm = () => {
  showForm.value = false
}

// 取消更新
const cancelUpdate = () => {
  isUpdate.value = false
}

// 监听props变化，重新加载数据
watch(() => props.type, async (newType) => {
  if (newType) {
    await updateView()
  }
}, { immediate: true })

// 初始化
onMounted(async () => {
  await updateView()
})
</script>

<style scoped>
.content-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}

.header-actions {
  flex-shrink: 0;
  margin-bottom: 20px;
}

.table-container {
  flex: 1;
  overflow: auto;
  margin-bottom: 20px;
}

.pagination-container {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.form-overlay {
  position: absolute;
  top: 10%;
  left: 17.5%;
  z-index: 10000;
}

.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  z-index: 9995;
}
</style>
