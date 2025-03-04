"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const favorites_controller_1 = require("./favorites.controller");
describe('FavoritesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [favorites_controller_1.FavoritesController],
        }).compile();
        controller = module.get(favorites_controller_1.FavoritesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
