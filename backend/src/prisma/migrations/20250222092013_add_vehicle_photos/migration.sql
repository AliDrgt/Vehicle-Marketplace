-- DropForeignKey
ALTER TABLE "VehiclePhoto" DROP CONSTRAINT "VehiclePhoto_vehicleId_fkey";

-- AlterTable
ALTER TABLE "VehiclePhoto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "VehiclePhoto" ADD CONSTRAINT "VehiclePhoto_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
