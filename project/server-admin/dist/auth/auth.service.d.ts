import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private adminService;
    private jwtService;
    constructor(adminService: AdminsService, jwtService: JwtService);
    validateAdmin(email: string, password: string): Promise<import("../admins/admin.schema").Admin>;
    login(admin: any): Promise<{
        access_token: string;
    }>;
}
