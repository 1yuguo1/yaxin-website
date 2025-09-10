import http from '@/utils/http'

export const getViewData = async (enum_: number) => {
    try {
        const response = await http.get(`/viewdata/${enum_}`)
        return response.data.data
    } catch (error) {
        console.error('获取视图数据失败:', error)
        throw error
    }
}

export const captchaVerifyCallback = async (captchaVerifyParam: string) => {
    try {
        const response = await http.post('/aliyunvaid', {
            captchaVerifyParam
        })
        return {
            captchaResult: response.data.result,
            bizResult: true
        }
    } catch (error) {
        console.error('验证码验证失败:', error)
        return {
            captchaResult: false,
            bizResult: true
        }
    }
}