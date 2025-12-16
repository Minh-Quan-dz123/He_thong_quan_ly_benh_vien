import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt'; // tạo và ký JWT token
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{
    constructor(
        private adminService: AdminsService,
        private jwtService: JwtService,
    ){}

    // 1 xác thực thông tin admin
    async validateAdmin(email: string, password: string)
    {
        // b1 lấy theo username
        const admin = await this.adminService.findByEmail(email);
        if(!admin) throw new UnauthorizedException('Email ko ton tai');// exception HTTP


        // b2 so sánh password client gửi tới password hash trong DB
        const match = await bcrypt.compare(password, admin.password);
        if(!match) throw new UnauthorizedException('sai mat khau');

        // nếu oke hết thì thôi
        return admin;
    }

    // 2 tọa JWT khi login và sau khi validate thành công
    async login(admin: any)
    {
        const payload = {email: admin.email, sub: admin.id};// lưu emai với id của admin trong mongodb
        return { access_token: this.jwtService.sign(payload),};// tạo JWT token
    }
}