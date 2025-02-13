import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Get all users
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  // Get a specific user
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Update user details (role, name, etc.)
  async updateUser(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // Deactivate a user (soft delete)
  async deactivateUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true }, // Soft delete
    });
  }

  // Get all reports
  async getAllReports() {
    return this.prisma.report.findMany({
      include: { vehicle: true, reporter: { select: { email: true } } },
    });
  }

  // Update report status
  async updateReportStatus(reportId: string, status: ReportStatus) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
  }
}
