import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

/**
 * HEO 主题页脚组件
 * 展示社交链接、版权信息、居中合规政策导航及备案与统计信息
 * @returns
 */
const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const BEI_AN_LINK = siteConfig('BEI_AN_LINK')
  const BIO = siteConfig('BIO')
  return (
    <footer className='relative flex-shrink-0 bg-white dark:bg-[#1a191d] justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm'>
      {/* 颜色过度区 */}
      <div
        id='color-transition'
        className='h-32 bg-gradient-to-b from-[#f7f9fe] to-white  dark:bg-[#1a191d] dark:from-inherit dark:to-inherit'
      />

      {/* 社交按钮 */}
      <div className='w-full h-24'>
        <SocialButton />
      </div>

      <br />

      {/* 底部页面信息 */}
      <div
        id='footer-bottom'
        className='w-full min-h-20 py-3 flex flex-col p-3 lg:flex-row justify-between px-6 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F]'>
        {/* 左侧版权信息 */}
        <div id='footer-bottom-left' className='text-center lg:text-start'>
          <PoweredBy />
          <div className='flex gap-x-1 justify-center lg:justify-start'>
            <CopyRightDate />
            <a
              href={'/about'}
              className='underline font-semibold dark:text-gray-300 '>
              {siteConfig('AUTHOR')}
            </a>
            {BIO && <span className='mx-1'> | {BIO}</span>}
          </div>
        </div>

        {/* 中间合规法律政策导航（面向欧美用户标准英文） */}
        <div
          id='footer-bottom-center'
          className='my-2 lg:my-0 text-center text-xs text-gray-500 dark:text-gray-400'>
          <div className='flex flex-wrap justify-center items-center gap-x-2 gap-y-1'>
            <SmartLink
              href='/about'
              className='hover:underline hover:text-black dark:hover:text-white transition-colors'>
              About
            </SmartLink>
            <span>•</span>
            <SmartLink
              href='/privacy-policy'
              className='hover:underline hover:text-black dark:hover:text-white transition-colors'>
              Privacy Policy
            </SmartLink>
            <span>•</span>
            <SmartLink
              href='/terms-of-service'
              className='hover:underline hover:text-black dark:hover:text-white transition-colors'>
              Terms of Service
            </SmartLink>
          </div>
        </div>

        {/* 右侧备案与统计信息 */}
        <div id='footer-bottom-right' className='text-center lg:text-end'>
          {BEI_AN && (
            <>
              <i className='fas fa-shield-alt' />{' '}
              <a href={BEI_AN_LINK} className='mr-2'>
                {siteConfig('BEI_AN')}
              </a>
            </>
          )}
          <BeiAnGongAn />

          <span className='hidden busuanzi_container_site_pv'>
            <i className='fas fa-eye' />
            <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
          </span>
          <span className='pl-2 hidden busuanzi_container_site_uv'>
            <i className='fas fa-users' />{' '}
            <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
          </span>

          {/* <h1 className='text-xs pt-4 text-light-400 dark:text-gray-400'>{title} {siteConfig('BIO') && <>|</>} {siteConfig('BIO')}</h1> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
