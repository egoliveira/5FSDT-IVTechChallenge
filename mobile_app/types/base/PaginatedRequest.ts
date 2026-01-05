import {SortOrder} from "../common/SortOrder";

export interface PaginatedRequest<T> {
    sortBy: T | undefined;
    sortOrder: SortOrder | undefined;
    page: number;
    pageSize: number;
}