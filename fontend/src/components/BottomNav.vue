<script setup lang="ts">
import router from '@/router';
interface NavItem {
    icon: string;
    text: string;
    link: string;
}
interface SocialItem {
    icon: string;
    link: string;
}
const socialItems: SocialItem[] = [
    {
        icon: require('@/assets/wechat.png'),
        link: 'https://wechat.com'
    },
    {
        icon: require('@/assets/weibo.png'),
        link: 'https://weibo.com'
    },
    {
        icon: require('@/assets/douyin.png'),
        link: 'https://douyin.com'
    },
    {
        icon: require('@/assets/bili.png'),
        link: 'https://bili.com'
    }
]
const navItems: NavItem[] = [
    {
        icon: '@/assets/icon.png',
        text: '关于我们',
        link: '/us'
    },
    {
        icon: '@/assets/icon.png',
        text: '联系我们',
        link: '/service'
    },
    
    {
        icon: '@/assets/icon.png',
        text: '人才招聘',
        link: '/profess'
    },
    
    {
        icon: '@/assets/icon.png',
        text: '新闻动态',
        link: '/share'
    },
    
    {
        icon: '@/assets/icon.png',
        text: '资讯分享',
        link: '/share'
    },
    
    {
        icon: '@/assets/icon.png',
        text: '问题反馈',
        link: '/ask'
    }
    
]
</script>

<template>
    <div class="bottom">
        <div class="content">
            <div class="nav">
                <div class="left-nav">
                    <div class="icon"><img width="22px" height="22px" src="@/assets/icon.png"></div>
                    <div v-for="item in navItems" :key="item.link" class="left-nav-item" @click="router.push(item.link)">{{ item.text }}</div>
                </div>
                <div class="right-nav">
                    <div v-for="item in socialItems" :key="item.link"><a :href="item.link"><img width="16px" height="16px" :src="item.icon"></a></div>
                </div>
            </div>
            <div style="background-color: white;width: 100%;height: 0.5px;"></div>
            <div class="footer-tip">
                <ul style="display: flex;">
                    <li>隐私政策</li>
                    <li>使用条款</li>
                </ul>
            </div>
            <div class="copyright">Copyright © 2025 YAXIN 玉溪亚信 版权所有</div>
            <div style="display: inline-block;margin-right: 1vw;"><a style="text-decoration: none;color: white;font-size: 12px;" href="https://beian.miit.gov.cn/#/Integrated/index">滇ICP备2024032844号</a></div>
            <div style="display: inline-block;position: relative;"><img style="position: absolute;bottom: 0;left: 0;" width="20px" height="20px" src="@/assets/ga.png"><a style="text-decoration: none;color: white;font-size: 12px;margin-left: 2vw;" href="https://beian.mps.gov.cn/#/query/webSearch">滇公网安备53040202000576号</a></div>
        </div>
    </div>
</template>
<style scoped>
.content{
    width:80%;
    height: 100%;
}
@media (max-width: 1023px) {
    .bottom {
    background-color: #272727;
    height: calc(30vh + 10px);
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
}
    .footer-tip {
        display: none;
    }
    .icon {
        display: none;
    }
    .nav {
        height: 70%;
    }
    .left-nav {
        width: 100%;
        margin-top: 3%;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: white;
        margin-bottom: 2%;
    }
    .left-nav-item {
        font-size: 14px;
    }
    .right-nav {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: space-between;
    }
}
@media (min-width: 1024px) {
    .bottom {
    background-color: #272727;
    height: calc(30vh + 10px);
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    overflow: hidden;
}
.content {
    width: 80vw;
    height: 10vh;
    position: absolute;
    bottom: 2vh;
}

.nav {
    width: 100%;
    height: 45%;
    display: flex;
    justify-content: space-between;
}

.left-nav {
    width: 35%;
    display:flex;
    justify-content: space-between;
    height: 100%;
    color: white;
    font-size: 11px;
}

.left-nav-item {
    cursor: grab;
}


.left-nav div {
    display: flex;
    align-items: center;
}

.right-nav {
    width: 10%;
    height: 100%;
    display: flex;
    justify-content: space-between;
}

.footer-tip {
    min-width: 18%;
    height: 20px;
    color: white;
    font-size: 12px;
    margin-top: 1vh;
}

.footer-tip ul {
    padding: 0;
    margin: 0;
    display: inline-block;
}
.footer-tip ul li{
    display: inline-block;
    margin-left: 20px;
}
.footer-tip ul li::before{
    content: "";
    width: 2px;
    height: 2px;
    border: 1px solid rgba(255,255,255,.85);
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,.85);
}
.copyright{
    font-size: 12px;
    color: rgba(255,255,255,.65);
    padding-right: 16px;
    min-width: 15vw;
    display: inline-block;
}
}
</style>