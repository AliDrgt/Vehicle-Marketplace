"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const vehicle_photo_controller_1 = require("./vehicle-photo.controller");
describe('VehiclePhotoController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [vehicle_photo_controller_1.VehiclePhotoController],
        }).compile();
        controller = module.get(vehicle_photo_controller_1.VehiclePhotoController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
