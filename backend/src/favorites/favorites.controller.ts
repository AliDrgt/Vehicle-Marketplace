import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface';

@UseGuards(JwtAuthGuard) // Protect all routes with JWT
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // Add to Favorites
  @Post()
  async addFavorite(@Request() req: AuthRequest, @Body('vehicle_id') vehicleId: string) {
    const userId = req.user.id;
    const favorite = await this.favoritesService.addFavorite(userId, vehicleId);
    return {
      message: 'Vehicle added to favorites',
      favorite,
    };
  }

  // Get User’s Favorites
  @Get()
  async getUserFavorites(@Request() req: AuthRequest) {
    const userId = req.user.id;
    const favorites = await this.favoritesService.getUserFavorites(userId);
    return favorites;
  }

  // Remove from Favorites
  @Delete(':id')
  async removeFavorite(@Request() req: AuthRequest, @Param('id') favoriteId: string) {
    const userId = req.user.id;
    await this.favoritesService.removeFavorite(userId, favoriteId);
    return { message: 'Favorite removed successfully' };
  }

  // Count Favorites for a Vehicle
  @Get('count/:vehicle_id')
  async countFavorites(@Param('vehicle_id') vehicleId: string) {
    const count = await this.favoritesService.countFavoritesForVehicle(vehicleId);
    return { vehicleId, count };
  }
}

