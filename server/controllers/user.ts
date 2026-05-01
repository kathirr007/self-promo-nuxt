import type { H3Event } from 'h3'
import type { User } from '~~/server/models/types/user'
import bcrypt from 'bcryptjs'
// import { HTTPError } from 'h3'
import UserModel from '~~/server/models/user'

// Define types for request bodies and responses
interface RegisterData {
  email: string
  password: string
  passwordConfirmation: string
}

interface LoginData {
  email: string
  password: string
}

interface ResetPasswordData {
  email: string
  oldPassword: string
  newPassword: string
}

interface ErrorResponse {
  errors: {
    [key: string]: string
    message: string
  }
}

interface SuccessResponse {
  status: string
  message: string
}

// Register new user
export const handleRegister = defineEventHandler(async (event: H3Event) => {
  const registerData = await readBody<RegisterData>(event)

  if (!registerData?.email) {
    throw createError({ statusCode: 422, message: 'Email is required' })
  }

  if (!registerData.password) {
    throw createError({ statusCode: 422, message: 'Password is required' })
  }

  if (registerData.password !== registerData.passwordConfirmation) {
    throw createError({ statusCode: 422, message: 'Password confirmation mismatch' })
  }

  try {
    const user = await createUser(registerData)
    return user
  }
  catch (errors) {
    throw createError({ statusCode: 422, message: errors instanceof Error ? errors.message : 'Registration failed' })
  }
})

// Get current user from session
export const getCurrentUser = defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  if (!user) {
    throw createError({ statusCode: 422, message: 'User not authenticated' })
  }

  return user
})

// Login user
export const handleLogin = defineEventHandler(async (event: H3Event) => {
  const loginData = await readBody<LoginData>(event)

  if (!loginData?.email) {
    throw createError({ statusCode: 422, message: 'Email is required' })
  }

  if (!loginData?.password) {
    throw createError({ statusCode: 422, message: 'Password is required' })
  }

  try {
    const user = await authenticateUser(loginData.email, loginData.password)

    if (user) {
      await setUserSession(event, { user: user as Record<string, any> })
      return await getUserSession(event)
    }
    else {
      throw createError({ statusCode: 422, message: 'Invalid password or email' })
    }
  }
  catch (error) {
    throw createError({ statusCode: 422, message: 'Authentication failed' })
  }
})

// Reset password
export const resetPassword = defineEventHandler(async (event) => {
  const resetPasswordData = await readBody<ResetPasswordData>(event)

  try {
    const user = await findUserByEmail((resetPasswordData as ResetPasswordData).email)

    if (!user) {
      throw createError({ statusCode: 422, message: 'User not found' })
    }

    const isMatch = await bcrypt.compare((resetPasswordData as ResetPasswordData).oldPassword, user.password)

    if (isMatch) {
      await updateUserPassword(user.email, (resetPasswordData as ResetPasswordData).newPassword)

      return {
        status: 'OK',
        message: 'Password has been reset successfully...',
      } as SuccessResponse
    }
    else {
      return {
        status: 'NOK',
        message: 'Old Password doesn\'t match with provided Password...',
      } as SuccessResponse
    }
  }
  catch (error) {
    throw createError({ statusCode: 422, message: 'Password reset failed' })
  }
})

// Logout user
export const handleLogout = defineEventHandler(async (event) => {
  await clearUserSession(event)
  return { status: 'Session destroyed!' }
})

// Helper functions that need to be implemented based on your user model and session management
async function getUserFromSession(event: any): Promise<User | null> {
  try {
    // Get the user session using nuxt-auth-utils
    const session = await getUserSession(event)

    if (!session?.user) {
      return null
    }

    // If session contains user data, return it
    if ((session.user as User).email) {
      // Optionally fetch fresh user data from database to ensure it's up to date
      const user = await UserModel.findOne({ email: (session.user as User).email })
      return user ? user.toObject() as User : null
    }

    return session.user as User
  }
  catch (error) {
    console.error('Error getting user from session:', error)
    return null
  }
}

async function createUser(userData: RegisterData): Promise<User> {
  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

    // Create new user with hashed password
    const newUser = new UserModel({
      email: userData.email,
      password: hashedPassword,
    })

    // Save user to database
    const savedUser = await newUser.save()

    // Return user without password
    // const { password, ...userWithoutPassword } = savedUser.toObject()
    // return userWithoutPassword as Partial<User>
    return savedUser.toObject()
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(`User creation failed: ${error.message}`)
    }
    throw new Error('User creation failed: Unknown error')
  }
}

async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    // Find user by email
    const user = await UserModel.findOne({ email }).select('+password')

    if (!user) {
      return null
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return null
    }

    // Return user without password
    // const { password: _, ...userWithoutPassword } = user.toObject()
    // return userWithoutPassword as Partial<User>
    return user.toObject()
  }
  catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await UserModel.findOne({ email }).select('+password')
    return user ? user.toObject() as User : null
  }
  catch (error) {
    console.error('Error finding user by email:', error)
    return null
  }
}

async function updateUserPassword(email: string, newPassword: string): Promise<void> {
  try {
    // Hash the new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update user password in database
    const result = await UserModel.updateOne(
      { email },
      { password: hashedPassword },
    )

    if (result.matchedCount === 0) {
      throw new Error('User not found')
    }

    if (result.modifiedCount === 0) {
      throw new Error('Password update failed')
    }
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(`Password update failed: ${error.message}`)
    }
    throw new Error('Password update failed: Unknown error')
  }
}
