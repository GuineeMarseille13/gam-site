-- AlterTable
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "source_label" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "source_image_url" TEXT;
