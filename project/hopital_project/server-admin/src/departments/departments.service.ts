import { Injectable, NotFoundException , BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { Admin } from '../admins/admin.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService{
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,

        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
    ) {}

    // 1: adminId tạo 1 department
    async create(adminId: number, dto: CreateDepartmentDto) 
    {       
        // tìm theo id của admin trong bảng
        const admin = await this.adminRepo.findOne({
        where: { id: adminId },
        });

        if (!admin) 
        {
            throw new NotFoundException('Không tìm thấy admin');
        }
        // xử lý trùng email:
        const existed = await this.departmentRepo.findOne({
            where: { email: dto.email },
        });

        if (existed) {
            throw new BadRequestException('Email department đã tồn tại');
        }

        // tìm xong rồi thì INSERT INTO departments
        const department = this.departmentRepo.create({
            ...dto,
            admin,
        });

        return this.departmentRepo.save(department);
    }

    // 2: adminId gọi tìm tất cả department
    async findAll(adminId: number) 
    {
        return this.departmentRepo.find({
            where: 
            {
                admin: { id: adminId },
            },
        });
    }

    // 3 lấy 1 department
    async findOne(adminId: number, id: number) 
    {
        const department = await this.departmentRepo.findOne({
            where: {
                id,
                admin: { id: adminId },
            },
        });

        if (!department) {
            throw new NotFoundException('Không tìm thấy department');
        }

        return department;
    }

    // 4 update
    async update(adminId: number, id: number, dto: UpdateDepartmentDto,) 
    {
        const department = await this.findOne(adminId, id);
        Object.assign(department, dto);
        return this.departmentRepo.save(department);
    }

    // 5 delete
    async remove(adminId: number, id: number) 
    {
        const department = await this.findOne(adminId, id);
        await this.departmentRepo.remove(department);        
        return { message: 'Đã xoá thành công department' };
    }

    

}
