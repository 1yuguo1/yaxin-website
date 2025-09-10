<template>
    <div v-if="isMobile == false" class="all">
        <SearchComp @close="onClose" v-if="search_type == 1" style="z-index: 9999;position: fixed;top: 0;left: 0;">
        </SearchComp>
        <NavComp @search="onSearch" :isFixed="isFixed_" :isColored="isColored_" :icon_num="icon_num_"
            :isLogin="isLogin_" :name="name_"></NavComp>
        <div class="top-img">
            <img width="100%" height="auto" src="@/assets/service.png">
        </div>
        <div class="content">
            <div class="left-panel">
                <el-menu @select="change" default-active="0" class="el-menu-vertical-demo" background-color="#545c64"
                    active-text-color="#ffd04b" text-color="#fff">
                    <el-menu-item v-for="(item,index) in serviceData" :key="index" :index="String(index)">
                        <el-icon>
                            <document />
                        </el-icon>
                        <span>{{ item.title }}</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="right-panel" v-html="current_content">
                
            </div>
        </div>
    </div>
    <div v-if="isMobile == true" class="mobile-all">
        <NavComp :isFixed="isFixed" :isColored="isColored" :icon_num="iconNum"></NavComp>
        <div class="banner-nav"></div>
        <img src="@/assets/service-banner.png" width="100%" height="auto">
        <div class="service-list">
            <Tab v-model="activeTab">
                <TabItem class="service-item" v-for="(item,index) in serviceData" :key="index" :title="item.title">
                    <div v-html="item.content"></div>
                </TabItem>
            </Tab>
        </div>
    </div>
</template>
<script setup>
import { getMainNews } from '@/api/login';
import { useUserStore } from '@/store';
import NavComp from '@/components/NavComp.vue';
import SearchComp from '@/components/SearchComp.vue';
import { defineComponent, ref, onMounted, defineAsyncComponent } from 'vue';
import { useDevice } from '@/composables/useDevice';
import { useScroll } from '@/composables/useScroll';
import 'vant/es/tabs/style';
import 'vant/es/tab/style';
defineComponent({
    components: { NavComp, SearchComp }
})
let isFixed_ = ref(true)
let isColored_ = ref(true)
let icon_num_ = ref(true)
let isLogin_ = ref(false)
let name_ = ref('')
let search_type = ref(0)
let serviceData = ref([])
let current_content = ref('')
let activeTab = ref(0)
// 使用Pinia store
const userStore = useUserStore()

onMounted(async () => {
    // 如果用户已登录，使用store中的用户信息，否则初始化认证状态
    if (!userStore.isAuthenticated) {
        await userStore.initializeAuth()
    }
    
    serviceData.value = await getMainNews(2,1)
    current_content.value = serviceData.value[0].content
})
const {isMobile} = useDevice()
const Tab = defineAsyncComponent(() => import('vant/es/tabs'));
const TabItem = defineAsyncComponent(() => import('vant/es/tab'));
const { isFixed, isColored, iconNum } = useScroll();
const onSearch = () => {
    search_type.value = 1;
}
const onClose = () => {
    search_type.value = 0;
}

const change = (index_) => {
    console.log(index_)
    current_content.value = serviceData.value[index_].content
}
</script>
<style scoped>
.all {
    width: 100vw;
    height: 100vh;
    background-color: rgb(221.7, 222.6, 224.4);
    overflow-y: scroll;
}

.top-img {
    width: 100%;
    height: 400px;
    background-color: rgb(221.7, 222.6, 224.4);
}

.content {
    width: 100%;
    height: 90vh;
    padding-left: 10vw;
    padding-right: 10vw;
    margin-top: 50px;
    overflow: hidden;
    background-color: rgb(221.7, 222.6, 224.4);
}

.left-panel {
    display: inline-block;
    width: 15vw;
    height: 90vh;
    overflow-y: scroll;
    background-color: #545c64
}

.right-panel {
    display: inline-block;
    width: 60vw;
    height: 89vh;
    background: #fff;
    border-radius: 2px 2px 0 0;
    overflow-y: scroll;
    font-size: 16px;
    line-height: 1.6;
    white-space: pre-wrap;
    padding: 1vh 1vw 0 1vw;
}
.banner-nav {
    width: 100%;
    height: 10vh;
    background-color: #0b3663;
}
.service-list {
    width: 100%;
    min-height: 250px;
    background-color: #fff;
    overflow-y: scroll;
}
.service-item {
    height: 100vh;
    overflow-y: scroll;
    padding: 0 10px 0 10px;
}
</style>