-- Alter contacts table: remove old addressId, add new fields with defaults
ALTER TABLE contacts DROP COLUMN IF EXISTS "addressId";
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "zipCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create ContactSubmissionStatus enum
DO $$ BEGIN
  CREATE TYPE "ContactSubmissionStatus" AS ENUM ('PENDING', 'READ', 'REPLIED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT NOT NULL PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName"  TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      "ContactSubmissionStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
