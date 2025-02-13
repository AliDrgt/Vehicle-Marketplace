import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [UserModule, AuthModule, FavoritesModule, VehicleModule, ReportsModule, AdminModule],
})
export class AppModule {}
