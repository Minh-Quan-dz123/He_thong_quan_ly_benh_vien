"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const department_schema_1 = require("./department.schema");
const admin_schema_1 = require("../admins/admin.schema");
let DepartmentService = class DepartmentService {
    departmentModel;
    adminModel;
    constructor(departmentModel, adminModel) {
        this.departmentModel = departmentModel;
        this.adminModel = adminModel;
    }
    async create(adminId, dto) {
        console.log('epartmentService.create adminId=', adminId);
        const admin = await this.adminModel.findById(adminId);
        if (!admin) {
            throw new common_1.NotFoundException('Không tìm thấy admin');
        }
        const existed = await this.departmentModel.findOne({ email: dto.email });
        if (existed) {
            throw new common_1.BadRequestException('Email department đã tồn tại');
        }
        const payload = {
            ...dto,
            admin: admin._id,
            head_id: dto.headId,
            head_name: dto.headName
        };
        const department = new this.departmentModel(payload);
        return await department.save();
    }
    async findAll(adminId) {
        const filter_check = mongoose_2.Types.ObjectId.isValid(adminId) ? { admin: new mongoose_2.Types.ObjectId(adminId) } : { admin: adminId };
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
    async findOne(adminId, id) {
        const filter = {};
        filter._id = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        filter.admin = mongoose_2.Types.ObjectId.isValid(adminId) ? new mongoose_2.Types.ObjectId(adminId) : adminId;
        const department = await this.departmentModel.findOne(filter).exec();
        if (!department)
            throw new common_1.NotFoundException('Không tìm thấy department');
        return department;
    }
    async update(adminId, id, dto) {
        const department = await this.findOne(adminId, id);
        Object.assign(department, dto);
        return department.save();
    }
    async remove(adminId, id) {
        const filter = {
            _id: mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id,
            admin: mongoose_2.Types.ObjectId.isValid(adminId)
                ? new mongoose_2.Types.ObjectId(adminId)
                : adminId,
        };
        const department = await this.departmentModel.findOne(filter);
        if (!department)
            throw new common_1.NotFoundException('server không tìm thấy department');
        await this.departmentModel.deleteOne({ _id: department._id });
        return { message: 'Đã xoá thành công department' };
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(department_schema_1.Department.name)),
    __param(1, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DepartmentService);
//# sourceMappingURL=departments.service.js.map