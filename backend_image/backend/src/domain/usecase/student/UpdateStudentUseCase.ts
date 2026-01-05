import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {Student} from "../../vo/student/Student";
import {StudentRepository} from "../../repository/StudentRepository";
import {TeachingGradeRepository} from "../../repository/TeachingGradeRepository";
import {BusinessLogicError} from "../../error/BusimessLogicError";

@injectable()
export class UpdateStudentUseCase implements UseCase<UpdateStudentUseCaseParams, Student | undefined> {
    constructor(
        @inject('StudentRepository') private readonly studentRepository: StudentRepository,
        @inject('TeachingGradeRepository') private readonly teachingGradeRepository: TeachingGradeRepository,
    ) {
    }

    async execute(params: UpdateStudentUseCaseParams): Promise<Student | undefined> {
        const teachingGrade = await this.teachingGradeRepository.getById(params.teachingGradeId);

        if (!teachingGrade) {
            throw new BusinessLogicError('Invalid teaching grade id.');
        }

        return this.studentRepository.update(params.id, params.teachingGradeId);
    }
}

export class UpdateStudentUseCaseParams {
    constructor(
        readonly id: number,
        readonly teachingGradeId: number
    ) {
    }
}