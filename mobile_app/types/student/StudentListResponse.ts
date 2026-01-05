import {PaginatedResponse} from "../base/PaginatedResponse";
import {StudentResponse} from "./StudentResponse";

export class StudentListResponse extends PaginatedResponse<StudentResponse> {
    constructor(data: StudentResponse[], page: number, pageSize: number, total: number) {
        super(data, page, pageSize, total);
    }
}