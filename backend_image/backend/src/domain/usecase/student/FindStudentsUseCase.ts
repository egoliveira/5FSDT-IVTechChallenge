import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {DataPage} from "../../vo/common/DataPage";
import {FindParams} from "../../vo/common/FindParams";
import {UseCaseFindParams} from "../../vo/user/UseCaseFindParams";
import {SortOrder} from "../../vo/common/SortOrder";
import {StudentRepository} from "../../repository/StudentRepository";
import {FindStudentsSortField} from "../../vo/common/FindStudentsSortField";
import {Student} from "../../vo/student/Student";

@injectable()
export class FindStudentsUseCase implements UseCase<FindStudentsUseCaseParams, DataPage<Student>> {
    constructor(
        @inject("StudentRepository") private readonly studentRepository: StudentRepository
    ) {
    }

    async execute(params: FindStudentsUseCaseParams): Promise<DataPage<Student>> {
        const findParams = new FindParams(
            params.sortBy,
            params.sortOrder,
            params.page,
            params.pageSize
        );

        return this.studentRepository.find(
            params.name,
            params.email,
            params.teachingLevelId,
            params.teachingGradeId,
            findParams
        );
    }
}

export class FindStudentsUseCaseParams extends UseCaseFindParams<FindStudentsSortField> {
    constructor(
        readonly name?: string,
        readonly email?: string,
        readonly teachingLevelId?: number,
        readonly teachingGradeId?: number,
        readonly sortBy?: FindStudentsSortField,
        readonly sortOrder?: SortOrder,
        readonly page: number = 0,
        readonly pageSize: number = FindParams.DEFAULT_PAGE_SIZE) {
        super(sortBy, sortOrder, page, pageSize);
    }
}