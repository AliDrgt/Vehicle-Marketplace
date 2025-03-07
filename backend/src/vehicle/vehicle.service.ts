import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateListingDto, UpdateVehicleDto } from './vehicle.controller';
import { PrismaService} from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
                photos: {
                    create: (data.photos || []).map(photoUrl => ({ photoUrl }))
                }
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
    
        const orderBy: Prisma.ListingOrderByWithRelationInput[] = [];
        if (sort === 'newest') {
            orderBy.push({ createdAt: 'desc' });
        } else if (sort) {
            const [field, direction] = sort.split('_');
            if (['price', 'year', 'mileage'].includes(field) && ['asc', 'desc'].includes(direction)) {
                orderBy.push({ [field]: direction as Prisma.SortOrder });
            }
        }
    
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
    
        //  Get total count of listings (without pagination)
        const totalCount = await this.prisma.listing.count({
            where: filters,
        });
    
        //  Fetch listings with pagination
        const listings = await this.prisma.listing.findMany({
            where: filters,
            orderBy,
            skip,
            take,
            include: {
                brand: { select: { id: true, name: true } },
                model: { select: { id: true, name: true } },
                photos: { select: { photoUrl: true } },
            },
        });
    
        // 🔹 Calculate total pages
        const totalPages = Math.ceil(totalCount / take);
    
        return {
            listings,
            totalPages,
            totalCount, 
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
                photos: { select: { photoUrl: true } },
            },
        });
    }

    async getUserListings(sellerId: string) {
        console.log("Fetching listings for user ID:", sellerId);
    
        return this.prisma.listing.findMany({
            where: { sellerId },
            orderBy: { createdAt: "desc" },
            include: {
                brand: { select: { id: true, name: true } },
                model: { select: { id: true, name: true } },
            },
        });
    }

    // Update a listing
    async updateListing(userId: string, listingId: string, data: UpdateVehicleDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { photos: true } // Fetch existing photos
        });
    
        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.isDeleted) throw new NotFoundException('Listing is deleted and cannot be updated');
        if (listing.sellerId !== userId) throw new ForbiddenException('Unauthorized');
    
        // Get existing photo URLs
        const existingPhotoUrls = listing.photos.map(photo => photo.photoUrl);
    
        return this.prisma.listing.update({
            where: { id: listingId },
            data: {
                brandId: data.brandId,
                modelId: data.modelId,
                title: data.title,
                price: data.price,
                mileage: data.mileage,
                year: data.year,
                fuelType: data.fuelType,
                transmission: data.transmission,
                drivetrain: data.drivetrain,
                color: data.color,
                description: data.description,
                location: data.location,
                enginePower: data.enginePower,
                isSecondHand: data.isSecondHand,
    
                // Update photos correctly
                photos: {
                    deleteMany: {
                        photoUrl: { notIn: data.photos || [] } // Remove photos not included in the update
                    },
                    create: (data.photos || [])
                        .filter(photoUrl => !existingPhotoUrls.includes(photoUrl)) // Only add new photos
                        .map(photoUrl => ({ photoUrl }))
                }
            }
        });
    }
    

    // Delete (soft delete) a listing
    async deleteListing(userId: string, listingId: string) {
        const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });

        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.sellerId !== userId) throw new ForbiddenException('Unauthorized');

        return this.prisma.listing.update({ where: { id: listingId }, data: { isDeleted: true } });
    }
}
