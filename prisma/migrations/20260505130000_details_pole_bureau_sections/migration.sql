-- Sections éditables bureau → `details_poles` ; slug public sur `poles` ; fin de `pole_bureau_content` et `aboutSectionText` permanence.

ALTER TABLE "details_poles" ADD COLUMN "aboutSectionText" TEXT,
ADD COLUMN "servicesSectionText" TEXT,
ADD COLUMN "statisticsSectionText" TEXT,
ADD COLUMN "achievementsSectionText" TEXT;

ALTER TABLE "poles" ADD COLUMN "public_slug" TEXT;

CREATE UNIQUE INDEX "poles_public_slug_key" ON "poles"("public_slug");

UPDATE "poles" p SET public_slug = 'evenementiel' FROM (
  SELECT id FROM "poles" WHERE name ILIKE '%événementiel%' OR name ILIKE '%evenementiel%' ORDER BY "createdAt" ASC LIMIT 1
) sub WHERE p.id = sub.id;

UPDATE "poles" p SET public_slug = 'demarche-administrative' FROM (
  SELECT id FROM "poles" WHERE (name ILIKE '%démarche%' OR name ILIKE '%demarche%') AND (name ILIKE '%administratif%' OR name ILIKE '%administrative%') ORDER BY "createdAt" ASC LIMIT 1
) sub WHERE p.id = sub.id;

UPDATE "poles" p SET public_slug = 'mise-en-relation' FROM (
  SELECT id FROM "poles" WHERE name ILIKE '%mise%' AND name ILIKE '%relation%' ORDER BY "createdAt" ASC LIMIT 1
) sub WHERE p.id = sub.id;

DO $$
BEGIN
  IF to_regclass('public.pole_bureau_content') IS NOT NULL THEN
    UPDATE "details_poles" d
    SET "aboutSectionText" = pbc."aboutSectionText"
    FROM "poles" p
    INNER JOIN "pole_bureau_content" pbc ON pbc.slug = p.public_slug
    WHERE d.id = p."detailsPoleId"
      AND p.public_slug IS NOT NULL
      AND pbc."aboutSectionText" IS NOT NULL
      AND TRIM(pbc."aboutSectionText") <> '';
  END IF;
END $$;

UPDATE "details_poles" d
SET "aboutSectionText" = a."aboutSectionText"
FROM "poles" p
CROSS JOIN "administrative_permanence_settings" a
WHERE d.id = p."detailsPoleId"
  AND p.public_slug = 'demarche-administrative'
  AND (d."aboutSectionText" IS NULL OR TRIM(COALESCE(d."aboutSectionText", '')) = '')
  AND a.id = 'default'
  AND a."aboutSectionText" IS NOT NULL
  AND TRIM(a."aboutSectionText") <> '';

DROP TABLE IF EXISTS "pole_bureau_content";

ALTER TABLE "administrative_permanence_settings" DROP COLUMN IF EXISTS "aboutSectionText";
