/** Résultat des server actions « Mon profil ». */
export type ProfilActionResult =
  | { success: true }
  | { success: true; requiresReauth: true; loginPath: string }
  | { error: string }
