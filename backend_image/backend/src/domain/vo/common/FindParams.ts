import {SortOrder} from "./SortOrder";

export class FindParams<E> {
    public static readonly DEFAULT_PAGE_SIZE = 10;

    constructor(
        readonly sortBy?: E,
        readonly sortOrder?: SortOrder,
        readonly page: number = 0, // From 0 to n-1
        readonly pageSize: number = FindParams.DEFAULT_PAGE_SIZE
    ) {
    }
}