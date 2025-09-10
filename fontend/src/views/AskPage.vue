<template>
    <div class="all">
        <NavComp @search="onSearch" :isFixed="isFixed_" :isColored="isColored_" :icon_num="icon_num_" :isLogin="isLogin_" :name="name_"></NavComp>
        <main class="main">
            <h2>在此提交您的问题，我们将尽快与您联系</h2>
            <section class="feedback">
                <form class="form-container" @submit.prevent="onSubmit">
                   <fieldset id="base-info" class="form-group">
                        <legend>基础信息(*为必填项)</legend>
                        <div class="form-item">
                            <label for="name">姓名</label>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    id="name" 
                                    v-model="formData.name"
                                    :class="{ 'error': errors.name }"
                                    @blur="validateName"
                                    @input="clearError('name')"
                                    placeholder="请输入您的姓名"
                                    aria-describedby="name-error"
                                >
                                <div v-if="errors.name" id="name-error" class="error-message" role="alert">{{ errors.name }}</div>
                            </div>
                        </div>
                        <div class="form-item">
                            <label for="phone">电话 *</label>
                            <div class="input-wrapper">
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    v-model="formData.phone"
                                    :class="{ 'error': errors.phone }"
                                    @blur="validatePhone"
                                    @input="clearError('phone')"
                                    placeholder="请输入您的手机号码"
                                    aria-describedby="phone-error"
                                    required
                                >
                                <div v-if="errors.phone" id="phone-error" class="error-message" role="alert">{{ errors.phone }}</div>
                            </div>
                        </div>
                        <div class="form-item">
                            <label for="company">公司</label>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    id="company" 
                                    v-model="formData.company"
                                    :class="{ 'error': errors.company }"
                                    @blur="validateCompany"
                                    @input="clearError('company')"
                                    placeholder="请输入您的公司名称"
                                    aria-describedby="company-error"
                                >
                                <div v-if="errors.company" id="company-error" class="error-message" role="alert">{{ errors.company }}</div>
                            </div>
                        </div>
                   </fieldset>
                   <fieldset class="form-group">
                        <legend>咨询内容</legend>
                        <div class="form-item">
                            <label for="content_type">内容类型 *</label>
                            <div class="input-wrapper">
                                <select 
                                    v-if="!isMobile"
                                    id="content_type" 
                                    v-model="formData.content_type"
                                    :class="{ 'error': errors.content_type }"
                                    @change="clearError('content_type')"
                                    aria-describedby="content_type-error"
                                    required
                                >
                                    <option value="">请选择内容类型</option>
                                    <option value="1">建议反馈</option>
                                    <option value="2">税务咨询</option>
                                    <option value="3">其它</option>
                                </select>
                                <Field
                                    v-if="isMobile"
                                    is-link
                                    readonly
                                    placeholder="选择类型"
                                    @click="showPicker = true"
                                    v-model="formData.content_type"
                                />
                                <Popup
                                    v-if="isMobile"
                                    v-model:show="showPicker"
                                    position="bottom"
                                >
                                    <Picker :columns="pickerColumns" @confirm="onPickerConfirm" @cancel="showPicker = false" title="选择内容类型" />
                                </Popup>
    
                                <div v-if="errors.content_type" id="content_type-error" class="error-message" role="alert">{{ errors.content_type }}</div>
                            </div>
                        </div>
                        <div class="form-item">
                            <label for="content">咨询内容 *</label>
                            <div class="input-wrapper">
                                <textarea 
                                    id="content" 
                                    v-model="formData.content"
                                    :class="{ 'error': errors.content }"
                                    @blur="validateContent"
                                    @input="clearError('content')"
                                    placeholder="请详细描述您的问题或需求..."
                                    rows="5"
                                    aria-describedby="content-error"
                                    required
                                ></textarea>
                                <div class="char-count">{{ formData.content.length }}/500</div>
                                <div v-if="errors.content" id="content-error" class="error-message" role="alert">{{ errors.content }}</div>
                            </div>
                        </div>
                   </fieldset>
                   
                   <!-- 成功/错误消息 -->
                   <div v-if="submitMessage" :class="['submit-message', submitStatus]">
                       {{ submitMessage }}
                   </div>
                   
                   <button 
                       class="submit-button" 
                       type="submit" 
                       :disabled="isSubmitting || !isFormValid"
                       :class="{ 'loading': isSubmitting }"
                   >
                       <span v-if="!isSubmitting">提交</span>
                       <span v-else>提交中...</span>
                   </button>
                </form>
            </section>
            <section class="tax-consult"></section>
        </main>
        
    </div>
</template>
<script setup>
import { ref, defineComponent, computed, reactive, defineAsyncComponent } from 'vue';
import NavComp from '@/components/NavComp.vue';
import { useDevice } from '@/composables/useDevice';
import { createFeedback } from '@/api/feedback';
import 'vant/es/field/style';
import 'vant/es/picker/style';
import 'vant/es/popup/style';

defineComponent({
    components: {
        NavComp
    }
})

// 导航相关状态
let isFixed_ = ref(true)
let isColored_ = ref(true)
let icon_num_ = ref(true)
let isLogin_ = ref(false)
let name_ = ref('')

// 表单数据
const formData = reactive({
    name: '',
    phone: '',
    company: '',
    content_type: '',
    content: ''
})

// 错误信息
const errors = reactive({
    name: '',
    phone: '',
    company: '',
    content_type: '',
    content: ''
})

// 提交状态
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref('')


const Field = defineAsyncComponent(() => import('vant/es/field'));
const Picker = defineAsyncComponent(() => import('vant/es/picker'));
const Popup = defineAsyncComponent(() => import('vant/es/popup'));
const showPicker = ref(false)
const pickerColumns = ref([
    { text: '建议反馈', value: '1' },
    { text: '税务咨询', value: '2' },
    { text: '其它', value: '3' }
])
const {isMobile} = useDevice()

// 表单验证状态
const isFormValid = computed(() => {
    return formData.phone && 
           formData.content_type && 
           formData.content &&
           !errors.phone && 
           !errors.content_type && 
           !errors.content
})

// 验证函数
const validateName = () => {
    if (formData.name && formData.name.length < 2) {
        errors.name = '姓名至少需要2个字符'
        return false
    }
    if (formData.name && formData.name.length > 20) {
        errors.name = '姓名不能超过20个字符'
        return false
    }
    errors.name = ''
    return true
}

const validatePhone = () => {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!formData.phone) {
        errors.phone = '请输入手机号码'
        return false
    }
    if (!phoneRegex.test(formData.phone)) {
        errors.phone = '请输入正确的手机号码'
        return false
    }
    errors.phone = ''
    return true
}

const validateCompany = () => {
    if (formData.company && formData.company.length > 50) {
        errors.company = '公司名称不能超过50个字符'
        return false
    }
    errors.company = ''
    return true
}

const validateContent = () => {
    if (!formData.content) {
        errors.content = '请输入咨询内容'
        return false
    }
    if (formData.content.length < 10) {
        errors.content = '咨询内容至少需要10个字符'
        return false
    }
    if (formData.content.length > 500) {
        errors.content = '咨询内容不能超过500个字符'
        return false
    }
    errors.content = ''
    return true
}

const validateContentType = () => {
    if (!formData.content_type) {
        errors.content_type = '请选择内容类型'
        return false
    }
    errors.content_type = ''
    return true
}

const onPickerConfirm = ({ selectedValues, selectedOptions }) => {
    formData.content_type = selectedValues[0]
    showPicker.value = false
    clearError('content_type')
}

// 清除错误信息
const clearError = (field) => {
    errors[field] = ''
    submitMessage.value = ''
}

// 表单提交
const onSubmit = async () => {
    // 验证所有必填字段
    const isNameValid = validateName()
    const isPhoneValid = validatePhone()
    const isCompanyValid = validateCompany()
    const isContentValid = validateContent()
    const isContentTypeValid = validateContentType()

    if (!isNameValid || !isPhoneValid || !isCompanyValid || !isContentValid || !isContentTypeValid) {
        submitMessage.value = '请检查并完善表单信息'
        submitStatus.value = 'error'
        return
    }

    isSubmitting.value = true
    submitMessage.value = ''

    try {
        // 获取当前登录用户信息
        const token = localStorage.getItem('token_')
        let username = null
        
        // 如果用户已登录，尝试获取用户名
        if (token) {
            try {
                // 这里可以从token中解析用户名，或者调用API获取
                // 暂时使用localStorage中的用户名
                username = localStorage.getItem('username') || null
            } catch (error) {
                // 获取用户信息失败，使用匿名用户
            }
        }
        
        // 准备API请求数据
        const feedbackData = {
            username: username, // 已登录用户的用户名
            user_name: formData.name || '匿名用户',
            user_email: formData.phone, // 使用手机号作为联系方式
            type: formData.content_type,
            content: formData.content
        }
        
        // 提交反馈数据
        
        // 调用API提交反馈
        const response = await createFeedback(feedbackData)
        
        if (response.code === 200) {
            // 提交成功
            submitMessage.value = '反馈提交成功！我们会尽快与您联系。'
            submitStatus.value = 'success'
            
            // 清空表单
            Object.keys(formData).forEach(key => {
                formData[key] = ''
            })
            Object.keys(errors).forEach(key => {
                errors[key] = ''
            })
        } else {
            // 提交失败
            submitMessage.value = response.msg || '提交失败，请稍后重试'
            submitStatus.value = 'error'
        }
        
    } catch (error) {
        console.error('提交反馈错误:', error)
        submitMessage.value = '网络错误，请检查网络连接后重试'
        submitStatus.value = 'error'
    } finally {
        isSubmitting.value = false
    }
}


// 搜索功能
const onSearch = (searchTerm) => {
    // 搜索功能实现
}

</script>
<style scoped>
    .all {
        width: 100%;
        min-height: 100vh;
        position: relative;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .main {
        margin-top: 12vh;
        padding: 2rem 0;
    }
    
    .main h2 {
        text-align: center;
        color: #2c3e50;
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 2rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .form-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
    }
    
    .form-group {
        margin-bottom: 2rem;
        padding: 2rem;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    }
    
    .form-group legend {
        font-size: 1.25rem;
        font-weight: 600;
        color: #2c3e50;
        padding: 0 1rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #3498db;
        padding-bottom: 0.5rem;
    }
    
    .form-item {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-item label {
        font-weight: 600;
        color: #2c3e50;
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
    }
    
    .input-wrapper {
        position: relative;
        width: 100%;
    }
    
    .form-item input,
    .form-item select,
    .form-item textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e1e8ed;
        border-radius: 12px;
        font-size: 1rem;
        background: #fff;
        transition: all 0.3s ease;
        box-sizing: border-box;
        font-family: inherit;
    }
    
    .form-item select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1rem;
        padding-right: 3rem;
        cursor: pointer;
        min-height: 48px;
        -webkit-tap-highlight-color: transparent;
    }
    
    
    .form-item input:focus,
    .form-item select:focus,
    .form-item textarea:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        transform: translateY(-1px);
    }
    
    .form-item input.error,
    .form-item select.error,
    .form-item textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .form-item textarea {
        resize: vertical;
        min-height: 120px;
        line-height: 1.6;
    }
    
    .char-count {
        position: absolute;
        bottom: 0.5rem;
        right: 1rem;
        font-size: 0.8rem;
        color: #7f8c8d;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
    
    .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .error-message::before {
        content: "⚠";
        font-size: 0.875rem;
    }
    
    .submit-message {
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        font-weight: 500;
        text-align: center;
        animation: slideIn 0.3s ease;
    }
    
    .submit-message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .submit-message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .submit-button {
        width: 100%;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    }
    
    .submit-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
    }
    
    .submit-button:active:not(:disabled) {
        transform: translateY(0);
    }
    
    .submit-button:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    
    .submit-button.loading {
        background: #95a5a6;
    }
    
    .submit-button.loading::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* 桌面端样式 */
    @media (min-width: 1024px) {
        .main h2 {
            font-size: 2.5rem;
            margin-bottom: 3rem;
        }
        
        .form-container {
            padding: 0 2rem;
        }
        
        .form-group {
            padding: 2.5rem;
        }
        
        #base-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        
        #base-info .form-item:last-child {
            grid-column: 1 / -1;
        }
        
        .form-item {
            flex-direction: row;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .form-item label {
            width: 120px;
            flex-shrink: 0;
            margin-bottom: 0;
            padding-top: 0.875rem;
        }
        
        .input-wrapper {
            flex: 1;
        }
        
        .form-item select {
            padding-right: 3rem;
            background-size: 1rem;
            background-position: right 1rem center;
        }
        
        .submit-button {
            max-width: 300px;
            margin: 0 auto;
            display: block;
        }
    }
    
    /* 平板端样式 */
    @media (min-width: 768px) and (max-width: 1023px) {
        .main h2 {
            font-size: 2.2rem;
        }
        
        .form-group {
            padding: 2rem;
        }
        
        .form-item {
            flex-direction: row;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .form-item label {
            width: 100px;
            flex-shrink: 0;
            margin-bottom: 0;
            padding-top: 0.875rem;
        }
        
        .input-wrapper {
            flex: 1;
        }
        
        .form-item select {
            padding-right: 2.75rem;
            background-size: 0.9rem;
            background-position: right 0.875rem center;
        }
        
        .submit-button {
            max-width: 250px;
            margin: 0 auto;
            display: block;
        }
    }
    
    /* 移动端样式 */
    @media (max-width: 767px) {
        .main {
            margin-top: 10vh;
            padding: 1rem 0;
        }
        
        .main h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            padding: 0 1rem;
        }
        
        .form-container {
            padding: 0 0.5rem;
        }
        
        .form-group {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .form-group legend {
            font-size: 1.1rem;
            margin-bottom: 1rem;
        }
        
        .form-item {
            margin-bottom: 1rem;
        }
        
        .form-item input,
        .form-item select,
        .form-item textarea {
            padding: 0.75rem;
            font-size: 16px; /* 防止iOS缩放 */
        }
        
        .form-item select {
            padding-right: 2.5rem;
            background-size: 0.875rem;
            background-position: right 0.75rem center;
            min-height: 52px;
            font-size: 16px;
        }
        
        .submit-button {
            padding: 1rem;
            font-size: 1rem;
        }
    }
    
    /* 超小屏幕优化 */
    @media (max-width: 480px) {
        .form-group {
            padding: 1rem;
            border-radius: 12px;
        }
        
        .form-group legend {
            font-size: 1rem;
        }
        
        .form-item input,
        .form-item select,
        .form-item textarea {
            padding: 0.625rem;
        }
        
        .form-item select {
            padding-right: 2rem;
            background-size: 0.75rem;
            background-position: right 0.625rem center;
            min-height: 48px;
            font-size: 16px;
        }
    }
</style>