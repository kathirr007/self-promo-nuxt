import type { FileValidation, S3UploadResult } from '~~/types/upload'
import { Buffer } from 'node:buffer'
import { DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

// Define MultipartFile interface for h3 multipart form data
export interface MultipartFile {
  name: string
  filename?: string
  type?: string
  size: number
  arrayBuffer: () => Promise<ArrayBuffer>
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || process.env.AWSRegion || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWSAccessKeyId || '',
    secretAccessKey: process.env.AWSSecretKey || '',
  },
  // Force path style for some S3-compatible services
  forcePathStyle: false,
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'kathirr007-portfolio'

// File validation configuration
export const fileValidation: FileValidation = {
  maxSize: 100 * 1024 * 1024, // 100MB
  maxFiles: 50,
  allowedTypes: ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'],
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
}

/**
 * Detect MIME type from buffer magic bytes
 * @param buffer - File buffer to analyze
 * @returns Detected MIME type or fallback
 */
function detectMimeType(buffer: Buffer): string {
  // Check magic bytes for common image formats
  if (buffer.length >= 4) {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'image/jpeg'
    }
    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image/png'
    }
    // GIF: 47 49 46 38
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
      return 'image/gif'
    }
    // WebP: 52 49 46 46 ... 57 45 42 50
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer.length >= 12) {
      if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return 'image/webp'
      }
    }
  }

  // Default to jpeg if cannot detect
  return 'image/jpeg'
}

/**
 * Get file extension from MIME type
 * @param mimeType - MIME type string
 * @returns File extension
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  }
  return mimeToExt[mimeType] || 'jpg'
}

/**
 * Generate unique file key with timestamp and random suffix
 * @param originalName - Original filename
 * @returns Unique S3 key
 */
export function generateFileKey(originalName: string): string {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const extension = originalName.split('.').pop() || ''
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '_')
  return `${uniqueSuffix}-${baseName}.${extension}`
}

/**
 * Validate uploaded file
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateFile(file: MultipartFile): { valid: boolean, error?: string } {
  // Check file size
  if (file.size > fileValidation.maxSize) {
    return {
      valid: false,
      error: `File "${file.filename}" is too large. Maximum size is ${Math.round(fileValidation.maxSize / (1024 * 1024))}MB.`,
    }
  }

  // Check file extension
  const extension = file.filename?.split('.').pop()?.toLowerCase()
  if (!extension || !fileValidation.allowedTypes.includes(extension)) {
    return {
      valid: false,
      error: `File "${file.filename}" has an unsupported format. Allowed: ${fileValidation.allowedTypes.join(', ')}`,
    }
  }

  // Check MIME type
  if (file.type && !fileValidation.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File "${file.filename}" has an unsupported MIME type.`,
    }
  }

  return { valid: true }
}

/**
 * Upload file buffer to S3 with automatic MIME type detection
 * @param fileBuffer - File buffer to upload
 * @param folderPath - Optional folder path for organizing files
 * @returns Upload result with location and metadata
 */
export async function uploadToS3(fileBuffer: Buffer, folderPath?: string): Promise<S3UploadResult>
/**
 * Upload MultipartFile to S3 using provided MIME type
 * @param file - MultipartFile object from h3
 * @param folderPath - Optional folder path for organizing files
 * @returns Upload result with location and metadata
 */
export async function uploadToS3(file: MultipartFile, folderPath?: string): Promise<S3UploadResult>
export async function uploadToS3(fileOrBuffer: Buffer | MultipartFile, folderPath?: string): Promise<S3UploadResult> {
  try {
    let fileBuffer: Buffer
    let mimeType: string
    let originalName: string
    let key: string

    // Handle both Buffer and MultipartFile inputs
    if (Buffer.isBuffer(fileOrBuffer)) {
      // Direct buffer upload with MIME type detection
      fileBuffer = fileOrBuffer
      mimeType = detectMimeType(fileBuffer)
      const extension = getExtensionFromMimeType(mimeType)
      const timestamp = Date.now().toString()
      const uniqueFilename = `${timestamp}.${extension}`
      key = folderPath ? `${folderPath}/${uniqueFilename}` : uniqueFilename
      originalName = uniqueFilename
    }
    else {
      // MultipartFile upload with provided MIME type
      const file = fileOrBuffer
      fileBuffer = Buffer.from(await file.arrayBuffer())
      mimeType = file.type || detectMimeType(fileBuffer)
      originalName = file.filename || 'unknown'
      key = generateFileKey(originalName)
      if (folderPath) {
        key = `${folderPath}/${key}`
      }
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ACL: 'public-read',
      ContentType: mimeType,
      Metadata: {
        originalName,
        uploadedAt: new Date().toISOString(),
      },
    })

    const response = await s3Client.send(command)

    return {
      bucket: BUCKET_NAME,
      key,
      location: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || process.env.AWSRegion || 'us-east-2'}.amazonaws.com/${key}`,
      etag: response.ETag || '',
      size: fileBuffer.length,
    }
  }
  catch (error: any) {
    console.error('S3 Upload Error:', error.message)
    throw new Error(`Failed to upload file to S3: ${error.message}`)
  }
}

/**
 * Delete file from S3
 * @param key - S3 object key to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  }
  catch (error: any) {
    console.error('S3 Delete Error:', error.message)
    throw new Error(`Failed to delete file from S3: ${error.message}`)
  }
}

/**
 * Delete multiple images from S3
 * @param objectKeys - Array of S3 object keys to delete
 */
export async function deleteImagesFromS3(objectKeys: string[]): Promise<void> {
  if (!objectKeys || objectKeys.length === 0) {
    return
  }

  try {
    const objects = objectKeys.map(key => ({ Key: key }))
    const command = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: { Objects: objects, Quiet: true },
    })

    await s3Client.send(command)
    console.log(`Successfully deleted ${objectKeys.length} image(s) from S3`)
  }
  catch (error: any) {
    console.error('S3 Batch Delete Error:', error.message)
    throw new Error(`Failed to delete images from S3: ${error.message}`)
  }
}

/**
 * Extract S3 keys from a document's images array and delete them from S3
 * @param model - Mongoose model instance with images array
 * @param imagesField - Name of the images field (default: 'images')
 */
export async function deleteDocumentImages(model: any, imagesField: string = 'images'): Promise<void> {
  if (!model || !model[imagesField] || !Array.isArray(model[imagesField]) || model[imagesField].length === 0) {
    return
  }

  const s3Keys = model[imagesField]
    .map((img: any) => img.key || img.location?.split('/').slice(3).join('/'))
    .filter(Boolean)

  if (s3Keys.length > 0) {
    await deleteImagesFromS3(s3Keys)
  }
}
