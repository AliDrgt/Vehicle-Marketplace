"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const vehicle_controller_1 = require("./vehicle.controller");
describe('VehicleController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [vehicle_controller_1.ListingController],
        }).compile();
        controller = module.get(vehicle_controller_1.ListingController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
