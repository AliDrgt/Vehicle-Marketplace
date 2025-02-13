import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface';
import { ReportStatus } from '@prisma/client'; 


@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get all users (Admin only)
  @Get('users')
  async getAllUsers(@Request() req: AuthRequest) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only admins can access this');
    return this.adminService.getAllUsers();
  }

  // Get a specific user (Admin only)
  @Get('users/:id')
  async getUserById(@Request() req: AuthRequest, @Param('id') userId: string) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only admins can access this');
    return this.adminService.getUserById(userId);
  }

  // Update user details (Admin only)
  @Put('users/:id')
  async updateUser(@Request() req: AuthRequest, @Param('id') userId: string, @Body() data: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only admins can access this');
    return this.adminService.updateUser(userId, data);
  }

  // Deactivate a user (Admin only)
  @Delete('users/:id')
  async deactivateUser(@Request() req: AuthRequest, @Param('id') userId: string) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only admins can access this');
    return this.adminService.deactivateUser(userId);
  }

  // Get all reports (Admin only)
  @Get('reports')
  async getAllReports(@Request() req: AuthRequest) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only admins can access this');
    return this.adminService.getAllReports();
  }

  // Update report status (Admin only)
  @Put('reports/:id')
  async updateReportStatus(@Request() req: AuthRequest, @Param('id') reportId: string, @Body() data: { status: string }) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Only admins can access this');
  
    //Convert the received string to a ReportStatus enum
    const statusEnum = data.status.toUpperCase() as ReportStatus;
  
    //Validate the status before passing it to the service
    if (!Object.values(ReportStatus).includes(statusEnum)) {
      throw new ForbiddenException('Invalid status value');
    }
  
    return this.adminService.updateReportStatus(reportId, statusEnum);
  }
}
