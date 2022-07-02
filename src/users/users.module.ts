import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
// Controllers
import { UsersController } from './users.controller';
// Entities
import { User } from './user.entity';
// Services
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
// Interceptors
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
