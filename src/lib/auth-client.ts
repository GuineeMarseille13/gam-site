import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

/**
 * Base URL des routes Better Auth (`/api/auth`).
 * En navigateur : toujours l'origine courante (évite d'appeler la prod depuis localhost
 * si NEXT_PUBLIC_APP_URL est mal configuré — symptôme : « identifiants incorrects » avec un bon mot de passe).
 */
function resolveAuthBaseURL(): string | undefined {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/auth`
  }
  return undefined
}

export const authClient = createAuthClient({
  plugins: [adminClient()],
  baseURL: resolveAuthBaseURL(),
})

export const { signIn, signOut, signUp, useSession } = authClient
