import {UseCase} from "../UseCase";
import {TeachingLevel} from "../../vo/teachinglevel/TeachingLevel";
import {inject, injectable} from "tsyringe";
import {TeachingLevelRepository} from "../../repository/TeachingLevelRepository";

@injectable()
export class RetrieveAllTeachingLevelsUseCase implements UseCase<void, TeachingLevel[]> {
    constructor(
        @inject("TeachingLevelRepository") private readonly teachingLevelRepository: TeachingLevelRepository
    ) {
    }

    async execute(): Promise<TeachingLevel[]> {
        return this.teachingLevelRepository.getAll();
    }
}