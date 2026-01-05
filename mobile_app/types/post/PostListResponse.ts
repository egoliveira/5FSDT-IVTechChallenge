import {PaginatedResponse} from "../base/PaginatedResponse";
import {PostResponse} from "./PostResponse";

export class PostListResponse extends PaginatedResponse<PostResponse> {
    constructor(data: PostResponse[], page: number, pageSize: number, total: number) {
        super(data, page, pageSize, total);
    }
}