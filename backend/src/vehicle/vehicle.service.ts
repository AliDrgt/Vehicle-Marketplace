import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './vehicle.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateVehicleDto } from './vehicle.controller';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  // Create a new listing
  async createListing(userId: string, data: CreateVehicleDto) {
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
        location: data.location as any, 
        isSecondHand: data.isSecondHand ?? false, 
      },
    });
  }
  

  // Get all vehicles
  async getAllListings(query: any) {
    const {
      brand,
      minPrice,
      maxPrice,
      fuelType,
      transmission,
      sort,
      page = 1,
      limit = 10,
    } = query;

    const filters: any = {isDeleted: false};

    if (brand) filters.brand = brand;
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

    return this.prisma.listing.findMany({
      where: filters,
      orderBy,
      skip,
      take,
    });
  }

  // Get a single listing by ID
  async getListingId(listingId: string) {
    const cleanedId = listingId.trim(); // Trim the ID again (just in case)
    const listing = await this.prisma.listing.findUnique({
      where: { id: cleanedId },
    });
    if (!listing) {
      throw new NotFoundException('listing not found');
    }
    return listing;
  }
  
  
  

  // Update a listing listing
  async updateListing(userId: string, listingId: string, data: UpdateVehicleDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('listing not found');
    }

    if (listing.isDeleted) {
      throw new NotFoundException('listing is deleted and cannot be updated');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this listing');
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data,
    });
  }

  // Delete (soft delete) a listing
  async deleteListing(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new NotFoundException('Unauthorized: You cannot delete this listing');
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data: { isDeleted: true as boolean },
    });
  }
}
