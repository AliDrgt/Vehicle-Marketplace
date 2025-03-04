import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclePhoto } from '@prisma/client';

@Injectable()
export class VehiclePhotoService {
  constructor(private readonly prisma: PrismaService) {}

  async addPhoto(listingId: string, photoUrl: string): Promise<VehiclePhoto> {
    return this.prisma.vehiclePhoto.create({
      data: {
        listingId,
        photoUrl,
      },
    });
  }

  async getPhotosByVehicle(listingId: string): Promise<VehiclePhoto[]> {
    return this.prisma.vehiclePhoto.findMany({
      where: { listingId },
    });
  }

  async deletePhoto(photoId: string): Promise<void> {
    await this.prisma.vehiclePhoto.delete({
      where: { id: photoId },
    });
  }
}
