import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {Subject} from "../../vo/subject/Subject";
import {SubjectRepository} from "../../repository/SubjectRepository";

@injectable()
export class RetrieveAllSubjectsUseCase implements UseCase<void, Subject[]> {
    constructor(
        @inject("SubjectRepository") private readonly subjectRepository: SubjectRepository
    ) {
    }

    async execute(): Promise<Subject[]> {
        return this.subjectRepository.getAll();
    }
}