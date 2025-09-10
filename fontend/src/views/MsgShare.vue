<template>
    <div class="all">
        <SearchComp @close="onClose" v-if="search_type == 1" style="z-index: 9999;position: fixed;top: 0;left: 0;"></SearchComp>
        <NavComp @search="onSearch" :isFixed="isFixed_" :isColored="isColored_" :icon_num="icon_num_"
            :isLogin="isLogin_" :name="name_"></NavComp>
        <div class="content">
            <div class="top-img">
                <img src="@/assets/share.jpg" width="100%" height="100%" >
            </div>
            <div class="top-mobile-img">
                <img src="@/assets/case-banner.png" width="100%" height="100%" >
            </div>
            <div class="new-list">
            <div @click="goArticle(index)" class="card" v-for="(item,index) in textData" :key="index">
                <div class="title">{{ item.title }}</div>
                <div class="con" v-html="item.content.slice(0,20)"></div>
            </div>
        </div>
        <div style="width: 100%;display: flex;justify-content: center;height: 6vh;align-items: center;">
            <el-pagination @current-change="change_page" background layout="prev, pager, next" :total="total" />
        </div>
        </div>
    </div>
</template>
<script setup>
import { getArtTotal, getMainNews } from '@/api/login';
import { useUserStore } from '@/store';
import NavComp from '@/components/NavComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import { defineComponent, ref, onMounted } from 'vue';
import router from '@/router';
import { useDevice } from '@/composables/useDevice';
defineComponent({
    components: { NavComp, SearchComp }
})
let isFixed_ = ref(true)
let isColored_ = ref(true)
let icon_num_ = ref(true)
let isLogin_ = ref(false)
let name_ = ref('')
let search_type = ref(0)
let textData = ref([])
let total = ref(1)
const {isMobile} = useDevice()
const onSearch = () => {
    search_type.value = 1;
}
const onClose = () => {
    search_type.value = 0;
}

// 使用Pinia store
const userStore = useUserStore()

onMounted(async () => {
    // 如果用户已登录，使用store中的用户信息，否则初始化认证状态
    if (!userStore.isAuthenticated) {
        await userStore.initializeAuth()
    }
    
    total.value = await getArtTotal(4)
    textData.value = await getMainNews(4,1)
    localStorage.setItem('a3',JSON.stringify(textData.value))
})

const change_page = async(index_) => {
    textData.value = await getMainNews(4,index_)
}

const goArticle = (index_) => {
    router.push({'name':'detail','query':{'category_id':3,'index':index_}})
}
</script>

<style scoped>
    .all{
        width: 100vw;
        height: 100vh;
        overflow-y: scroll;
        position: relative;
    }

    .content{
        width: 100%;
        height: 150vh;
        position: absolute;
        top: 10vh;
    }

    @media (min-width: 1024px) {
    .top-img {
        width: 100%;
        height: 45vh;
    }

    .top-mobile-img {
        display: none;
    }

    .new-list {
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: space-between;
        margin-top: 6vh;
        margin-left: 5%;
        margin-right: 5%;
    }

    .card {
        width: 25%;
        height: 20vh;
        padding: 20px 18px 35px 18px;
        border-bottom: 2px solid #a0a0a0;
        cursor: grab;
    }

    .title{
        font-size: 24px;
        line-height: 30px;
        height: 25%;
    }

    .con{
        font-size: 16px;
        line-height: 30px;
        margin-top: 6%;
    }
}
@media (max-width: 1023px) {
    .top-img {
        display: none;
    }
    .top-mobile-img {
        width: 100%;
        height: auto;
    }
    .new-list {
        width: 90%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        margin-left: 5%;
        margin-right: 5%;
    }
    .top-mobile-img img {
        object-fit: cover;
    }

    .card {
        width: 80%;
        height: 20vh;
        padding: 20px 18px 35px 18px;
        border-bottom: 2px solid #a0a0a0;
        cursor: grab;
    }
}
</style>