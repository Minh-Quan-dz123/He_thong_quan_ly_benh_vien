import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsInt()
  head_id?: number; 

  @IsOptional()
  @IsInt()
  doctorCount?: number; // optional

  @IsOptional()
  @IsInt()
  patientCount?: number; // optional
}
