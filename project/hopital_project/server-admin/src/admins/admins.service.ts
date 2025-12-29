import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Admin, AdminDocument } from './admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

// Admin: class mô tả dữ liệu Admin (TypeScript)
//AdminDocument: kiểu Admin + Document của Mongoose


@Injectable()
export class AdminsService{
    // khai báo dùng bảng admins trong MongoDB
    constructor(
        @InjectModel(Admin.name)
        private readonly adminModel: Model<AdminDocument>,
    ) {}

    //1 Lấy tất cả Admin trong database
    async findAll(): Promise<Admin[]> 
    {
        return this.adminModel.find().select('fullName email phone').exec();
    }

    //2 tìm theoid
    async findById(id: string): Promise<Admin | null> {
        return this.adminModel.findById(id).exec();
    }
    // 2.5 tìm theo email
    async findByEmail(email: string): Promise<Admin | null> {
        return this.adminModel.findOne({ email }).exec();
    }

    //3 tạo admin (cho phép truyền 1 phần field)
    async create(dto: CreateAdminDto): Promise<Admin> {
    // 3.1 Kiểm tra email đã tồn tại chưa
    const existAdmin = await this.adminModel.findOne({ email: dto.email }).exec();
        if (existAdmin) {
            throw new BadRequestException("This email has already been used to register another account!");
        }

        // 3.2 Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // 3.3 Tạo entity admin
        const newAdmin = new this.adminModel({
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
        });

        // 3.4 Lưu vào 
        const saved = await newAdmin.save();
        saved.password = undefined as any; //  không trả password
        return saved;
    }

    // 4 thay đổi thông tin tài khoản
    async update(id: string, dto: UpdateAdminDto): Promise<Admin>{
        // 4.1 lấy admin hiện tại
        const admin = await this.adminModel.findById(id).exec();
        if(!admin) throw new BadRequestException("admin với id này ko tồn tại");

        // 4.2 nếu update email thì check email update có đc sử dụng cho tài khoản khác ko
        if(dto.email && dto.email !== admin.email)// người này đang muốn thay đổi cả email
        {
            // tìm xem email mới này đã tồn tại cho tài khoản khác chưa
            const checkEmail = await this.adminModel.findOne({ email: dto.email }).exec();
            if(checkEmail) throw new BadRequestException("email mới này đã được dùng cho tài khoản khác");// nếu đã tồn tại thì thôi 

            // nếu chưa thì cập nhật 
            admin.email = dto.email;
        }

        // 4.3 cập nhật các thông tin khác
        if (dto.fullName && dto.fullName !== admin.fullName) admin.fullName = dto.fullName;
         
        if (dto.phone && dto.phone !== admin.phone) admin.phone = dto.phone;

        // 4.5 Xử lý đổi mật khẩu 
        const hasOldPassword = dto.oldPassword != null;
        const hasNewPassword = dto.newPassword != null;

        // 4.1 Nếu client gửi đủ old + new
        if (hasOldPassword && hasNewPassword) {
            const isMatch = await bcrypt.compare(dto.oldPassword!, admin.password);
            if (!isMatch) {
                throw new BadRequestException("Mật khẩu cũ không đúng");
            }

            admin.password = await bcrypt.hash(dto.newPassword!, 10);
        }

        // 4.2 Nếu chỉ gửi 1 trong 2 → lỗi
        else if (hasOldPassword || hasNewPassword) {
            throw new BadRequestException(
                "Phải cung cấp cả mật khẩu cũ và mật khẩu mới"
            );
        }
        // 4.3 Nếu cả hai đều null thì ko làm gì

        const saved = await admin.save();
        saved.password = undefined as any; //  không trả password
        return saved;
  

        
    }

    // 5. Xóa admin
    async remove(id: string): Promise<void> {
        const result = await this.adminModel.findByIdAndDelete(id).exec();
        if (!result) throw new BadRequestException('Admin with this id does not exist');
    }




}