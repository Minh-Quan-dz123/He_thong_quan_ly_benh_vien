import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Admin } from '../admins/admin.schema';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, sparse: true }) // nullable tương đương sparse
  email?: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  head_id?: string; // có thể null
  
  @Prop()
  head_name?: string;

  @Prop({ default: 0 })
  doctorCount: number;

  @Prop({ default: 0 })
  patientCount: number;

  // Quan hệ nhiều Department -> 1 Admin
  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true })
  admin: Types.ObjectId;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);