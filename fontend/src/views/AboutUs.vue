<template>
    <div class="about-us-page">
        <SearchComp @close="onClose" v-if="search_type==1" class="search-overlay" />
        <NavComp @search="onSearch" :isFixed="isFixed_" :isColored="isColored_" :icon_num="icon_num_" :isLogin="isLogin_" :name="name_" />
        
        <!-- 头部横幅 -->
        <div class="hero-section">
            <img src="@/assets/us.png" alt="亚信税务" class="hero-image">
            <div class="hero-text">专业铸就品质，诚信赢得未来。</div>
        </div>
        
        <!-- 文化与价值观 -->
        <section class="culture-section">
            <h2 class="section-title">文化与价值观</h2>
            <ul class="values-list">
                <li class="value-item" v-for="(value, index) in values" :key="index">
                    <strong class="value-title">{{ value.title }}</strong>
                    <span class="value-description">{{ value.description }}</span>
                </li>
            </ul>
        </section>
        
        <!-- 公司介绍 -->
        <section class="company-section">
            <h2 class="section-title">公司介绍</h2>
            <div class="company-content">
                <p class="company-text">{{ companyIntro1 }}</p>
                <p class="company-text">{{ companyIntro2 }}</p>
            </div>
        </section>
        
        <!-- 领导团队 -->
        <section class="leadership-section">
            <h2 class="section-title">领导团队</h2>
            <div class="leaders-grid">
                <div class="leader-card" v-for="(item, index) in leaderData" :key="index">
                    <el-image 
                        class="leader-image" 
                        :src="apiBaseURL + '/imagel/'+item.id" 
                        fit="cover" 
                    />
                    <div class="leader-name">{{ item.name }}</div>
                    <div class="leader-role">{{ item.role }}</div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
import NavComp from '@/components/NavComp.vue'
import SearchComp from '@/components/SearchComp.vue';
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import { getLeader } from '@/api/login';
import { useUserStore } from '@/store';
import { API_BASE_URL } from '@/config/api';

defineComponent({
    components: { NavComp, SearchComp }
})

// 响应式数据
let isFixed_ = ref(false)
let isColored_ = ref(false)
let icon_num_ = ref(false)
let search_type = ref(0)
let isLogin_ = ref(false)
let name_ = ref('')
let leaderData = ref([])
const apiBaseURL = API_BASE_URL

// 价值观数据
const values = [
    {
        title: '专业至上:',
        description: '税务服务是一项高度专业的工作，需要扎实的税务知识、丰富的实践经验以及敏锐的洞察力。我们致力于为客户提供最专业的税务解决方案，不断追求卓越，以高标准要求自己。'
    },
    {
        title: '诚信为本:',
        description: '诚信是税务服务行业的基石。我们严格遵守税法法规，坚守职业道德，以诚信为本，为客户创造合法合规的价值。'
    },
    {
        title: '与时俱进:',
        description: '税务环境不断变化，只有不断创新才能保持竞争力。我们鼓励创新思维，积极探索新的服务模式和技术应用，以适应市场变化。'
    },
    {
        title: '勇于担当:',
        description: '税务服务行业充满挑战，我们倡导积极进取的精神，勇于承担责任，为客户排忧解难。'
    }
]

// 公司介绍文本
const companyIntro1 = '玉溪亚信税务师事务所有限公司位于云南省玉溪市，是经国家税务总局云南省税务局正式批准成立的提供全方位涉税服务的专业机构。公司前身：玉溪新源税务师事务所，于2011年3月创立。经过多年的发展与沉淀，我们已成长为玉溪地区极具影响力和专业实力的税务服务机构。'

const companyIntro2 = '公司拥有一支高素质、经验丰富的专业团队，成员均具备扎实的税务知识和丰富的实践经验。他们不仅精通国家税收法律法规，还能够敏锐地捕捉行业动态和政策变化，为客户提供精准、高效、个性化的涉税解决方案。我们的服务范围广泛，涵盖税务咨询、税务筹划、税务审计、税务代理、税收筹划等多个领域。无论是企业日常税务申报，还是复杂的税务筹划项目，我们都能凭借专业的知识和严谨的态度，帮助客户合理降低税务成本，有效规避税务风险，确保税务合规。'

const handleScroll_ = () => {
    if(search_type.value == 1){
        search_type.value = 0;
    }
    const scrollTop = event.target.scrollTop;
    isFixed_.value = scrollTop > 0;
    isColored_.value = scrollTop > 150;
    icon_num_.value = isColored_.value;
}

const onSearch = () => {
    search_type.value = 1;
}

const onClose = () => {
    search_type.value = 0;
}

// 使用Pinia store
const userStore = useUserStore()

onMounted(async() => {
    // 如果用户已登录，使用store中的用户信息，否则初始化认证状态
    if (!userStore.isAuthenticated) {
        await userStore.initializeAuth()
    }
    
    const allElement = document.querySelector('.about-us-page');
    allElement.addEventListener('scroll', handleScroll_);
    leaderData.value = await getLeader()
})

onBeforeUnmount(() => {
    const allElement = document.querySelector('.about-us-page');
    allElement.removeEventListener('scroll', handleScroll_)
})
</script>
<style scoped>
.about-us-page {
    width: 100%;
    min-height: 100vh;
    background: #fff;
}

/* 搜索覆盖层 */
.search-overlay {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* 头部横幅 */
.hero-section {
    position: relative;
    width: 100%;
    height: 60vh;
    min-height: 400px;
    overflow: hidden;
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-text {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 600px;
    font-size: clamp(18px, 4vw, 32px);
    color: white;
    text-align: center;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 通用区块样式 */
.culture-section,
.company-section,
.leadership-section {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.culture-section {
    background-color: #f8f9fa;
}

.company-section {
    background-color: white;
}

.leadership-section {
    background-color: #f8f9fa;
}

/* 标题样式 */
.section-title {
    color: #333;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: bold;
    margin-bottom: 40px;
    text-align: center;
}

/* 价值观列表 */
.values-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.value-item {
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.value-title {
    display: block;
    color: #2c5aa0;
    font-size: clamp(16px, 3vw, 20px);
    margin-bottom: 10px;
}

.value-description {
    color: #666;
    font-size: clamp(14px, 2.5vw, 16px);
    line-height: 1.6;
}

/* 公司介绍 */
.company-content {
    max-width: 800px;
    margin: 0 auto;
}

.company-text {
    font-size: clamp(16px, 2.5vw, 18px);
    line-height: 1.8;
    color: #333;
    margin-bottom: 20px;
    text-align: justify;
}

/* 领导团队网格 */
.leaders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 320px));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    justify-content: center;
}

.leader-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    width: 100%;
    max-width: 320px;
}

.leader-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.leader-image {
    width: 100%;
    height: 220px;
    border-radius: 8px;
    margin-bottom: 20px;
    object-fit: cover;
}

.leader-name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

.leader-role {
    font-size: 16px;
    color: #666;
    line-height: 1.4;
}

/* ========== 平板端适配 (768px - 1199px) ========== */
@media (min-width: 768px) and (max-width: 1199px) {
    .hero-section {
        height: 50vh;
    }
    
    .culture-section,
    .company-section,
    .leadership-section {
        padding: 50px 30px;
    }
    
    .leaders-grid {
        grid-template-columns: repeat(auto-fit, minmax(240px, 280px));
        gap: 30px;
        max-width: 900px;
    }
    
    .leader-card {
        max-width: 280px;
        padding: 20px;
    }
    
    .leader-image {
        height: 200px;
        margin-bottom: 18px;
    }
    
    .leader-name {
        font-size: 17px;
    }
    
    .leader-role {
        font-size: 15px;
    }
}

/* ========== 移动端适配 (≤767px) ========== */
@media (max-width: 767px) {
    .hero-section {
        height: 40vh;
        min-height: 300px;
    }
    
    .hero-text {
        bottom: 15%;
        width: 95%;
        font-size: clamp(16px, 5vw, 24px);
    }
    
    .culture-section,
    .company-section,
    .leadership-section {
        padding: 40px 16px;
    }
    
    .section-title {
        font-size: clamp(20px, 6vw, 28px);
        margin-bottom: 30px;
    }
    
    .value-item {
        margin-bottom: 20px;
        padding: 16px;
    }
    
    .value-title {
        font-size: clamp(15px, 4vw, 18px);
    }
    
    .value-description {
        font-size: clamp(13px, 3.5vw, 15px);
    }
    
    .company-text {
        font-size: clamp(14px, 3.5vw, 16px);
        line-height: 1.7;
    }
    
    .leaders-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        max-width: 100%;
    }
    
    .leader-card {
        padding: 16px;
        max-width: none;
    }
    
    .leader-image {
        height: 180px;
        margin-bottom: 15px;
    }
    
    .leader-name {
        font-size: 16px;
    }
    
    .leader-role {
        font-size: 14px;
    }
}

/* ========== 超小屏幕优化 (≤375px) ========== */
@media (max-width: 375px) {
    .hero-section {
        height: 35vh;
        min-height: 250px;
    }
    
    .culture-section,
    .company-section,
    .leadership-section {
        padding: 30px 12px;
    }
    
    .leaders-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        max-width: 100%;
    }
    
    .leader-card {
        padding: 12px;
        max-width: none;
    }
    
    .leader-image {
        height: 150px;
        margin-bottom: 12px;
    }
    
    .leader-name {
        font-size: 15px;
    }
    
    .leader-role {
        font-size: 13px;
    }
}

/* ========== 横屏模式优化 ========== */
@media (max-width: 767px) and (orientation: landscape) {
    .hero-section {
        height: 50vh;
    }
    
    .hero-text {
        bottom: 20%;
    }
    
    .leaders-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
    }
    
    .leader-image {
        height: 100px;
    }
}

/* ========== 深色模式支持 ========== */
@media (prefers-color-scheme: dark) {
    .about-us-page {
        background: #1a1a1a;
        color: #fff;
    }
    
    .culture-section,
    .leadership-section {
        background-color: #2d2d2d;
    }
    
    .section-title {
        color: #fff;
    }
    
    .value-item,
    .leader-card {
        background: #3a3a3a;
        color: #fff;
    }
    
    .value-title {
        color: #64b5f6;
    }
    
    .value-description {
        color: #ccc;
    }
    
    .company-text {
        color: #e0e0e0;
    }
    
    .leader-name {
        color: #fff;
    }
    
    .leader-role {
        color: #bbb;
    }
}

/* ========== 触摸设备优化 ========== */
@media (hover: none) and (pointer: coarse) {
    .leader-card:hover {
        transform: none;
    }
    
    .leader-card:active {
        transform: scale(0.98);
    }
    
    .value-item:active {
        background-color: #f0f0f0;
    }
}
</style>