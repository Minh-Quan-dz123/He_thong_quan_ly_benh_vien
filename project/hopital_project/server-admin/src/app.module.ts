import { Module } from '@nestjs/common';
/*import { AppController } from './app.controller';
//import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}*/

import { DatabaseModule } from './database/database.module';
import { AdminsModule } from './admins/admins.module';
import { DepartmentsModule } from './departments/departments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AdminsModule,
    AuthModule,
    DepartmentsModule,
  ],
})
export class AppModule {}