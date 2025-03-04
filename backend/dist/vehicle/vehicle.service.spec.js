"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const vehicle_service_1 = require("./vehicle.service");
describe('VehicleService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [vehicle_service_1.VehicleService],
        }).compile();
        service = module.get(vehicle_service_1.VehicleService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
