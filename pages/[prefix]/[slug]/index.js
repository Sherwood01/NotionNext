import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, resolvePostProps } from '@/lib/db/SiteDataApi'
import Slug from '..'
import { checkSlugHasOneSlash, checkSlugHasNoSlash } from '@/lib/utils/post'
import { isExport } from '@/lib/utils/buildMode'
import { prefetchAllBlockMaps } from '@/lib/build/prefetch'

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about 或 /article/[slug]
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

export async function getStaticPaths() {
  const from = 'slug-paths'
  const { allPages, NOTION_CONFIG } = await fetchGlobalAllData({ from })
  const POST_URL_PREFIX =
    siteConfig('POST_URL_PREFIX', BLOG.POST_URL_PREFIX, NOTION_CONFIG) ||
    'article'

  const publishedRows =
    allPages?.filter(row => row.status === 'Published') || []

  // 生成全量两段式路径（包括默认带有 POST_URL_PREFIX 的文章，以及本身含有单斜杠的两段式 slug）
  const paths = []
  publishedRows.forEach(row => {
    if (!row.slug) return
    const cleanSlug = row.slug.startsWith('/') ? row.slug.substring(1) : row.slug

    if (checkSlugHasOneSlash(row)) {
      // 自身带有单斜杠（例如 "custom/my-post"）
      const parts = cleanSlug.split('/')
      paths.push({
        params: {
          prefix: parts[0],
          slug: parts[1]
        }
      })
    } else if (row.type === 'Post' && checkSlugHasNoSlash(row)) {
      // 普通博文（默认挂载在 POST_URL_PREFIX 下，如 /article/my-post）
      paths.push({
        params: {
          prefix: POST_URL_PREFIX,
          slug: cleanSlug
        }
      })
    }
  })

  // Export 模式全量预生成并关闭 fallback
  if (isExport()) {
    await prefetchAllBlockMaps(allPages)
    return {
      paths,
      fallback: false
    }
  }

  // ISR 模式：全量预生成现有发布文章，彻底消除首次访问时的运行时 ISR 写入
  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params: { prefix, slug }, locale }) {
  const props = await resolvePostProps({
    prefix,
    slug,
    locale
  })

  return {
    props,
    revalidate: isExport()
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        ),
    notFound: !props.post
  }
}

export default PrefixSlug
