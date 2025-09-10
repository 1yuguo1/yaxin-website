<template>
    <div :id="captchaElementId"></div>
</template>
<script setup>
import { captchaVerifyCallback } from '@/api/login'
import { onMounted, ref, defineEmits, defineProps,defineExpose } from 'vue';

const props = defineProps({
    buttonId: {
        type: String,
        default: '#login'
    }
})

const emit = defineEmits(['success']);

const captchaElementId = ref(`captcha-element-${Math.random().toString(36).substr(2, 9)}`)
let captcha;

function onBizResultCallback(bizResult) {
    if (bizResult === true) {
        captcha.destroyCaptcha();
        emit('success', true)
    } else {
        // 如果业务验证不通过，给出不通过提示。此处不通过提示为业务验证不通过！
        alert('业务验证不通过！');
    }
}

function getInstance(instance) {
    captcha = instance;
}

const destroyCaptcha = () => {
    if (captcha) {
        captcha.destroyCaptcha();
    }
}

onMounted(() => {
    // 确保DOM元素存在
    const element = document.getElementById(captchaElementId.value);
    if (!element) {
        return;
    }

    window.initAliyunCaptcha({
        SceneId: "1qmeoggk", // 场景ID
        prefix: "1jn9q5", // 身份标
        mode: "popup", // 改为弹窗模式，确保滑块按钮显示
        element: `#${captchaElementId.value}`, // 页面上预留的渲染验证码的元素
        button: props.buttonId, // 触发验证码弹窗的元素
        captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数
        onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数
        getInstance: getInstance, // 绑定验证码实例函数
        slideStyle: {
            width: 300,
            height: 40,
        }, // 滑块验证码样式，调整为适合移动端的尺寸
        immediate: false, // 改为false，让用户手动触发验证
        language: "cn", // 验证码语言类型
        region: 'cn'
    })
})

// 暴露方法给父组件
defineExpose({
    destroyCaptcha
})
</script>