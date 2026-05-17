export interface AvisListRow {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  country: string | null
  rating: number
  order: number
  isActive: boolean
  isVerified: boolean
  poste: { labelFr: string; code: string }
}
