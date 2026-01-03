import {IsString, IsEmail, MinLength,IsNotEmpty, Matches} from 'class-validator'

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
    @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
    phone:string;
}