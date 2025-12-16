import {Controller, Get, Param, Post, Body, UseGuards} from '@nestjs/common';
import { AdminsService } from './admins.service';
import {Admin} from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';

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
    @Get(':email')
    getAdmin(@Param('email') email: string): Promise<Admin | null> {
        return this.adminsService.findByEmail(email);
    }

    // 3 tạo admin POST/admins
    @Post()
    createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Admin>{
        return this.adminsService.create(createAdminDto);
    }
}