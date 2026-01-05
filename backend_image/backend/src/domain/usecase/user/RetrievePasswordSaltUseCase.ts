import {UseCase} from "../UseCase";
import {injectable} from "tsyringe";
import {genSalt} from "bcrypt";

@injectable()
export class RetrievePasswordSaltUseCase implements UseCase<void, string> {
    private readonly SALT_ROUNDS = 10;

    async execute(params: void): Promise<string> {
        return await genSalt(this.SALT_ROUNDS);
    }
}