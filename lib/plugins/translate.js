import { isBrowser, loadExternalResource } from '@/lib/utils'

/**
 * 前端即时无损翻译插件
 * 基于轻量级翻译引擎，不改动任何 DOM 结构与样式，只替换可读文本节点。
 * 完美保留 Notion 的所有排版、图片、Callout 卡片、代码块高亮等格式。
 */

let isInitializing = false
let isInitialized = false

/**
 * 初始化前端翻译引擎
 */
export async function initTranslate() {
  if (!isBrowser || typeof window === 'undefined') {
    return
  }
  if (isInitialized || window.translate) {
    return window.translate
  }
  if (isInitializing) {
    return
  }

  isInitializing = true
  try {
    // 异步加载本地静态翻译库（已通过 Vercel CDN 毫秒级分发）
    await loadExternalResource('/js/translate.js', 'js')

    if (window.translate) {
      // 1. 隐藏自带的原生浮动/下拉选择框，由顶栏 [EN/中] 按钮统一受控
      window.translate.selectLanguageTag.show = false

      // 2. 采用微软 Edge 翻译通道（稳定、免费且翻译质量高）
      window.translate.service.use('client.edge')

      // 3. 设置站点的原始语言为简体中文
      window.translate.localLanguage = 'chinese_simplified'

      // 4. 配置防翻译保护：代码块、公式、导航栏绝对不翻译，防止代码和既有UI受影响
      if (!window.translate.ignore) {
        window.translate.ignore = {}
      }
      if (!Array.isArray(window.translate.ignore.class)) {
        window.translate.ignore.class = []
      }
      if (!Array.isArray(window.translate.ignore.tag)) {
        window.translate.ignore.tag = []
      }

      window.translate.ignore.class.push('notranslate')
      window.translate.ignore.class.push('notion-code')
      window.translate.ignore.class.push('notion-asset-wrapper')
      window.translate.ignore.tag.push('code')
      window.translate.ignore.tag.push('pre')
      window.translate.ignore.tag.push('kbd')
      window.translate.ignore.tag.push('header')
      window.translate.ignore.tag.push('nav')

      isInitialized = true
    }
  } catch (err) {
    console.warn('加载翻译引擎失败:', err)
  } finally {
    isInitializing = false
  }

  return window.translate
}

/**
 * 同步页面翻译状态
 * @param {string} targetLang 当前目标语言，如 'en-US' 或 'zh-CN'
 */
export async function syncPageTranslation(targetLang) {
  if (!isBrowser || typeof window === 'undefined') {
    return
  }

  const translate = await initTranslate()
  if (!translate) {
    return
  }

  const isEn = targetLang?.toLowerCase().startsWith('en')
  try {
    if (isEn) {
      translate.changeLanguage('english')
    } else {
      translate.changeLanguage('chinese_simplified')
    }
  } catch (e) {
    console.warn('执行翻译切换异常:', e)
  }
}
