import {UseCase} from "../UseCase";
import {UserRoles} from "../../vo/user/UserRoles";
import {inject, injectable} from "tsyringe";
import {UserRolesRepository} from "../../repository/UserRolesRepository";

@injectable()
export class RetrieveUserRolesByUserIdUseCase implements UseCase<number, UserRoles | undefined> {
    constructor(@inject("UserRolesRepository") private readonly userRolesRepository: UserRolesRepository) {
    }

    execute(params: number): Promise<UserRoles | undefined> {
        return this.userRolesRepository.getByUserId(params);
    }
}