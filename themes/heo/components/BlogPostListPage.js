import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { filterPostsByLang } from '@/lib/utils/langPostFilter'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import PaginationNumber from './PaginationNumber'

/**
 * 文章列表分页表格
 * 结合多语言单库过滤与自适应分页
 * @param page 当前页
 * @param posts 所有文章
 * @param siteInfo 站点信息
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListPage = ({ page = 1, posts = [], siteInfo }) => {
  const { NOTION_CONFIG, lang } = useGlobal()
  // 根据当前语言过滤文章
  const filteredPosts = filterPostsByLang(posts, lang)
  const currentPostCount = filteredPosts.length
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)
  const totalPage = Math.ceil(currentPostCount / POSTS_PER_PAGE) || 1
  const currentPage = Math.min(Math.max(1, parseInt(page) || 1), totalPage)
  const showPagination = currentPostCount > POSTS_PER_PAGE
  const POST_TWO_COLS = siteConfig('HEO_HOME_POST_TWO_COLS', true, CONFIG)

  // 提取当前页展示的文章列表
  const postsToShow = filteredPosts.slice(
    POSTS_PER_PAGE * (currentPage - 1),
    POSTS_PER_PAGE * currentPage
  )

  if (!filteredPosts || filteredPosts.length === 0 || page > totalPage) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id='container' className='w-full'>
        {/* 文章列表 */}
        <div
          className={`${POST_TWO_COLS && '2xl:grid 2xl:grid-cols-2'} grid-cols-1 gap-5`}>
          {postsToShow.map(post => (
            <BlogPostCard
              index={postsToShow.indexOf(post)}
              key={post.id}
              post={post}
              siteInfo={siteInfo}
            />
          ))}
        </div>

        {showPagination && (
          <PaginationNumber page={currentPage} totalPage={totalPage} />
        )}
      </div>
    )
  }
}

export default BlogPostListPage
