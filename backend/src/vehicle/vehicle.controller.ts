import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface'; 

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // Create Vehicle
  @Post()
  async createVehicle(@Request() req: AuthRequest, @Body() body: any) {
    console.log('User ID from JWT:', req.user.id); // Debugging
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
    return this.vehicleService.getVehicleById(vehicleId);
  }

  // Update Vehicle
  @Put(':id')
  async updateVehicle(@Request() req: AuthRequest, @Param('id') vehicleId: string, @Body() body: any) {
    const userId = req.user.id;
    return this.vehicleService.updateVehicle(userId, vehicleId, body);
  }

  // Delete (Soft Delete) Vehicle
  @Delete(':id')
  async deleteVehicle(@Request() req: AuthRequest, @Param('id') vehicleId: string) {
    const userId = req.user.id;
    return this.vehicleService.deleteVehicle(userId, vehicleId);
  }
}
