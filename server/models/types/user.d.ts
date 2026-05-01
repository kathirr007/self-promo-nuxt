import type { Schema } from 'mongoose'

export interface User {
  avatar: string
  email: string
  name: string
  username: string
  password: string
  // Very simplified you should have separate collection with roles
  // You can create also array of roles in case of multiple roles
  role: string
  info: string
  projects: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}
