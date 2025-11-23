import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authReady, isAuthenticated } from '@/services/auth'



const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth',
    component:  import('@/layouts/AuthLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        name: 'Login',
        component:  import('@/pages/auth/LoginPage.vue'),
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'Register',
        component:  import('@/pages/auth/RegisterPage.vue'),
        meta: { title: 'Register' }
      }
    ]
  },
  {
    path: '/dashboard',
    component:  import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component:  import('@/pages/dashboard/DashboardHome.vue'),
        meta: { 
          title: 'Dashboard',
          breadcrumbs: [{ name: 'Dashboard', path: '/dashboard' }]
        }
      },
      {
        path: 'services',
        name: 'Services',
        component:  import('@/pages/dashboard/ServicesPage.vue'),
        meta: { 
          title: 'Services',
          breadcrumbs: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Services', path: '/dashboard/services' }
          ]
        }
      },
      {
        path: 'users',
        name: 'Users',
        component:  import('@/pages/dashboard/UsersPage.vue'),
        meta: { 
          title: 'Users',
          breadcrumbs: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Users', path: '/dashboard/users' }
          ]
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component:  import('@/pages/dashboard/ProfilePage.vue'),
        meta: { 
          title: 'Profile',
          breadcrumbs: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Profile', path: '/dashboard/profile' }
          ]
        }
      },

      {
        path: 'settings',
        name: 'Settings',
        component:  import('@/pages/dashboard/SettingsPage.vue') ,
        meta: { 
          title: 'Settings',
          breadcrumbs: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Settings', path: '/dashboard/settings' }
          ]
        }
      },
      {
        path: 'i18n-demo',
        name: 'I18nDemo',
        component:  import('@/pages/dashboard/I18nDemo.vue'),
        meta: { 
          title: 'I18n Demo',
          breadcrumbs: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'I18n Demo', path: '/dashboard/i18n-demo' }
          ]
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach(async (to, _from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Admin Template`
  }

  // Use the auth service directly for more reliable state
  if (!authReady.value) {
    console.log('Auth not ready, waiting...')
    
    // Simple polling approach with timeout
    let attempts = 0
    const maxAttempts = 100 // 10 seconds max
    
    while (!authReady.value && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
    
    if (!authReady.value) {
      console.warn('Auth timeout - proceeding without full auth check')
    }
  }

  console.log('Navigation guard:', {
    to: to.path,
    authReady: authReady.value,
    isAuthenticated: isAuthenticated.value,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest
  })

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      console.log('Route requires auth, redirecting to login')
      next('/auth/login')
      return
    }
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest) {
    if (isAuthenticated.value) {
      console.log('User is authenticated, redirecting to dashboard')
      next('/dashboard')
      return
    }
  }

  console.log('Navigation guard: allowing navigation to', to.path)
  next()
})

export default router