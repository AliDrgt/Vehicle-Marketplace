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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    // Get all users (Admin only)
    async getAllUsers(req) {
        if (req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Only admins can access this');
        return this.adminService.getAllUsers();
    }
    // Get a specific user (Admin only)
    async getUserById(req, userId) {
        if (req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Only admins can access this');
        return this.adminService.getUserById(userId);
    }
    // Update user details (Admin only)
    async updateUser(req, userId, data) {
        if (req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Only admins can access this');
        return this.adminService.updateUser(userId, data);
    }
    // Deactivate a user (Admin only)
    async deactivateUser(req, userId) {
        if (req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Only admins can access this');
        return this.adminService.deactivateUser(userId);
    }
    // Get all reports (Admin only)
    async getAllReports(req) {
        if (req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Only admins can access this');
        return this.adminService.getAllReports();
    }
    // Update report status (Admin only)
    async updateReportStatus(req, reportId, data) {
        if (req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Only admins can access this');
        //Convert the received string to a ReportStatus enum
        const statusEnum = data.status.toUpperCase();
        //Validate the status before passing it to the service
        if (!Object.values(client_1.ReportStatus).includes(statusEnum)) {
            throw new common_1.ForbiddenException('Invalid status value');
        }
        return this.adminService.updateReportStatus(reportId, statusEnum);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deactivateUser", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllReports", null);
__decorate([
    (0, common_1.Put)('reports/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateReportStatus", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
