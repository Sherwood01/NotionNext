import BLOG from "@/blog.config"

<<<<<<< HEAD
export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  try {
    // Notion数据库中的第几个视图用于站点展示和排序：
    const groupIndex = BLOG.NOTION_INDEX || 0
    if (viewIds && viewIds.length > 0 && collectionQuery?.[collectionId]) {
      const ids = collectionQuery[collectionId][viewIds[groupIndex]]?.collection_group_results?.blockIds || []
      if (ids) {
        for (const id of ids) {
          pageIds.push(id)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching page IDs:', error);
    return [];
  }

  // 否则按照数据库原始排序
  if (pageIds.length === 0 && collectionQuery && Object.values(collectionQuery).length > 0) {
    const pageSet = new Set()
    Object.values(collectionQuery).forEach(entry => {
      if (!entry) return
      Object.values(entry).forEach(view => {
        view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
        view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
      })
    })
    pageIds = [...pageSet]
=======
export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds, block = {}) {
  const pageSet = new Set()
  const targetViewId = viewIds?.[BLOG.NOTION_INDEX || 0]

  // 策略1：page_sort（有顺序，但可能截断）
  if (collectionView && targetViewId) {
    const pageSort = collectionView?.[targetViewId]?.value?.value?.page_sort
    if (Array.isArray(pageSort) && pageSort.length > 0) {
      pageSort.forEach(id => pageSet.add(id))
    }
  }

  // ✅ 策略补充：collectionQuery 始终运行，补齐 page_sort 截断的记录
  // 注意：补充的记录追加在末尾，不影响已有顺序
  if (collectionQuery && collectionId) {
    const viewQuery = collectionQuery?.[collectionId]
    if (viewQuery) {
      const selectedViewData = targetViewId ? viewQuery[targetViewId] : null
      const queryData = selectedViewData ? [selectedViewData] : Object.values(viewQuery)
      queryData.forEach(viewData => {
        [
          viewData?.collection_group_results?.blockIds,
          viewData?.results?.blockIds,
          viewData?.blockIds,
        ].forEach(ids => {
          if (Array.isArray(ids)) ids.forEach(id => pageSet.add(id))
        })
      })
    }
>>>>>>> e087fdc5bc0a499358122f27ce8e8fab95b78632
  }

  // 过滤无权限
  // const accessibleIds = [...pageSet].filter(id => {
  //   const entry = block[id]
  //   if (!entry) return true
  //   return entry?.value?.role !== 'none' && entry?.value?.value?.role !== 'none'
  // })

  // console.log(`[getAllPageIds] 最终数量: ${accessibleIds.length}`)
  return [...pageSet]
}
