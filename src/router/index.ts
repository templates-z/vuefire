import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authReady, isAuthenticated } from '@/services/auth'

// Layouts
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'

// Dashboard Pages
import DashboardHome from '@/pages/dashboard/DashboardHome.vue'
import UsersPage from '@/pages/dashboard/UsersPage.vue'
import ProfilePage from '@/pages/dashboard/ProfilePage.vue'
import SettingsPage from '@/pages/dashboard/SettingsPage.vue'
import I18nDemo from '@/pages/dashboard/I18nDemo.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginPage,
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterPage,
        meta: { title: 'Register' }
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardHome,
        meta: { 
          title: 'Dashboard',
          breadcrumbs: [{ name: 'Dashboard', path: '/dashboard' }]
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersPage,
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
        component: ProfilePage,
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
        component: SettingsPage,
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
        component: I18nDemo,
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