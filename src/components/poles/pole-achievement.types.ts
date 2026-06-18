/**
 * Types partagés pour la section « Nos réalisations » des pages pôle.
 */
export interface PoleAchievementImage {
  readonly url: string;
  readonly title?: string;
  readonly description?: string;
}

export interface PoleAchievementColorScheme {
  readonly primary: string;
  readonly secondary?: string;
}
