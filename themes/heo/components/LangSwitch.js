import { useGlobal } from '@/lib/global'
import { convertCategoryPath } from '@/lib/utils/category'
import { useRouter } from 'next/router'

/**
 * HEO 主题多语言切换按钮组件
 * 支持一键切换全站中英文系统界面语言，并持久化存储在 localStorage 中
 * 当处于分类页、文章或单页详情页时，自动识别并跳转至对应的中英文对应 URL
 * @param {*} props
 * @returns {JSX.Element}
 */
const LangSwitch = props => {
  const { className } = props
  const { lang, changeLang } = useGlobal()
  const router = useRouter()

  // 判断当前语言是否为英语系列
  const isEn = lang?.toLowerCase().startsWith('en')

  /**
   * 切换语言
   */
  const handleToggleLang = () => {
    const nextLang = isEn ? 'zh-CN' : 'en-US'
    changeLang(nextLang)

    const currentPath = router.asPath
    const [pathname, search] = currentPath.split('?')
    const query = search ? `?${search}` : ''

    // 1. 分类路径双语自动对换（例如 /category/技术分享 <-> /category/engineering）
    const targetIsEn = !isEn
    const convertedCatPath = convertCategoryPath(pathname, targetIsEn)
    if (convertedCatPath) {
      router.push(`${convertedCatPath}${query}`)
      return
    }

    // 2. 详情页与单页联动跳转
    if (isEn) {
      // 英文 -> 中文
      if (pathname.includes('-en')) {
        const newPath = pathname.replace(/-en(\/|$)/, '-ch$1')
        router.push(`${newPath}${query}`)
      } else if (pathname === '/about' || pathname === '/about-en') {
        router.push(`/about-ch${query}`)
      } else if (pathname === '/privacy-policy' || pathname === '/privacy-policy-en') {
        router.push(`/privacy-policy-ch${query}`)
      } else if (pathname === '/terms-of-service' || pathname === '/terms-of-service-en') {
        router.push(`/terms-of-service-ch${query}`)
      }
    } else {
      // 中文 -> 英文
      if (pathname.includes('-ch')) {
        const newPath = pathname.replace(/-ch(\/|$)/, '-en$1')
        router.push(`${newPath}${query}`)
      } else if (pathname === '/about-ch') {
        router.push(`/about-en${query}`)
      } else if (pathname === '/privacy-policy-ch') {
        router.push(`/privacy-policy-en${query}`)
      } else if (pathname === '/terms-of-service-ch') {
        router.push(`/terms-of-service-en${query}`)
      }
    }
  }

  return (
    <div
      onClick={handleToggleLang}
      title={isEn ? 'Switch to Chinese / 切换为中文' : 'Switch to English / 切换为英文'}
      className={`${className || ''} cursor-pointer hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 rounded-full h-10 px-2.5 flex justify-center items-center duration-200 transition-all text-xs font-semibold select-none text-gray-700 dark:text-gray-200`}>
      <i className='fas fa-language text-base mr-1' />
      <span>{isEn ? 'EN' : '中'}</span>
    </div>
  )
}

export default LangSwitch
