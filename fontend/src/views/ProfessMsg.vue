<template>
    <div class="all">
        <SearchComp @close="onClose" v-if="search_type == 1 && isMobile == false"
            style="z-index: 9999;position: fixed;top: 0;left: 0;"></SearchComp>
        <NavComp id="nav" @search="onSearch" :isFixed="isFixed" :isColored="isColored" :icon_num="icon_num" :isLogin="isLogin_"
            :name="name_"></NavComp>
        <div class="content">
            <div class="left-panel">
                <div @click="goArticle(index)" class="news" v-for="(item, index) in newData" :key="index">
                    <div class="new-head">
                        <h3>{{ item.title }}</h3>
                    </div>
                    <div class="new-content">
                        <p v-html="item.content.slice(0, 20)"></p>
                    </div>
                    <div class="new-footer">
                        <p style="font-size: 14px;line-height: 20px;color: #777;">{{ item.update_time }}</p>
                    </div>
                </div>
            </div>
            <div v-if="isMobile == false" class="right-panel">
                <div class="hot">
                    <h3 class="hot-title">热点资讯</h3>
                    <ul style="background-color: #f9f9f9;padding: 0 !important;margin: 0 !important;">
                        <li @click="goHot(index)" class="hot-item" v-for="(item, index) in hotData" :key="index">
                            <span class="num">{{ index + 1 }}</span>
                            <span class="hot-text">{{ item.title }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div style="width: 100%;display: flex;justify-content: center;height: 6vh;align-items: center;">
            <el-pagination @current-change="change_page" background layout="prev, pager, next" :total="total" />
        </div>
    </div>
</template>
<script setup>
import { getArtTotal, getHot, getMainNews } from '@/api/login';
import { useUserStore } from '@/store';
import NavComp from '@/components/NavComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import router from '@/router';
import { defineComponent, ref, onMounted } from 'vue';
import { useDevice } from '@/composables/useDevice';
import { useScroll } from '@/composables/useScroll';
defineComponent({
    components: { NavComp, SearchComp }
})
const { isMobile } = useDevice()
let isFixed = ref(true)
let isColored = ref(true)
let iconNum = ref(true)
let icon_num = iconNum; // 创建别名以匹配组件期望的prop名称
let isLogin_ = ref(false)
let name_ = ref('')
let search_type = ref(0)
let hotData = ref({})
let newData = ref([])
let total = ref(1)
// 使用Pinia store
const userStore = useUserStore()

onMounted(async () => {
    // 如果用户已登录，使用store中的用户信息，否则初始化认证状态
    if (!userStore.isAuthenticated) {
        await userStore.initializeAuth()
    }
    
    total.value = await getArtTotal(3)
    newData.value = await getMainNews(3, 1)
    localStorage.setItem('a2', JSON.stringify(newData.value))
    hotData.value = await getHot()
    localStorage.setItem('hot', JSON.stringify(hotData.value))
})
const onSearch = () => {
    search_type.value = 1;
}
const onClose = () => {
    search_type.value = 0;
}

const goArticle = (index_) => {
    router.push({ 'name': 'detail', 'query': { 'category_id': 2, 'index': index_ } })
}

const goHot = (index_) => {
    router.push({ 'name': 'detail', 'query': { 'category_id': -1, 'index': index_ } })
}

const change_page = async (index_) => {
    newData.value = await getMainNews(3, index_)
}
</script>
<style scoped>
.all {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
}

/* ========== 大桌面端 (1200px+) ========== */
@media (min-width: 1200px) {
    .content {
        overflow: hidden;
        background: #f0f0f0;
        border: 1px solid #ccc;
        width: 70vw;
        min-height: 150vh;
        margin-top: 15vh;
        margin-left: auto;
        margin-right: auto;
        display: flex;
    }
    
    .left-panel {
        border-right: 1px solid #ccc;
        background: #fff;
        border-top: 0;
        width: 72%;
        min-height: 90vh;
        overflow: hidden;
    }
    
    .right-panel {
        width: 28%;
        background: #f0f0f0;
        display: flex;
        justify-content: center;
    }
    
    .news {
        border-bottom: 1px dashed #ccc;
        padding: 0 20px;
        font-size: 18px;
        height: auto;
        cursor: grab;
    }
    
    .new-head {
        padding: 5px 0;
    }
    
    .new-head h3 {
        font-size: 14px;
        line-height: 24px;
    }
    
    .new-content p {
        font-size: 14px;
        line-height: 20px;
        color: #777;
    }
    
    .new-footer p {
        font-size: 14px;
        line-height: 20px;
        color: #777;
    }
    
    .hot {
        border: 1px solid #dfdfdf;
        background-color: #f9f9f9;
        width: 85%;
        height: 50vh;
        display: inline-block;
        margin-top: 2vh;
    }
    
    .hot-title {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 700;
        padding-left: 15px;
        background-color: #ececec;
        margin: 0 !important;
    }
    
    .hot-item {
        height: 5vh;
        line-height: 32px;
        font-size: 13px;
        border-top: 1px solid #dcdcdc;
        padding: 2px 14px 2px 6px;
        display: flex;
        align-items: center;
        cursor: grab;
    }
    
    .num {
        font: 12px/18px georgia;
        width: 44px;
        text-align: center;
    }
    
    .hot-text {
        color: #000;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

/* ========== 平板端 (768px - 1199px) ========== */
@media (min-width: 768px) and (max-width: 1199px) {
    #nav {
        color: black !important;
    }
    .content {
        width: 85vw;
        min-height: 150vh;
        margin-top: 15vh;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
    
    .left-panel {
        width: 65%;
        background: #fff;
        border-right: 1px solid #ccc;
        min-height: 90vh;
        overflow: hidden;
    }
    
    .right-panel {
        width: 35%;
        background: #f0f0f0;
        display: flex;
        justify-content: center;
    }
    
    .news {
        border-bottom: 1px dashed #ccc;
        padding: 0 16px;
        font-size: 16px;
        height: auto;
        cursor: grab;
    }
    
    .new-head h3 {
        font-size: 13px;
        line-height: 22px;
    }
    
    .new-content p {
        font-size: 13px;
        line-height: 18px;
        color: #777;
    }
    
    .new-footer p {
        font-size: 12px;
        line-height: 18px;
        color: #777;
    }
    
    .hot {
        width: 90%;
        height: 45vh;
        margin-top: 2vh;
    }
    
    .hot-title {
        height: 36px;
        line-height: 36px;
        font-size: 15px;
    }
    
    .hot-item {
        height: 4.5vh;
        line-height: 28px;
        font-size: 12px;
    }
    
    .num {
        width: 40px;
        font-size: 11px;
    }
}

/* ========== 移动端 (≤767px) ========== */
@media (max-width: 767px) {
    #nav {
        color: black !important;
    }
    .content {
        width: 95vw;
        min-height: auto;
        margin-top: 15vh;
        margin-left: auto;
        margin-right: auto;
        display: block; /* 改为垂直堆叠 */
        background: transparent;
        border: none;
    }
    
    .left-panel {
        width: 100%;
        background: #fff;
        border: none;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .right-panel {
        width: 100%;
        background: transparent;
        display: block;
    }
    
    .news {
        border-bottom: 1px solid #f0f0f0;
        padding: 16px;
        font-size: 16px;
        height: auto;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .news:last-child {
        border-bottom: none;
    }
    
    .news:active {
        background-color: #f8f9fa;
    }
    
    .new-head h3 {
        font-size: 15px;
        line-height: 22px;
        margin-bottom: 8px;
    }
    
    .new-content p {
        font-size: 13px;
        line-height: 18px;
        color: #666;
        margin-bottom: 12px;
    }
    
    .new-footer p {
        font-size: 12px;
        line-height: 16px;
        color: #999;
        text-align: right;
    }
    
    .hot {
        width: 100%;
        height: auto;
        margin-top: 0;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background: #fff;
    }
    
    .hot-title {
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        border-radius: 12px 12px 0 0;
    }
    
    .hot-item {
        height: auto;
        min-height: 44px; /* 触摸友好 */
        line-height: 20px;
        font-size: 13px;
        padding: 12px 16px;
    }
    
    .num {
        width: 28px;
        height: 28px;
        background: #ff6b6b;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-right: 12px;
        flex-shrink: 0;
    }
    
    .hot-text {
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal;
    }
}

/* ========== 超小屏幕优化 (≤375px) ========== */
@media (max-width: 375px) {
    .content {
        width: 98vw;
        padding: 0 8px;
    }
    
    .news {
        padding: 14px;
    }
    
    .new-head h3 {
        font-size: 14px;
    }
    
    .hot {
        padding: 0;
    }
    
    .hot-item {
        padding: 10px 12px;
    }
}

/* ========== 横屏模式优化 ========== */
@media (max-width: 767px) and (orientation: landscape) {
    .content {
        margin-top: 12vh;
    }
    
    .left-panel {
        margin-bottom: 16px;
    }
    
    .news {
        padding: 12px 16px;
    }
    
    .hot-item {
        min-height: 40px;
        padding: 10px 16px;
    }
}
</style>