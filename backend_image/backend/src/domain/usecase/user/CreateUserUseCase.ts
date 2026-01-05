import {User} from "../../vo/user/User";
import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {UserRoles} from "../../vo/user/UserRoles";
import {UserRepository} from "../../repository/UserRepository";
import {RetrievePasswordHashUseCase, RetrievePasswordHashUseCaseParams} from "./RetrievePasswordHashUseCase";
import {RetrievePasswordSaltUseCase} from "./RetrievePasswordSaltUseCase";
import {ExistingEntityError} from "../../error/ExistingEntityError";

@injectable()
export class CreateUserUseCase implements UseCase<CreateUserUseCaseParams, User> {
    constructor(
        private readonly retrievePasswordHashUseCase: RetrievePasswordHashUseCase,
        private readonly retrievePasswordSaltUseCase: RetrievePasswordSaltUseCase,
        @inject("UserRepository") private readonly userRepository: UserRepository
    ) {
    }

    async execute(params: CreateUserUseCaseParams): Promise<User> {
        const user = await this.userRepository.getByUsername(params.user.username);

        if (user) {
            throw new ExistingEntityError(`User ${params.user.username} already exists.`);
        }

        const salt = await this.retrievePasswordSaltUseCase.execute();
        const passwordHashParams = new RetrievePasswordHashUseCaseParams(params.user.password, salt);

        params.user.password = await this.retrievePasswordHashUseCase.execute(passwordHashParams);
        params.user.active = true;

        return await this.userRepository.create(params.user, params.userRoles);
    }
}

export class CreateUserUseCaseParams {
    user: User;

    userRoles: UserRoles;

    constructor(user: User, userRoles: UserRoles) {
        this.user = user;
        this.userRoles = userRoles;
    }
}