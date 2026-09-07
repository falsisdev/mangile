export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const username = String(query.username || '').trim()

  if (!username || username.length < 3 || username.length > 20) {
    return {
      valid: false,
      available: false,
      message: 'Kullanıcı adı 3 ile 20 karakter arasında olmalıdır.'
    }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      available: false,
      message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi (_) içerebilir.'
    }
  }

  const sanity = useSanityApi()
  const taken = await sanity.isUsernameTaken(username)

  return {
    valid: true,
    available: !taken,
    message: taken ? 'Bu kullanıcı adı zaten kullanımda.' : 'Kullanıcı adı kullanılabilir.'
  }
})
