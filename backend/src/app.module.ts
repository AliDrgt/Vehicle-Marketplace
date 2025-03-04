import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { VehiclePhotoService } from './vehicle-photo/vehicle-photo.service';
import { VehiclePhotoController } from './vehicle-photo/vehicle-photo.controller';
import { VehiclePhotoModule } from './vehicle-photo/vehicle-photo.module';
import { PrismaService } from './prisma/prisma.service';



@Module({
  imports: [UserModule, AuthModule, FavoritesModule, VehicleModule, ReportsModule, AdminModule, VehiclePhotoModule],
  providers: [VehiclePhotoService, PrismaService],
  controllers: [VehiclePhotoController],
  exports: [PrismaService],
})
export class AppModule {}
