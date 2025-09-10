<template>
  <div class="article-editor">
    <div class="header-actions">
      <el-select 
        v-model="articleValue" 
        placeholder="请选择文章栏目" 
        style="width: 240px;margin-left: 4%"
      >
        <el-option 
          v-for="item in options" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value" 
        />
      </el-select>
      
      <el-button 
        type="primary"
        style="position: absolute;right: 4%;top: 1%;" 
        @click="submitArticle"
      >
        提交文章
      </el-button>
    </div>
    
    <div v-loading="isArticle" class="editor-container">
      <div class="title-input">
        <span>标题：</span>
        <el-input 
          style="width: 90%;" 
          type="text" 
          v-model="title" 
        />
      </div>
      
      <Toolbar 
        style="border-bottom: 1px solid #ccc" 
        :editor="editorRef" 
        :defaultConfig="toolbarConfig"
        :mode="mode" 
      />
      
      <Editor 
        style="height: 80%; overflow-y: hidden" 
        v-model="content" 
        :defaultConfig="editorConfig"
        :mode="mode" 
        @onCreated="handleCreated" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import "@wangeditor/editor/dist/css/style.css"
import { createArticle } from '@/utils/articleApi'
import { ElMessage } from 'element-plus'

// 响应式数据
const title = ref('')
const content = ref('')
const articleValue = ref('')
const isArticle = ref(false)
const editorRef = shallowRef()
const mode = "default"

// 文章栏目选项
const options = ref([
  { value: 'a1', label: '动态1' },
  { value: 'a2', label: '动态2' },
  { value: 'a3', label: '动态3' },
  { value: 'a4', label: '动态4' },
  { value: 'a5', label: '动态5' }
])

// 编辑器工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    "headerSelect",
    "bold",
    "italic",
    "underline",
    "justifyCenter",
    "justifyJustify",
    "justifyLeft",
    "justifyRight",
    "bulletedList",
    "numberedList",
    "color",
    "insertLink",
    "fontSize",
    "lineHeight",
    "indent",
    "delIndent",
    "divider",
    "insertTable",
    "undo",
    "redo",
    "clearStyle",
    "fullScreen",
    "blockquote",
    "codeBlock",
    "insertImage",
    "insertVideo"
  ]
}

// 编辑器配置
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      server: "https://your-upload-server.com/upload",
      fieldName: "file"
    }
  }
}

// 编辑器创建完成
const handleCreated = (editor) => {
  editorRef.value = editor
}

// 提交文章
const submitArticle = async () => {
  if (articleValue.value === '' || title.value === '' || content.value === '') {
    ElMessage.warning('请完成表单内容')
    return
  }
  
  isArticle.value = true
  const data = {
    title: title.value,
    content: content.value,
    author: '玉溪亚信税务师事务所',
    category_id: 1,
    tags: articleValue.value
  }
  
  try {
    const response = await createArticle(data)
    if (response.code === 200) {
      ElMessage.success('文章提交成功')
      title.value = ''
      content.value = ''
      articleValue.value = ''
    } else {
      ElMessage.error(response.msg || '文章提交失败')
    }
  } catch (error) {
    console.error('提交文章失败:', error)
    ElMessage.error('文章提交失败')
  } finally {
    isArticle.value = false
  }
}
</script>

<style scoped>
.article-editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.header-actions {
  width: 100%;
  height: 5%;
  position: relative;
}

.editor-container {
  border: 1px solid #ccc;
  min-width: 365px;
  max-width: 100%;
  height: 95%;
}

.title-input {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-input > div {
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
