// src/services/crud.service.ts

import prisma from '@/lib/prisma'
import type { Prisma } from '@/lib/generated/prisma/client'

/**
 * Options pour la pagination
 */
export interface PaginationOptions {
  page?: number
  limit?: number
}

/**
 * Résultat paginé
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Convertit un nom de modèle PascalCase en camelCase pour l'accès Prisma
 * Ex: "Product" -> "product", "OrderItem" -> "orderItem"
 */
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * Service CRUD générique pour toutes les tables Prisma
 * 
 * @template ModelName - Nom du modèle Prisma en PascalCase (ex: 'Product', 'Order', 'Person')
 * 
 * @example
 * ```ts
 * const productService = new CrudService('Product')
 * const products = await productService.findAll({ where: { isActive: true } })
 * ```
 */
export class CrudService<ModelName extends keyof Prisma.TypeMap['model']> {
  private modelName: string
  private model: any

  constructor(modelName: ModelName) {
    this.modelName = modelName as string
    const delegateName = toCamelCase(this.modelName) as keyof typeof prisma
    this.model = prisma[delegateName]
    
    if (!this.model) {
      throw new Error(`Model "${this.modelName}" not found in Prisma client. Available models: ${Object.keys(prisma).filter(k => !k.startsWith('$') && typeof prisma[k as keyof typeof prisma] === 'object').join(', ')}`)
    }
  }

  /**
   * Crée un nouvel enregistrement
   */
  async create<T = any>(
    data: any
  ): Promise<T> {
    try {
      return await this.model.create({ data })
    } catch (error) {
      throw this.handleError(error, 'create')
    }
  }

  /**
   * Crée plusieurs enregistrements
   */
  async createMany(
    data: any[],
    options?: { skipDuplicates?: boolean }
  ): Promise<{ count: number }> {
    try {
      return await this.model.createMany({ data, ...options })
    } catch (error) {
      throw this.handleError(error, 'createMany')
    }
  }

  /**
   * Trouve un enregistrement par son ID
   */
  async findById<T = any>(
    id: string,
    options?: { include?: any; select?: any }
  ): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
        ...options,
      })
    } catch (error) {
      throw this.handleError(error, 'findById')
    }
  }

  /**
   * Trouve un enregistrement unique selon des critères
   */
  async findOne<T = any>(
    options?: {
      where?: any
      include?: any
      select?: any
      orderBy?: any
    }
  ): Promise<T | null> {
    try {
      return await this.model.findFirst(options)
    } catch (error) {
      throw this.handleError(error, 'findOne')
    }
  }

  /**
   * Trouve plusieurs enregistrements
   */
  async findAll<T = any>(
    options?: {
      where?: any
      include?: any
      select?: any
      orderBy?: any
      take?: number
      skip?: number
    }
  ): Promise<T[]> {
    try {
      return await this.model.findMany(options)
    } catch (error) {
      throw this.handleError(error, 'findAll')
    }
  }

  /**
   * Trouve plusieurs enregistrements avec pagination
   */
  async findManyPaginated<T = any>(
    options?: {
      where?: any
      include?: any
      select?: any
      orderBy?: any
      page?: number
      limit?: number
    }
  ): Promise<PaginatedResult<T>> {
    try {
      const { page = 1, limit = 10, ...queryOptions } = options || {}
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
        this.model.findMany({
          ...queryOptions,
          skip,
          take: limit,
        }),
        this.model.count({
          where: queryOptions.where,
        }),
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    } catch (error) {
      throw this.handleError(error, 'findManyPaginated')
    }
  }

  /**
   * Compte le nombre d'enregistrements
   */
  async count(
    options?: {
      where?: any
    }
  ): Promise<number> {
    try {
      return await this.model.count(options)
    } catch (error) {
      throw this.handleError(error, 'count')
    }
  }

  /**
   * Met à jour un enregistrement par son ID
   */
  async updateById<T = any>(
    id: string,
    data: any,
    options?: {
      include?: any
      select?: any
    }
  ): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
        ...options,
      })
    } catch (error) {
      throw this.handleError(error, 'updateById')
    }
  }

  /**
   * Met à jour plusieurs enregistrements
   */
  async updateMany(
    where: any,
    data: any
  ): Promise<{ count: number }> {
    try {
      return await this.model.updateMany({ where, data })
    } catch (error) {
      throw this.handleError(error, 'updateMany')
    }
  }

  /**
   * Met à jour ou crée un enregistrement (upsert)
   */
  async upsert<T = any>(
    where: any,
    create: any,
    update: any,
    options?: {
      include?: any
      select?: any
    }
  ): Promise<T> {
    try {
      return await this.model.upsert({
        where,
        create,
        update,
        ...options,
      })
    } catch (error) {
      throw this.handleError(error, 'upsert')
    }
  }

  /**
   * Supprime un enregistrement par son ID
   */
  async deleteById<T = any>(
    id: string,
    options?: {
      include?: any
      select?: any
    }
  ): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
        ...options,
      })
    } catch (error) {
      throw this.handleError(error, 'deleteById')
    }
  }

  /**
   * Supprime plusieurs enregistrements
   */
  async deleteMany(
    where: any
  ): Promise<{ count: number }> {
    try {
      return await this.model.deleteMany({ where })
    } catch (error) {
      throw this.handleError(error, 'deleteMany')
    }
  }

  /**
   * Gère les erreurs de manière cohérente
   */
  private handleError(error: unknown, operation: string): Error {
    if (error instanceof Error) {
      console.error(`[CrudService:${this.modelName}] Error in ${operation}:`, error.message)
      // Préserver les erreurs Prisma pour un meilleur debugging
      if ('code' in error) {
        return error as Error
      }
      return error
    }
    return new Error(`Unknown error in ${operation} for model ${this.modelName}`)
  }
}

/**
 * Factory function pour créer facilement des services CRUD
 * 
 * @example
 * ```ts
 * const productService = createCrudService('Product')
 * const orderService = createCrudService('Order')
 * 
 * // Utilisation
 * const products = await productService.findAll({ where: { isActive: true } })
 * const order = await orderService.findById('order-id', { include: { items: true } })
 * ```
 */
export function createCrudService<ModelName extends keyof Prisma.TypeMap['model']>(
  modelName: ModelName
): CrudService<ModelName> {
  return new CrudService(modelName)
}