import {User} from "../../vo/user/User";
import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository";
import {DataPage} from "../../vo/common/DataPage";
import {FindParams} from "../../vo/common/FindParams";
import {FindUsersSortField} from "../../vo/common/FindUsersSortField";
import {UseCaseFindParams} from "../../vo/user/UseCaseFindParams";
import {SortOrder} from "../../vo/common/SortOrder";

@injectable()
export class FindUsersUseCase implements UseCase<FindUsersUseCaseParams, DataPage<User>> {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository
    ) {
    }

    async execute(params: FindUsersUseCaseParams): Promise<DataPage<User>> {
        const findParams = new FindParams(
            params.sortBy,
            params.sortOrder,
            params.page,
            params.pageSize
        );

        return this.userRepository.find(
            params.username,
            params.name,
            params.email,
            params.active,
            params.admin,
            params.teacher,
            params.student,
            findParams
        );
    }
}

export class FindUsersUseCaseParams extends UseCaseFindParams<FindUsersSortField> {
    constructor(
        readonly username?: string,
        readonly name?: string,
        readonly email?: string,
        readonly active?: boolean,
        readonly admin?: boolean,
        readonly teacher?: boolean,
        readonly student?: boolean,
        readonly sortBy?: FindUsersSortField,
        readonly sortOrder?: SortOrder,
        readonly page: number = 0,
        readonly pageSize: number = FindParams.DEFAULT_PAGE_SIZE) {
        super(sortBy, sortOrder, page, pageSize);
    }
}