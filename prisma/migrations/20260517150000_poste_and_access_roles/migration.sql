-- Postes organisationnels : ancienne table roles → postes
ALTER TABLE "roles" RENAME TO "postes";

ALTER INDEX IF EXISTS "roles_pkey" RENAME TO "postes_pkey";
ALTER INDEX IF EXISTS "roles_code_key" RENAME TO "postes_code_key";

ALTER TABLE "persons" RENAME COLUMN "roleId" TO "poste_id";
ALTER TABLE "reviews" RENAME COLUMN "roleId" TO "poste_id";

ALTER INDEX IF EXISTS "persons_roleId_idx" RENAME TO "persons_poste_id_idx";
ALTER INDEX IF EXISTS "reviews_roleId_idx" RENAME TO "reviews_poste_id_idx";

ALTER TABLE "reviews" RENAME CONSTRAINT "reviews_roleId_fkey" TO "reviews_poste_id_fkey";
ALTER TABLE "persons" RENAME CONSTRAINT "persons_roleId_fkey" TO "persons_poste_id_fkey";

-- Rôles d’accès dashboard (référentiel)
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label_fr" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

INSERT INTO "roles" ("id", "code", "label_fr", "description", "sort_order", "is_active", "createdAt", "updatedAt") VALUES
  ('role_super_admin', 'SUPER-ADMIN', 'Super administrateur', 'Accès complet Bureau et Administration', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('role_bureau', 'BUREAU', 'Bureau', 'Accès au dashboard Bureau', 20, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('role_invite_bureau', 'INVITE-BUREAU', 'Invité bureau', 'Accès limité au dashboard Bureau', 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('role_admin_permadmin', 'ADMIN-PERMADMIN', 'Admin permanence', 'Administration permanence — droits étendus', 40, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('role_permadmin', 'PERMADMIN', 'Permanence administrative', 'Dashboard Administration', 50, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('role_invite_permadmin', 'INVITE-PERMADMIN', 'Invité permanence', 'Accès limité au dashboard Administration', 60, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Better Auth User.role → codes normalisés
UPDATE "user" SET "role" = 'SUPER-ADMIN' WHERE "role" = 'admin';
UPDATE "user" SET "role" = 'BUREAU' WHERE "role" = 'bureau';
UPDATE "user" SET "role" = 'ADMIN-PERMADMIN' WHERE "role" = 'administration';
UPDATE "user" SET "role" = 'INVITE-BUREAU' WHERE "role" = 'benevole';
