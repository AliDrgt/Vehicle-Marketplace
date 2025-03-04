import { Module } from '@nestjs/common';
import { ListingController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ListingController],
  providers: [VehicleService, PrismaService, JwtService],
})
export class VehicleModule {}
