import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getCategoryRawName, getCategorySlug } from '@/lib/utils/category'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类页
 * 支持中英文双语 URL Slug 解析（如 /category/engineering 与 /category/技术分享 双向兼容）
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { category }, locale }) {
  const from = 'category-props'
  let props = await fetchGlobalAllData({ from, locale })

  // 还原真实 Notion 原始分类名（例如将 'engineering' 还原为 '技术分享'）
  const rawCategory = getCategoryRawName(category)

  // 过滤状态
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  // 根据原始分类名精准匹配文章
  props.posts = props.posts.filter(
    post =>
      post &&
      post.category &&
      (post.category === rawCategory ||
        post.category.includes(rawCategory) ||
        post.category === category)
  )

  // 处理文章数量
  props.postCount = props.posts.length

  // 为保证单库多语言客户端过滤完整性，将全部该分类文章传给前端组件切片
  delete props.allPages

  props = { ...props, category: rawCategory, categorySlug: category }

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export async function getStaticPaths() {
  const from = 'category-paths'
  const { categoryOptions } = await fetchGlobalAllData({ from })
  const paths = []

  Object.keys(categoryOptions || {}).forEach(key => {
    const rawName = categoryOptions[key]?.name
    if (rawName) {
      // 原始中文分类路由
      paths.push({ params: { category: rawName } })
      // 英文 Slug 路由
      const enSlug = getCategorySlug(rawName, 'en-US')
      if (enSlug && enSlug !== rawName) {
        paths.push({ params: { category: enSlug } })
      }
    }
  })

  return {
    paths,
    fallback: true
  }
}
