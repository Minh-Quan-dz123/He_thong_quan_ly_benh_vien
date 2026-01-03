import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    // kế từ lớp cha
    constructor() {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET || 'MySuperSecretKey123',
        });
    }
    //
    async validate(payload: any)
    {
        console.log(" JWT VALID:", payload);
        // payload chứa thông tin admin đã đăng nhập
        return {
            sub: payload.sub,
            id: payload.sub,
            email: payload.email,
            fullName: payload.fullName,
            phone: payload.phone,
        };
    }
}

