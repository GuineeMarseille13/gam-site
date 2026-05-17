import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { admin } from "better-auth/plugins"
import { betterAuthAdminPluginOptions } from "@/config/better-auth-admin"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3001",
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [admin(betterAuthAdminPluginOptions)],
})
