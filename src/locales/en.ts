export default {
  // Common/Global
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    submit: 'Submit',
    reset: 'Reset',
    clear: 'Clear',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    view: 'View',
    details: 'Details',
    actions: 'Actions',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    enabled: 'Enabled',
    disabled: 'Disabled',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    country: 'Country',
    date: 'Date',
    time: 'Time',
    created: 'Created',
    updated: 'Updated',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    saving: 'Saving...'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    users: 'Users',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    notifications: 'Notifications',
    services:'Services',
    demotable: 'Demo Table'
  },

  // Authentication
  auth: {
    signIn: 'Sign in to your account',
    signUp: 'Create a new account',
    login: 'Sign in',
    register: 'Sign up',
    logout: 'Sign out',
    forgotPassword: 'Forgot your password?',
    rememberMe: 'Remember me',
    emailAddress: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    createAccount: 'Create account',
    signingIn: 'Signing in...',
    signingUp: 'Creating account...',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterFullName: 'Enter your full name',
    orContinueWith: 'Or continue with',
    
    // Demo credentials
    demoCredentials: 'Demo Credentials',
    adminCredentials: 'Admin: admin@example.com / password',
    userCredentials: 'User: john@example.com / password',
    
    // Validation messages
    validation: {
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      nameRequired: 'Name is required',
      invalidEmail: 'Please enter a valid email address',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordsDoNotMatch: 'Passwords do not match'
    },
    
    // Error messages
    errors: {
      loginFailed: 'Login failed',
      registrationFailed: 'Registration failed',
      invalidCredentials: 'Invalid email or password',
      userExists: 'User already exists',
      networkError: 'Network error, please try again'
    }
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back!',
    overview: 'Overview',
    statistics: 'Statistics',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    
    // Stats cards
    stats: {
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      totalSales: 'Total Sales',
      revenue: 'Revenue',
      orders: 'Orders',
      products: 'Products',
      visitors: 'Visitors',
      conversion: 'Conversion Rate'
    }
  },

  // Users
  users: {
    title: 'Users',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    userDetails: 'User Details',
    userList: 'User List',
    searchUsers: 'Search users...',
    noUsers: 'No users found',
    
    // Table headers
    table: {
      avatar: 'Avatar',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      lastLogin: 'Last Login',
      actions: 'Actions'
    },
    
    // User roles
    roles: {
      admin: 'Admin',
      user: 'User',
      moderator: 'Moderator',
      editor: 'Editor'
    },
    
    // Confirmation messages
    confirmDelete: 'Are you sure you want to delete this user?',
    deleteSuccess: 'User deleted successfully',
    saveSuccess: 'User saved successfully',
    updateSuccess: 'User updated successfully'
  },

  // Profile
  profile: {
    title: 'Profile',
    description: 'Manage your profile information and preferences',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    exportData: 'Export Data',
    
    // Personal Information
    personalInfo: {
      title: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      address: 'Address Information',
      street: 'Street Address',
      city: 'City',
      state: 'State/Province',
      zipCode: 'ZIP/Postal Code'
    },
    
    // Preferences
    preferences: {
      title: 'Preferences',
      notifications: 'Email Notifications',
      notificationsDesc: 'Receive notifications via email',
      marketing: 'Marketing Communications',
      marketingDesc: 'Receive marketing and promotional emails',
      theme: 'Theme Preference',
      themeDesc: 'Choose your preferred theme',
      publicProfile: 'Profile Visibility',
      publicProfileDesc: 'Make your profile visible to other users'
    },
    
    // Activity
    activity: {
      title: 'Recent Activity',
      noActivity: 'No recent activity'
    },
    
    // Stats
    stats: {
      views: 'Profile Views',
      completion: 'Profile Complete'
    },
    
    // Messages
    saved: 'Profile saved successfully',
    error: 'Failed to save profile',
    loading: 'Saving...'
  },



  // Settings
  settings: {
    title: 'Settings',
    general: 'General',
    account: 'Account',
    preferences: 'Preferences',
    notifications: 'Notifications',
    appearance: 'Appearance',
    
    // Theme settings
    theme: {
      title: 'Theme',
      description: 'Choose your preferred theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      currentTheme: 'Current theme'
    },
    
    // Language settings
    language: {
      title: 'Language',
      description: 'Choose your preferred language',
      current: 'Current language'
    },
    
    // Profile settings
    profile: {
      title: 'Profile Settings',
      description: 'Update your profile information',
      avatar: 'Profile Picture',
      updateAvatar: 'Update Avatar',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information'
    },
    
    // Security settings
    security: {
      title: 'Security Settings',
      description: 'Manage your account security',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      twoFactor: 'Two-Factor Authentication',
      enableTwoFactor: 'Enable Two-Factor Authentication',
      disableTwoFactor: 'Disable Two-Factor Authentication'
    }
  },

  // Sidebar
  sidebar: {
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar'
  },

  // Breadcrumbs
  breadcrumbs: {
    home: 'Home',
    dashboard: 'Dashboard',
    users: 'Users',
    settings: 'Settings'
  },

  // Error pages
  errors: {
    notFound: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      goHome: 'Go to Dashboard'
    },
    serverError: {
      title: 'Server Error',
      description: 'Something went wrong on our end.',
      tryAgain: 'Try Again'
    },
    unauthorized: {
      title: 'Unauthorized',
      description: 'You do not have permission to access this page.',
      goBack: 'Go Back'
    }
  },

  // Time and dates
  time: {
    justNow: 'Just now',
    minutesAgo: '{count} minutes ago | {count} minute ago | {count} minutes ago',
    hoursAgo: '{count} hours ago | {count} hour ago | {count} hours ago',
    daysAgo: '{count} days ago | {count} day ago | {count} days ago',
    weeksAgo: '{count} weeks ago | {count} week ago | {count} weeks ago',
    monthsAgo: '{count} months ago | {count} month ago | {count} months ago',
    yearsAgo: '{count} years ago | {count} year ago | {count} years ago'
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    markAllAsRead: 'Mark all as read',
    noNotifications: 'No notifications',
    newNotification: 'New notification',
    
    // Types
    types: {
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error'
    }
  },

  // User menu
  userMenu: {
    profile: 'Your Profile',
    settings: 'Settings',
    signOut: 'Sign out'
  },

  // Demo page
  demo: {
    title: 'Internationalization Demo',
    description: 'This page demonstrates the i18n features implemented in the admin template.',
    welcome: 'Welcome, {name}!',
    itemsCount: 'You have {count} items',
    
    translations: {
      title: 'Translation Examples',
      basic: 'Basic Translations',
      pluralization: 'Pluralization',
      dynamic: 'Dynamic Content'
    },
    
    formatting: {
      title: 'Formatting Examples',
      dates: 'Date Formatting',
      numbers: 'Number Formatting',
      relativeTime: 'Relative Time',
      now: 'Now',
      yesterday: 'Yesterday',
      lastWeek: 'Last week',
      decimal: 'Decimal',
      currency: 'Currency',
      percent: 'Percent',
      fiveMinutesAgo: '5 minutes ago',
      twoHoursAgo: '2 hours ago',
      threeDaysAgo: '3 days ago'
    },
    
    locale: {
      title: 'Current Locale Information',
      available: 'Available',
      languages: 'Languages',
      persistent: 'Persistent',
      storage: 'Local Storage'
    }
  }
}