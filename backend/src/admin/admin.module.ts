import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, JwtService]
})
export class AdminModule {}
