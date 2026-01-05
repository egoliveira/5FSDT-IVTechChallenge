import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {Student} from "../../vo/student/Student";
import {StudentRepository} from "../../repository/StudentRepository";

@injectable()
export class RetrieveStudentByIdUseCase implements UseCase<number, Student | undefined> {
    constructor(
        @inject("StudentRepository") private readonly studentRepository: StudentRepository
    ) {
    }

    async execute(params: number): Promise<Student | undefined> {
        return this.studentRepository.getById(params);
    }
}