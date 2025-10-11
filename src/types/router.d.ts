import 'vue-router'

interface BreadcrumbItem {
  name: string
  path: string
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    breadcrumbs?: BreadcrumbItem[]
    requiresAuth?: boolean
  }
}