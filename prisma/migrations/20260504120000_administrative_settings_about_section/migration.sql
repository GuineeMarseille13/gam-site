-- Paragraphe « À propos » éditable depuis le bureau (pôle démarche administrative).
ALTER TABLE "administrative_permanence_settings" ADD COLUMN IF NOT EXISTS "aboutSectionText" TEXT;
