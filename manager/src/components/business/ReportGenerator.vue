<template>
  <div class="report-generator">
    <div class="left-area">
      <!-- 第一个文件上传 -->
      <el-upload 
        :data="uploadData" 
        class="upload-demo" 
        drag 
        :action="getBaseURL() + '/filea'"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          从此处删除文件或 <em>点击上传纳税审核汇总表</em>
        </div>
      </el-upload>
      
      <!-- 第一个表格 -->
      <el-table :data="tableData" style="width: 100%" v-show="showtype0">
        <el-table-column width="100" prop="序号" label="序号" />
        <el-table-column width="100" prop="税种" label="税种" />
        <el-table-column width="100" prop="计税金额" label="计税金额" />
        <el-table-column width="100" prop="税率" label="税率" />
        <el-table-column width="100" prop="应纳税额" label="应纳税额" />
        <el-table-column width="100" prop="优惠税额" label="优惠税额" />
        <el-table-column width="100" prop="已纳税额" label="已纳税额" />
        <el-table-column width="100" prop="应补税额" label="应补税额" />
        <el-table-column width="100" prop="应退税额" label="应退税额" />
        <el-table-column width="100" prop="备注" label="备注" />
      </el-table>
      
      <div class="button-container">
        <el-button @click="getData(1)" type="primary" size="small">预览表格</el-button>
      </div>
      
      <!-- 第二个文件上传 -->
      <el-upload 
        :data="uploadData" 
        class="upload-demo" 
        drag 
        :action="getBaseURL() + '/fileb'"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          从此处删除文件或 <em>点击上传企业所得税年度纳税审核表</em>
        </div>
      </el-upload>
      
      <!-- 第二个表格 -->
      <el-table :data="tableData1" style="width: 100%" v-show="showtype1">
        <el-table-column width="200" prop="账载金额" label="账载金额" />
        <el-table-column width="200" prop="审核调整额" label="审核调整额" />
        <el-table-column width="200" prop="审核确认金额" label="审核确认金额" />
        <el-table-column width="200" prop="备注" label="备注" />
      </el-table>
      
      <div class="button-container">
        <el-button @click="getreport">生成报告</el-button>
      </div>
    </div>

    <div class="right-area">
      <div v-if="showreport === 'default'" class="init-panel">
        请先上传表格并生成报告
      </div>
      
      <div v-loading="loading" style="width: 100%; height: 100%;position: absolute;top: 0;"></div>
      
      <div v-if="showreport === 'error'" class="error-panel">
        <el-result 
          icon="error" 
          title="生成报告失败" 
          sub-title="请确定表格格式正确及网络连接正常"
        ></el-result>
      </div>
      
      <div v-if="showreport === 'report'" class="report-panel">
        <div class="download-btn">
          <el-button @click="download" type="primary">下载报告</el-button>
        </div>
        <div class="report-content">
          <vue-office-docx 
            :src="docxSrc" 
            @rendered="renderedHandler" 
            @error="errorHandler" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import VueOfficeDocx from "@vue-office/docx"
import { ElMessage } from 'element-plus'
import http from '@/utils/http'
import { getBaseURL } from '@/utils/http'
import { getViewData, generateReport, downloadReport } from '@/utils/reportApi'

// 响应式数据
const showtype0 = ref(false)
const showtype1 = ref(false)
const tableData = ref([])
const tableData1 = ref([])
const loading = ref(false)
const showreport = ref('default')
const uploadData = ref({ username: '' })
const docxSrc = ref(getBaseURL() + '/reportfile/')

// 获取数据
const getData = (enum_) => {
  const username_ = localStorage.getItem('username')
  if (enum_ == 1) {
    showtype0.value = true
    showtype1.value = false
    nextTick(() => {
      http.get(`/viewdata/${username_}/1`).then((res) => {
        tableData.value = res.data.data
      })
    })
  } else if (enum_ == 2) {
    showtype1.value = true
    showtype0.value = false
    nextTick(() => {
      http.get(`/viewdata/${username_}/2`).then((res) => {
        tableData1.value = res.data.data
      })
    })
  }
}

// 生成报告
const getreport = async () => {
  const username_ = localStorage.getItem('username')
  loading.value = true
  try {
    const response = await generateReport(username_)
    if (response.code === 200) {
      showreport.value = 'report'
      ElMessage.success('生成成功')
    } else {
      showreport.value = 'error'
      ElMessage.error(response.msg || '生成失败')
    }
  } catch (error) {
    console.error('生成报告失败:', error)
    showreport.value = 'error'
    ElMessage.error('生成失败')
  } finally {
    loading.value = false
  }
}

// 下载报告
const download = async () => {
  const username_ = localStorage.getItem('username')
  try {
    const blob = await downloadReport(username_)
    const link = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', 'output.docx')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('下载成功')
  } catch (error) {
    console.error('下载报告失败:', error)
    ElMessage.error('下载失败')
  }
}

// 文档渲染处理
const renderedHandler = () => {
  console.log('文档渲染完成')
}

const errorHandler = (error) => {
  console.error('文档渲染错误:', error)
}

// 初始化
onMounted(() => {
  const username_ = localStorage.getItem('username')
  if (username_) {
    uploadData.value.username = username_
    docxSrc.value += username_
  }
})
</script>

<style scoped>
.report-generator {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.left-area {
  width: 47%;
  height: 92%;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: scroll;
}

.right-area {
  width: 47%;
  height: 92%;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.button-container {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.init-panel {
  width: 38%;
  height: 12%;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: beige;
  margin-left: 31%;
  margin-top: 44%;
}

.error-panel {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.report-panel {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.download-btn {
  width: 100%;
  height: 5%;
  position: absolute;
  top: 0;
}

.report-content {
  width: 100%;
  height: 95%;
  position: absolute;
  top: 5%;
  overflow: scroll;
}
</style>
