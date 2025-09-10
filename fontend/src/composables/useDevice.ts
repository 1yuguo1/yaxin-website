import { ref, computed, onMounted, onUnmounted } from 'vue'
export const useDevice = () => {
    const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
    const isMobile = computed(() => screenWidth.value < 1024)
    const handleResize = () => {
        screenWidth.value = window.innerWidth
    }
    onMounted(() => {
        window.addEventListener('resize', handleResize)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
    })
    return {
        isMobile,
    }
}
