import type { MultipartFile } from '~~/server/utils/s3'
import type { UploadedFile, UploadResponse } from '~~/types/upload'
import { readMultipartFormData } from 'h3'
import { fileValidation, uploadToS3, validateFile } from '~~/server/utils/s3'

export default defineEventHandler(async (event): Promise<UploadResponse> => {
  try {
    // Check if request is multipart/form-data
    const contentType = getHeader(event, 'content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content-Type must be multipart/form-data',
      })
    }

    // Parse multipart form data
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files were uploaded',
      })
    }

    // Filter files (ignore non-file fields)
    const files = formData.filter(item =>
      item.name === 'files'
      && item.data
      && item.data.length > 0,
    )

    if (files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid files found in the request',
      })
    }

    // Check file count limit
    if (files.length > fileValidation.maxFiles) {
      throw createError({
        statusCode: 400,
        statusMessage: `Too many files. Maximum is ${fileValidation.maxFiles} files at once.`,
      })
    }

    // Validate all files first
    const validationErrors: string[] = []
    for (const file of files) {
      // Convert MultiPartData to MultipartFile format for validation
      const multipartFile: MultipartFile = {
        name: file.name || 'files',
        filename: file.filename || 'unknown',
        type: file.type || 'application/octet-stream',
        size: file.data.length,
        arrayBuffer: async (): Promise<ArrayBuffer> => {
          return file.data.buffer.slice(
            file.data.byteOffset,
            file.data.byteOffset + file.data.byteLength,
          ) as ArrayBuffer
        },
      }

      const validation = validateFile(multipartFile)
      if (!validation.valid && validation.error) {
        validationErrors.push(validation.error)
      }
    }

    if (validationErrors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: validationErrors.join('; '),
      })
    }

    // Upload all files to S3
    const uploadPromises = files.map(async (file) => {
      try {
        // Convert MultiPartData to MultipartFile format
        const multipartFile: MultipartFile = {
          name: file.name || 'files',
          filename: file.filename || 'unknown',
          type: file.type || 'application/octet-stream',
          size: file.data.length,
          arrayBuffer: async (): Promise<ArrayBuffer> => {
            return file.data.buffer.slice(
              file.data.byteOffset,
              file.data.byteOffset + file.data.byteLength,
            ) as ArrayBuffer
          },
        }

        const storageLocation = formData.find(item => item.name === 'storageLocation')?.data.toString() || 'default'

        const s3Result = await uploadToS3(multipartFile, storageLocation)

        const uploadedFile: UploadedFile = {
          originalName: file.filename || 'unknown',
          fileName: s3Result.key,
          fileUrl: s3Result.location,
          fileSize: file.data.length,
          mimeType: file.type || 'application/octet-stream',
          bucket: s3Result.bucket,
          etag: s3Result.etag,
        }

        return uploadedFile
      }
      catch (error) {
        console.error(`Failed to upload ${file.filename}:`, error)
        throw new Error(`Failed to upload ${file.filename}`)
      }
    })

    // Wait for all uploads to complete
    const uploadedFiles = await Promise.all(uploadPromises)

    const response: UploadResponse = {
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    }

    return response
  }
  catch (error: any) {
    console.error('Upload API error:', error)

    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Otherwise, create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error during file upload',
    })
  }
})
