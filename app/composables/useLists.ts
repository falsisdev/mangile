export interface ListItemReference {
  _id: string
  _type: string
  title: string
  slug?: string
  coverImage?: { url: string }
  bannerImage?: { url: string }
  myAnimeListId?: number
  uploadStatus?: string
  format?: string
  tags?: string[]
}

export interface ListItem {
  _key: string
  reference?: ListItemReference
  externalId?: number
  externalType?: string
  index: number
  note?: string
  addedAt?: string
}

export interface ListUser {
  id: string
  logtoId: string
  name: string
  username: string
  avatar?: string
}

export interface ListData {
  _id: string
  _type: string
  title: string
  description?: string
  isPrivate: boolean
  coverImage?: { url: string }
  createdAt?: string
  updatedAt?: string
  user?: ListUser
  likes?: ListUser[]
  items: ListItem[]
  likesCount?: number
  itemsCount?: number
}

export function useLists() {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.backend.baseUrl ?? '')

  async function fetchPublicLists(limit = 50): Promise<ListData[]> {
    return await $fetch<ListData[]>(`${apiBase}/api/lists`, {
      query: { limit }
    })
  }

  async function fetchUserLists(targetLogtoId: string, viewerLogtoId?: string): Promise<ListData[]> {
    return await $fetch<ListData[]>(`${apiBase}/api/user/${targetLogtoId}/lists`, {
      headers: viewerLogtoId ? { 'X-Logto-Id': viewerLogtoId } : {}
    })
  }

  async function fetchList(id: string, viewerLogtoId?: string): Promise<ListData> {
    return await $fetch<ListData>(`${apiBase}/api/list/${id}`, {
      headers: viewerLogtoId ? { 'X-Logto-Id': viewerLogtoId } : {}
    })
  }

  async function createList(payload: {
    title: string
    description?: string
    isPrivate?: boolean
    logtoId: string
  }): Promise<ListData> {
    return await $fetch<ListData>(`${apiBase}/api/list`, {
      method: 'POST',
      body: payload
    })
  }

  async function updateList(
    id: string,
    payload: {
      title?: string
      description?: string
      isPrivate?: boolean
      logtoId: string
    }
  ): Promise<ListData> {
    return await $fetch<ListData>(`${apiBase}/api/list/${id}`, {
      method: 'PATCH',
      body: payload
    })
  }

  async function deleteList(id: string, logtoId: string): Promise<{ success: boolean; message: string }> {
    return await $fetch<{ success: boolean; message: string }>(`${apiBase}/api/list/${id}`, {
      method: 'DELETE',
      body: { logtoId }
    })
  }

  async function addListItem(
    listId: string,
    payload: {
      referenceId?: string
      externalId?: number
      externalType?: string
      index?: number
      note?: string
      logtoId: string
    }
  ): Promise<ListData> {
    return await $fetch<ListData>(`${apiBase}/api/list/${listId}/items`, {
      method: 'POST',
      body: payload
    })
  }

  async function removeListItem(listId: string, key: string, logtoId: string): Promise<ListData> {
    return await $fetch<ListData>(`${apiBase}/api/list/${listId}/items/${key}`, {
      method: 'DELETE',
      body: { logtoId }
    })
  }

  async function updateListItems(
    listId: string,
    items: ListItem[],
    logtoId: string
  ): Promise<ListData> {
    return await $fetch<ListData>(`${apiBase}/api/list/${listId}/items`, {
      method: 'PUT',
      body: { items, logtoId }
    })
  }

  async function toggleLike(listId: string, logtoId: string): Promise<ListData> {
    return await $fetch<ListData>(`${apiBase}/api/list/${listId}/like`, {
      method: 'POST',
      body: { logtoId }
    })
  }

  return {
    fetchPublicLists,
    fetchUserLists,
    fetchList,
    createList,
    updateList,
    deleteList,
    addListItem,
    removeListItem,
    updateListItems,
    toggleLike
  }
}
