import { IsEmail, Matches,IsOptional, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class UpdateDepartmentDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  headId?: string;

  @IsOptional()
  @IsString()
  headName?: string;

  @IsOptional()
  @IsInt()
  doctorCount?: number;

  @IsOptional()
  @IsInt()
  patientCount?: number;
}
