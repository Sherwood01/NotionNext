/**
 * 文章语言匹配与过滤工具函数
 * 用于配合全局语言切换，实现文章中英文动态联动
 */

/**
 * 判断单篇文章是否与目标语言环境相符合
 * @param {object} post 文章数据对象
 * @param {string} lang 当前语言代码（如 'en-US' 或 'zh-CN'）
 * @returns {boolean}
 */
export function isPostMatchLang(post, lang = 'en-US') {
  if (!post) return false
  const slug = post?.slug || ''
  const isEn = lang?.toLowerCase().startsWith('en')

  if (isEn) {
    // 英文环境下：
    // 1. 如果 slug 显式以 -en 结尾，保留
    if (slug.endsWith('-en')) return true
    // 2. 如果 slug 显式以 -ch 结尾，过滤掉
    if (slug.endsWith('-ch')) return false
    // 3. 通用单页（例如 about, terms-of-service, privacy-policy 等），保留
    return true
  } else {
    // 中文环境下：
    // 1. 如果 slug 显式以 -ch 结尾，保留
    if (slug.endsWith('-ch')) return true
    // 2. 如果 slug 显式以 -en 结尾，过滤掉
    if (slug.endsWith('-en')) return false
    // 3. 通用单页，保留
    return true
  }
}

/**
 * 根据当前语言过滤文章列表
 * @param {Array} posts 文章数组
 * @param {string} lang 当前语言代码
 * @returns {Array} 过滤后的文章数组
 */
export function filterPostsByLang(posts = [], lang = 'en-US') {
  if (!posts || !Array.isArray(posts)) return []
  return posts.filter(post => isPostMatchLang(post, lang))
}

