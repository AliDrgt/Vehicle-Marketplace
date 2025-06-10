"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const favorites_module_1 = require("./favorites/favorites.module");
const vehicle_module_1 = require("./vehicle/vehicle.module");
const reports_module_1 = require("./reports/reports.module");
const admin_module_1 = require("./admin/admin.module");
const vehicle_photo_service_1 = require("./vehicle-photo/vehicle-photo.service");
const vehicle_photo_controller_1 = require("./vehicle-photo/vehicle-photo.controller");
const vehicle_photo_module_1 = require("./vehicle-photo/vehicle-photo.module");
const prisma_service_1 = require("./prisma/prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, auth_module_1.AuthModule, favorites_module_1.FavoritesModule, vehicle_module_1.VehicleModule, reports_module_1.ReportsModule, admin_module_1.AdminModule, vehicle_photo_module_1.VehiclePhotoModule],
        providers: [vehicle_photo_service_1.VehiclePhotoService, prisma_service_1.PrismaService],
        controllers: [vehicle_photo_controller_1.VehiclePhotoController],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
