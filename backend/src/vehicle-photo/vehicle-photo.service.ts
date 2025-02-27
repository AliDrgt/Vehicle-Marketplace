import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VehiclePhoto } from '@prisma/client';

@Injectable()
export class VehiclePhotoService {
  constructor(private readonly prisma: PrismaService) {}

  async addPhoto(vehicleId: string, photoUrl: string): Promise<VehiclePhoto> {
    return this.prisma.vehiclePhoto.create({
      data: {
        vehicleId,
        photoUrl,
      },
    });
  }

  async getPhotosByVehicle(vehicleId: string): Promise<VehiclePhoto[]> {
    return this.prisma.vehiclePhoto.findMany({
      where: { vehicleId },
    });
  }

  async deletePhoto(photoId: string): Promise<void> {
    await this.prisma.vehiclePhoto.delete({
      where: { id: photoId },
    });
  }
}
