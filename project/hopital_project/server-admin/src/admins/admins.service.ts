import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';

// Admin: class mô tả dữ liệu Admin (TypeScript)
//AdminDocument: kiểu Admin + Document của Mongoose


@Injectable()
export class AdminsService{
    // khai báo dùng bảng admins trong MongoDB
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
    ) {}

    //1Lấy tất cả Admin trong database
    async findAll(): Promise<Admin[]> 
    {
        return this.adminRepo.find({select: ['id', 'fullName'],});
    }

    //2 tìm theo tên
    async findByEmail(email: string): Promise<Admin | null> {
        return this.adminRepo.findOne({where: { email },});
    }

    //3 tạo admin (cho phép truyền 1 phần field)
    async create(dto: CreateAdminDto): Promise<Admin> {
    // 3.1 Kiểm tra email đã tồn tại chưa
    const existAdmin = await this.adminRepo.findOne({where: { email: dto.email },});

        if (existAdmin) {
            throw new BadRequestException("This email has already been used to register another account!");
        }

        // 3.2 Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // 3.3 Tạo entity admin
        const admin = this.adminRepo.create({
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
        });

        // 3.4 Lưu vào MySQL
        return this.adminRepo.save(admin);
    }




}