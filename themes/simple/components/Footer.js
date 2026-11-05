import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

/**
 * 页脚组件
 * 展示版权、合规链接（隐私政策、服务条款、关于）及备案信息
 * @param {*} props
 * @returns
 */
export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative w-full bg-black px-6 border-t'>
      <DarkModeButton className='text-center pt-4' />

      <div className='text-yellow-300 container mx-auto max-w-4xl py-6 md:flex flex-wrap md:flex-no-wrap md:justify-between items-center text-sm'>
        <div className='text-center md:text-left mb-3 md:mb-0'>
          <div>
            &copy;{`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights
            reserved.
          </div>
          {/* 合规法律政策链接（面向欧美用户标准英文） */}
          <div className='flex flex-wrap justify-center md:justify-start gap-2 text-xs mt-1 text-gray-400'>
            <SmartLink href='/about' className='hover:underline hover:text-yellow-200'>
              About
            </SmartLink>
            <span>•</span>
            <SmartLink href='/privacy-policy' className='hover:underline hover:text-yellow-200'>
              Privacy Policy
            </SmartLink>
            <span>•</span>
            <SmartLink href='/terms-of-service' className='hover:underline hover:text-yellow-200'>
              Terms of Service
            </SmartLink>
          </div>
        </div>

        <div className='md:p-0 text-center md:text-right text-xs'>
          {siteConfig('BEI_AN') && (
            <a
              href={siteConfig('BEI_AN_LINK')}
              className='no-underline hover:underline ml-4'>
              {siteConfig('BEI_AN')}
            </a>
          )}
          <BeiAnGongAn />
          <span className='no-underline ml-4'>
            Powered by
            <a
              href='https://github.com/Sherwood01/NotionNext'
              className=' hover:underline'>
              NotionNext {siteConfig('VERSION')}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
