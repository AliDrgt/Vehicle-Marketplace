/*
  Warnings:

  - You are about to drop the column `brand` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "brand",
DROP COLUMN "model",
ADD COLUMN     "brandId" INTEGER NOT NULL,
ADD COLUMN     "modelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "CarBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
