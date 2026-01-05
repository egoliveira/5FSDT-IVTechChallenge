import {FindParams} from "../vo/common/FindParams";
import {DataPage} from "../vo/common/DataPage";
import {Post} from "../vo/post/Post";
import {FindPostsSortField} from "../vo/common/FindPostsSortField";

export interface PostRepository {
    find(fullContent?: string, subjectId?: number, teachingLevelId?: number, teachingGradeId?: number, userId?: number,
         findParams?: FindParams<FindPostsSortField>): Promise<DataPage<Post>>;

    getById(id: number): Promise<Post | undefined>;

    create(post: Post): Promise<Post>;

    update(id: number, title?: string, content?: string, subjectId?: number, teachingGradeId?: number):
        Promise<Post | undefined>;

    deleteById(id: number): Promise<boolean>;
}