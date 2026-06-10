-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_poste_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "reviews_poste_id_idx";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "poste_id";
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "country";
