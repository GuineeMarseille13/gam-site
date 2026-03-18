/**
 * Script de création de l'utilisateur administrateur initial.
 *
 * Usage : npm run create-admin
 */

import "dotenv/config"
import { auth } from "../src/lib/auth"
import { Pool } from "pg"

const EMAIL = "admingam@gam.fr"
const PASSWORD = "GAMAdmin@13"
const NAME = "Admin GAM"

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  try {
    // ── Vérifier si l'utilisateur existe déjà ────────────────────────────────
    const { rows } = await pool.query<{ id: string; role: string | null }>(
      `SELECT id, role FROM "user" WHERE email = $1`,
      [EMAIL]
    )

    if (rows.length > 0) {
      const existing = rows[0]

      if (existing.role === "admin") {
        console.log("✓ L'administrateur existe déjà avec le rôle admin.")
        console.log(`  Email : ${EMAIL}`)
        return
      }

      // Existe mais n'est pas admin — on corrige le rôle
      await pool.query(`UPDATE "user" SET role = 'admin' WHERE id = $1`, [existing.id])
      console.log("✓ Rôle mis à jour → admin")
      console.log(`  Email : ${EMAIL}`)
      return
    }

    // ── Créer l'utilisateur via Better Auth (hash du mot de passe géré) ──────
    const result = await auth.api.signUpEmail({
      body: { email: EMAIL, password: PASSWORD, name: NAME },
    })

    if (!result?.user) {
      throw new Error("La création du compte a échoué.")
    }

    // ── Définir le rôle admin en base ─────────────────────────────────────────
    await pool.query(`UPDATE "user" SET role = 'admin' WHERE id = $1`, [result.user.id])

    console.log("✅ Administrateur créé avec succès !")
    console.log(`   Nom      : ${NAME}`)
    console.log(`   Email    : ${EMAIL}`)
    console.log(`   Mot de passe : ${PASSWORD}`)
    console.log("\n⚠️  Pensez à changer le mot de passe après la première connexion.")
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error("❌ Erreur :", err.message ?? err)
  process.exit(1)
})
