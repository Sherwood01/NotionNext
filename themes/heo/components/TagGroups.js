import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 标签组组件
 * 过滤展示文章数量 >= minCount 的标签，默认只展示至少 2 篇文章的活跃标签
 * @param {Array} tags 标签列表
 * @param {string} className 样式类名
 * @param {number} minCount 标签最少文章数阈值，默认为 2
 * @returns {JSX.Element}
 */
const TagGroups = ({ tags, className, minCount = 2 }) => {
  const router = useRouter()
  const { tag: currentTag } = router.query
  if (!tags) return <></>

  // 过滤掉文章数量少于 minCount 的长尾标签
  const filteredTags = tags.filter(tag => (tag.count || 0) >= minCount)

  return (
    <div id='tags-group' className='dark:border-gray-700 space-y-2'>
      {filteredTags.map((tag, index) => {
        const selected = currentTag === tag.name
        return (
          <SmartLink
            passHref
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={'cursor-pointer inline-block whitespace-nowrap'}>
            <div
              className={`${className || ''} 
                ${selected ? 'text-white bg-blue-600 dark:bg-yellow-600' : ''}  
                flex items-center hover:bg-blue-600 dark:hover:bg-yellow-600 hover:scale-110 hover:text-white rounded-lg px-2 py-0.5 duration-150 transition-all`}>
              <div className='text-lg'>{tag.name} </div>
              {tag.count ? (
                <sup className='relative ml-1'>{tag.count}</sup>
              ) : (
                <></>
              )}
            </div>
          </SmartLink>
        )
      })}
    </div>
  )
}

export default TagGroups
