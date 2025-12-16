import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Department } from './department.entity';
import { DepartmentService } from './departments.service';
import { DepartmentController } from './departments.controller';
import { Admin } from '../admins/admin.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Department,Admin])],

  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService], // export nếu muốn dùng service ở module khác
})
export class DepartmentsModule {}
