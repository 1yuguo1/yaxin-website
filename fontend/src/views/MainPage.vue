<template>
    <div class="all">
        <SearchComp @close="onClose" v-if="search_type==1 && isMobile == false" style="z-index: 9999;position: fixed;top: 0;left: 0;"></SearchComp>
        <NavComp @search="onSearch" :isFixed="isFixed" :isColored="isColored" :icon_num="iconNum" :isLogin="isLogin_" :name="name_"></NavComp>
        <div v-if="isMobile == false" class="nav-image">
            <div class="image-text">
                <p style="margin-bottom: 10px;">精准税务筹划为企业创造</p>
                <p style="margin-top: 10px;text-indent: 3ch;">&nbsp;更大的价值</p>
                <div class="nav-more">了解更多</div>
            </div>
            <div style="width: 70vw;height: 1px;position: absolute;left: 15vw;bottom: 12vh;background-color: white;">
            </div>
            <div style="position: absolute;bottom: 6vh;font-weight: bold;left: 15vw;font-size: 28px;color: white;">最新动态
            </div>
        </div>
        <div v-if="isMobile == true" class="nav-image-mobile">
            <div class="image-nav-mobile"></div>
            <img width="100%" height="auto" src="@/assets/mobile-banner.png">
        </div>
        <div class="news">
            <NewsCard v-for="(news,index) in newsData" :key="news.id" :title="news.title" :content="news.content" :time="news.update_time" :image="news.image" :index="index" variant="primary" size="large"></NewsCard>
        </div>
        <BottomNav></BottomNav>
    </div>
</template>
<script setup>
import NavComp from '@/components/NavComp.vue'
import BottomNav from '@/components/BottomNav.vue';
import SearchComp from '@/components/SearchComp.vue';
import NewsCard from '@/components/NewsCard.vue';
import { defineComponent } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getLoginMsg } from '@/api/login';
import { getMainNews } from '@/api/login';
import router from '@/router';
import { useDevice } from '@/composables/useDevice';
import { useScroll } from '@/composables/useScroll';
import { useUserStore } from '@/store';
defineComponent({
    components: { NavComp,BottomNav,SearchComp }
})
let search_type = ref(0)
let isLogin_ = ref(false)
let name_ = ref('')
let newsData = ref([{'update_time':'2028.1.4','title':'税改新政解读与应对策略','content':'深入剖析最新税法修订要点，助力企业精准筹划税务布局'},{'update_time':'2028.1.4','title':'税务稽查案例分析与风险防范','content':'剖析典型税务稽查案例，提炼关键风险点，为企业筑牢税务合规防线'},{'update_time':'2028.1.4','title':'税收优惠政策精准匹配与申报指南','content':'全面梳理行业税收优惠政策，提供详细申报流程，助力企业尽享政策红利'},{'update_time':'2028.1.4','title':'国际税收动态与跨境税务筹划','content':'聚焦全球税收动态，解读跨境税务规则变化，为企业"走出去"保驾护航'},{'update_time':'2028.1.4','title':'税务数字化转型实践与创新','content':'探索税务数字化转型路径，分享前沿技术应用案例，推动企业税务管理升级'}])

// 用户状态管理
const userStore = useUserStore()

const { isMobile } = useDevice()
const { isFixed, isColored, iconNum } = useScroll();
onMounted(async() => {
    try {
        // 初始化用户认证状态
        await userStore.initializeAuth()
        
        // 更新本地状态以保持兼容性
        isLogin_.value = userStore.isAuthenticated
        name_.value = userStore.displayName
        
        // 获取新闻数据
        const newsResult = await getMainNews(1,1)
        newsData.value = newsResult
        localStorage.setItem('a1',JSON.stringify(newsData.value))
    } catch (error) {
        // 使用默认数据，确保页面正常显示
    }
})

// 旧的 getLoginMsg_ 函数已被 store 的 initializeAuth 替代

const onSearch = ()=>{
    search_type.value = 1;
}
const onClose = ()=> {
    search_type.value = 0;
}

const extractTextFromHTML = (htmlString)=>{
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
}

const goArticle = (index_) => {
    router.push({'name':'detail','query':{'category_id':1,'index':index_}})
}

</script>
<style scoped>
@font-face {
  font-family: 'TencentSans W7'; /* 自定义字体名称 */
  src: url('@/assets/font/腾讯体 W7.ttf') format('truetype'); /* 多种格式以确保兼容性 */
  font-weight: normal; /* 字体粗细 */
  font-style: normal; /* 字体样式 */
}
.nav-image-mobile {
    width: 100%;
}
.image-nav-mobile {
    width: 100%;
    height: 10vh;
    background-image: url('@/assets/banner-top.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
.nav-image-mobile img {
    object-fit: contain;
}

.all {
    width: 100%;
    height: 300vh;
    /* overflow-y: scroll; */
    position: relative;
    overflow-x: hidden;
}

.nav-image {
    z-index: 1;
    width: 100%;
    height: 78vh;
    position: absolute;
    top: 0;
    background-image: url('@/assets/bck0.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
}

.image-text {
    margin-left: 8vw;
    color: white;
    font-size: 50px;
    font-family: 微软雅黑;
}

.nav-more {
    width: 140px;
    height: 45px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    background-color: white;
    border-radius: 8px;
    margin-left: 10vw;
}

@media (max-width: 1024px) {
    .news {
        width: 96%;
        height: auto;
        padding:0 2% 0 2%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        z-index: 999;
    }
}

@media (min-width: 1024px) {
.news {
    width: 70%;
    height: 150vh;
    position: absolute;
    left: 15vw;
    top: 74vh;
    display: flex;
    justify-content: space-between;
    align-self: start;
    flex-wrap: wrap;
    z-index: 999;
}
}

</style>