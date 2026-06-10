-- CreateTable
CREATE TABLE "association_page_contents" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "imageId" TEXT,
    "intro" TEXT,
    "items" JSONB,
    "conclusion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "association_page_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "association_page_contents_key_key" ON "association_page_contents"("key");
