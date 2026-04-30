import type { ObjectId } from 'mongodb'

/**
 * User type that matches the server model and extends nuxt-auth-utils SessionUser
 * This type is used throughout the application for type-safe user data
 */
export interface SessionUser {
  /** Unique MongoDB identifier */
  _id: string | ObjectId
  /** User's display name */
  name: string
  /** User's username */
  username: string
  /** User's email address */
  email: string
  /** URL to user's avatar image */
  avatar?: string
  /** User's role (e.g., 'admin', 'user') */
  role: string
  /** Additional user information/bio */
  info?: string
  /** Array of project IDs associated with the user */
  projects?: string[] | ObjectId[]
  /** Account creation timestamp */
  createdAt?: Date | string
  /** Last update timestamp */
  updatedAt?: Date | string
}

/**
 * Type guard to check if a user object has admin role
 */
export function isAdminUser(user: SessionUser | null | undefined): user is SessionUser {
  return user?.role === 'admin'
}

/**
 * Type guard to check if a user object exists and is authenticated
 */
export function isAuthenticatedUser(user: SessionUser | null | undefined): user is SessionUser {
  return user !== null && user !== undefined && typeof user === 'object' && 'email' in user
}
