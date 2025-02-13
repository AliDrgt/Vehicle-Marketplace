import { Controller, Post, Get, Put, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface'; 
import { ReportStatus } from '@prisma/client';


@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}


  @Post()
  async createReport(@Request() req: AuthRequest, @Body() body: { vehicleId: string; reason: string }) {
    return this.reportsService.createReport(req.user.id, body.vehicleId, body.reason);
  }

  @Get()
  async getAllReports(@Request() req: AuthRequest) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view reports');
    }
    return this.reportsService.getAllReports();
  }

  @Put(':reportId')
  async updateReportStatus(
    @Request() req: AuthRequest,
    @Param('reportId') reportId: string,
    @Body() body: { status: ReportStatus } 
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can update reports');
    }
    return this.reportsService.updateReportStatus(reportId, body.status as ReportStatus); 
  }
}
