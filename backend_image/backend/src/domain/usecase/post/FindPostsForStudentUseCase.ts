import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {DataPage} from "../../vo/common/DataPage";
import {FindParams} from "../../vo/common/FindParams";
import {UseCaseFindParams} from "../../vo/user/UseCaseFindParams";
import {SortOrder} from "../../vo/common/SortOrder";
import {FindPostsSortField} from "../../vo/common/FindPostsSortField";
import {Post} from "../../vo/post/Post";
import {PostRepository} from "../../repository/PostRepository";
import {StudentRepository} from "../../repository/StudentRepository";

@injectable()
export class FindPostsForStudentUseCase implements UseCase<FindPostsForStudentUseCaseParams, DataPage<Post>> {
    constructor(
        @inject("PostRepository") private readonly postRepository: PostRepository,
        @inject("StudentRepository") private readonly studentRepository: StudentRepository
    ) {
    }

    async execute(params: FindPostsForStudentUseCaseParams): Promise<DataPage<Post>> {
        let dataPage: DataPage<Post>;

        const student = await this.studentRepository.getByUserId(params.studentUserId);

        if (student) {
            const findParams = new FindParams(
                params.sortBy,
                params.sortOrder,
                params.page,
                params.pageSize
            );

            dataPage = await this.postRepository.find(
                params.fullContent,
                params.subjectId,
                student.teachingGrade?.teachingLevelId,
                student.teachingGradeId,
                params.userId,
                findParams
            );
        } else {
            dataPage = new DataPage([], 0, params.pageSize, 0);
        }

        return dataPage;
    }
}

export class FindPostsForStudentUseCaseParams extends UseCaseFindParams<FindPostsSortField> {
    constructor(
        readonly studentUserId: number,
        readonly fullContent?: string,
        readonly subjectId?: number,
        readonly userId?: number,
        readonly sortBy?: FindPostsSortField,
        readonly sortOrder?: SortOrder,
        readonly page: number = 0,
        readonly pageSize: number = FindParams.DEFAULT_PAGE_SIZE) {
        super(sortBy, sortOrder, page, pageSize);
    }
}