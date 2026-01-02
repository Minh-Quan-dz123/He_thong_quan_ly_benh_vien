import { IsEmail, IsNotEmpty, IsOptional, Matches,IsString, IsInt } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone: string;

  @IsOptional()
  @IsString()
  headId?: string; 

  @IsOptional()
  @IsString()
  headName?: string; 

  @IsOptional()
  @IsInt()
  doctorCount?: number; // optional

  @IsOptional()
  @IsInt()
  patientCount?: number; // optional
}
