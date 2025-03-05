import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface';


@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addFavorite(@Request() req: AuthRequest, @Body('listing_id') listingId: string) {
    const userId = req.user.id;
    return this.favoritesService.addFavorite(userId, listingId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserFavorites(@Request() req: AuthRequest) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeFavorite(@Request() req: AuthRequest, @Body('listing_id') listingId: string) {
    return this.favoritesService.removeFavorite(req.user.id, listingId);
  }

  @Get('count/:listingId')
  async countFavorites(@Param('listingId') listingId: string) {
    return { listingId, count: await this.favoritesService.countFavoritesForVehicle(listingId) };
  }
}

