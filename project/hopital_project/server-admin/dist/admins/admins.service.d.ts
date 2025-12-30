import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminsService {
    private readonly adminModel;
    constructor(adminModel: Model<AdminDocument>);
    findAll(): Promise<Admin[]>;
    findById(id: string): Promise<Admin | null>;
    findByEmail(email: string): Promise<Admin | null>;
    create(dto: CreateAdminDto): Promise<Admin>;
    update(id: string, dto: UpdateAdminDto): Promise<Admin>;
    remove(id: string): Promise<void>;
}
