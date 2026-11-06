import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { getCategoryDisplayName, getCategorySlug } from '@/lib/utils/category'

const CategoryGroup = ({ currentCategory, categories }) => {
  const { lang } = useGlobal()
  if (!categories) {
    return <></>
  }
  return <>
    <div id='category-list' className='dark:border-gray-700 flex flex-wrap  mx-4'>
      {categories.map(category => {
        const selected = currentCategory === category.name
        return (
          <SmartLink
            key={category.name}
            href={`/category/${getCategorySlug(category.name, lang)}`}
            passHref
            className={(selected
              ? 'hover:text-white dark:hover:text-white bg-indigo-600 text-white '
              : 'dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-indigo-600') +
              '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'}>

            <div> <i className={`mr-2 fas ${selected ? 'fa-folder-open' : 'fa-folder'}`} />{getCategoryDisplayName(category.name, lang)}({category.count})</div>

          </SmartLink>
        )
      })}
    </div>
  </>
}

export default CategoryGroup
