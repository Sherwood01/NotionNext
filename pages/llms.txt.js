// pages/llms.txt.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { extractLangId } from '@/lib/utils/pageId'

/**
 * 动态生成 llms.txt 服务端路由
 * 遵循 llmstxt.org 规范，为大语言模型提供 Markdown 格式的站点索引
 * @param {*} ctx
 * @returns
 */
export const getServerSideProps = async ctx => {
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')
  const firstId = siteIds[0]
  const id = extractLangId(firstId)

  const siteData = await fetchGlobalAllData({
    pageId: id,
    from: 'llms.txt'
  })

  let link = siteConfig('LINK', siteData?.siteInfo?.link, siteData?.NOTION_CONFIG)
  if (link && link.endsWith('/')) {
    link = link.slice(0, -1)
  }

  const title =
    siteConfig('TITLE', siteData?.siteInfo?.title, siteData?.NOTION_CONFIG) ||
    siteConfig('AUTHOR', "Sunmore's Blog", siteData?.NOTION_CONFIG)
  const description =
    siteConfig(
      'DESCRIPTION',
      siteData?.siteInfo?.description,
      siteData?.NOTION_CONFIG
    ) ||
    siteConfig('BIO', '', siteData?.NOTION_CONFIG) ||
    'Personal knowledge base and blog'

  const content = generateLlmsTxt({
    link,
    title,
    description,
    allPages: siteData?.allPages || []
  })

  // 缓存 1 小时
  ctx.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  ctx.res.write(content)
  ctx.res.end()

  return { props: {} }
}

/**
 * 组装遵循 llmstxt.org 标准的 Markdown 文本
 * 根据项目规则，面向欧美用户的展示内容使用英文
 * @param {*} param0
 * @returns {string}
 */
function generateLlmsTxt({ link, title, description, allPages }) {
  const lines = []

  // H1 标题
  lines.push(`# ${title}`)
  lines.push('')

  // 引用摘要
  if (description) {
    lines.push(`> ${description}`)
    lines.push('')
  }

  // 核心导航页面
  lines.push('## Core Pages')
  lines.push(`- [Home](${link}): Main landing page`)
  lines.push(`- [Archive](${link}/archive): Complete chronological archive of articles`)
  lines.push(`- [Categories](${link}/category): All article categories and topics`)
  lines.push(`- [Tags](${link}/tag): Tag directory`)
  lines.push('')

  // 过滤已发布且不是菜单/通知的文章，同时排除外链 slug
  const validPosts = (allPages || []).filter(post => {
    if (post.status !== BLOG.NOTION_PROPERTY_NAME.status_publish) return false
    const type = post.type || ''
    if (type.includes('Menu') || type.includes('SubMenu') || type.includes('Notice')) return false
    if (!post.slug) return false
    // 排除外链
    if (post.slug.startsWith('http://') || post.slug.startsWith('https://')) return false
    return true
  })

  // 文章列表
  if (validPosts.length > 0) {
    lines.push('## Articles')
    validPosts.forEach(post => {
      const slugWithoutLeadingSlash = post.slug.startsWith('/')
        ? post.slug.slice(1)
        : post.slug
      const postUrl = `${link}/${slugWithoutLeadingSlash}`
      const postTitle = post.title || 'Untitled'
      const postSummary = (post.summary || '').replace(/\r?\n|\r/g, ' ').trim()
      if (postSummary) {
        lines.push(`- [${postTitle}](${postUrl}): ${postSummary}`)
      } else {
        lines.push(`- [${postTitle}](${postUrl})`)
      }
    })
    lines.push('')
  }

  // Optional 区域
  lines.push('## Optional')
  lines.push(`- [Sitemap](${link}/sitemap.xml): Complete XML sitemap`)
  lines.push(`- [RSS Feed](${link}/rss/feed.xml): RSS feed for content subscription`)
  lines.push('')

  return lines.join('\n')
}

export default () => {}

