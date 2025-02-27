import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface';
import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator'; 
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';


export class CreateVehicleDto {
  //Required fields
  @IsString() brand!: string;
  @IsString() model!: string;
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

  //Optional fields
  @IsNumber() @IsOptional() enginePower?: number;
  @IsBoolean() @IsOptional() isSecondHand?: boolean;
}

class LocationDto {
  @IsNumber() latitude!: number;
  @IsNumber() longitude!: number;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // Create Vehicle
  @Post()
  async createVehicle(@Request() req: AuthRequest, @Body() body: CreateVehicleDto) {
    const userId = req.user.id;
    if (!userId) {
      throw new Error('User ID is missing from request');
    }
    return this.vehicleService.createVehicle(userId, body);
  }

  // Get All Vehicles
  @Get()
  async getAllVehicles(
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('fuelType') fuelType?: string,
    @Query('transmission') transmission?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.vehicleService.getAllVehicles({
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

  // Get a Specific Vehicle
  @Get(':id')
  async getVehicleById(@Param('id') vehicleId: string) {
    const cleanedId = vehicleId.trim(); // Trim ID in the controller
    return this.vehicleService.getVehicleById(cleanedId);
}


  // Update Vehicle
  @Put(':id')
  async updateVehicle(@Request() req: AuthRequest, @Param('id') vehicleId: string, @Body() body: UpdateVehicleDto) {
    const userId = req.user.id;
    return this.vehicleService.updateVehicle(userId, vehicleId, body);
  }

  // Delete (Soft Delete) Vehicle
  @Patch(':id')
  async deleteVehicle(@Request() req: AuthRequest, @Param('id') vehicleId: string) {
    const userId = req.user.id;
    return this.vehicleService.deleteVehicle(userId, vehicleId);
  }
}
function ValidateNested(): (target: CreateVehicleDto, propertyKey: "location") => void {
  throw new Error('Function not implemented.');
}

