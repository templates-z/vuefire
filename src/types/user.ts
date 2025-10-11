export interface User {
  id: string
  name: string
  email: string
  role: 'User' | 'Admin' | 'Editor' | 'SuperAdmin' | 'Author'
  avatar?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}