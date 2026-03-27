/**
 * Exemples d'utilisation du service CRUD générique
 * 
 * Ce fichier montre comment utiliser le CrudService pour différents modèles
 */

/* eslint-disable @typescript-eslint/no-unused-vars -- exemples documentés, non exécutés par l’app */
import { createCrudService } from './crud.service'

// ============================================
// Exemple 1: Service pour les produits
// ============================================
const productService = createCrudService('Product')

// Créer un produit
async function createProduct() {
  const product = await productService.create({
    title: 'T-shirt GAM',
    description: 'T-shirt officiel de l\'association',
    price: 2000, // 20€ en centimes
    stock: 50,
    isActive: true,
  })
  return product
}

// Trouver tous les produits actifs
async function getActiveProducts() {
  const products = await productService.findAll({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
  return products
}

// Trouver un produit par ID avec sa catégorie
async function getProductWithCategory(productId: string) {
  const product = await productService.findById(productId, {
    include: {
      productCategory: true,
    },
  })
  return product
}

// Mettre à jour le stock d'un produit
async function updateProductStock(productId: string, newStock: number) {
  const product = await productService.updateById(productId, {
    stock: newStock,
  })
  return product
}

// Pagination des produits
async function getProductsPaginated(page: number = 1, limit: number = 10) {
  const result = await productService.findManyPaginated({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    page,
    limit,
  })
  return result
}

// ============================================
// Exemple 2: Service pour les commandes
// ============================================
const orderService = createCrudService('Order')

// Trouver une commande avec ses items et produits
async function getOrderWithItems(orderId: string) {
  const order = await orderService.findById(orderId, {
    include: {
      items: {
        include: {
          product: true,
        },
      },
      person: true,
    },
  })
  return order
}

// Trouver toutes les commandes d'une personne
async function getPersonOrders(personId: string) {
  const orders = await orderService.findAll({
    where: { personId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return orders
}

// ============================================
// Exemple 3: Service pour les personnes
// ============================================
const personService = createCrudService('Person')

// Créer une personne
async function createPerson(data: {
  firstName: string
  lastName: string
  email?: string
  phone: string
}) {
  const person = await personService.create(data)
  return person
}

// Trouver une personne par email
async function findPersonByEmail(email: string) {
  const person = await personService.findOne({
    where: { email },
  })
  return person
}

// Compter le nombre de personnes
async function countPersons() {
  const count = await personService.count()
  return count
}

// ============================================
// Exemple 4: Service pour les images
// ============================================
const imageService = createCrudService('Image')

// Trouver toutes les images d'une page spécifique
async function getImagesByPage(page: string) {
  const images = await imageService.findAll({
    where: { page },
    orderBy: { order: 'asc' },
  })
  return images
}

// ============================================
// Exemple 5: Opérations avancées
// ============================================

// Upsert (créer ou mettre à jour)
async function upsertProduct(productId: string, data: Record<string, unknown>) {
  const product = await productService.upsert(
    { id: productId },
    data, // create
    data  // update
  )
  return product
}

// Mettre à jour plusieurs enregistrements
async function deactivateAllProducts() {
  const result = await productService.updateMany(
    { isActive: true },
    { isActive: false }
  )
  return result.count // Nombre d'enregistrements mis à jour
}

// Supprimer plusieurs enregistrements
async function deleteInactiveProducts() {
  const result = await productService.deleteMany({
    isActive: false,
  })
  return result.count // Nombre d'enregistrements supprimés
}

// Créer plusieurs produits en une fois
async function createMultipleProducts(products: Record<string, unknown>[]) {
  const result = await productService.createMany(products, {
    skipDuplicates: true, // Ignorer les doublons
  })
  return result.count // Nombre de produits créés
}

// ============================================
// Exemple 6: Service personnalisé avec méthodes spécifiques
// ============================================
export const customProductService = {
  // Utiliser les méthodes CRUD de base
  ...createCrudService('Product'),

  // Ajouter des méthodes spécifiques
  async findActiveProducts() {
    return productService.findAll({
      where: { isActive: true },
      include: { productCategory: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findByCategory(categoryId: string) {
    return productService.findAll({
      where: {
        productCategoryId: categoryId,
        isActive: true,
      },
    })
  },

  async updateStock(productId: string, quantity: number) {
    return productService.updateById(productId, {
      stock: { increment: quantity },
    })
  },

  async decreaseStock(productId: string, quantity: number) {
    return productService.updateById(productId, {
      stock: { decrement: quantity },
    })
  },
}

