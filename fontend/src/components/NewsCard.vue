<template>
    <div 
        @click="goArticle" 
        :class="['news-card', `news-card--${index}`]"
    >
        <img 
            width="100%" 
            height="auto" 
            :src="getBackgroundImage" 
            :alt="title || '新闻图片'"
            class="news-card__image"
        >
        <div 
            :class="['news-card__content', `news-card__content--${index}`]"
        >
            <div :class="timeClass">{{ formattedTime }}</div>
            <div :class="titleContainerClass">
                <div class="news-card__title">{{ truncatedTitle }}</div>
                <div class="news-card__excerpt">
                    <p>{{ truncatedContent }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed,defineProps } from 'vue';
import { useRouter } from 'vue-router';
import bck0 from '@/assets/bck0.png';
import bck1 from '@/assets/bck1.png';
import bck2 from '@/assets/bck2.png';
import bck3 from '@/assets/bck3.png';
import bck4 from '@/assets/bck4.png';

// 定义背景图数组并添加类型
const backgroundImages = [bck0, bck1, bck2, bck3, bck4] as const;
type BackgroundIndex = 0 | 1 | 2 | 3 | 4;

// 定义 props 并完善类型约束
const props = defineProps<{
    title?: string;
    content?: string;
    time?: string;
    index?: BackgroundIndex; // 限制 index 为有效范围
}>();

const router = useRouter();

// 计算属性：处理默认值和类型安全
const index = computed<BackgroundIndex>(() => props.index ?? 0);
const getBackgroundImage = computed(() => backgroundImages[index.value]);
const formattedTime = computed(() => props.time ? props.time.slice(0, 10) : '');
const truncatedTitle = computed(() => props.title ? props.title.slice(0, 10) : '');

// 安全提取 HTML 文本内容
const extractTextFromHTML = (htmlString: string): string => {
    if (!htmlString) return '';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent?.trim() || tempDiv.innerText?.trim() || "";
};

const truncatedContent = computed(() => {
    const pureText = extractTextFromHTML(props.content || '');
    return pureText.slice(0, 20) + (pureText.length > 20 ? '...' : '');
});

// 样式类计算（使用更语义化的类名）
const timeClass = computed(() => {
    const specialIndexes: BackgroundIndex[] = [0, 3, 4];
    return specialIndexes.includes(index.value) 
        ? 'news-card__time news-card__time--primary' 
        : 'news-card__time news-card__time--light';
});

const titleContainerClass = computed(() => {
    const specialIndexes: BackgroundIndex[] = [0, 3, 4];
    return specialIndexes.includes(index.value) 
        ? 'news-card__title-container news-card__title-container--default' 
        : 'news-card__title-container news-card__title-container--inverted';
});

// 路由跳转（优化参数处理）
const goArticle = () => {
    router.push({ 
        name: 'detail', 
        query: { 
            category_id: '1', // 统一转为字符串避免类型问题
            index: index.value.toString() 
        } 
    });
};
</script>

<style lang="scss" scoped>
// 定义可复用的混合宏（替代 @extend，更灵活）
@mixin title-container-base {
    position: absolute;
    top: 9vh;
}

@mixin card-hover-effect {
    cursor: grab;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@mixin time-decoration($color: #0052D9) {
    color: $color;
    position: relative;
    left: 0;
    top: 4vh;
    overflow: hidden;
    width: 8vw;
    height: 28px;
    border-top: 1px solid $color;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-family: 'TencentSans W7', sans-serif;

    &::before {
        content: "";
        display: block;
        position: absolute;
        left: calc(100% - 12px);
        bottom: 0;
        width: 100%;
        border-top: 1px solid $color;
        transform: rotate(-69deg) translate(-1px, 0);
        transform-origin: 0 0;
    }

    &::after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: calc(100% - 12px);
        border-top: 1px solid $color;
    }
}



// 桌面端样式（≥1024px）
@media (min-width: 1024px) {
    // 基础动画定义
@keyframes appear {
    0% { transform: scale(0.1); }
    100% { transform: scale(1); }
}

.animate {
    animation: appear linear;
    animation-timeline: scroll(root);
    animation-range: entry 0% entry 45%;
}
    .news-card {
        transition: box-shadow 0.3s ease;

        &--0 {
            width: 63%;
            height: 48%;
        }

        &--1 {
            width: 34%;
            height: 48%;
        }

        &--2,
        &--3,
        &--4 {
            @extend .animate;
            width: 32%;
            height: 48%;
        }

        &:hover {
            @include card-hover-effect;
        }
    }

    .news-card__image {
        height: 50%;
        object-fit: cover; // 确保图片比例正确
    }

    .news-card__content {
        position: relative;

        &--0 {
            height: 50%;
            width: 100%;
        }

        &--1 {
            width: 100%;
            height: 50%;
            background-color: rgb(0, 169, 206);
        }

        &--2 {
            width: 100%;
            height: 60%;
            background: #0052d9;
        }

        &--3 {
            width: 100%;
            height: 60%;
            background-color: white;
        }

        &--4 {
            width: 100%;
            height: 60%;
            background-color: #eee;
        }
    }

    .news-card__time {
        &--primary {
            @include time-decoration(#0052D9);
        }

        &--light {
            @include time-decoration(white);
        }
    }

    .news-card__title-container {
        &--default {
            @include title-container-base;
        }

        &--inverted {
            @include title-container-base;
            color: white;
        }
    }

    .news-card__title {
        font-size: 24px;
        line-height: 1.4em;
        max-height: 50px;
        margin: 0 2vw;
        overflow: hidden; // 防止文字溢出
        text-overflow: ellipsis; // 溢出显示省略号
    }

    .news-card__excerpt {
        max-height: 75px;
        margin: 2vh 2vw 0;
        overflow: hidden;
    }
}

// 移动端样式（≤1023px）
@media (max-width: 1023px) {
    .news-card {
        width: 100%;
        height: auto;
        margin-bottom: 20px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background: white;
    }

    .news-card__image {
        height: 200px;
        object-fit: cover;
        display: block;
    }

    .news-card__content {
        width: 100%;
        height: auto;
        padding: 16px;
        position: relative;
        background-color: white;
    }

    .news-card__time {
        position: static;
        width: auto;
        height: auto;
        border: none;
        padding: 8px 12px;
        background: #f5f5f5;
        border-radius: 6px;
        display: inline-block;
        margin-bottom: 12px;
        font-size: 12px;
        color: #666;
        font-family: 'TencentSans W7', sans-serif;

        // 移除伪元素
        &::before,
        &::after {
            display: none;
        }

        // 统一移动端时间样式，无需区分主题
        &--light {
            color: #666;
            background: #f5f5f5;
        }
    }

    .news-card__title-container {
        position: static;
        color: #333;

        &--inverted {
            color: #333; // 移动端统一文字颜色
        }
    }

    .news-card__title {
        font-size: 18px;
        line-height: 1.4;
        margin: 0 0 8px;
        color: #333;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; // 最多显示2行
        -webkit-box-orient: vertical;
    }

    .news-card__excerpt {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: #666;
        max-height: none;

        p {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3; // 最多显示3行
            -webkit-box-orient: vertical;
        }
    }
}
</style>
