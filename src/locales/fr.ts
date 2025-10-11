export default {
  // Common/Global
  common: {
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    refresh: 'Actualiser',
    submit: 'Soumettre',
    reset: 'Réinitialiser',
    clear: 'Effacer',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    view: 'Voir',
    details: 'Détails',
    actions: 'Actions',
    status: 'Statut',
    active: 'Actif',
    inactive: 'Inactif',
    enabled: 'Activé',
    disabled: 'Désactivé',
    name: 'Nom',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    phone: 'Téléphone',
    address: 'Adresse',
    city: 'Ville',
    country: 'Pays',
    date: 'Date',
    time: 'Heure',
    created: 'Créé',
    updated: 'Mis à jour',
    createdAt: 'Créé le',
    updatedAt: 'Mis à jour le'
  },

  // Navigation
  nav: {
    dashboard: 'Tableau de bord',
    users: 'Utilisateurs',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
    notifications: 'Notifications'
  },

  // Authentication
  auth: {
    signIn: 'Connectez-vous à votre compte',
    signUp: 'Créer un nouveau compte',
    login: 'Se connecter',
    register: "S'inscrire",
    logout: 'Se déconnecter',
    forgotPassword: 'Mot de passe oublié ?',
    rememberMe: 'Se souvenir de moi',
    emailAddress: 'Adresse email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    fullName: 'Nom complet',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: "Vous n'avez pas de compte ?",
    createAccount: 'Créer un compte',
    signingIn: 'Connexion en cours...',
    signingUp: 'Création du compte...',
    enterEmail: 'Entrez votre email',
    enterPassword: 'Entrez votre mot de passe',
    enterFullName: 'Entrez votre nom complet',
    
    // Demo credentials
    demoCredentials: 'Identifiants de démonstration',
    adminCredentials: 'Admin: admin@example.com / password',
    userCredentials: 'Utilisateur: john@example.com / password',
    
    // Validation messages
    validation: {
      emailRequired: "L'email est requis",
      passwordRequired: 'Le mot de passe est requis',
      nameRequired: 'Le nom est requis',
      invalidEmail: 'Veuillez entrer une adresse email valide',
      passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas'
    },
    
    // Error messages
    errors: {
      loginFailed: 'Échec de la connexion',
      registrationFailed: "Échec de l'inscription",
      invalidCredentials: 'Email ou mot de passe invalide',
      userExists: "L'utilisateur existe déjà",
      networkError: 'Erreur réseau, veuillez réessayer'
    }
  },

  // Dashboard
  dashboard: {
    title: 'Tableau de bord',
    welcome: 'Bon retour !',
    overview: 'Aperçu',
    statistics: 'Statistiques',
    recentActivity: 'Activité récente',
    quickActions: 'Actions rapides',
    
    // Stats cards
    stats: {
      totalUsers: 'Total utilisateurs',
      activeUsers: 'Utilisateurs actifs',
      totalSales: 'Ventes totales',
      revenue: 'Revenus',
      orders: 'Commandes',
      products: 'Produits',
      visitors: 'Visiteurs',
      conversion: 'Taux de conversion'
    }
  },

  // Users
  users: {
    title: 'Utilisateurs',
    addUser: 'Ajouter un utilisateur',
    editUser: 'Modifier un utilisateur',
    deleteUser: 'Supprimer un utilisateur',
    userDetails: "Détails de l'utilisateur",
    userList: 'Liste des utilisateurs',
    searchUsers: 'Rechercher des utilisateurs...',
    noUsers: 'Aucun utilisateur trouvé',
    
    // Table headers
    table: {
      avatar: 'Avatar',
      name: 'Nom',
      email: 'Email',
      role: 'Rôle',
      status: 'Statut',
      lastLogin: 'Dernière connexion',
      actions: 'Actions'
    },
    
    // User roles
    roles: {
      admin: 'Administrateur',
      user: 'Utilisateur',
      moderator: 'Modérateur',
      editor: 'Éditeur'
    },
    
    // Confirmation messages
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    deleteSuccess: 'Utilisateur supprimé avec succès',
    saveSuccess: 'Utilisateur enregistré avec succès',
    updateSuccess: 'Utilisateur mis à jour avec succès'
  },

  // Settings
  settings: {
    title: 'Paramètres',
    general: 'Général',
    account: 'Compte',
    preferences: 'Préférences',
    notifications: 'Notifications',
    appearance: 'Apparence',
    
    // Theme settings
    theme: {
      title: 'Thème',
      description: 'Choisissez votre thème préféré',
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
      currentTheme: 'Thème actuel'
    },
    
    // Language settings
    language: {
      title: 'Langue',
      description: 'Choisissez votre langue préférée',
      current: 'Langue actuelle'
    },
    
    // Profile settings
    profile: {
      title: 'Paramètres du profil',
      description: 'Mettez à jour les informations de votre profil',
      avatar: 'Photo de profil',
      updateAvatar: 'Mettre à jour l\'avatar',
      personalInfo: 'Informations personnelles',
      contactInfo: 'Informations de contact'
    },
    
    // Security settings
    security: {
      title: 'Paramètres de sécurité',
      description: 'Gérez la sécurité de votre compte',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmNewPassword: 'Confirmer le nouveau mot de passe',
      twoFactor: 'Authentification à deux facteurs',
      enableTwoFactor: 'Activer l\'authentification à deux facteurs',
      disableTwoFactor: 'Désactiver l\'authentification à deux facteurs'
    }
  },

  // Sidebar
  sidebar: {
    collapse: 'Réduire la barre latérale',
    expand: 'Développer la barre latérale'
  },

  // Breadcrumbs
  breadcrumbs: {
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    users: 'Utilisateurs',
    settings: 'Paramètres'
  },

  // Error pages
  errors: {
    notFound: {
      title: 'Page non trouvée',
      description: 'La page que vous recherchez n\'existe pas.',
      goHome: 'Aller au tableau de bord'
    },
    serverError: {
      title: 'Erreur du serveur',
      description: 'Quelque chose s\'est mal passé de notre côté.',
      tryAgain: 'Réessayer'
    },
    unauthorized: {
      title: 'Non autorisé',
      description: 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.',
      goBack: 'Retour'
    }
  },

  // Time and dates
  time: {
    justNow: 'À l\'instant',
    minutesAgo: 'il y a {count} minutes | il y a {count} minute | il y a {count} minutes',
    hoursAgo: 'il y a {count} heures | il y a {count} heure | il y a {count} heures',
    daysAgo: 'il y a {count} jours | il y a {count} jour | il y a {count} jours',
    weeksAgo: 'il y a {count} semaines | il y a {count} semaine | il y a {count} semaines',
    monthsAgo: 'il y a {count} mois | il y a {count} mois | il y a {count} mois',
    yearsAgo: 'il y a {count} ans | il y a {count} an | il y a {count} ans'
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    markAllAsRead: 'Marquer toutes comme lues',
    noNotifications: 'Aucune notification',
    newNotification: 'Nouvelle notification',
    
    // Types
    types: {
      info: 'Info',
      success: 'Succès',
      warning: 'Avertissement',
      error: 'Erreur'
    }
  },

  // User menu
  userMenu: {
    profile: 'Votre profil',
    settings: 'Paramètres',
    signOut: 'Se déconnecter'
  },

  // Demo page
  demo: {
    title: 'Démonstration d\'Internationalisation',
    description: 'Cette page démontre les fonctionnalités i18n implémentées dans le modèle d\'administration.',
    welcome: 'Bienvenue, {name} !',
    itemsCount: 'Vous avez {count} éléments',
    
    translations: {
      title: 'Exemples de Traduction',
      basic: 'Traductions de Base',
      pluralization: 'Pluralisation',
      dynamic: 'Contenu Dynamique'
    },
    
    formatting: {
      title: 'Exemples de Formatage',
      dates: 'Format de Date',
      numbers: 'Format de Nombres',
      relativeTime: 'Temps Relatif',
      now: 'Maintenant',
      yesterday: 'Hier',
      lastWeek: 'La semaine dernière',
      decimal: 'Décimal',
      currency: 'Devise',
      percent: 'Pourcentage',
      fiveMinutesAgo: 'Il y a 5 minutes',
      twoHoursAgo: 'Il y a 2 heures',
      threeDaysAgo: 'Il y a 3 jours'
    },
    
    locale: {
      title: 'Informations sur les Paramètres Régionaux Actuels',
      available: 'Disponibles',
      languages: 'Langues',
      persistent: 'Persistant',
      storage: 'Stockage Local'
    }
  }
}