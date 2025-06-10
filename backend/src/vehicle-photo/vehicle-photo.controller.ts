import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { VehiclePhotoService } from './vehicle-photo.service';

@Controller('listings/:id/photos')
export class VehiclePhotoController {
  constructor(private readonly vehiclePhotoService: VehiclePhotoService) {}

  // Upload a photo
  @Post()
  async uploadPhoto(@Param('id') listingId: string, @Body('photoUrl') photoUrl: string) {
    return this.vehiclePhotoService.addPhoto(listingId, photoUrl);
  }

  // Get all photos for a listing
  @Get()
  async getPhotos(@Param('id') listingId: string) {
    return this.vehiclePhotoService.getPhotosByVehicle(listingId);
  }

  // Delete a photo
  @Delete(':photoId')
async deletePhoto(@Param('photoId') photoId: string) {
  await this.vehiclePhotoService.deletePhoto(photoId);
  return { message: "Photo deleted successfully" };
}
}
