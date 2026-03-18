import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [
        admin({
            defaultRole: "bureau",
            adminRole: ["admin"],
        }),
    ]
});
