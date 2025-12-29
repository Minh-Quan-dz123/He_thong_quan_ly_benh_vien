import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Department , DepartmentSchema} from './department.schema';
import { DepartmentService } from './departments.service';
import { DepartmentController } from './departments.controller';
import { Admin, AdminSchema } from '../admins/admin.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService], 
})
export class DepartmentsModule {}
