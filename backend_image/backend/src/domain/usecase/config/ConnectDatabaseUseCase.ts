import {UseCase} from "../UseCase";
import {ConfigurationRepository} from "../../repository/ConfigurationRepository";
import {inject, injectable} from "tsyringe";

@injectable()
export class ConnectDatabaseUseCase implements UseCase<void, void> {
    constructor(@inject("ConfigurationRepository") private readonly configurationRepository: ConfigurationRepository) {
    }

    async execute(): Promise<void> {
        return this.configurationRepository.connectDatabase();
    }
}