import {PaginatedResponse} from "../base/PaginatedResponse";
import {UserResponse} from "./UserResponse";

export class UserListResponse extends PaginatedResponse<UserResponse> {
    constructor(data: UserResponse[], page: number, pageSize: number, total: number) {
        super(data, page, pageSize, total);
    }
}