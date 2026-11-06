import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getCategoryRawName, getCategorySlug } from '@/lib/utils/category'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类页（带分页）
 * 支持中英文双语 URL Slug 解析（如 /category/engineering/page/2）
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { category, page } }) {
  const from = 'category-page-props'
  let props = await fetchGlobalAllData({ from })

  // 还原真实 Notion 原始分类名
  const rawCategory = getCategoryRawName(category)

  // 过滤状态类型
  props.posts = props.allPages
    ?.filter(page => page.type === 'Post' && page.status === 'Published')
    .filter(
      post =>
        post &&
        post.category &&
        (post.category === rawCategory ||
          post.category.includes(rawCategory) ||
          post.category === category)
    )

  // 处理文章页数
  props.postCount = props.posts.length

  delete props.allPages
  props.page = page

  props = { ...props, category: rawCategory, categorySlug: category, page }

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
  const { categoryOptions, allPages, NOTION_CONFIG } = await fetchGlobalAllData({
    from
  })
  const paths = []

  categoryOptions?.forEach(category => {
    // 过滤状态类型
    const categoryPosts = allPages
      ?.filter(page => page.type === 'Post' && page.status === 'Published')
      .filter(
        post => post && post.category && post.category.includes(category.name)
      )
    // 处理文章页数
    const postCount = categoryPosts.length
    const totalPages = Math.ceil(
      postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
    )
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        paths.push({ params: { category: category.name, page: '' + i } })
        const enSlug = getCategorySlug(category.name, 'en-US')
        if (enSlug && enSlug !== category.name) {
          paths.push({ params: { category: enSlug, page: '' + i } })
        }
      }
    }
  })

  return {
    paths,
    fallback: true
  }
}
