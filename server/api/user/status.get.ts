export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const logtoUser = event.context.logtoUser
  const logtoId = (query.logtoId as string) || logtoUser?.sub

  if (!logtoId) {
    return {
      authenticated: false,
      exists: false,
      user: null
    }
  }

  const sanity = useSanityApi()
  const user = await sanity.getAuthByLogtoId(logtoId)

  return {
    authenticated: !!logtoUser,
    exists: !!user,
    user,
    logtoUser: logtoUser || null
  }
})
