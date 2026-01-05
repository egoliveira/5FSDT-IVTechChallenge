import {User} from "../../vo/user/User";
import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository";
import {BusinessLogicError} from "../../error/BusimessLogicError";

@injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserUseCaseParams, User | undefined> {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository
    ) {
    }

    async execute(params: UpdateUserUseCaseParams): Promise<User | undefined> {
        if ((params.currentUserId == params.id) && (!params.active)) {
            throw new BusinessLogicError("You can't deactivate your own account");
        }

        return this.userRepository.update(params.id, params.name, params.email, params.active);
    }
}

export class UpdateUserUseCaseParams {
    constructor(
        readonly currentUserId: number,
        readonly id: number,
        readonly name?: string,
        readonly email?: string,
        readonly active?: boolean
    ) {
    }
}