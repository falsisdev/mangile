export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const logtoUser = event.context.logtoUser
  const logtoId = String(body?.logtoId || logtoUser?.sub || '').trim()

  if (!logtoId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yetkilendirme hatası: Oturum bulunamadı.'
    })
  }

  const name = body?.name !== undefined ? String(body.name).trim() : undefined
  const avatar = body?.avatar !== undefined ? String(body.avatar).trim() : undefined
  const banner = body?.banner !== undefined ? String(body.banner).trim() : undefined
  const bio = body?.bio !== undefined ? String(body.bio).trim() : undefined

  if (name !== undefined && (name.length < 1 || name.length > 50)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Görünen ad 1-50 karakter arasında olmalıdır.'
    })
  }

  if (bio !== undefined && bio.length > 200) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Biyografi en fazla 200 karakter olabilir.'
    })
  }

  const sanity = useSanityApi()
  const updated = await sanity.updateAuthDocument(logtoId, {
    name,
    avatar,
    banner,
    bio
  })

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Kullanıcı kaydı bulunamadı.'
    })
  }

  return {
    success: true,
    user: updated
  }
})
