import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface';
import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator'; 
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';


export class CreateListingDto {
  // Required fields
  @IsNumber() brandId!: number;
  @IsNumber() modelId!: number;
  @IsString() title!: string;
  @IsNumber() price!: number;
  @IsNumber() mileage!: number;
  @IsNumber() year!: number;
  @IsString() fuelType!: string;
  @IsString() transmission!: string;
  @IsString() drivetrain!: string;
  @IsString() color!: string;
  @IsString() description!: string;
  @IsObject() location!: { latitude: number; longitude: number };

  // Optional fields
  @IsNumber() @IsOptional() enginePower?: number;
  @IsBoolean() @IsOptional() isSecondHand?: boolean;
}

class LocationDto {
  @IsNumber() latitude!: number;
  @IsNumber() longitude!: number;
}

export class UpdateVehicleDto extends PartialType(CreateListingDto) {}
@UseGuards(JwtAuthGuard)
@Controller('listing')
export class ListingController {
  constructor(private readonly vehicleService: VehicleService) {}

  // Create Vehicle
  @Post()
  async createListing(@Request() req: AuthRequest, @Body() body: CreateListingDto) {
    const userId = req.user.id;
    if (!userId) {
      throw new Error('User ID is missing from request');
    }
    return this.vehicleService.createListing(userId, body);
  }

  // Get All Listings
@Get()
async getAllListings(
  @Query('brand') brand?: string,
  @Query('minPrice') minPrice?: string,
  @Query('maxPrice') maxPrice?: string,
  @Query('fuelType') fuelType?: string,
  @Query('transmission') transmission?: string,
  @Query('sort') sort?: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string
) {
  return this.vehicleService.getAllListings({
    brand,
    minPrice,
    maxPrice,
    fuelType,
    transmission,
    sort,
    page,
    limit,
  });
}

  @Get('/brands')
  async getAllBrands() {
    console.log("Controller: GET /listing/brands called");
    return this.vehicleService.getAllBrands();
  }

  // Get a Specific Listing
  @Get(':id')
  async getListingById(@Param('id') listingId: string) {
    const cleanedId = listingId.trim(); // Trim ID in the controller
    return this.vehicleService.getListingById(cleanedId);
}

  // Update Vehicle
  @Put(':id')
  async updateListing(@Request() req: AuthRequest, @Param('id') listingId: string, @Body() body: UpdateVehicleDto) {
    const userId = req.user.id;
    return this.vehicleService.updateListing(userId, listingId, body);
  }

  // Delete (Soft Delete) Vehicle
  @Patch(':id')
  async deleteListing(@Request() req: AuthRequest, @Param('id') listingId: string) {
    const userId = req.user.id;
    return this.vehicleService.deleteListing(userId, listingId);
  }


  @Get('/brands/:brandId/models')
  async getModelsByBrand(@Param('brandId') brandId: number) {
    return this.vehicleService.getModelsByBrand(brandId);
  }
}

