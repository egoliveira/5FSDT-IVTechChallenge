import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {TeachingGradeRepository} from "../../repository/TeachingGradeRepository";
import {TeachingGrade} from "../../vo/teachinggrade/TeachingGrade";

@injectable()
export class RetrieveTeachingGradesByTeachingLevelIdUseCase implements UseCase<number, TeachingGrade[]> {
    constructor(
        @inject("TeachingGradeRepository") private readonly teachingGradeRepository: TeachingGradeRepository
    ) {
    }

    async execute(params: number): Promise<TeachingGrade[]> {
        return this.teachingGradeRepository.getByTeachingLevelId(params);
    }
}