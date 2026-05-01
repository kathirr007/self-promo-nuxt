export interface UploadedFile {
  originalName: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  bucket: string
  etag: string
}

export interface UploadResponse {
  success: boolean
  message: string
  files: UploadedFile[]
}

export interface FileValidation {
  maxSize: number
  maxFiles: number
  allowedTypes: string[]
  allowedMimeTypes: string[]
}

export interface S3UploadResult {
  bucket: string
  key: string
  location: string
  etag: string
  size: number
}
