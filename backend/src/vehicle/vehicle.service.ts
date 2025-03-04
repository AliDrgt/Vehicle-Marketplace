import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateListingDto, UpdateVehicleDto } from './vehicle.controller';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehicleService {
    constructor(private prisma: PrismaService) {}

    // Create a new listing
    async createListing(userId: string, data: CreateListingDto) {
        const brand = await this.prisma.carBrand.findUnique({ where: { id: data.brandId } });
        const model = await this.prisma.carModel.findUnique({ where: { id: data.modelId, brandId: data.brandId } });

        if (!brand || !model) {
            throw new BadRequestException("Invalid brand or model selection.");
        }

        return this.prisma.listing.create({
            data: {
                sellerId: userId,
                brandId: data.brandId,
                modelId: data.modelId,
                title: data.title,
                price: data.price,
                mileage: data.mileage,
                year: data.year,
                fuelType: data.fuelType,
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

    async getAllBrands() {
        return this.prisma.carBrand.findMany();
    }

    async getModelsByBrand(brandId: number) {
        return this.prisma.carModel.findMany({ where: { brandId: Number(brandId) } });
    }

    // Get all listings
    async getAllListings(query: any) {
        const { brand, minPrice, maxPrice, fuelType, transmission, sort, page = 1, limit = 10 } = query;
    
        const filters: any = { isDeleted: false };
    
        if (brand) filters.brandId = Number(brand);
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.gte = Number(minPrice);
            if (maxPrice) filters.price.lte = Number(maxPrice);
        }
        if (fuelType) filters.fuelType = fuelType;
        if (transmission) filters.transmission = transmission;
    
        const orderBy = [];
        if (sort) {
            const [field, direction] = sort.split('_');
            if (['price', 'year', 'mileage'].includes(field) && ['asc', 'desc'].includes(direction)) {
                orderBy.push({ [field]: direction });
            }
        }
    
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
    
        // 🔹 Get total count of listings (without pagination)
        const totalCount = await this.prisma.listing.count({
            where: filters,
        });
    
        // 🔹 Fetch listings with pagination
        const listings = await this.prisma.listing.findMany({
            where: filters,
            orderBy,
            skip,
            take,
            include: {
                brand: { select: { id: true, name: true } },
                model: { select: { id: true, name: true } },
            },
        });
    
        // 🔹 Calculate total pages
        const totalPages = Math.ceil(totalCount / take);
    
        return {
            listings,
            totalPages,
            totalCount,  // Optional: You can remove this if not needed
            currentPage: Number(page),
            perPage: take,
        };
    }
    

    // Get a single listing by ID
    async getListingById(id: string) {
        return this.prisma.listing.findUnique({
            where: { id },
            include: {
                brand: { select: { id: true, name: true } },
                model: { select: { id: true, name: true } },
            },
        });
    }

    // Update a listing
    async updateListing(userId: string, listingId: string, data: UpdateVehicleDto) {
        const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });

        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.isDeleted) throw new NotFoundException('Listing is deleted and cannot be updated');
        if (listing.sellerId !== userId) throw new ForbiddenException('Unauthorized');

        return this.prisma.listing.update({ where: { id: listingId }, data });
    }

    // Delete (soft delete) a listing
    async deleteListing(userId: string, listingId: string) {
        const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });

        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.sellerId !== userId) throw new ForbiddenException('Unauthorized');

        return this.prisma.listing.update({ where: { id: listingId }, data: { isDeleted: true } });
    }
}
