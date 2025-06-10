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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclePhotoController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_photo_service_1 = require("./vehicle-photo.service");
let VehiclePhotoController = class VehiclePhotoController {
    constructor(vehiclePhotoService) {
        this.vehiclePhotoService = vehiclePhotoService;
    }
    // Upload a photo
    async uploadPhoto(listingId, photoUrl) {
        return this.vehiclePhotoService.addPhoto(listingId, photoUrl);
    }
    // Get all photos for a listing
    async getPhotos(listingId) {
        return this.vehiclePhotoService.getPhotosByVehicle(listingId);
    }
    // Delete a photo
    async deletePhoto(photoId) {
        await this.vehiclePhotoService.deletePhoto(photoId);
        return { message: "Photo deleted successfully" };
    }
};
exports.VehiclePhotoController = VehiclePhotoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('photoUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VehiclePhotoController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclePhotoController.prototype, "getPhotos", null);
__decorate([
    (0, common_1.Delete)(':photoId'),
    __param(0, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclePhotoController.prototype, "deletePhoto", null);
exports.VehiclePhotoController = VehiclePhotoController = __decorate([
    (0, common_1.Controller)('listings/:id/photos'),
    __metadata("design:paramtypes", [vehicle_photo_service_1.VehiclePhotoService])
], VehiclePhotoController);
