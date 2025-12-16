import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Taquan2327@ppv',
      database: 'hopital',

      autoLoadEntities: true,
      synchronize: true, 
    }),
  ],
  exports: [TypeOrmModule],  
})
export class DatabaseModule {}
