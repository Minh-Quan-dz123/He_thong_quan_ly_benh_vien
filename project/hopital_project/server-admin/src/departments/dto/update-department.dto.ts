import { IsEmail, IsOptional, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class UpdateDepartmentDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  head_id?: number;

  @IsOptional()
  @IsInt()
  doctorCount?: number;

  @IsOptional()
  @IsInt()
  PatientCount?: number;
}
