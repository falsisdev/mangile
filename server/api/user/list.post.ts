import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { listId, titleID, action, itemKey } = body

  const client = createClient({
    projectId: process.env.NUXT_SANITY_PROJECT_ID, 
    dataset: 'production',
    useCdn: false,
    token: process.env.NUXT_SANITY_TOKEN,
  })

  try {
    const doc = await client.fetch(`*[_id == $listId][0]`, { listId })
    if (!doc) {
      return { success: false, message: 'Liste bulunamadı.' }
    }

    let items = doc.items || []

    if (action === 'remove') {
      items = items.filter((i: any) => i._key !== itemKey)
    } else if (action === 'add') {
      const exists = items.some((i: any) => i.item && Number(i.item[0]) === Number(titleID))
      if (!exists) {
        const newKey = Math.random().toString(36).substring(2, 14)
        items.push({
          _key: newKey,
          _type: 'items',
          item: [Number(titleID), 0] // Geçici olarak 0 veriyoruz, aşağıda yeniden index atanıyor 
        })
      }
    }

    const reIndexedItems = items.map((item: any, idx: number) => {
      const currentTitleId = item.item && item.item[0] ? Number(item.item[0]) : 0
      return {
        ...item,
        item: [currentTitleId, idx]
      }
    })
    await client
      .patch(listId)
      .set({ items: reIndexedItems })
      .commit()
    return { 
      success: true, 
      items: reIndexedItems 
    }
  } catch (error: any) {
    console.error("Backend list update error:", error)
    return { success: false, message: error.message }
  }
})