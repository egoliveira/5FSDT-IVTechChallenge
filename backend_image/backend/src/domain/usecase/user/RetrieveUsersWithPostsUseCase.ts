import {User} from "../../vo/user/User";
import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository";

@injectable()
export class RetrieveUsersWithPostsUseCase implements UseCase<void, User[]> {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository
    ) {
    }

    async execute(): Promise<User[]> {
        return this.userRepository.getWithPosts();
    }
}