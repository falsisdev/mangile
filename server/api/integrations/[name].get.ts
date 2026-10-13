export default defineEventHandler((event) => {
  const name = getRouterParam(event, 'name') || ''
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as Record<string, string>).toString()

  let provider = 'mal'
  if (name.includes('anilist')) {
    provider = 'anilist'
  } else if (name.includes('mangadex')) {
    provider = 'mangadex'
  } else if (name.includes('mal')) {
    provider = 'mal'
  }

  return sendRedirect(event, `/auth/${provider}/callback?${queryString}`)
})
