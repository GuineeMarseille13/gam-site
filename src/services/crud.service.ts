// src/services/crud.service.ts

import prisma from '@/lib/prisma'
import type { Prisma } from '@/lib/generated/prisma/client'

/**
 * Delegate Prisma minimal pour le service CRUD générique (évite `any` sur le client).
 */
type PrismaCrudDelegate = {
  create: (args: { data: unknown }) => Promise<unknown>
  createMany: (args: { data: unknown[]; skipDuplicates?: boolean }) => Promise<{ count: number }>
  findUnique: (args: unknown) => Promise<unknown>
  findFirst: (args: unknown) => Promise<unknown>
  findMany: (args: unknown) => Promise<unknown>
  count: (args: unknown) => Promise<number>
  update: (args: unknown) => Promise<unknown>
  updateMany: (args: { where: unknown; data: unknown }) => Promise<{ count: number }>
  upsert: (args: unknown) => Promise<unknown>
  delete: (args: unknown) => Promise<unknown>
  deleteMany: (args: { where: unknown }) => Promise<{ count: number }>
}

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
  private readonly model: PrismaCrudDelegate

  constructor(modelName: ModelName) {
    this.modelName = modelName as string
    const delegateName = toCamelCase(this.modelName) as keyof typeof prisma
    this.model = prisma[delegateName] as unknown as PrismaCrudDelegate
    
    if (!this.model) {
      throw new Error(`Model "${this.modelName}" not found in Prisma client. Available models: ${Object.keys(prisma).filter(k => !k.startsWith('$') && typeof prisma[k as keyof typeof prisma] === 'object').join(', ')}`)
    }
  }

  /**
   * Crée un nouvel enregistrement
   */
  async create<T = unknown>(data: unknown): Promise<T> {
    try {
      return (await this.model.create({ data })) as T
    } catch (error) {
      throw this.handleError(error, 'create')
    }
  }

  /**
   * Crée plusieurs enregistrements
   */
  async createMany(
    data: unknown[],
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
  async findById<T = unknown>(
    id: string,
    options?: { include?: unknown; select?: unknown }
  ): Promise<T | null> {
    try {
      return (await this.model.findUnique({
        where: { id },
        ...options,
      })) as T | null
    } catch (error) {
      throw this.handleError(error, 'findById')
    }
  }

  /**
   * Trouve un enregistrement unique selon des critères
   */
  async findOne<T = unknown>(
    options?: {
      where?: unknown
      include?: unknown
      select?: unknown
      orderBy?: unknown
    }
  ): Promise<T | null> {
    try {
      return (await this.model.findFirst(options)) as T | null
    } catch (error) {
      throw this.handleError(error, 'findOne')
    }
  }

  /**
   * Trouve plusieurs enregistrements
   */
  async findAll<T = unknown>(
    options?: {
      where?: unknown
      include?: unknown
      select?: unknown
      orderBy?: unknown
      take?: number
      skip?: number
    }
  ): Promise<T[]> {
    try {
      return (await this.model.findMany(options)) as T[]
    } catch (error) {
      throw this.handleError(error, 'findAll')
    }
  }

  /**
   * Trouve plusieurs enregistrements avec pagination
   */
  async findManyPaginated<T = unknown>(
    options?: {
      where?: unknown
      include?: unknown
      select?: unknown
      orderBy?: unknown
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
        data: data as T[],
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
      where?: unknown
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
  async updateById<T = unknown>(
    id: string,
    data: unknown,
    options?: {
      include?: unknown
      select?: unknown
    }
  ): Promise<T> {
    try {
      return (await this.model.update({
        where: { id },
        data,
        ...options,
      })) as T
    } catch (error) {
      throw this.handleError(error, 'updateById')
    }
  }

  /**
   * Met à jour plusieurs enregistrements
   */
  async updateMany(
    where: unknown,
    data: unknown
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
  async upsert<T = unknown>(
    where: unknown,
    create: unknown,
    update: unknown,
    options?: {
      include?: unknown
      select?: unknown
    }
  ): Promise<T> {
    try {
      return (await this.model.upsert({
        where,
        create,
        update,
        ...options,
      })) as T
    } catch (error) {
      throw this.handleError(error, 'upsert')
    }
  }

  /**
   * Supprime un enregistrement par son ID
   */
  async deleteById<T = unknown>(
    id: string,
    options?: {
      include?: unknown
      select?: unknown
    }
  ): Promise<T> {
    try {
      return (await this.model.delete({
        where: { id },
        ...options,
      })) as T
    } catch (error) {
      throw this.handleError(error, 'deleteById')
    }
  }

  /**
   * Supprime plusieurs enregistrements
   */
  async deleteMany(
    where: unknown
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