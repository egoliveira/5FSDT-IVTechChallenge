import {PaginatedRequest} from "../base/PaginatedRequest";
import {StudentListSortField} from "./StudentListSortField";

export interface StudentListRequestParams extends PaginatedRequest<StudentListSortField> {
    readonly name: string | undefined;
    readonly email: string | undefined;
    readonly teachingLevelId: number | undefined;
    readonly teachingGradeId: number | undefined;
}