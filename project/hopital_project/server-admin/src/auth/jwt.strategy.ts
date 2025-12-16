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
        secretOrKey: 'SECRET_KEY',
        });
    }
    //
    async validate(payload: any)
    {
        // payload chứa thông tin admin đã đăng nhập
        return {adminId: payload.sub, email: payload.email};
    }
}

