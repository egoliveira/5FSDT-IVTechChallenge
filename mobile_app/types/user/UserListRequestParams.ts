import {UserListSortField} from "./UserListSortField";
import {PaginatedRequest} from "../base/PaginatedRequest";

export interface UserListRequestParams extends PaginatedRequest<UserListSortField> {
    username: string | undefined;
    name: string | undefined;
    email: string | undefined;
    active: boolean | undefined;
    userRole: string | undefined;
}