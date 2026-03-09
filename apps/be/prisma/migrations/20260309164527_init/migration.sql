-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "zh" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Translation_zh_key" ON "Translation"("zh");
