import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(@Request() req: AuthRequest, @Body('vehicle_id') vehicleId: string) {
    const userId = req.user.id;
    return this.favoritesService.addFavorite(userId, vehicleId);
  }

  @Get()
  async getUserFavorites(@Request() req: AuthRequest) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Delete(':id')
  async removeFavorite(@Request() req: AuthRequest, @Param('id') favoriteId: string) {
    return this.favoritesService.removeFavorite(req.user.id, favoriteId);
  }

  @Get('count/:vehicle_id')
  async countFavorites(@Param('vehicle_id') vehicleId: string) {
    return { vehicleId, count: await this.favoritesService.countFavoritesForVehicle(vehicleId) };
  }
}

