import fs from 'fs'

/**
 * 生成 robots.txt 文件
 * 包含对主流 AI 爬虫的放行规则及 Sitemap 索引
 * @param {*} props
 */
export function generateRobotsTxt(props) {
  const { siteInfo } = props
  const LINK = siteInfo?.link || 'https://notion.xwqin.com'
  const content = `# *
User-agent: *
Allow: /

# Allow Major AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Google-Extended
Allow: /

# Host
Host: ${LINK}

# Sitemaps
Sitemap: ${LINK}/sitemap.xml
`
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
