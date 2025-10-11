export default {
  // Common/Global
  common: {
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    refresh: 'Actualizar',
    submit: 'Enviar',
    reset: 'Restablecer',
    clear: 'Limpiar',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    ok: 'OK',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    view: 'Ver',
    details: 'Detalles',
    actions: 'Acciones',
    status: 'Estado',
    active: 'Activo',
    inactive: 'Inactivo',
    enabled: 'Habilitado',
    disabled: 'Deshabilitado',
    name: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    phone: 'Teléfono',
    address: 'Dirección',
    city: 'Ciudad',
    country: 'País',
    date: 'Fecha',
    time: 'Hora',
    created: 'Creado',
    updated: 'Actualizado',
    createdAt: 'Creado el',
    updatedAt: 'Actualizado el'
  },

  // Navigation
  nav: {
    dashboard: 'Panel de control',
    users: 'Usuarios',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    notifications: 'Notificaciones'
  },

  // Authentication
  auth: {
    signIn: 'Inicia sesión en tu cuenta',
    signUp: 'Crea una nueva cuenta',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    forgotPassword: '¿Olvidaste tu contraseña?',
    rememberMe: 'Recordarme',
    emailAddress: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    fullName: 'Nombre completo',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: "¿No tienes una cuenta?",
    createAccount: 'Crear cuenta',
    signingIn: 'Iniciando sesión...',
    signingUp: 'Creando cuenta...',
    enterEmail: 'Ingresa tu correo electrónico',
    enterPassword: 'Ingresa tu contraseña',
    enterFullName: 'Ingresa tu nombre completo',
    
    // Demo credentials
    demoCredentials: 'Credenciales de demostración',
    adminCredentials: 'Admin: admin@example.com / password',
    userCredentials: 'Usuario: john@example.com / password',
    
    // Validation messages
    validation: {
      emailRequired: 'El correo electrónico es obligatorio',
      passwordRequired: 'La contraseña es obligatoria',
      nameRequired: 'El nombre es obligatorio',
      invalidEmail: 'Por favor ingresa un correo electrónico válido',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      passwordsDoNotMatch: 'Las contraseñas no coinciden'
    },
    
    // Error messages
    errors: {
      loginFailed: 'Inicio de sesión fallido',
      registrationFailed: 'Registro fallido',
      invalidCredentials: 'Correo electrónico o contraseña inválidos',
      userExists: 'El usuario ya existe',
      networkError: 'Error de red, por favor inténtalo de nuevo'
    }
  },

  // Dashboard
  dashboard: {
    title: 'Panel de control',
    welcome: '¡Bienvenido de vuelta!',
    overview: 'Resumen',
    statistics: 'Estadísticas',
    recentActivity: 'Actividad reciente',
    quickActions: 'Acciones rápidas',
    
    // Stats cards
    stats: {
      totalUsers: 'Total de usuarios',
      activeUsers: 'Usuarios activos',
      totalSales: 'Ventas totales',
      revenue: 'Ingresos',
      orders: 'Pedidos',
      products: 'Productos',
      visitors: 'Visitantes',
      conversion: 'Tasa de conversión'
    }
  },

  // Users
  users: {
    title: 'Usuarios',
    addUser: 'Agregar usuario',
    editUser: 'Editar usuario',
    deleteUser: 'Eliminar usuario',
    userDetails: 'Detalles del usuario',
    userList: 'Lista de usuarios',
    searchUsers: 'Buscar usuarios...',
    noUsers: 'No se encontraron usuarios',
    
    // Table headers
    table: {
      avatar: 'Avatar',
      name: 'Nombre',
      email: 'Correo electrónico',
      role: 'Rol',
      status: 'Estado',
      lastLogin: 'Último inicio de sesión',
      actions: 'Acciones'
    },
    
    // User roles
    roles: {
      admin: 'Administrador',
      user: 'Usuario',
      moderator: 'Moderador',
      editor: 'Editor'
    },
    
    // Confirmation messages
    confirmDelete: '¿Estás seguro de que quieres eliminar este usuario?',
    deleteSuccess: 'Usuario eliminado exitosamente',
    saveSuccess: 'Usuario guardado exitosamente',
    updateSuccess: 'Usuario actualizado exitosamente'
  },

  // Settings
  settings: {
    title: 'Configuración',
    general: 'General',
    account: 'Cuenta',
    preferences: 'Preferencias',
    notifications: 'Notificaciones',
    appearance: 'Apariencia',
    
    // Theme settings
    theme: {
      title: 'Tema',
      description: 'Elige tu tema preferido',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
      currentTheme: 'Tema actual'
    },
    
    // Language settings
    language: {
      title: 'Idioma',
      description: 'Elige tu idioma preferido',
      current: 'Idioma actual'
    },
    
    // Profile settings
    profile: {
      title: 'Configuración del perfil',
      description: 'Actualiza la información de tu perfil',
      avatar: 'Foto de perfil',
      updateAvatar: 'Actualizar avatar',
      personalInfo: 'Información personal',
      contactInfo: 'Información de contacto'
    },
    
    // Security settings
    security: {
      title: 'Configuración de seguridad',
      description: 'Administra la seguridad de tu cuenta',
      changePassword: 'Cambiar contraseña',
      currentPassword: 'Contraseña actual',
      newPassword: 'Nueva contraseña',
      confirmNewPassword: 'Confirmar nueva contraseña',
      twoFactor: 'Autenticación de dos factores',
      enableTwoFactor: 'Habilitar autenticación de dos factores',
      disableTwoFactor: 'Deshabilitar autenticación de dos factores'
    }
  },

  // Sidebar
  sidebar: {
    collapse: 'Contraer barra lateral',
    expand: 'Expandir barra lateral'
  },

  // Breadcrumbs
  breadcrumbs: {
    home: 'Inicio',
    dashboard: 'Panel de control',
    users: 'Usuarios',
    settings: 'Configuración'
  },

  // Error pages
  errors: {
    notFound: {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe.',
      goHome: 'Ir al panel de control'
    },
    serverError: {
      title: 'Error del servidor',
      description: 'Algo salió mal de nuestro lado.',
      tryAgain: 'Intentar de nuevo'
    },
    unauthorized: {
      title: 'No autorizado',
      description: 'No tienes permisos para acceder a esta página.',
      goBack: 'Regresar'
    }
  },

  // Time and dates
  time: {
    justNow: 'Justo ahora',
    minutesAgo: 'hace {count} minutos | hace {count} minuto | hace {count} minutos',
    hoursAgo: 'hace {count} horas | hace {count} hora | hace {count} horas',
    daysAgo: 'hace {count} días | hace {count} día | hace {count} días',
    weeksAgo: 'hace {count} semanas | hace {count} semana | hace {count} semanas',
    monthsAgo: 'hace {count} meses | hace {count} mes | hace {count} meses',
    yearsAgo: 'hace {count} años | hace {count} año | hace {count} años'
  },

  // Notifications
  notifications: {
    title: 'Notificaciones',
    markAllAsRead: 'Marcar todas como leídas',
    noNotifications: 'Sin notificaciones',
    newNotification: 'Nueva notificación',
    
    // Types
    types: {
      info: 'Información',
      success: 'Éxito',
      warning: 'Advertencia',
      error: 'Error'
    }
  },

  // User menu
  userMenu: {
    profile: 'Tu perfil',
    settings: 'Configuración',
    signOut: 'Cerrar sesión'
  },

  // Demo page
  demo: {
    title: 'Demostración de Internacionalización',
    description: 'Esta página demuestra las funciones de i18n implementadas en la plantilla de administración.',
    welcome: '¡Bienvenido, {name}!',
    itemsCount: 'Tienes {count} artículos',
    
    translations: {
      title: 'Ejemplos de Traducción',
      basic: 'Traducciones Básicas',
      pluralization: 'Pluralización',
      dynamic: 'Contenido Dinámico'
    },
    
    formatting: {
      title: 'Ejemplos de Formato',
      dates: 'Formato de Fecha',
      numbers: 'Formato de Números',
      relativeTime: 'Tiempo Relativo',
      now: 'Ahora',
      yesterday: 'Ayer',
      lastWeek: 'La semana pasada',
      decimal: 'Decimal',
      currency: 'Moneda',
      percent: 'Porcentaje',
      fiveMinutesAgo: 'Hace 5 minutos',
      twoHoursAgo: 'Hace 2 horas',
      threeDaysAgo: 'Hace 3 días'
    },
    
    locale: {
      title: 'Información de Configuración Regional Actual',
      available: 'Disponibles',
      languages: 'Idiomas',
      persistent: 'Persistente',
      storage: 'Almacenamiento Local'
    }
  }
}