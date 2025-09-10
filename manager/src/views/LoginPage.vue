<template>
    <div class="main">
        <div class="loginform">
            <div style="width: 100%;margin-top: 5%;display: flex;justify-content: center;color: white;font-size: 25px;font-weight: bold;">亚信后台登录</div>
            <div style="width: 100%;height: 10%;display: flex;justify-content: center;margin-top: 5%;"><el-input v-model="username" style="width: 70%" placeholder="请输入用户名" /></div>
            <div style="width: 100%;height: 10%;display: flex;justify-content: center;margin-top: 5%;"><el-input type="password" v-model="password" style="width: 70%" placeholder="请输入密码" /></div>
            <div style="width: 100%;height: 10%;display: flex;justify-content: center;margin-top: 5%;margin-bottom: 10%;"><CaptcheComp @success="passvaid" ref="child"></CaptcheComp></div>
            <div style="width: 100%;height: 10%;display: flex;justify-content: center;margin-top: 5%;"><el-button type="primary" size="large" @click="handleLogin" :loading="loading">登录</el-button></div>
        </div>
    </div>
</template>
<style scoped>
.main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('@/assets/bck1.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}

.loginform {
    width: 35vw;
    height: 60vh;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    color: white;
    overflow: hidden;
    padding-left: 70px;
    padding-right: 70px;
}
</style>
<script setup>
import { defineComponent, ref } from "vue";
import CaptcheComp from "@/components/CaptcheComp.vue";
import router from "@/router";
import { login, getUserRole } from "@/utils/authApi";
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

defineComponent({ components: [CaptcheComp] })

const store = useStore()
let vaidtype = ref(false)
let username = ref('')
let password = ref('')
let loading = ref(false)

const passvaid = () => {
    console.log(1)
    vaidtype.value = true
}

const child = ref(null)

const handleLogin = async () => {
    if (vaidtype.value !== true) {
        ElMessage.warning('请先完成滑动验证')
        return
    }
    
    if (!username.value.trim()) {
        ElMessage.warning('请输入用户名')
        return
    }
    
    if (!password.value.trim()) {
        ElMessage.warning('请输入密码')
        return
    }
    
    loading.value = true
    try {
        const response = await login(username.value, password.value)
        
        if (response.code === 200) {
            localStorage.setItem('token', response.token)
            
            // 登录成功后立即获取用户权限信息
            try {
                const roleResponse = await getUserRole(username.value)
                if (roleResponse.code === 200) {
                    const userRole = roleResponse.role_id
                    // 使用Vuex更新全局状态
                    store.dispatch('login', { username: username.value, role: userRole })
                }
            } catch (roleError) {
                console.error('获取用户权限失败:', roleError)
                // 权限获取失败不影响登录流程，但记录错误
                // 使用默认权限
                store.dispatch('login', { username: username.value, role: 1 })
            }
            
            ElMessage.success('登录成功')
            router.push('/')
        } else {
            ElMessage.error(response.msg || '用户名或密码错误')
        }
    } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查网络连接')
    } finally {
        loading.value = false
    }
}
</script>