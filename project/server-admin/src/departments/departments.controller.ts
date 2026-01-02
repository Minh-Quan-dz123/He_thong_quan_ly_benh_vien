import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards,  ParseIntPipe, } from '@nestjs/common';
import { DepartmentService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))  // Bảo vệ tất cả route trong controller bằng JWT
@Controller('departments')
export class DepartmentController{
    constructor(private readonly departmentService: DepartmentService){}

    // 1 tạo department mới
    @Post()
    create(@Body() dto: CreateDepartmentDto, @Req() req: Request)
    {
        const adminId = (req.user as any).sub; // lấy adminId từ JWT payload (sub)
        return this.departmentService.create(adminId, dto);
    }

    // 2 tìm lấy cả department theo admin id
    @Get()
    findAll(@Req() req: Request)
    {
        const adminId = (req.user as any).sub;
        return this.departmentService.findAll(adminId);
    }

    //3 lấy 1 department có id
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request) {
        const adminId = (req.user as any).sub;
        return this.departmentService.findOne(adminId, id);
    }

    // 4 update theo id
    @Patch(':id')
    update( @Param('id') id: string, @Body() dto: UpdateDepartmentDto, @Req() req) {
        
        const adminId = (req.user as any).sub;
        return this.departmentService.update(adminId, id, dto);
    }

    // 5 xóa theo id
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        const adminId = (req.user as any).sub;
        return this.departmentService.remove(adminId, id);
    }
}