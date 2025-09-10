<template>
  <div class="app-layout">
    <SideComp v-if="leftShow" />
    <div class="right-panel" :style="{ width: awidth + '%' }">
      <HeaderComp @toggle-sidebar="toggleSidebar" />
      <ContentArea :roletype="roletype" />
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import SideComp from './SideComp.vue'
import HeaderComp from './HeaderComp.vue'
import ContentArea from './ContentArea.vue'

// 布局状态
const leftShow = ref(true)
const awidth = ref(83)
const roletype = ref('1-1')

// 切换侧边栏显示
const toggleSidebar = () => {
  if (leftShow.value) {
    leftShow.value = false
    awidth.value = 100
  } else {
    leftShow.value = true
    awidth.value = 83
  }
}

// 提供全局状态给子组件
provide('roletype', roletype)
provide('leftShow', leftShow)
provide('awidth', awidth)
</script>

<style scoped>
.app-layout {
  width: 100vw;
  height: 100vh;
  background-color: red;
  display: flex;
}

.right-panel {
  height: 100%;
  background-color: aliceblue;
}
</style>
