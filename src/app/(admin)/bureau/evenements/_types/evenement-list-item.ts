export interface EvenementListItem {
  readonly id: string
  readonly title: string
  readonly description: string | null
  readonly location: string | null
  readonly imageId: string | null
  readonly published: boolean
  readonly startDate: string
}
