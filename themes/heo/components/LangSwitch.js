import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * HEO 主题多语言切换按钮组件
 * 支持一键切换全站中英文系统界面语言，并持久化存储在 localStorage 中
 * 当在文章详情页时，自动识别并跳转至对应的 -en / -ch 双语文章
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

    // 如果当前处于文章详情页，且包含双语后缀，自动联动跳转
    const currentPath = router.asPath
    const [pathname, search] = currentPath.split('?')
    const query = search ? `?${search}` : ''

    if (isEn && pathname.includes('-en')) {
      // 英文 -> 中文：自动跳转到对应的 -ch 页面
      const newPath = pathname.replace(/-en(\/|$)/, '-ch$1')
      router.push(`${newPath}${query}`)
    } else if (!isEn && pathname.includes('-ch')) {
      // 中文 -> 英文：自动跳转到对应的 -en 页面
      const newPath = pathname.replace(/-ch(\/|$)/, '-en$1')
      router.push(`${newPath}${query}`)
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
