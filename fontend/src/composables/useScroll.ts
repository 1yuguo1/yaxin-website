import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useScroll() {
  const isFixed = ref(false)
  const isColored = ref(false)
  const iconNum = ref(false)

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    isFixed.value = scrollTop > 0
    isColored.value = scrollTop > 150
    iconNum.value = scrollTop > 150
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isFixed,
    isColored,
    iconNum
  }
}