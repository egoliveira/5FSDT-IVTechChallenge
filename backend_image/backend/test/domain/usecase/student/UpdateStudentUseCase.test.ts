import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {
    UpdateStudentUseCase,
    UpdateStudentUseCaseParams
} from "../../../../src/domain/usecase/student/UpdateStudentUseCase";
import {StudentRepository} from "../../../../src/domain/repository/StudentRepository";
import {TeachingGradeRepository} from "../../../../src/domain/repository/TeachingGradeRepository";
import {Student} from "../../../../src/domain/vo/student/Student";
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";

describe('UpdateStudentUseCase class tests', () => {
    let studentRepository: MockProxy<StudentRepository>;
    let teachingGradeRepository: MockProxy<TeachingGradeRepository>;

    let student: Student;
    let user: User;
    let teachingLevel: TeachingLevel;
    let teachingGrade: TeachingGrade;

    let useCase: UpdateStudentUseCase;

    beforeEach(() => {
        studentRepository = mock<StudentRepository>();
        teachingGradeRepository = mock<TeachingGradeRepository>();

        teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGrade = new TeachingGrade(
            2,
            teachingLevel.id,
            teachingLevel,
            'Segundo Ano',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        student = new Student(
            1,
            user.id,
            user,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 1, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        teachingGradeRepository.getById.calledWith(2).mockReturnValue(Promise.resolve(teachingGrade));

        useCase = new UpdateStudentUseCase(studentRepository, teachingGradeRepository);
    });

    afterEach(() => {
        mockReset(studentRepository);
        mockReset(teachingGradeRepository);

        jest.restoreAllMocks();
    })

    test('Should update a student successfully when use case is executed', async () => {
        // Prepare

        studentRepository.update.calledWith(1, 2).mockReturnValue(Promise.resolve(student));

        const params = new UpdateStudentUseCaseParams(1, 2);

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeDefined();

        expect(result).toEqual(student);

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(2);
        expect(studentRepository.update).toHaveBeenCalledWith(1, 2);
    });

    test('Should not update a student successfully due to invalid teaching grade id when use case is executed', async () => {
        // Prepare

        const params = new UpdateStudentUseCaseParams(1, 3);

        // Act

        await expect(useCase.execute(params)).rejects.toThrow('Invalid teaching grade id.');

        // Assert

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(3);
    });
});