import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, resolvePostProps } from '@/lib/db/SiteDataApi'
import { checkSlugHasMorThanTwoSlash } from '@/lib/utils/post'
import Slug from '..'
import { isExport } from '@/lib/utils/buildMode'

/**
 * 根据notion的slug访问页面
 * 解析三级以上目录 /article/2023/10/29/test
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}


export async function getStaticPaths() {
  const from = 'slug-paths'
  const { allPages } = await fetchGlobalAllData({ from })

  // Export 模式：全量预生成
  if (isExport()) {
    const { prefetchAllBlockMaps } = await import('@/lib/build/prefetch')
    await prefetchAllBlockMaps(allPages)
    return {
      paths: allPages
        ?.filter(row => checkSlugHasMorThanTwoSlash(row))
        .map(row => ({
          params: {
            prefix: row.slug.split('/')[0],
            slug: row.slug.split('/')[1],
            suffix: row.slug.split('/').slice(2)
          }
        })),
      fallback: false
    }
  }

  // ISR 模式：仅预生成三段以上路径格式
  const validPages = allPages?.filter(p => checkSlugHasMorThanTwoSlash(p)) || []

  return {
    paths: validPages.map(row => ({
      params: {
        prefix: row.slug.split('/')[0],
        slug: row.slug.split('/')[1],
        suffix: row.slug.split('/').slice(2)
      }
    })),
    fallback: 'blocking'
  }
}

/**
 * 抓取页面数据
 * @param {*} param0
 * @returns
 */
export async function getStaticProps({
  params: { prefix, slug, suffix },
  locale
}) {

  const props = await resolvePostProps({
    prefix,
    slug,
    suffix,
    locale,
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
