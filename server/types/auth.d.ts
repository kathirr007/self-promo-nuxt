import type { ObjectId } from 'mongodb'

/**
 * Extend nuxt-auth-utils session types to include our custom User type
 * This allows type-safe access to user data throughout the application
 */

declare module '#auth-utils' {
  interface User {
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

  interface UserSession {
    user: User
  }
}

export {}
