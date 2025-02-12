import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';


@Module({
  imports: [UserModule, AuthModule, FavoritesModule],
})
export class AppModule {}
