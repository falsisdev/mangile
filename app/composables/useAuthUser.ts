import { useLogtoUser } from '#imports'

export interface SanityUserData {
  _id?: string
  _type?: string
  logtoId: string
  username: string
  name: string
  avatar?: string
  banner?: string
  bio?: string
  roles?: string[]
  lists?: unknown[]
  _createdAt?: string
  _updatedAt?: string
}

const roleMap: Record<string, string> = {
  '001': 'Yönetici',
  '002': 'Moderatör',
  '003': 'Çevirmen',
  '004': 'Üye'
}

export function useAuthUser() {
  const logtoUser = useLogtoUser()
  const sanityUser = useState<SanityUserData | null>('auth-sanity-user', () => null)
  const isChecking = useState<boolean>('auth-sanity-checking', () => false)
  const hasChecked = useState<boolean>('auth-sanity-checked', () => false)

  const isRegistered = computed(() => !!sanityUser.value)

  const user = computed(() => {
    if (!logtoUser) return null

    const primaryRole = sanityUser.value?.roles?.[0]
    const roleLabel = primaryRole ? (roleMap[primaryRole] || 'Üye') : 'Üye'

    return {
      isRegistered: !!sanityUser.value,
      _id: sanityUser.value?._id || '',
      logtoId: logtoUser.sub,
      username: sanityUser.value?.username || logtoUser.username || '',
      name: sanityUser.value?.name || logtoUser.name || logtoUser.username || 'Kullanıcı',
      avatar: sanityUser.value?.avatar || logtoUser.picture || '',
      banner: sanityUser.value?.banner || '',
      bio: sanityUser.value?.bio || '',
      roles: sanityUser.value?.roles || ['004'],
      roleLabel,
      lists: sanityUser.value?.lists || []
    }
  })

  async function fetchSanityUser(force = false) {
    if (!logtoUser?.sub) {
      sanityUser.value = null
      hasChecked.value = true
      return null
    }

    if (hasChecked.value && !force && sanityUser.value) {
      return sanityUser.value
    }

    isChecking.value = true
    try {
      const data = await $fetch<{
        authenticated: boolean
        exists: boolean
        user: SanityUserData | null
      }>('/api/user/status', {
        query: { logtoId: logtoUser.sub }
      })

      if (data.exists && data.user) {
        sanityUser.value = data.user
      } else {
        sanityUser.value = null
      }
      hasChecked.value = true
      return sanityUser.value
    } catch {
      hasChecked.value = true
      return null
    } finally {
      isChecking.value = false
    }
  }

  function setSanityUser(doc: SanityUserData) {
    sanityUser.value = doc
    hasChecked.value = true
  }

  // Otomatik yükleme: Eğer logtoUser varsa ve henüz kontrol edilmediyse yükle
  if (import.meta.client && logtoUser?.sub && !hasChecked.value && !isChecking.value) {
    fetchSanityUser()
  }

  return {
    logtoUser,
    sanityUser,
    user,
    isRegistered,
    isChecking,
    hasChecked,
    fetchSanityUser,
    setSanityUser
  }
}
