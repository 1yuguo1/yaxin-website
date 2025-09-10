import http from '@/utils/request'


export const captchaVerifyCallback = (captchaVerifyParam: string) => {
    let result = false;
    const data = { 'captchaVerifyParam': captchaVerifyParam }
    return new Promise((resolve) => {
        http.post(`/aliyunvaid`, data).then((res) => {
            result = res.data.result
            resolve({ captchaResult: result, bizResult: true })
        }).catch((error) => {
            resolve({ captchaResult: false, bizResult: true })
        })
    })
}

export const getPhoneCode = (phoneNumber: string) => {
    return http.get(`/phonecode/${phoneNumber}`).then((res) => {
        return res;
    }).catch((error) => {
        // 提供更友好的错误信息
        if (error.response?.status === 429) {
            throw new Error('请求过于频繁，请稍后重试');
        } else if (error.response?.status === 400) {
            throw new Error('手机号格式不正确');
        } else {
            throw new Error('发送验证码失败，请稍后重试');
        }
    })
}

export const regist_ = (username: string, password: string, code: string) => {
    const data = { 'username': username, 'password': password, 'code': code }
    return new Promise((resolve)=>{
        http.post('/regist', data).then((res) => {
            if(res.data.code==200){
                resolve(true);
            }
            else{
                resolve(false);
            }
        }).catch((error) => {
            resolve(false)
        })
    })
}

export const login_ = async (username: string, password: string) => {
    const data = { 'username': username, 'password': password }
    return new Promise((resolve) => {
        http.post('/login', data).then((res) => {
            if (res.data.code == 200) {
                const token = res.data.token
                localStorage.setItem('token_', token)
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}

export const getLoginMsg = (token: string) => {
    return new Promise((resolve) => {
        http.post('/loginmsg', { token: token }).then((res) => {
            if (res.data.code == 200) {
                const result = { 
                    'username': res.data.user_id, 
                    'name': res.data.name,
                    'user_id': res.data.user_id  // 添加user_id字段
                }
                resolve(result)
            }
            else{
                resolve(false)
            }
        }).catch((error) => {
            resolve(false)
        })
    })
}

export const getMainNews = async(category_id: number,page: number) => {
    try {
        const response = await http.get(`/articleData/${category_id}/${page}?enum=1`)
        if (response.data && response.data.code === 200) {
            return response.data.data || []
        } else {
            return []
        }
    } catch (error) {
        // 返回默认数据，避免页面崩溃
        return [
            {
                'update_time':'2024.1.4',
                'title':'税改新政解读与应对策略',
                'content':'深入剖析最新税法修订要点，助力企业精准筹划税务布局',
                'id': 1
            },
            {
                'update_time':'2024.1.4',
                'title':'税务稽查案例分析与风险防范',
                'content':'剖析典型税务稽查案例，提炼关键风险点，为企业筑牢税务合规防线',
                'id': 2
            },
            {
                'update_time':'2024.1.4',
                'title':'税收优惠政策精准匹配与申报指南',
                'content':'全面梳理行业税收优惠政策，提供详细申报流程，助力企业尽享政策红利',
                'id': 3
            },
            {
                'update_time':'2024.1.4',
                'title':'国际税收动态与跨境税务筹划',
                'content':'聚焦全球税收动态，解读跨境税务规则变化，为企业"走出去"保驾护航',
                'id': 4
            },
            {
                'update_time':'2024.1.4',
                'title':'税务数字化转型实践与创新',
                'content':'探索税务数字化转型路径，分享前沿技术应用案例，推动企业税务管理升级',
                'id': 5
            }
        ]
    }
}

export const getArtTotal = async(category_id: number) => {
    try {
        const response = await http.get(`/articleTotal/${category_id}`)
        if (response.data && response.data.code === 200) {
            return response.data.data || 0
        } else {
            return 0
        }
    } catch (error) {
        return 0
    }
}

export const getLeader = async() => {
    try {
        const response = await http.get('/leaderData')
        if (response.data && response.data.code === 200) {
            return response.data.data || []
        } else {
            return []
        }
    } catch (error) {
        return []
    }
}

export const getHot = async() => {
    try {
        const response = await http.get('/hot')
        if (response.data && response.data.code === 200) {
            return response.data.data || []
        } else {
            return []
        }
    } catch (error) {
        return []
    }
}

export const search = async(keyword: string) => {
    try {
        const response = await http.get(`/search?keyword=${keyword}`)
        if (response.data && response.data.code === 200) {
            return response.data.data || []
        } else {
            return []
        }
    } catch (error) {
        return []
    }
}



export const resetPassword = (phoneNumber: string, code: string, newPassword: string) => {
    const data = { 
        'phoneNumber': phoneNumber, 
        'code': code, 
        'newPassword': newPassword 
    }
    return new Promise((resolve) => {
        http.post('/reset-password', data).then((res) => {
            if (res.data.code === 200) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            resolve(false)
        })
    })
}

/**
 * 获取用户消息列表（使用token验证）
 * @param params 查询参数
 * @returns Promise<any>
 */
export const getUserMessages = async (params: {
    page?: number
    page_size?: number
    status?: string
    type?: string
    keyword?: string
} = {}) => {
    const token = localStorage.getItem('token_')
    
    if (!token) {
        throw new Error('用户未登录')
    }

    // 先验证token是否有效
    const userInfo = await getLoginMsg(token)
    
    if (!userInfo) {
        throw new Error('token无效')
    }

    const queryParams = new URLSearchParams()
    queryParams.append('token', token)
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.page_size) queryParams.append('page_size', params.page_size.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.type) queryParams.append('type', params.type)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    
    const queryString = queryParams.toString()
    const url = `/message/list?${queryString}`
    
    const response = await http.get(url)
    
    return response.data
}

/**
 * 标记消息为已读
 * @param messageId 消息ID
 * @returns Promise<any>
 */
export const markUserMessageRead = async (messageId: number) => {
    const token = localStorage.getItem('token_')
    if (!token) {
        throw new Error('用户未登录')
    }
    
    const url = `/message/${messageId}/read?token=${token}`
    const response = await http.put(url)
    return response.data
}

/**
 * 删除用户消息
 * @param messageId 消息ID
 * @returns Promise<any>
 */
export const deleteUserMessage = async (messageId: number) => {
    const token = localStorage.getItem('token_')
    if (!token) {
        throw new Error('用户未登录')
    }
    
    const url = `/message/${messageId}?token=${token}`
    const response = await http.delete(url)
    return response.data
}