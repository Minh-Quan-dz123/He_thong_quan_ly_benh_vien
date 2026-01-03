import { Model, Types } from 'mongoose';
import { Department, DepartmentDocument } from './department.schema';
import { AdminDocument } from '../admins/admin.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentService {
    private readonly departmentModel;
    private readonly adminModel;
    constructor(departmentModel: Model<DepartmentDocument>, adminModel: Model<AdminDocument>);
    create(adminId: string, dto: CreateDepartmentDto): Promise<import("mongoose").Document<unknown, {}, DepartmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Department & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(adminId: string): Promise<{
        id: string;
        name: string;
        email: string | undefined;
        phoneNumber: string;
        headId: string | null;
        headName: string | null;
        doctorCount: number;
        patientCount: number;
    }[]>;
    findOne(adminId: string, id: string): Promise<import("mongoose").Document<unknown, {}, DepartmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Department & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(adminId: string, id: string, dto: UpdateDepartmentDto): Promise<import("mongoose").Document<unknown, {}, DepartmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Department & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(adminId: string, id: string): Promise<{
        message: string;
    }>;
}
