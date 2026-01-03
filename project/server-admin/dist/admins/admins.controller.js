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
exports.AdminsController = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("./admins.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const passport_1 = require("@nestjs/passport");
const update_admin_dto_1 = require("./dto/update-admin.dto");
let AdminsController = class AdminsController {
    adminsService;
    constructor(adminsService) {
        this.adminsService = adminsService;
    }
    getAllAdmins() {
        return this.adminsService.findAll();
    }
    getAdmin(id) {
        return this.adminsService.findById(id);
    }
    createAdmin(createAdminDto) {
        return this.adminsService.create(createAdminDto);
    }
    updateAdmin(req, updateAdminDto) {
        console.log("🟢 USER:", req.user);
        console.log("🟢 DTO:", updateAdminDto);
        const adminId = req.user.id;
        return this.adminsService.update(adminId, updateAdminDto);
    }
    async deleteAdmin(req) {
        const adminId = req.user.id;
        await this.adminsService.remove(adminId);
        return { message: 'Tài khoản admin đã bị xóa' };
    }
};
exports.AdminsController = AdminsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getAdmin", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "deleteAdmin", null);
exports.AdminsController = AdminsController = __decorate([
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admins_service_1.AdminsService])
], AdminsController);
//# sourceMappingURL=admins.controller.js.map