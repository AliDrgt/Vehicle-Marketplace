"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const favorites_service_1 = require("./favorites.service");
describe('FavoritesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [favorites_service_1.FavoritesService],
        }).compile();
        service = module.get(favorites_service_1.FavoritesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
