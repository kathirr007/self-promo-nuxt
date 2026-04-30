import type { Document } from 'mongoose'
import type { User } from './types/user'
import * as Bcrypt from 'bcryptjs'
import { model, Schema } from 'mongoose'

// Define interface that extends Document for proper typing
interface IUser extends User, Document {
  comparePassword: (candidatePassword: string) => Promise<boolean>
}

const userSchema = new Schema<IUser>({
  avatar: String,
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: [6, 'Too short, min is 6 characters'],
  },
  username: {
    type: String,
    required: true,
    minlength: [6, 'Too short, min is 6 characters'],
  },
  password: {
    type: String,
    minlength: [4, 'Too short, min is 4 characters'],
    maxlength: [32, 'Too long, max is 32 characters'],
    required: true,
  },
  role: {
    type: String,
    enum: ['guest', 'admin'],
    required: true,
    default: 'guest',
  },
  info: String,
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Convert pre-save hook to use async/await for better error handling
userSchema.pre('save', async function () {
  if (!this.isModified('password'))
    return

  const salt = await Bcrypt.genSalt(10)
  this.password = await Bcrypt.hash(this.password, salt)
})

// Convert comparePassword method to return Promise for modern async/await usage
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await Bcrypt.compare(candidatePassword, this.password)
}

const UserModel = model<IUser>('User', userSchema)

export default UserModel
