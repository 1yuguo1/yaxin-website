// 首先确保已有的Vue类型声明
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  
  // 新增图片文件类型声明
  declare module '*.png' {
    const src: string
    export default src
  }
  
  declare module '*.jpg' {
    const src: string
    export default src
  }
  
  declare module '*.jpeg' {
    const src: string
    export default src
  }
  
  declare module '*.gif' {
    const src: string
    export default src
  }
  
  declare module '*.svg' {
    const src: string
    export default src
  }
      