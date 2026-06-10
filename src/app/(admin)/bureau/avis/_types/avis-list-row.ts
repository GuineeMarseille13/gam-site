export interface AvisListRow {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  sourceLabel: string | null
  sourceImageUrl: string | null
  rating: number
  order: number
  isActive: boolean
  isVerified: boolean
}
