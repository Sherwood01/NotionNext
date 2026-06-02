import BLOG from "@/blog.config"

/**
 * Normalize ID to hex format (remove dashes) for collection_query lookup
 */
function normalizeToHex(id) {
  return id?.replace(/-/g, '') || ''
}

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  try {
    // Notion数据库中的第几个视图用于站点展示和排序：
    const groupIndex = BLOG.NOTION_INDEX || 0
    if (viewIds && viewIds.length > 0) {
      // Try both hex and UUID formats for collectionId lookup
      const hexId = normalizeToHex(collectionId)
      let colData = collectionQuery?.[hexId]
      if (!colData) {
        colData = collectionQuery?.[collectionId]
      }
      const ids = colData?.[viewIds[groupIndex]]?.collection_group_results?.blockIds || []
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
    // Try collectionId first, then hex, then all entries
    const hexId = normalizeToHex(collectionId)
    let colData = collectionQuery?.[hexId]
    if (!colData) {
      colData = collectionQuery?.[collectionId]
    }
    if (colData) {
      Object.values(colData).forEach(view => {
        view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
        view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
      })
    }
    pageIds = [...pageSet]
  }
  return pageIds
}
