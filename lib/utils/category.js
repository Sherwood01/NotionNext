/**
 * 分类与标签中英双语映射字典
 * 专为单库多语言站点设计：在不改变 Notion 原始数据的前提下，根据前台当前语言自动在中英文之间无缝切换展示
 */

// 分类前台展示名称字典（大写/带空格，适于 UI 显示）
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

// 分类 URL 友好英文 Slug 字典（小写、中划线，适于路由）
export const CATEGORY_SLUG_MAP = {
  '学习思考': 'thinking',
  '技术分享': 'engineering',
  '碎片杂文': 'notes',
  'AI资讯': 'ai-news',

  '开发': 'development',
  '工具': 'tools',
  '思考': 'thoughts',
  '文字': 'writing',
  '建站': 'web-dev',
  '关于': 'about',
  '归档': 'archive',
  '必看精选': 'featured',
  '热门文章': 'popular',
  '实用教程': 'tutorials'
}

// 反向映射：英文 slug -> 原始中文分类名
export const CATEGORY_RAW_MAP = Object.entries(CATEGORY_SLUG_MAP).reduce(
  (acc, [raw, slug]) => {
    acc[slug.toLowerCase()] = raw
    return acc
  },
  {}
)

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

/**
 * 获取分类适于当前语言的 URL Slug
 * @param {string} name 原始分类名称（如 '技术分享'）
 * @param {string} lang 当前语言代码（如 'en-US' 或 'zh-CN'）
 * @returns {string} 英文环境下返回 slug（如 'engineering'），中文环境下返回原始中文名
 */
export function getCategorySlug(name, lang = 'en-US') {
  if (!name) return ''
  const isEn = lang?.toLowerCase().startsWith('en')
  if (isEn && CATEGORY_SLUG_MAP[name]) {
    return CATEGORY_SLUG_MAP[name]
  }
  return name
}

/**
 * 根据传入的 slug 或中文名，反查还原出 Notion 中原始的分类名称
 * @param {string} slugOrName 分类 slug（如 'engineering'）或中文原名（如 '技术分享'）
 * @returns {string} Notion 原始分类名
 */
export function getCategoryRawName(slugOrName) {
  if (!slugOrName) return ''
  try {
    const decoded = decodeURIComponent(slugOrName).trim()
    const lower = decoded.toLowerCase()
    if (CATEGORY_RAW_MAP[lower]) {
      return CATEGORY_RAW_MAP[lower]
    }
    return decoded
  } catch (e) {
    return slugOrName
  }
}

/**
 * 在语言切换时，转换当前路径中的分类部分
 * @param {string} pathname 路由路径，例如 '/category/engineering' 或 '/category/技术分享/page/2'
 * @param {boolean} targetIsEn 目标语言是否为英文
 * @returns {string|null} 转换后的路径，若不是分类路由则返回 null
 */
export function convertCategoryPath(pathname, targetIsEn) {
  if (!pathname || !pathname.startsWith('/category/')) {
    return null
  }
  // 匹配 /category/:cat 或 /category/:cat/page/:num
  const match = pathname.match(/^\/category\/([^/?#]+)(\/page\/[^/?#]+)?/)
  if (!match) return null

  const currentCatPart = match[1]
  const pagePart = match[2] || ''

  let targetCatPart = currentCatPart
  if (targetIsEn) {
    // 中文 -> 英文 slug
    const rawName = getCategoryRawName(currentCatPart)
    targetCatPart = CATEGORY_SLUG_MAP[rawName] || currentCatPart
  } else {
    // 英文 -> 中文原名
    targetCatPart = getCategoryRawName(currentCatPart)
  }

  return `/category/${targetCatPart}${pagePart}`
}
