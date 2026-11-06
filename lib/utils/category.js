/**
 * 分类与标签中英双语映射字典
 * 专为单库多语言站点设计：在不改变 Notion 原始数据的前提下，根据前台当前语言自动在中英文之间无缝切换展示
 */
export const CATEGORY_LOCALE_MAP = {
  // 核心分类映射
  '学习思考': 'Thinking',
  '技术分享': 'Engineering',
  '碎片杂文': 'Notes',
  'AI资讯': 'AI News',
  
  // 常见通用分类与标签备用映射
  '开发': 'Development',
  '工具': 'Tools',
  '思考': 'Thoughts',
  '文字': 'Writing',
  '建站': 'Web Dev',
  '关于': 'About',
  '归档': 'Archive',
  '必看精选': 'Featured',
  '热门文章': 'Popular',
  '实用教程': 'Tutorials'
}

/**
 * 获取分类或标签的多语言显示名称
 * @param {string} name 原始分类名称（如来自 Notion 的 '学习思考'）
 * @param {string} lang 当前界面语言代码，例如 'en-US' 或 'zh-CN'
 * @returns {string} 适配当前语言后的名称（英文环境下返回映射值，中文或未匹配时返回原名）
 */
export function getCategoryDisplayName(name, lang = 'en-US') {
  if (!name) return ''
  const isEn = lang?.toLowerCase().startsWith('en')
  if (isEn && CATEGORY_LOCALE_MAP[name]) {
    return CATEGORY_LOCALE_MAP[name]
  }
  return name
}
