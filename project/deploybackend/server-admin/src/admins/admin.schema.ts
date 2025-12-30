import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Department } from '../departments/department.schema';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  // Quan hệ 1-n với departments
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Department',  }] })
  departments: Types.ObjectId[];

  // Lưu ID doctor và patient từ server khác
  @Prop({ type: [String] }) 
  doctors: string[];

  @Prop({ type: [String] })
  patients: string[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);