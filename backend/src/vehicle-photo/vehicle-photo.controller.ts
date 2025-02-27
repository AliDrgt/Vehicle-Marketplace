import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { VehiclePhotoService } from './vehicle-photo.service';

@Controller('listings/:id/photos')
export class VehiclePhotoController {
  constructor(private readonly vehiclePhotoService: VehiclePhotoService) {}

  // Upload a photo
  @Post()
  async uploadPhoto(@Param('id') vehicleId: string, @Body('photoUrl') photoUrl: string) {
    return this.vehiclePhotoService.addPhoto(vehicleId, photoUrl);
  }

  // Get all photos for a listing
  @Get()
  async getPhotos(@Param('id') vehicleId: string) {
    return this.vehiclePhotoService.getPhotosByVehicle(vehicleId);
  }

  // Delete a photo
  @Delete(':photoId')
async deletePhoto(@Param('photoId') photoId: string) {
  await this.vehiclePhotoService.deletePhoto(photoId);
  return { message: "Photo deleted successfully" };
}
}
