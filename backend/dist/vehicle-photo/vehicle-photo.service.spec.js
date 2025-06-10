"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const vehicle_photo_service_1 = require("./vehicle-photo.service");
describe('VehiclePhotoService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [vehicle_photo_service_1.VehiclePhotoService],
        }).compile();
        service = module.get(vehicle_photo_service_1.VehiclePhotoService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
