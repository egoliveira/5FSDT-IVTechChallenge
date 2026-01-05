import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {DataPage} from "../../vo/common/DataPage";
import {FindParams} from "../../vo/common/FindParams";
import {UseCaseFindParams} from "../../vo/user/UseCaseFindParams";
import {SortOrder} from "../../vo/common/SortOrder";
import {FindPostsSortField} from "../../vo/common/FindPostsSortField";
import {Post} from "../../vo/post/Post";
import {PostRepository} from "../../repository/PostRepository";

@injectable()
export class FindPostsUseCase implements UseCase<FindPostsUseCaseParams, DataPage<Post>> {
    constructor(
        @inject("PostRepository") private readonly postRepository: PostRepository
    ) {
    }

    async execute(params: FindPostsUseCaseParams): Promise<DataPage<Post>> {
        const findParams = new FindParams(
            params.sortBy,
            params.sortOrder,
            params.page,
            params.pageSize
        );

        return this.postRepository.find(
            params.fullContent,
            params.subjectId,
            params.teachingLevelId,
            params.teachingGradeId,
            params.userId,
            findParams
        );
    }
}

export class FindPostsUseCaseParams extends UseCaseFindParams<FindPostsSortField> {
    constructor(
        readonly fullContent?: string,
        readonly subjectId?: number,
        readonly teachingLevelId?: number,
        readonly teachingGradeId?: number,
        readonly userId?: number,
        readonly sortBy?: FindPostsSortField,
        readonly sortOrder?: SortOrder,
        readonly page: number = 0,
        readonly pageSize: number = FindParams.DEFAULT_PAGE_SIZE) {
        super(sortBy, sortOrder, page, pageSize);
    }
}