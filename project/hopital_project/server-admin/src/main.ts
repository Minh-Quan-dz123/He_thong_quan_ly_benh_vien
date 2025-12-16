import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // đăng ký pipe cho toàn bộ ứng dụng
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // loại bỏ field thừa
      forbidNonWhitelisted: true, // báo lỗi nếu gửi field lạ, ko có trong DTO
      transform: true,        // tự convert kiểu vữ liệu

      errorHttpStatusCode: 422,
    }));

    app.enableCors({
        origin: "http://localhost:5173", // bên front end
        credentials: true,
    });


  await app.listen(3000, '0.0.0.0'); // bind tất cả interface IPv4);
  console.log(`🚀 Backend đang chạy tại: ${await app.getUrl()}`);

}
bootstrap();
