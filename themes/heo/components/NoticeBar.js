import { ArrowRightCircle } from '@/components/HeroIcons'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Swipe from './Swipe'

/**
 * 通知横幅
 * 支持根据当前语言自适应展示中英文公告内容与链接
 */
export function NoticeBar() {
  const { locale, lang } = useGlobal()
  const isEn = lang?.toLowerCase().startsWith('en')

  let notices = siteConfig('HEO_NOTICE_BAR', null, CONFIG)
  if (typeof notices === 'string') {
    try {
      notices = JSON.parse(notices)
    } catch (e) {
      notices = null
    }
  }

  // 双语默认公告配置
  const defaultNotices = isEn
    ? [
        {
          title: "Welcome to Sunmore's Blog — AI insights & digital workflows",
          url: '/about-en'
        }
      ]
    : [
        {
          title: '欢迎访问 Sunmore 博客 — 探索前沿 AI 工作流与数字化实战经验',
          url: '/about-ch'
        }
      ]

  const displayNotices = (notices && notices.length > 0) ? notices.map(item => ({
    ...item,
    url: isEn ? (item.url === '/about' ? '/about-en' : item.url) : (item.url === '/about' ? '/about-ch' : item.url)
  })) : defaultNotices

  return (
    <div className='max-w-[86rem] w-full mx-auto flex h-12 mb-4 px-5 font-bold'>
      <div className='animate__animated animate__fadeIn animate__fast group cursor-pointer bg-white dark:bg-[#1e1e1e] dark:text-white hover:border-indigo-600 dark:hover:border-yellow-600 border dark:border-gray-700 duration-200 hover:shadow-md transition-all rounded-xl w-full h-full flex items-center justify-between px-5'>
        <span className='whitespace-nowrap'>{locale.COMMON.NOW}</span>
        <div className='w-full h-full hover:text-indigo-600 dark:hover:text-yellow-600 flex justify-center items-center'>
          <Swipe items={displayNotices} />
        </div>
        <div>
          <ArrowRightCircle className={'w-5 h-5'} />
        </div>
      </div>
    </div>
  )
}
