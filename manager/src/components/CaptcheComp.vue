<template>
    <div id="captcha-element"></div>
</template>
<script setup>
import { captchaVerifyCallback } from '@/utils/api'
import { onMounted,ref,defineEmits } from 'vue';
const emit = defineEmits(['success']);
let captcha;
function onBizResultCallback(bizResult) {
    if (bizResult === true) {
        //captcha.destroyCaptcha();
        emit('success',true)
        captcha.destroyCaptcha();
        console.log(1)
    } else {
        // 如果业务验证不通过，给出不通过提示。此处不通过提示为业务验证不通过！
        alert('业务验证不通过！');
    }
}
function getInstance(instance) {
    captcha = instance;
}
const destroyCaptcha = ()=>{
    console.log('destroy')
    captcha.destroyCaptcha();
}
onMounted(() => {
    window.initAliyunCaptcha({
        SceneId: "1qmeoggk", // 场景ID
        prefix: "1jn9q5", // 身份标
        mode: "embed",
        element: "#captcha-element", // 页面上预留的渲染验证码的元素
        button: "#login", // 触发验证码弹窗的元素
        captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数
        onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数
        getInstance: getInstance, // 绑定验证码实例函数
        slideStyle: {
            width: 550,
            height: 40,
        }, // 滑块验证码样式
        immediate: true, // 完成验证后，是否立即发送验证请求
        language: "cn", // 验证码语言类型
        region: 'cn'
    })
})
</script>