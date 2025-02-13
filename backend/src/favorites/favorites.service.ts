import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // Add to Favorites
  async addFavorite(userId: string, vehicleId: string): Promise<Favorite> {
    // Check if the vehicle exists
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Check if it's already favorited
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_vehicleId: {
          userId,
          vehicleId,
        },
      },
    });
    if (existingFavorite) {
      throw new ForbiddenException('Vehicle already in favorites');
    }

    // Add to favorites
    return this.prisma.favorite.create({
      data: {
        userId,
        vehicleId,
      },
    });
  }

  // Get User’s Favorites
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        vehicle: false, // Include vehicle details
      },
    });
  }

  // Remove from Favorites
  async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    if (favorite.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this favorite');
    }

    await this.prisma.favorite.delete({
      where: { id: favoriteId },
    });
  }

  // Count Favorites for a Vehicle
  async countFavoritesForVehicle(vehicleId: string): Promise<number> {
    return this.prisma.favorite.count({
      where: { vehicleId },
    });
  }
}
