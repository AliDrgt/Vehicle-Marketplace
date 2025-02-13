import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService, JwtService],
})
export class ReportsModule {}
