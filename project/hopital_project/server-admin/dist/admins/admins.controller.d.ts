import { AdminsService } from './admins.service';
import { Admin } from './admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    getAllAdmins(): Promise<Admin[]>;
    getAdmin(id: string): Promise<Admin | null>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<Admin>;
    updateAdmin(req: any, updateAdminDto: UpdateAdminDto): Promise<Admin>;
    deleteAdmin(req: any): Promise<{
        message: string;
    }>;
}
