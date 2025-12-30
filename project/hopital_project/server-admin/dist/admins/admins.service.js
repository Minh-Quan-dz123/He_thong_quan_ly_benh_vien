"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const admin_schema_1 = require("./admin.schema");
let AdminsService = class AdminsService {
    adminModel;
    constructor(adminModel) {
        this.adminModel = adminModel;
    }
    async findAll() {
        return this.adminModel.find().select('fullName email phone').exec();
    }
    async findById(id) {
        return this.adminModel.findById(id).exec();
    }
    async findByEmail(email) {
        return this.adminModel.findOne({ email }).exec();
    }
    async create(dto) {
        const existAdmin = await this.adminModel.findOne({ email: dto.email }).exec();
        if (existAdmin) {
            throw new common_1.BadRequestException("This email has already been used to register another account!");
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newAdmin = new this.adminModel({
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
        });
        const saved = await newAdmin.save();
        saved.password = undefined;
        return saved;
    }
    async update(id, dto) {
        const admin = await this.adminModel.findById(id).exec();
        if (!admin)
            throw new common_1.BadRequestException("admin với id này ko tồn tại");
        if (dto.email && dto.email !== admin.email) {
            const checkEmail = await this.adminModel.findOne({ email: dto.email }).exec();
            if (checkEmail)
                throw new common_1.BadRequestException("email mới này đã được dùng cho tài khoản khác");
            admin.email = dto.email;
        }
        if (dto.fullName && dto.fullName !== admin.fullName)
            admin.fullName = dto.fullName;
        if (dto.phone && dto.phone !== admin.phone)
            admin.phone = dto.phone;
        const hasOldPassword = dto.oldPassword != null;
        const hasNewPassword = dto.newPassword != null;
        if (hasOldPassword && hasNewPassword) {
            const isMatch = await bcrypt.compare(dto.oldPassword, admin.password);
            if (!isMatch) {
                throw new common_1.BadRequestException("Mật khẩu cũ không đúng");
            }
            admin.password = await bcrypt.hash(dto.newPassword, 10);
        }
        else if (hasOldPassword || hasNewPassword) {
            throw new common_1.BadRequestException("Phải cung cấp cả mật khẩu cũ và mật khẩu mới");
        }
        const saved = await admin.save();
        saved.password = undefined;
        return saved;
    }
    async remove(id) {
        const result = await this.adminModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.BadRequestException('Admin with this id does not exist');
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminsService);
//# sourceMappingURL=admins.service.js.map