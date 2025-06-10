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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Create a new report
    async createReport(reporterId, listingId, reason) {
        return this.prisma.report.create({
            data: {
                reporterId,
                listingId,
                reason,
                status: client_1.ReportStatus.OPEN, // Default status set
            },
        });
    }
    // Get all reports (Admin only)
    async getAllReports() {
        return this.prisma.report.findMany({
            include: {
                listing: true,
                reporter: { select: { email: true } }
            },
        });
    }
    // Get reports for a specific vehicle
    async getReportsForVehicle(listingId) {
        return this.prisma.report.findMany({
            where: { listingId },
        });
    }
    // Update report status (Admin only)
    async updateReportStatus(reportId, status) {
        const report = await this.prisma.report.findUnique({
            where: { id: reportId },
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return this.prisma.report.update({
            where: { id: reportId },
            data: { status },
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
