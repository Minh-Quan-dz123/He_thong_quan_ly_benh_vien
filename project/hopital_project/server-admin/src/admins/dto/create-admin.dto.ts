import {IsString, IsEmail, MinLength,IsNotEmpty} from 'class-validator'

export class CreateAdminDto{

    @IsNotEmpty()
    @IsString()
    fullName:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password:string;

    @IsNotEmpty()
    @IsString()
    phone:string;
}