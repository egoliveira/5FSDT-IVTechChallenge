import {User} from "../../vo/user/User";
import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository";
import {RetrievePasswordHashUseCase, RetrievePasswordHashUseCaseParams} from "./RetrievePasswordHashUseCase";
import {RetrievePasswordSaltUseCase} from "./RetrievePasswordSaltUseCase";
import {BusinessLogicError} from "../../error/BusimessLogicError";

@injectable()
export class ChangeUserPasswordUseCase implements UseCase<ChangeUserPasswordUseCaseParams, User | undefined> {
    constructor(
        private readonly retrievePasswordHashUseCase: RetrievePasswordHashUseCase,
        private readonly retrievePasswordSaltUseCase: RetrievePasswordSaltUseCase,
        @inject("UserRepository") private readonly userRepository: UserRepository
    ) {
    }

    async execute(params: ChangeUserPasswordUseCaseParams): Promise<User | undefined> {
        const user = await this.userRepository.getById(params.id);

        if (!user) {
            throw new BusinessLogicError('Invalid user id.');
        }

        const salt = await this.retrievePasswordSaltUseCase.execute();
        const passwordHashParams = new RetrievePasswordHashUseCaseParams(params.password, salt);

        const password = await this.retrievePasswordHashUseCase.execute(passwordHashParams);

        return this.userRepository.changePassword(params.id, password);
    }
}

export class ChangeUserPasswordUseCaseParams {
    constructor(
        readonly id: number,
        readonly password: string,
    ) {
    }
}