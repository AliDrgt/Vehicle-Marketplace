"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FavoritesService = class FavoritesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Add to Favorites
    async addFavorite(userId, vehicleId) {
        // Check if the vehicle exists
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
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
            throw new common_1.ForbiddenException('Vehicle already in favorites');
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
    async getUserFavorites(userId) {
        return this.prisma.favorite.findMany({
            where: { userId },
            include: {
                vehicle: true, // Include vehicle details
            },
        });
    }
    // Remove from Favorites
    async removeFavorite(userId, favoriteId) {
        const favorite = await this.prisma.favorite.findUnique({
            where: { id: favoriteId },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Favorite not found');
        }
        if (favorite.userId !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to delete this favorite');
        }
        await this.prisma.favorite.delete({
            where: { id: favoriteId },
        });
    }
    // Count Favorites for a Vehicle
    async countFavoritesForVehicle(vehicleId) {
        return this.prisma.favorite.count({
            where: { vehicleId },
        });
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
