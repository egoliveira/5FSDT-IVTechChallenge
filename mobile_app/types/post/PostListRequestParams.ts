import {PostListSortField} from "./PostListSortField";
import {PaginatedRequest} from "../base/PaginatedRequest";

export interface PostListRequestParams extends PaginatedRequest<PostListSortField> {
    fullContent: string | undefined;
    subjectId: number | undefined;
    teachingLevelId: number | undefined;
    teachingGradeId: number | undefined;
    userId: number | undefined;
}