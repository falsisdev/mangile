import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { logtoId, name, avatar, username, email } = body

  if (!logtoId) {
    return { success: false, message: 'Logto ID gerekiyor. Sağlanamadı.' }
  }

  const client = createClient({
    projectId: process.env.NUXT_SANITY_PROJECT_ID, 
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.NUXT_SANITY_TOKEN,
  })

  try {
    const existingUser = await client.fetch(`*[_type == "auth" && logtoId == $logtoId][0]`, { logtoId })
    
    if (existingUser) {
      return { success: true, user: existingUser }
    }

    const safeLogtoId = logtoId.replace(/[^a-zA-Z0-9_-]/g, '')
    const newUserDoc = {
      _id: `user_${safeLogtoId}`,
      _type: 'auth',
      logtoId,
      email: email || '',
      username: username,
      name: name,
      gender: 'male',
      avatar: avatar || 'https://placehold.co/150x150/020618/ffffff?text=' + String(username.slice(0, 2)).toUpperCase(),
      bio: 'Merhaba! Ben bir Mangile kullanıcısıyım. Çok yaşa Falsis!',
      lists: [],
      favoriteLists: [],
      userFollows: [],
      userFollowers: [],
      favoriteTitles: [],
      favoritePages: [],
      favoriteScans: [],
      favoriteChapters: [],
      bookcase: {
        reading: [],
        completed: [],
        onHold: [],
        dropped: [],
        planned: [],
        rereading: []
      }
    }

    const createdUser = await client.createIfNotExists(newUserDoc)

    return { 
      success: true, 
      user: createdUser 
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
})