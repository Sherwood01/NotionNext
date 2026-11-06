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

  // 双语默认公告配置
  const enNotices = [
    {
      title: "Welcome to Sunmore's Blog — AI insights & digital workflows",
      url: '/about-en'
    }
  ]

  const chNotices = [
    {
      title: '欢迎访问 Sunmore 博客 — 探索前沿 AI 工作流与数字化实战经验',
      url: '/about-ch'
    }
  ]

  let customNotices = siteConfig('HEO_NOTICE_BAR', null, CONFIG)
  if (typeof customNotices === 'string') {
    try {
      customNotices = JSON.parse(customNotices)
    } catch (e) {
      customNotices = null
    }
  }

  // 默认根据当前语言选择对应语言的通知
  const displayNotices = isEn ? enNotices : chNotices

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
