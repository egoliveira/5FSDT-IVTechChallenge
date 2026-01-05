import {FindParams} from "../common/FindParams";
import {SortOrder} from "../common/SortOrder";

export abstract class UseCaseFindParams<E> {
    protected constructor(
        readonly sortBy?: E,
        readonly sortOrder?: SortOrder,
        readonly page: number = 0,
        readonly pageSize: number = FindParams.DEFAULT_PAGE_SIZE
    ) {
    }
}