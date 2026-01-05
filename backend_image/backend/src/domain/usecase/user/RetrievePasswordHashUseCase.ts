import {UseCase} from "../UseCase";
import {injectable} from "tsyringe";
import {hashSync} from "bcrypt";

@injectable()
export class RetrievePasswordHashUseCase implements UseCase<RetrievePasswordHashUseCaseParams, string> {
    async execute(params: RetrievePasswordHashUseCaseParams): Promise<string> {
        return hashSync(params.password, params.salt);
    }
}

export class RetrievePasswordHashUseCaseParams {
    constructor(
        readonly password: string,
        readonly salt: string
    ) {
    }
}