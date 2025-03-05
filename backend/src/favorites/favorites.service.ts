import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // Add to Favorites
  async addFavorite(userId: string, listingId: string): Promise<Favorite> {
    // Check if the listing exists
    const listing = await this.prisma.listing.findUnique({
        where: { id: listingId },
    });
    if (!listing) {
        throw new NotFoundException("Listing not found");
    }

    // Check if already favorited
    const existingFavorite = await this.prisma.favorite.findFirst({
        where: { userId, listingId }, // ✅ Use findFirst instead of findUnique
    });

    if (existingFavorite) {
        throw new ForbiddenException("Listing already in favorites");
    }

    // Add to favorites
    return this.prisma.favorite.create({
        data: {
            userId,
            listingId,
        },
    });
}

  // Get User’s Favorites
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        listing: true, // Include vehicle details
      },
    });
  }

  // Remove from Favorites
  async removeFavorite(userId: string, listingId: string): Promise<void> {
    const favorite = await this.prisma.favorite.findFirst({
        where: { userId, listingId }, 
    });

    if (!favorite) {
        throw new NotFoundException("Favorite not found");
    }

    await this.prisma.favorite.delete({
        where: { id: favorite.id },
    });
}

  // Count Favorites for a Vehicle
  async countFavoritesForVehicle(listingId: string): Promise<number> {
    return this.prisma.favorite.count({
      where: { listingId },
    });
  }
}
