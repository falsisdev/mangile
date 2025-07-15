import { defineEventHandler, readBody } from 'h3'
import { getSanityClient } from '~/utils/sanityClient'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, favoriteTitle } = body

  const client = getSanityClient()

  try {
    if (favoriteTitle) {
      await client.patch(id).set({ favoriteTitle }).commit()
    } else {
      await client.patch(id).unset(['favoriteTitle']).commit()
    }

    return { success: true }
  } catch (err: any) {
    console.error('[Sanity Favorite Error]', err)
    return { success: false, error: err.message }
  }
})
