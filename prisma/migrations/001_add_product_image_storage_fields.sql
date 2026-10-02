-- Alter table
ALTER TABLE "ProductImage" 
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "imageType" TEXT NOT NULL DEFAULT 'gallery',
ADD COLUMN     "variantId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create indexes
CREATE INDEX "ProductImage_variantId_idx" ON "ProductImage"("variantId");
CREATE INDEX "ProductImage_imageType_idx" ON "ProductImage"("imageType");

-- Add foreign key constraint for variantId
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey" FOREIGN KEY("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
