export abstract class PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;

    protected constructor(data: T[], page: number, pageSize: number, total: number) {
        this.data = data;
        this.page = page;
        this.pageSize = pageSize;
        this.total = total;
    }
}