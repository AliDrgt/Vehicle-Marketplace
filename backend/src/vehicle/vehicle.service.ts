import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  // Create a new vehicle
  async createVehicle(userId: string, data: any) {
    return this.prisma.vehicle.create({
      data: {
        sellerId: userId, 
        brand: data.brand,
        model: data.model,
        title: data.title,
        price: data.price,
        mileage: data.mileage,
        year: data.year,
        fuelType: data.fuelType,
        transmission: data.transmission,
        enginePower: data.enginePower,
        drivetrain: data.drivetrain,
        color: data.color,
        description: data.description,
        location: data.location, // Must be valid JSON
        isSecondHand: data.isSecondHand,
      },
    });
  }
  

  // Get all vehicles
  async getAllVehicles(query: any) {
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

    return this.prisma.vehicle.findMany({
      where: filters,
      orderBy,
      skip,
      take,
    });
  }

  // Get a single vehicle by ID
  async getVehicleById(vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  // Update a vehicle listing
  async updateVehicle(userId: string, vehicleId: string, data: any) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.sellerId !== userId) {
      throw new NotFoundException('Unauthorized: You cannot update this vehicle');
    }

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data,
    });
  }

  // Delete (soft delete) a vehicle
  async deleteVehicle(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.sellerId !== userId) {
      throw new NotFoundException('Unauthorized: You cannot delete this vehicle');
    }

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { isDeleted: true as boolean },
    });
  }
}
