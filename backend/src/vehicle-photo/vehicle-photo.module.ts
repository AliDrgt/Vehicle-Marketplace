import { Module } from '@nestjs/common';
import { VehiclePhotoService } from './vehicle-photo.service';
import { VehiclePhotoController } from './vehicle-photo.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VehiclePhotoController],
  providers: [VehiclePhotoService, PrismaService],
  exports: [VehiclePhotoService], // If needed elsewhere
})
export class VehiclePhotoModule {}
