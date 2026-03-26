-- Migration données : enum Role → table roles + FK (sans perte de données sur reviews/persons)

-- 1) Table roles + graines (ids stables pour reproductibilité)
CREATE TABLE IF NOT EXISTS "roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label_fr" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "roles_code_key" ON "roles"("code");

INSERT INTO "roles" ("id", "code", "label_fr", "sort_order", "is_active", "createdAt", "updatedAt")
VALUES
  ('cm_role_seed_president', 'PRESIDENT', 'Président(e)', 10, true, now(), now()),
  ('cm_role_seed_vp', 'VICE_PRESIDENT', 'Vice-président(e)', 20, true, now(), now()),
  ('cm_role_seed_sec', 'SECRETARY', 'Secrétaire', 30, true, now(), now()),
  ('cm_role_seed_asec', 'ASSISTANT_SECRETARY', 'Secrétaire adjoint(e)', 40, true, now(), now()),
  ('cm_role_seed_tre', 'TREASURER', 'Trésorier(ère)', 50, true, now(), now()),
  ('cm_role_seed_atre', 'ASSISTANT_TREASURER', 'Trésorier(ère) adjoint(e)', 60, true, now(), now()),
  ('cm_role_seed_vol', 'VOLUNTEER', 'Bénévole', 70, true, now(), now()),
  ('cm_role_seed_mem', 'MEMBER', 'Membre', 80, true, now(), now()),
  ('cm_role_seed_amb', 'AMBASSADOR', 'Ambassadeur(rice)', 90, true, now(), now()),
  ('cm_role_seed_oth', 'OTHER', 'Autre', 100, true, now(), now())
ON CONFLICT ("code") DO NOTHING;

-- 2) Reviews : ajouter roleId, copier depuis l’enum, puis supprimer l’enum colonne
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "roleId" TEXT;

UPDATE "reviews" r
SET "roleId" = s.id
FROM "roles" s
WHERE r."roleId" IS NULL
  AND EXISTS (
    SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema = 'public' AND c.table_name = 'reviews' AND c.column_name = 'role'
  )
  AND s.code = r."role"::text;

UPDATE "reviews"
SET "roleId" = (SELECT "id" FROM "roles" WHERE "code" = 'MEMBER' LIMIT 1)
WHERE "roleId" IS NULL;

ALTER TABLE "reviews" DROP COLUMN IF EXISTS "role";

ALTER TABLE "reviews" ALTER COLUMN "roleId" SET NOT NULL;

-- 3) Persons : roleId depuis le 1er élément du tableau enum
ALTER TABLE "persons" ADD COLUMN IF NOT EXISTS "roleId" TEXT;

UPDATE "persons" p
SET "roleId" = s.id
FROM "roles" s
WHERE p."roleId" IS NULL
  AND EXISTS (
    SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema = 'public' AND c.table_name = 'persons' AND c.column_name = 'roles'
  )
  AND p."roles" IS NOT NULL
  AND array_length(p."roles", 1) >= 1
  AND s.code = p."roles"[1]::text;

UPDATE "persons"
SET "roleId" = (SELECT "id" FROM "roles" WHERE "code" = 'VOLUNTEER' LIMIT 1)
WHERE "roleId" IS NULL;

ALTER TABLE "persons" DROP COLUMN IF EXISTS "roles";

CREATE INDEX IF NOT EXISTS "persons_roleId_idx" ON "persons"("roleId");
CREATE INDEX IF NOT EXISTS "reviews_roleId_idx" ON "reviews"("roleId");

-- 4) TeamMember : poste supprimé (rôle sur Person)
ALTER TABLE "team_members" DROP COLUMN IF EXISTS "poste";

-- 5) FKs (idempotents si déjà présents)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_roleId_fkey'
  ) THEN
    ALTER TABLE "reviews" ADD CONSTRAINT "reviews_roleId_fkey"
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'persons_roleId_fkey'
  ) THEN
    ALTER TABLE "persons" ADD CONSTRAINT "persons_roleId_fkey"
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'team_members_personId_fkey'
  ) THEN
    ALTER TABLE "team_members" ADD CONSTRAINT "team_members_personId_fkey"
      FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 6) Type enum PostgreSQL obsolète
DROP TYPE IF EXISTS "Role";
