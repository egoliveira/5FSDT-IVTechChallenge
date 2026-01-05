import {UseCase} from "../UseCase";
import {UserRoles} from "../../vo/user/UserRoles";
import {inject, injectable} from "tsyringe";
import {UserRolesRepository} from "../../repository/UserRolesRepository";
import {BusinessLogicError} from "../../error/BusimessLogicError";

@injectable()
export class UpdateUserRolesByUserIdUseCase implements UseCase<UpdateUserRolesByUserIdUseCaseParams, UserRoles | undefined> {
    constructor(@inject("UserRolesRepository") private readonly userRolesRepository: UserRolesRepository) {
    }

    async execute(params: UpdateUserRolesByUserIdUseCaseParams): Promise<UserRoles | undefined> {
        if (params.teacher && params.student) {
            throw new BusinessLogicError("An user can't have both teacher and student roles.");
        }

        if (params.currentUserId == params.userId) {
            const currentUserRoles = await this.userRolesRepository.getByUserId(params.userId);

            if (currentUserRoles && currentUserRoles.admin && !params.admin) {
                throw new BusinessLogicError("The current user can't remove its own admin role.");
            }
        }

        return this.userRolesRepository.updateByUserId(params.userId, params.admin, params.teacher, params.student);
    }
}

export class UpdateUserRolesByUserIdUseCaseParams {
    constructor(
        readonly currentUserId: number,
        readonly userId: number,
        readonly admin: boolean,
        readonly teacher: boolean,
        readonly student: boolean
    ) {
    }
}