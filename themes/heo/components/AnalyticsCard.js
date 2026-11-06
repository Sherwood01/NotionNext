import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/**
 * 博客统计卡牌组件
 * 支持中英文双语自适应显示文章数、建站天数、访问量与访客数
 * @param {*} props
 * @returns {JSX.Element}
 */
export function AnalyticsCard(props) {
  const { lang } = useGlobal()
  const isEn = lang?.toLowerCase().startsWith('en')
  const targetDate = new Date(siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG))
  const today = new Date()
  const diffTime = today.getTime() - targetDate.getTime() // 获取两个日期之间的毫秒数差值
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // 将毫秒数差值转换为天数差值
  const postCountTitle = isEn ? siteConfig('HEO_POST_COUNT_TITLE', 'Articles:', CONFIG) : '文章数:'
  const siteTimeTitle = isEn ? siteConfig('HEO_SITE_TIME_TITLE', 'Online:', CONFIG) : '建站天数:'
  const siteVisitTitle = isEn ? siteConfig('HEO_SITE_VISIT_TITLE', 'Pageviews:', CONFIG) : '访问量:'
  const siteVisitorTitle = isEn ? siteConfig('HEO_SITE_VISITOR_TITLE', 'Visitors:', CONFIG) : '访客数:'

  const { postCount } = props
  return <>
        <div className='text-md flex flex-col space-y-1 justify-center px-3'>
            <div className='inline'>
                <div className='flex justify-between'>
                    <div>{postCountTitle}</div>
                    <div>{postCount}</div>
                </div>
            </div>
            <div className='inline'>
                <div className='flex justify-between'>
                    <div>{siteTimeTitle}</div>
                    <div>
                      {diffDays} {isEn ? 'Days' : '天'}
                    </div>
                </div>
            </div>
            <div className='hidden busuanzi_container_page_pv'>
                <div className='flex justify-between'>
                    <div>{siteVisitTitle}</div>
                    <div className='busuanzi_value_page_pv' />
                </div>
            </div>
            <div className='hidden busuanzi_container_site_uv'>
                <div className='flex justify-between'>
                    <div>{siteVisitorTitle}</div>
                    <div className='busuanzi_value_site_uv' />
                </div>
            </div>
        </div>
        </>
}
