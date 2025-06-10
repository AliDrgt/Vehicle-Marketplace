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
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const common_2 = require("@nestjs/common");
let VehicleService = class VehicleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Create a new listing
    async createListing(userId, data) {
        return this.prisma.listing.create({
            data: {
                sellerId: userId,
                brand: data.brand,
                model: data.model,
                title: data.title,
                price: data.price,
                mileage: data.mileage,
                year: data.year,
                fuelType: data.fuelType || 'Unknown',
                transmission: data.transmission,
                enginePower: data.enginePower ?? 0,
                drivetrain: data.drivetrain,
                color: data.color,
                description: data.description,
                location: data.location,
                isSecondHand: data.isSecondHand ?? false,
            },
        });
    }
    // Get all vehicles
    async getAllListings(query) {
        const { brand, minPrice, maxPrice, fuelType, transmission, sort, page = 1, limit = 10, } = query;
        const filters = { isDeleted: false };
        if (brand)
            filters.brand = brand;
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice)
                filters.price.gte = Number(minPrice);
            if (maxPrice)
                filters.price.lte = Number(maxPrice);
        }
        if (fuelType)
            filters.fuelType = fuelType;
        if (transmission)
            filters.transmission = transmission;
        const orderBy = [];
        if (sort) {
            const [field, direction] = sort.split('_');
            if (['price', 'year', 'mileage'].includes(field) && ['asc', 'desc'].includes(direction)) {
                orderBy.push({ [field]: direction });
            }
        }
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        return this.prisma.listing.findMany({
            where: filters,
            orderBy,
            skip,
            take,
        });
    }
    // Get a single listing by ID
    async getListingId(listingId) {
        const cleanedId = listingId.trim(); // Trim the ID again (just in case)
        const listing = await this.prisma.listing.findUnique({
            where: { id: cleanedId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('listing not found');
        }
        return listing;
    }
    // Update a listing listing
    async updateListing(userId, listingId, data) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('listing not found');
        }
        if (listing.isDeleted) {
            throw new common_1.NotFoundException('listing is deleted and cannot be updated');
        }
        if (listing.sellerId !== userId) {
            throw new common_2.ForbiddenException('You are not allowed to modify this listing');
        }
        return this.prisma.listing.update({
            where: { id: listingId },
            data,
        });
    }
    // Delete (soft delete) a listing
    async deleteListing(userId, listingId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.NotFoundException('Unauthorized: You cannot delete this listing');
        }
        return this.prisma.listing.update({
            where: { id: listingId },
            data: { isDeleted: true },
        });
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleService);
