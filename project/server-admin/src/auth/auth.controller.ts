import {Controller, Post, Body} from '@nestjs/common';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    // 1 xác thực login
    @Post('login')
    async login(@Body() body: {email: string; password: string})
    {
        // xác thực và trả về login
        const admin = await this.authService.validateAdmin(body.email, body.password);
        return this.authService.login(admin);
    }
}