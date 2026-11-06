import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { filterPostsByLang } from '@/lib/utils/langPostFilter'
import { getCategoryDisplayName, getCategorySlug } from '@/lib/utils/category'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostArchive = ({ posts = [], archiveTitle, siteInfo }) => {
  const { lang } = useGlobal()
  const filteredPosts = filterPostsByLang(posts, lang)

  if (!filteredPosts || filteredPosts.length === 0) {
    return <></>
  } else {
    return (
      <div className=''>
        <div className='pb-4 dark:text-gray-300' id={archiveTitle}>
          {archiveTitle}
        </div>
        <ul>
          {filteredPosts.map(post => {
            const showPreview =
              siteConfig('HEO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
            if (
              post &&
              !post.pageCoverThumbnail &&
              siteConfig('HEO_POST_LIST_COVER_DEFAULT', null, CONFIG)
            ) {
              post.pageCoverThumbnail = siteInfo?.pageCover
            }
            const showPageCover =
              siteConfig('HEO_POST_LIST_COVER', null, CONFIG) &&
              post?.pageCoverThumbnail &&
              !showPreview
            return (
              <div
                key={post.id}
                className={
                  'cursor-pointer flex flex-row mb-4 h-24 md:flex-row group w-full  dark:border-gray-600 hover:border-indigo-600  dark:hover:border-yellow-600 duration-300 transition-colors justify-between overflow-hidden'
                }>
                {/* 图片封面 */}
                {showPageCover && (
                  <div>
                    <SmartLink href={post?.href} passHref legacyBehavior>
                      <LazyImage
                        className={'rounded-xl bg-center bg-cover w-40 h-24'}
                        src={post?.pageCoverThumbnail}
                      />
                    </SmartLink>
                  </div>
                )}

                {/* 文字区块 */}
                <div className={'flex px-2 flex-col justify-between w-full'}>
                  <div>
                    {/* 分类 */}
                    {post?.category && (
                      <div
                        className={`flex items-center ${showPreview ? 'justify-center' : 'justify-start'} hidden md:block flex-wrap dark:text-gray-500 text-gray-600 `}>
                        <SmartLink
                          passHref
                          href={`/category/${getCategorySlug(post.category, lang)}`}
                          className='cursor-pointer text-xs font-normal menu-link hover:text-indigo-700  dark:text-gray-600 transform'>
                          {getCategoryDisplayName(post.category, lang)}
                        </SmartLink>
                      </div>
                    )}

                    {/* 标题 */}
                    <SmartLink
                      href={post?.href}
                      passHref
                      className={
                        ' group-hover:text-indigo-700 group-hover:dark:text-indigo-400 text-black dark:text-gray-100 dark:group-hover:text-yellow-600 line-clamp-2 replace cursor-pointer text-xl font-extrabold leading-tight'
                      }>
                      <span className='menu-link '>{post.title}</span>
                    </SmartLink>
                  </div>

                  <div className='md:flex-nowrap flex-wrap md:justify-start inline-block'>
                    <div>
                      {' '}
                      {post.tagItems?.map(tag => (
                        <TagItemMini key={tag.name} tag={tag} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default BlogPostArchive
