import { Controller, Get, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../auth/auth-request.interface';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService 
  ) {}

  @Get()
  async getAllUsers(): Promise<any> {   
    return await this.userService.getAllUsers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return this.prisma.user.findUnique({ 
      where: { id: userId },
    });
  }

  @Patch(':id')
  async softDeleteUser(@Param('id') userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
  });
}
}
