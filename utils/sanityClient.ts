import sanityClient from '@sanity/client'
import { useRuntimeConfig } from '#imports'

export const getSanityClient = () => {
  const config = useRuntimeConfig()

  return sanityClient({
    projectId: config.public.projectId,
    dataset: 'production',
    token: config.public.sanityToken,
  })
}
