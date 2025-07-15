import { useLogtoUser } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useLogtoUser()
  const sanity = useSanity()

  if (!user) {
    //Kullanıcı giriş yapmamış
    return
  }

  const query = groq`*[_type == "auth" && logtoId == $logtoId][0]`
  const sanityUser = await sanity.fetch(query, { logtoId: user.sub })
  const sanityClient = getSanityClient()

  if (!sanityUser) {
    // Kullanıcı Sanity'de yok → yeni belge oluştur
    const newUser = {
      _type: 'auth',
      logtoId: user.sub,
      name: user.name || user.username ||'',
      username: user.username || '',
      avatar: user.picture || '',
      gender: 'male',
    }

    const created = await sanityClient.create(newUser)
    console.log('Yeni kullanıcı oluşturuldu!')
  } else {
      console.log('Mevcut kullanıcı bulundu!')
    }
})
