import { Injectable, NotFoundException , BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Department, DepartmentDocument } from './department.schema';
import { Admin, AdminDocument } from '../admins/admin.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService{
    constructor(
        @InjectModel(Department.name)
        private readonly departmentModel: Model<DepartmentDocument>,

        @InjectModel(Admin.name)
        private readonly adminModel: Model<AdminDocument>,
    ) {}

    // 1: adminId tạo 1 department
    async create(adminId: string, dto: CreateDepartmentDto) 
    {       
        // tìm theo id của admin trong bảng
        console.log('epartmentService.create adminId=', adminId);
        const admin = await this.adminModel.findById(adminId);
        if (!admin) 
        {
            throw new NotFoundException('Không tìm thấy admin');
        }

        // xử lý trùng email:
        const existed = await this.departmentModel.findOne({ email: dto.email });

        if (existed) {
            throw new BadRequestException('Email department đã tồn tại');
        }

        // tìm xong rồi thì INSERT INTO departments
        
        const payload: any = { 
            ...dto, 
            admin: admin._id,
            head_id: dto.headId,
            head_name: dto.headName
        };

        const department = new this.departmentModel(payload);
        return await department.save();

    }

    // 2: adminId gọi tìm tất cả department
    async findAll(adminId: string) 
    {
        // kiểm tra adminId có phải object hợp lệ ko, có thì tạo object mới
        const filter_check = Types.ObjectId.isValid(adminId)? { admin: new Types.ObjectId(adminId) }: { admin: adminId };
        const results = await this.departmentModel.find(filter_check).exec();
        return results.map(d => ({
            id: d._id.toString(),
            name: d.name,
            email: d.email,
            phoneNumber: d.phone,
            headId: d.head_id || null,
            headName: d.head_name || null,
            doctorCount: d.doctorCount ?? 0,
            patientCount: d.patientCount ?? 0,
        }));
    }

    // 3 lấy 1 department
    async findOne(adminId: string, id: string) {
        // Build a robust filter that uses ObjectId when available to avoid string vs ObjectId mismatch
        const filter: any = {};
        filter._id = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        filter.admin = Types.ObjectId.isValid(adminId) ? new Types.ObjectId(adminId) : adminId;

        const department = await this.departmentModel.findOne(filter).exec();
        if (!department) throw new NotFoundException('Không tìm thấy department');
        return department;
    }

    // 4 update
    async update(adminId: string, id: string, dto: UpdateDepartmentDto) {
        const department = await this.findOne(adminId, id);
        Object.assign(department, dto);
        return department.save();
    }

    // 5 delete
    async remove(adminId: string, id: string) {
        const filter: any = {
            _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id,
            admin: Types.ObjectId.isValid(adminId)
            ? new Types.ObjectId(adminId)
            : adminId,
        };

        const department = await this.departmentModel.findOne(filter);
        if (!department)
            throw new NotFoundException('server không tìm thấy department');

        await this.departmentModel.deleteOne({ _id: department._id });

        return { message: 'Đã xoá thành công department' };
    }

    

}
