import {SortOrder} from "../common/SortOrder";
import {PaginatedRequest} from "./PaginatedRequest";

export abstract class PaginatedRequestImpl<T> implements PaginatedRequest<T> {
    readonly sortBy: T | undefined;
    readonly sortOrder: SortOrder | undefined;
    readonly page: number;
    readonly pageSize: number;

    constructor(sortBy: T | undefined, sortOrder: SortOrder | undefined, page: number, pageSize: number) {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.page = page;
        this.pageSize = pageSize;
    }
}