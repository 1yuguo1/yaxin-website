<template>
    <nav class="navbar" :class="navbarClass" role="navigation" arial-lavel="主导航">
        <div v-if="isMobile == false" class="navbar-container">
            <div class="navbar-left">
                <div class="logo-container">
                    <img :src="icon_num ? require('@/assets/icon1.png') : require('@/assets/icon.png')"
                        :alt="icon_num ? '亚信Logo1' : '亚信Logo'" class="logo-image">
                        <span>亚信</span>
                </div>
                    <div v-for="item in menuItems" :key="item.path">
                        <div @click="handleMenuClick(item.path)">
                            {{ item.label }}
                        </div>
                    </div>
            </div>
            <div class="navbar-right">
                <div @click="onSearch"><el-icon>
                        <Search />
                    </el-icon></div>
                <div @click="toMessages"><el-icon>
                        <Bell />
                    </el-icon></div>
                <div v-if="!isUserLoggedIn" @click="toLogin"><el-icon>
                        <User />
                    </el-icon></div>
                <div @click="toggleUserDropdown" class="user-area"
                    v-else>
                    <span>{{ userName }}</span>
                    <el-icon class="dropdown-arrow" :class="{ 'arrow-up': isShowPop }">
                        <ArrowDown />
                    </el-icon>
                    <div v-if="isShowPop == true" class="user-dropdown" :class="{ 'pop_color': isColored }" @click.stop>
                        <div @click="logout" class="dropdown-item">注销</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isMobile == true" class="navbar-mobile-container">
            <div class="hamburger">
                <el-icon @click="isMenu = !isMenu">
                    <Menu />
                </el-icon>
            </div>
            <span class="logo-text">YAXIN 玉溪亚信</span>
            <div v-show="isMenu" class="menu-mobile-container">
                <div class="menu-close">
                    <el-icon class="menu-close-icon" @click="isMenu = !isMenu">
                        <Close />
                    </el-icon>
                </div>
                <div v-for="item in menuItems" :key="item.path">
                    <div @click="handleMenuClick(item.path)">
                        {{ item.label }}
                    </div>
                </div>
                <div class="menu-button mobile-bottom-safe">
                    <div v-if="!isUserLoggedIn" @click="toLogin">登录</div>
                    <div v-else class="user-info-container">
                        <div class="user-name" :title="userName">{{ userName }}</div>
                        <div class="logout-btn" @click="logout">注销</div>
                    </div>
                    <div @click="toMessages">信息</div>
                </div>
            </div>
        </div>
    </nav>
</template>
<script setup>
import router from '@/router';
import { defineProps, ref, defineEmits, computed } from 'vue';
import { useNav } from '@/composables/useNav';
import { useDevice } from '@/composables/useDevice';
import { useUserStore } from '@/store';
import { ArrowDown } from '@element-plus/icons-vue';
let isMenu = ref(false)
const props = defineProps({
    isFixed: Boolean,
    isColored: Boolean,
    icon_num: Boolean,
    isLogin: Boolean,
    name: String
})

// 用户状态管理
const userStore = useUserStore()

// 计算属性：动态获取登录状态和用户名
const isUserLoggedIn = computed(() => {
    return userStore.isAuthenticated || props.isLogin
})

const userName = computed(() => {
    return userStore.displayName || props.name || '用户'
})

const { navbarClass, handleMenuClick, toggleUserDropdown, logout, isShowPop, menuItems } = useNav(props)
const { isMobile } = useDevice()
const emit = defineEmits(['search'])
const onSearch = () => {
    emit('search')
}
const toLogin = () => {
    router.push('/login')
}

const toMessages = () => {
    // 检查是否已登录
    const token = localStorage.getItem('token_')
    if (!token) {
        // 未登录，跳转到登录页面
        router.push('/login')
    } else {
        // 已登录，跳转到消息页面
        router.push('/messages')
    }
}


</script>
<style scoped>
.logo-container {
    width: 20vw;
    display: flex;
    justify-content: space-between;
    font-size: 29px;
    font-weight: bold;
    margin-right: 10px;
}

.user-area {
    font-size: 14px;
    margin-left: 10px;
    position: relative;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.user-area:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-arrow {
    margin-left: 4px;
    font-size: 12px;
    transition: transform 0.2s;
}

.arrow-up {
    transform: rotate(180deg);
}

.user-dropdown {
    width: 80px;
    height: 40px;
    background-color: white;
    position: absolute;
    bottom: -40px;
    right: 0;
    font-size: 14px;
    color: black;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1001;
}

.dropdown-item {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.dropdown-item:hover {
    background-color: #f5f5f5;
}

.navbar {
    height: 10vh;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: transparent;
    /* 初始背景透明 */
    transition: background-color 0.5s;
    color: #fff;
}

.navbar-container {
    width: 85vw;
    height: 10vh;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    position: relative;
}

.navbar-left {
    width: 50vw;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-left div {
    /* min-width: 2vw;
    max-width: 10vw; */
    flex: 1;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
}

.navbar-left div:hover {
    background-color: rgba(128, 128, 128, 0.3);
    cursor: grab;
}

.navbar-right {
    width: 10vw;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26px;
}

.navbar-right div {
    flex: 1;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.navbar-right div:hover {
    cursor: grab;
}

.navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
}

.navbar-colored {
    background-color: #fff;
    /* 滚动后背景颜色 */
    color: black;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 添加阴影以突出导航栏 */
}

.pop_color {
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    color: black !important;
}
.navbar-mobile-container {
    width: 100%;
    height: 10vh;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.hamburger {
    flex-shrink: 0; /* 防止被压缩 */
    width: 44px; /* 触摸友好的最小尺寸 */
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.2s;
}
.menu-mobile-container {
    width: 45vw;
    height: 100vh;
    height: calc(100vh - env(safe-area-inset-bottom));
    overflow: hidden;
    left: 0;
    top: 0;
    position: fixed;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
}
.menu-mobile-container div {
    width: 100%;
    height: 10vh;
    display: flex;
    align-items: center;
    color: black;
    justify-content: center;
}

.menu-button {
    margin-bottom: env(safe-area-inset-bottom);
    padding-bottom: max(env(safe-area-inset-bottom), 20px);
}

.user-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
    box-sizing: border-box;
}

.logout-btn {
    font-size: 12px;
    color: #666;
    background-color: #f5f5f5;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid #e0e0e0;
}

.logout-btn:hover {
    background-color: #e0e0e0;
    color: #333;
}
.menu-mobile-container div:hover {
    cursor: grab;
}
.logo-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: clamp(16px, 2vw, 29px);
    font-weight: bold;
}

.menu-close {
    width: 100%;
    display: flex;
    justify-content: start !important;
}
.menu-close-icon {
    margin-left: 20px;
}

</style>