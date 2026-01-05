import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository";
import {User} from "../../vo/user/User";
import {compareSync} from "bcrypt";

@injectable()
export class PerformLoginUseCase implements UseCase<PerformLoginUseCaseParams, User | undefined> {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository
    ) {
    }

    async execute(params: PerformLoginUseCaseParams): Promise<User | undefined> {
        let user = await this.userRepository.getByUsername(params.username);

        if (user) {
            if (!user.active || !compareSync(params.password, user.password)) {
                user = undefined;
            }
        }

        return user;
    }
}

export class PerformLoginUseCaseParams {
    constructor(readonly username: string, readonly password: string) {
    }
}