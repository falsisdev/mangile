import { defineEventHandler, readBody } from 'h3'
import { getSanityClient } from '~/utils/sanityClient'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, favoriteTitle } = body

  if (!id || !favoriteTitle) {
    throw new Error('Eksik parametre')
  }

  const client = getSanityClient()

  try {
    const user = await client.getDocument(id)
    const currentFavorites = user?.favoriteTitles || []
    const updatedFavorites = currentFavorites.includes(favoriteTitle)
      ? currentFavorites.filter((id: any) => id !== favoriteTitle) // Çıkar
      : [...currentFavorites, favoriteTitle] // Ekle

    await client.patch(id)
      .set({ favoriteTitles: updatedFavorites })
      .commit()

    return {
      success: true,
      favorites: updatedFavorites,
      action: currentFavorites.includes(favoriteTitle) ? 'removed' : 'added'
    }

  } catch (err) {
    console.error('[Sanity Favorite Error]', err)
    throw err
  }
})