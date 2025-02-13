import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // Create a new report
  async createReport(reporterId: string, vehicleId: string, reason: string) {
    return this.prisma.report.create({
      data: {
        reporterId,
        vehicleId, 
        reason,
        status: ReportStatus.OPEN, // Default status set
      },
    });
  }

  // Get all reports (Admin only)
  async getAllReports() {
    return this.prisma.report.findMany({
      include: { 
        vehicle: true, 
        reporter: { select: { email: true } } 
      },
    });
  }

  // Get reports for a specific vehicle
  async getReportsForVehicle(vehicleId: string) {
    return this.prisma.report.findMany({
      where: { vehicleId }, 
    });
  }

  // Update report status (Admin only)
  async updateReportStatus(reportId: string, status: ReportStatus) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
  }
}
