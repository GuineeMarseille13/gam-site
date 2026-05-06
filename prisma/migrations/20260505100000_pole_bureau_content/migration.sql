-- Contenu éditable depuis le bureau par slug de pôle public.
CREATE TABLE IF NOT EXISTS "pole_bureau_content" (
    "slug" TEXT NOT NULL,
    "aboutSectionText" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pole_bureau_content_pkey" PRIMARY KEY ("slug")
);

-- Reprise du texte « À propos » déjà stocké sur les paramètres permanence (pôle démarche administrative).
INSERT INTO "pole_bureau_content" ("slug", "aboutSectionText", "updatedAt")
SELECT 'demarche-administrative', a."aboutSectionText", NOW()
FROM "administrative_permanence_settings" a
WHERE a.id = 'default'
  AND a."aboutSectionText" IS NOT NULL
  AND TRIM(a."aboutSectionText") <> ''
ON CONFLICT ("slug") DO NOTHING;
