<template>
    <div class="all">
        <div class="search">
            <div style="margin-left: 13vw;display: flex;align-items: center;"><img src="@/assets/icon1.png"></div>
            <div style="margin-left: 10vw;width: 70vw;font-size: 26px;display: flex;align-items: center;"><el-input
                    @input="debouncedSearch" v-model="keyword" style="width: 50vw;margin-right: 5vw;" size="large"
                    placeholder="请输入内容" :prefix-icon="Search" />
                <el-icon @click="onClose" class="close">
                    <Close />
                </el-icon>
            </div>
        </div>
        <div v-loading="isSearch" class="search-board">
            <ul style="width: 100%;height: 100%;list-style-type: none;padding: 0 !important;margin: 0 !important;">
                <li :class="searchItem" @mouseover="searchItem = 'searchItem2'" @mouseout="searchItem = 'searchItem1'" @click="goArticle(index)" v-for="(item, index) in searchData" :key="index">{{ item.title }}</li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
.all {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2) !important;
    overflow: hidden;
    position: relative;
}

.search {
    width: 100%;
    height: 10vh;
    background-color: #fff;
    display: flex;
    align-items: center;
}

.close:hover {
    cursor: grab;
}

.search-board {
    width: 50vw;
    height: 38vh;
    position: absolute;
    left: 25vw;
    top: 11vh;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.searchItem1{
    width: 98%;
    height: 12%;
    padding-left: 2%;
    background-color: white;
    cursor: grab;
    display: flex;
    align-items: center;
}

.searchItem2{
    width: 98%;
    height: 12%;
    padding-left: 2%;
    background-color: rgba(200, 200, 200, 0.8);
    cursor: grab;
    display: flex;
    align-items: center;
}
</style>
<script setup>
import { search } from '@/api/login';
import { Search } from '@element-plus/icons-vue'
import { defineEmits, ref } from 'vue';
import router from '@/router';
let searchData = ref([])
let keyword = ref('')
let searchItem = ref('searchItem1')
let isSearch = ref(false)

const emit = defineEmits(['close'])
const onClose = () => {
    emit('close')
}

function debounce(func, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer); // 清除旧定时器
        timer = setTimeout(() => {
            func.apply(this, args); // 确保 this 指向正确
        }, delay);
    };
}

const performSearch = async () => {
    isSearch.value = true
    searchData.value = await search(keyword.value)
    localStorage.setItem('search',JSON.stringify(searchData.value))
    isSearch.value = false
};

// 防抖后的搜索方法
const debouncedSearch = debounce(performSearch, 500);

const goArticle = (index_) => {
    router.push({'name':'detail','query':{'category_id':-2,'index':index_}})
}

</script>