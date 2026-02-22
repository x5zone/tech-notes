// 等待页面加载完成后注入 Giscus
document.addEventListener('DOMContentLoaded', function() {
    // mdBook 的内容区域选择器
    const content = document.querySelector('#content') || 
                    document.querySelector('.content') ||
                    document.querySelector('main') ||
                    document.querySelector('.page');
    if (!content) {
        console.warn('[Giscus] Cannot find content container');
        return;
    }

    // 创建评论容器
    const commentsDiv = document.createElement('div');
    commentsDiv.id = 'giscus-comments';
    commentsDiv.style.marginTop = '80px';
    commentsDiv.style.paddingTop = '40px';
    commentsDiv.style.borderTop = '1px solid rgba(255,255,255,0.1)';
    
    content.appendChild(commentsDiv);

    // 动态加载 Giscus 脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'x5zone/tech-notes');
    script.setAttribute('data-repo-id', 'R_kgDORUgOJw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDORUgOJ84C2-wv');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'zh-CN');
    script.crossOrigin = 'anonymous';
    script.async = true;

    commentsDiv.appendChild(script);
});
