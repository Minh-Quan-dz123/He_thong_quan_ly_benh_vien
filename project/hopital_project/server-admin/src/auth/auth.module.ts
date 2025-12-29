// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // tạo JWT token
import { PassportModule } from '@nestjs/passport'; // xác thực 

import { AdminsModule } from '../admins/admins.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; // xác thực token khi request đến api
import { AuthController } from './auth.controller';

@Module({
  imports: [
    AdminsModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        //secret: process.env.JWT_SECRET,
        secret: 'MySuperSecretKey123',
        signOptions: { expiresIn: '1h' },
      }),
    })
  ],

  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports:[AuthService],
})
export class AuthModule {}
