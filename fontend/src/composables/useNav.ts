import { ref, computed, defineEmits, onMounted, onUnmounted } from 'vue';
import { MenuItem } from '@/types/nav';
import router from '@/router';
import { useThrottleFn } from '@vueuse/core';
import { useUserStore } from '@/store';
export const useNav = (props: any) => {
    const isShowPop = ref(false)
    const isScroll = ref(false)
    const userStore = useUserStore()
    
    const menuItems = ref<MenuItem[]>([
        { icon: 'HomeIcon', label: '首页', path: '/' },
        { icon: 'ServiceIcon', label: '服务项目', path: '/service' },
        { icon: 'ProfessIcon', label: '行业资讯', path: '/profess' },
        { icon: 'ShareIcon', label: '案例分享', path: '/share' },
        { icon: 'UsIcon', label: '关于我们', path: '/us' }
    ])

    const navbarClass = computed(() => ({
        'navbar-fixed': props.isFixed,
        'navbar-colored': props.isColored
    }))

    const handleMenuClick = (path: string) => {
        router.push(path)
    }

    const toggleUserDropdown = () => {
        isShowPop.value = !isShowPop.value
    }

    const closeUserDropdown = () => {
        isShowPop.value = false
    }

    const logout = () => {
        userStore.logout()
        router.push('/login')
        isShowPop.value = false
    }

    // 点击外部区域关闭下拉菜单
    const handleClickOutside = (event: Event) => {
        const target = event.target as HTMLElement
        const userArea = target.closest('.user-area')
        if (!userArea && isShowPop.value) {
            closeUserDropdown()
        }
    }

    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
    })

    const handleScroll = useThrottleFn(() => {
        isScroll.value = window.pageYOffset > 150
    }, 100)

    return {
        navbarClass,
        handleMenuClick,
        toggleUserDropdown,
        logout,
        handleScroll,
        isShowPop,
        isScroll,
        menuItems
    }
}