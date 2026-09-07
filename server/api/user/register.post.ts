export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const logtoUser = event.context.logtoUser

  const logtoId = String(body?.logtoId || logtoUser?.sub || '').trim()
  const username = String(body?.username || '').trim()
  const name = String(body?.name || '').trim()
  const avatar = body?.avatar ? String(body.avatar).trim() : ''
  const banner = body?.banner ? String(body.banner).trim() : ''
  const bio = body?.bio ? String(body.bio).trim() : ''

  if (!logtoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Logto kimlik bilgisi (logtoId) zorunludur.'
    })
  }

  if (!username || username.length < 3 || username.length > 20) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kullanıcı adı 3-20 karakter arasında olmalıdır.'
    })
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kullanıcı adı sadece harf, rakam ve alt çizgi (_) içerebilir.'
    })
  }

  if (!name || name.length < 1 || name.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Görünen ad 1-50 karakter arasında olmalıdır.'
    })
  }

  if (bio && bio.length > 200) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Biyografi en fazla 200 karakter olabilir.'
    })
  }

  const sanity = useSanityApi()

  // Check if this logtoId is already registered
  const existingUser = await sanity.getAuthByLogtoId(logtoId)
  if (existingUser) {
    return {
      success: true,
      alreadyExisted: true,
      user: existingUser,
      message: 'Kullanıcı zaten kayıtlı.'
    }
  }

  // Check if username is already taken
  const taken = await sanity.isUsernameTaken(username)
  if (taken) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.'
    })
  }

  // Create auth document in Sanity
  const user = await sanity.createAuthDocument({
    logtoId,
    username,
    name,
    avatar: avatar || undefined,
    banner: banner || undefined,
    bio: bio || undefined,
    roles: ['004']
  })

  return {
    success: true,
    alreadyExisted: false,
    user,
    message: 'Kullanıcı başarıyla oluşturuldu.'
  }
})
