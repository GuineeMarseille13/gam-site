/**
 * Handlers génériques pour les routes API CRUD
 * Utilise le service CRUD pour éviter la duplication de code
 */

import { NextRequest, NextResponse } from 'next/server'
import { createCrudService } from '@/services/crud.service'
import type { Prisma } from '@/lib/generated/prisma/client'

/**
 * Options pour les handlers CRUD
 */
export interface CrudHandlerOptions {
  modelName: keyof Prisma.TypeMap['model']
  validateCreate?: (data: unknown) => Promise<unknown> | unknown
  validateUpdate?: (data: unknown) => Promise<unknown> | unknown
  beforeCreate?: (data: unknown) => Promise<unknown> | unknown
  beforeUpdate?: (data: unknown) => Promise<unknown> | unknown
  afterCreate?: (result: unknown) => Promise<unknown> | unknown
  afterUpdate?: (result: unknown) => Promise<unknown> | unknown
}

/**
 * Handler générique pour GET (findAll ou findById)
 */
export async function handleGet(
  request: NextRequest,
  options: CrudHandlerOptions
) {
  try {
    const service = createCrudService(options.modelName)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // GET /api/model?id=xxx
      const include = searchParams.get('include')
      const select = searchParams.get('select')
      
      const result = await service.findById(id, {
        include: include ? JSON.parse(include) : undefined,
        select: select ? JSON.parse(select) : undefined,
      })

      if (!result) {
        return NextResponse.json(
          { error: `${options.modelName} not found` },
          { status: 404 }
        )
      }

      return NextResponse.json(result)
    }

    // GET /api/model (findAll)
    const where = searchParams.get('where')
    const include = searchParams.get('include')
    const select = searchParams.get('select')
    const orderBy = searchParams.get('orderBy')
    const take = searchParams.get('take')
    const skip = searchParams.get('skip')
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')

    const queryOptions: {
      where?: unknown
      include?: unknown
      select?: unknown
      orderBy?: unknown
      take?: number
      skip?: number
    } = {
      where: where ? JSON.parse(where) : undefined,
      include: include ? JSON.parse(include) : undefined,
      select: select ? JSON.parse(select) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      skip: skip ? parseInt(skip, 10) : undefined,
    }

    // Si page et limit sont présents, utiliser la pagination
    if (page && limit) {
      const result = await service.findManyPaginated({
        ...queryOptions,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      })
      return NextResponse.json(result)
    }

    const result = await service.findAll(queryOptions)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`[GET ${options.modelName}] Error:`, error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * Handler générique pour POST (create)
 */
export async function handlePost(
  request: NextRequest,
  options: CrudHandlerOptions
) {
  try {
    const service = createCrudService(options.modelName)
    const body = await request.json()

    // Validation
    let data = body
    if (options.validateCreate) {
      data = await options.validateCreate(body)
    }

    // Hook beforeCreate
    if (options.beforeCreate) {
      data = await options.beforeCreate(data)
    }

    // Création
    const result = await service.create(data)

    // Hook afterCreate
    if (options.afterCreate) {
      await options.afterCreate(result)
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error(`[POST ${options.modelName}] Error:`, error)
    
    // Gérer les erreurs de validation
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * Handler générique pour PUT (updateById)
 */
export async function handlePut(
  request: NextRequest,
  options: CrudHandlerOptions
) {
  try {
    const service = createCrudService(options.modelName)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Vérifier que l'enregistrement existe
    const existing = await service.findById(id)
    if (!existing) {
      return NextResponse.json(
        { error: `${options.modelName} not found` },
        { status: 404 }
      )
    }

    // Validation
    let data = body
    if (options.validateUpdate) {
      data = await options.validateUpdate(body)
    }

    // Hook beforeUpdate
    if (options.beforeUpdate) {
      data = await options.beforeUpdate(data)
    }

    // Mise à jour
    const result = await service.updateById(id, data)

    // Hook afterUpdate
    if (options.afterUpdate) {
      await options.afterUpdate(result)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`[PUT ${options.modelName}] Error:`, error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * Handler générique pour DELETE (deleteById)
 */
export async function handleDelete(
  request: NextRequest,
  options: CrudHandlerOptions
) {
  try {
    const service = createCrudService(options.modelName)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    // Vérifier que l'enregistrement existe
    const existing = await service.findById(id)
    if (!existing) {
      return NextResponse.json(
        { error: `${options.modelName} not found` },
        { status: 404 }
      )
    }

    // Suppression
    await service.deleteById(id)

    return NextResponse.json(
      { message: `${options.modelName} deleted successfully` },
      { status: 200 }
    )
  } catch (error) {
    console.error(`[DELETE ${options.modelName}] Error:`, error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * Crée un handler CRUD complet pour un modèle
 */
export function createCrudHandler(options: CrudHandlerOptions) {
  return {
    GET: (request: NextRequest) => handleGet(request, options),
    POST: (request: NextRequest) => handlePost(request, options),
    PUT: (request: NextRequest) => handlePut(request, options),
    DELETE: (request: NextRequest) => handleDelete(request, options),
  }
}

