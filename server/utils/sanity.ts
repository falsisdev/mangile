export interface SanityAuthDocument {
  _id?: string
  _type: 'auth'
  logtoId: string
  username: string
  name: string
  avatar?: string
  banner?: string
  bio?: string
  roles?: string[]
  lists?: unknown[]
  integrations?: Record<string, unknown>
  _createdAt?: string
  _updatedAt?: string
}

export function useSanityApi() {
  const config = useRuntimeConfig()
  const sanityPublic = config.public.sanity as { projectId?: string, dataset?: string } | undefined
  const projectId = sanityPublic?.projectId || '1yge7tlr'
  const dataset = sanityPublic?.dataset || 'production'
  const token = (config.sanityToken as string) || ''
  const apiVersion = 'v2021-10-21'

  async function query<T = unknown>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = new URL(`https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}`)
    url.searchParams.set('query', groq)
    url.searchParams.set('perspective', 'drafts')

    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined) {
        url.searchParams.set(`$${key}`, JSON.stringify(val))
      }
    }

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await $fetch<{ result: T }>(url.toString(), { headers })
    return res.result
  }

  async function mutate(mutations: Record<string, unknown>[]) {
    const url = `https://${projectId}.api.sanity.io/${apiVersion}/data/mutate/${dataset}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return await $fetch(url, {
      method: 'POST',
      headers,
      body: { mutations }
    })
  }

  async function getAuthByLogtoId(logtoId: string): Promise<SanityAuthDocument | null> {
    if (!logtoId) return null
    const groq = `*[_type == "auth" && logtoId == $id][0]{
      _id,
      _type,
      logtoId,
      username,
      name,
      "avatar": coalesce(avatar.asset->url, avatar),
      "banner": coalesce(banner.asset->url, banner),
      bio,
      roles,
      lists,
      _createdAt,
      _updatedAt
    }`
    return await query<SanityAuthDocument | null>(groq, { id: logtoId })
  }

  async function isUsernameTaken(username: string, excludeLogtoId?: string): Promise<boolean> {
    if (!username) return false
    const groq = excludeLogtoId
      ? `count(*[_type == "auth" && lower(username) == lower($username) && logtoId != $excludeLogtoId]) > 0`
      : `count(*[_type == "auth" && lower(username) == lower($username)]) > 0`
    const params: Record<string, unknown> = { username }
    if (excludeLogtoId) params.excludeLogtoId = excludeLogtoId
    return await query<boolean>(groq, params)
  }

  async function createAuthDocument(data: {
    logtoId: string
    username: string
    name: string
    avatar?: string
    banner?: string
    bio?: string
    roles?: string[]
  }): Promise<SanityAuthDocument> {
    const doc: Record<string, unknown> = {
      _type: 'auth',
      logtoId: data.logtoId,
      username: data.username,
      name: data.name,
      roles: data.roles || ['004'],
      lists: []
    }

    if (data.avatar) doc.avatar = data.avatar
    if (data.banner) doc.banner = data.banner
    if (data.bio) doc.bio = data.bio

    await mutate([{ create: doc }])

    const created = await getAuthByLogtoId(data.logtoId)
    return created || (doc as unknown as SanityAuthDocument)
  }

  async function updateAuthDocument(logtoId: string, data: {
    name?: string
    avatar?: string
    banner?: string
    bio?: string
  }): Promise<SanityAuthDocument | null> {
    const existing = await getAuthByLogtoId(logtoId)
    if (!existing || !existing._id) return null

    const setFields: Record<string, unknown> = {}
    if (data.name !== undefined) setFields.name = data.name
    if (data.avatar !== undefined) setFields.avatar = data.avatar
    if (data.banner !== undefined) setFields.banner = data.banner
    if (data.bio !== undefined) setFields.bio = data.bio

    await mutate([{
      patch: {
        id: existing._id,
        set: setFields
      }
    }])

    return await getAuthByLogtoId(logtoId)
  }

  return {
    query,
    mutate,
    getAuthByLogtoId,
    isUsernameTaken,
    createAuthDocument,
    updateAuthDocument
  }
}
