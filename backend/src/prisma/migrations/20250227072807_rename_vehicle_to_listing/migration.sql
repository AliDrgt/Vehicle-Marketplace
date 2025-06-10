-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_vehicleId_fkey";
ALTER TABLE "Report" DROP CONSTRAINT "Report_vehicleId_fkey";
ALTER TABLE "VehiclePhoto" DROP CONSTRAINT "VehiclePhoto_vehicleId_fkey";

-- DropIndex
DROP INDEX "Favorite_userId_vehicleId_key";

-- Step 1: Add `listingId` column (but allow NULL temporarily)
ALTER TABLE "Favorite" ADD COLUMN "listingId" TEXT;
ALTER TABLE "Report" ADD COLUMN "listingId" TEXT;
ALTER TABLE "VehiclePhoto" ADD COLUMN "listingId" TEXT;
ALTER TABLE "Message" ADD COLUMN "listingId" TEXT;

-- Step 2: Copy existing data from `vehicleId` to `listingId`
UPDATE "Favorite" SET "listingId" = "vehicleId";
UPDATE "Report" SET "listingId" = "vehicleId";
UPDATE "VehiclePhoto" SET "listingId" = "vehicleId";
UPDATE "Message" SET "listingId" = "vehicleId";

-- Step 3: Drop `vehicleId` column
ALTER TABLE "Favorite" DROP COLUMN "vehicleId";
ALTER TABLE "Report" DROP COLUMN "vehicleId";
ALTER TABLE "VehiclePhoto" DROP COLUMN "vehicleId";
ALTER TABLE "Message" DROP COLUMN "vehicleId";

-- Step 4: Set `listingId` as NOT NULL
ALTER TABLE "Favorite" ALTER COLUMN "listingId" SET NOT NULL;
ALTER TABLE "Report" ALTER COLUMN "listingId" SET NOT NULL;
ALTER TABLE "VehiclePhoto" ALTER COLUMN "listingId" SET NOT NULL;

-- Step 5: Create Unique Index
CREATE UNIQUE INDEX "Favorite_userId_listingId_key" ON "Favorite"("userId", "listingId");

-- Step 6: Re-add Foreign Keys
ALTER TABLE "VehiclePhoto" ADD CONSTRAINT "VehiclePhoto_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
