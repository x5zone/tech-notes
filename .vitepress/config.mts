import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  base: '/tech-notes/',
  title: "Tech Notes",
  markdown: {
    config: (md) => {
      md.use(mathjax3)
    }
  },
  themeConfig: {
    // 这里建议先写一个空的或者简单的，保证能跑起来
    sidebar: [
      { text: '首页', link: '/' }
    ]
  }
})