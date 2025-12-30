import { DepartmentService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import type { Request } from 'express';
export declare class DepartmentController {
    private readonly departmentService;
    constructor(departmentService: DepartmentService);
    create(dto: CreateDepartmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("./department.schema").DepartmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./department.schema").Department & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(req: Request): Promise<{
        id: string;
        name: string;
        email: string | undefined;
        phoneNumber: string;
        headId: string | null;
        headName: string | null;
        doctorCount: number;
        patientCount: number;
    }[]>;
    findOne(id: string, req: Request): Promise<import("mongoose").Document<unknown, {}, import("./department.schema").DepartmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./department.schema").Department & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdateDepartmentDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./department.schema").DepartmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./department.schema").Department & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
