import { Prisma } from '@/lib/generated/prisma/client'
import { errorResponse } from './response'

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, error.details)
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Gestion des erreurs Prisma
    switch (error.code) {
      case 'P2002':
        return errorResponse('Unique constraint violation', 409)
      case 'P2025':
        return errorResponse('Record not found', 404)
      default:
        return errorResponse('Database error', 500)
    }
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }

  return errorResponse('Internal server error', 500)
}