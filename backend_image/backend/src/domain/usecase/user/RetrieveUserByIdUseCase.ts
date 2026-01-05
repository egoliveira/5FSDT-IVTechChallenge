import {User} from "../../vo/user/User";
import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository";

@injectable()
export class RetrieveUserByIdUseCase implements UseCase<number, User | undefined> {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository
    ) {
    }

    async execute(params: number): Promise<User | undefined> {
        return this.userRepository.getById(params);
    }
}