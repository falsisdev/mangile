export interface BreadcrumbItem {
  label: string
  to?: string
}

export const useBreadcrumbs = () => {
  return useState<BreadcrumbItem[]>('breadcrumbs', () => [])
}
