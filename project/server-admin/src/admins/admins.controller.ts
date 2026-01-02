import {Controller, Get, Put, Param, Post, Body,Delete,Query, UseGuards, Req} from '@nestjs/common';
import { AdminsService } from './admins.service';
import {Admin} from './admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')// định nghĩa route gốc
export class AdminsController{
    constructor(private readonly adminsService: AdminsService) {}//tạo sẵn admin

    // 1 lấy hết admin GET/admins
    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllAdmins(): Promise<Admin[]>{
        return this.adminsService.findAll();
    }

    // 2 lấy admin theo tên GET/admins/abcxyz
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getAdmin(@Param('id') id: string): Promise<Admin | null> {
        return this.adminsService.findById(id);
    }

    // 3 tạo admin POST/admins
    @Post()
    createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Admin>{
        return this.adminsService.create(createAdminDto);
    }

    //4 update tài khoản
    @UseGuards(AuthGuard('jwt'))
    @Put()
    updateAdmin(@Req() req: any, @Body() updateAdminDto: UpdateAdminDto): Promise<Admin> {
        console.log("🟢 USER:", req.user);
        console.log("🟢 DTO:", updateAdminDto);
        const adminId = req.user.id; // lấy từ JWT
        return this.adminsService.update(adminId, updateAdminDto);
    }

    // 5 xóa tài khoản
    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async deleteAdmin(@Req() req: any) {
        const adminId = req.user.id; // lấy từ JWT
        await this.adminsService.remove(adminId);
        return { message: 'Tài khoản admin đã bị xóa' };
    }

}