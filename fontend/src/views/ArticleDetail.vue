<template>
  <div class="article-back-btn" @click="router.back()"><el-icon>
      <ArrowLeftBold />
    </el-icon>返回</div>
  <div class="article-container">
    <!-- 文章头部信息 -->
    <div class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="author">作者：{{ article.author }}</span>
        <span class="publish-time">发布时间：{{ formatTime(article.update_time) }}</span>
        <span class="views">浏览量：{{ article.view_count }}</span>
        <span class="comments-count">评论数：{{ article.comment_count || 0 }}</span>
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="article-content" v-html="article.content"></div>

    <!-- 评论区域 -->
    <CommentSection 
      v-if="article.article_id" 
      :article-id="article.article_id" 
    />
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, onBeforeMount, computed } from "vue";
import { useRoute } from "vue-router";
import CommentSection from "@/components/CommentSection.vue";

const route = useRoute()
let article = ref({})
const articleData = computed(() => {
  const { category_id, index } = route.query;
  const categoryMap = {
    '1': 'a1',
    '2': 'a2',
    '3': 'a3',
    '-1': 'hot',
    '-2': 'search'
  };

  const storageKey = categoryMap[category_id];
  if (!storageKey || index === undefined) return null;

  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data)[index] : null;
  } catch (error) {
    console.error('数据获取失败:', error);
    return null;
  }
});

onBeforeMount(() => {
  getData()
})

const formatTime = (time) => {
  const res = String(time).slice(0, 10)
  return res
}

const getData = () => {
  const data = articleData.value;
  if (data) {
    article.value = data;
  } else {
    // 处理数据获取失败的情况
    console.error('文章数据获取失败');
    // 可以跳转到错误页面或显示错误提示
  }
};
</script>

<style scoped>

@media (min-width: 1024px) {
  .article-back-btn {
  margin-left: 17%;
  margin-top: 1%;
  display: flex;
  align-items: center;
  cursor: grab;
}
.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.article-header {
  margin-bottom: 20px;
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.article-meta {
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: center;
}

.article-meta span {
  margin-right: 15px;
}

.comments-count {
  color: #409eff;
  font-weight: 500;
}

.article-content {
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
}
}
@media (max-width: 1023px) {
  .article-back-btn {
  margin-left: 5%;
  margin-top: 1%;
  display: flex;
  align-items: center;
  cursor: grab;
}
  .article-container {
  width: 90vw;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.article-header {
  margin-bottom: 20px;
}

.article-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.article-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.article-meta span {
  margin-right: 15px;
  margin-bottom: 5px;
}

.comments-count {
  color: #409eff;
  font-weight: 500;
}

.article-content {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

}
</style>