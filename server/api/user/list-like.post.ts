import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { listId, logtoId, action } = body

  const client = createClient({
    projectId: process.env.NUXT_SANITY_PROJECT_ID, 
    dataset: 'production',
    useCdn: false,
    token: process.env.NUXT_SANITY_TOKEN,
  })

  try {
    const userDoc = await client.fetch(`*[_type == "auth" && logtoId == $logtoId][0]{_id}`, { logtoId })
    if (!userDoc) {
      return { success: false, message: 'Kullanıcı bulunamadı.' }
    }
    const userDocId = userDoc._id

    if (action === 'add') {
      const likeKey = Math.random().toString(36).substring(2, 14)
      const favoriteKey = Math.random().toString(36).substring(2, 14)
      
      await Promise.all([
        client.patch(listId)
          .setIfMissing({ likes: [] })
          .append('likes', [{ 
            _key: likeKey, 
            _type: 'reference', 
            _ref: userDocId 
          }])
          .commit(),
        client.patch(userDocId)
          .setIfMissing({ favoriteLists: [] })
          .append('favoriteLists', [{ 
            _key: favoriteKey, 
            _type: 'reference', 
            _ref: listId 
          }])
          .commit()
      ])
    } else {
      await Promise.all([
        client.patch(listId)
          .unset([`likes[_ref=="${userDocId}"]`])
          .commit(),
        client.patch(userDocId)
          .unset([`favoriteLists[_ref=="${listId}"]`])
          .commit()
      ])
    }

    const updatedList = await client.fetch(`
      *[_id == $listId][0]{
        likes[]->{
          _id,
          name,
          avatar,
          username,
          logtoId
        }
      }
    `, { listId })

    return { 
      success: true, 
      likes: updatedList.likes || [] 
    }
  } catch (error: any) {
    console.error("Beğenme hatası:", error)
    return { success: false, message: error.message }
  }
})